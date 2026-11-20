import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getPrismaClient,
  resetPrismaClient,
  extractSafePrismaDiagnostic,
} from "../../src/database/client/prisma.js";
import {
  checkDatabaseReadiness,
  disconnectDatabase,
} from "../../src/database/index.js";
import { validateConfig } from "../../src/config/env.js";
import { PrismaClient } from "../../src/database/generated/client/client.js";
import * as loggerModule from "../../src/utils/logger.js";

describe("Database Client and Lifecycle Unit Tests", () => {
  const config = validateConfig({
    DATABASE_URL:
      "postgresql://fillcart_app_user:fillcart_app_pass@127.0.0.1:5432/fillcart?schema=public",
  });

  beforeEach(() => {
    resetPrismaClient();
    vi.restoreAllMocks();
  });

  it("returns a singleton PrismaClient instance across multiple calls", () => {
    const client1 = getPrismaClient(config);
    const client2 = getPrismaClient(config);
    expect(client1).toBe(client2);
  });

  it("checkDatabaseReadiness resolves ok: true when query succeeds", async () => {
    const mockPrisma = {
      $queryRaw: vi.fn().mockResolvedValue([{ "?column?": 1 }]),
    } as unknown as PrismaClient;

    const result = await checkDatabaseReadiness(mockPrisma);
    expect(result.ok).toBe(true);
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it("checkDatabaseReadiness resolves ok: false when query rejects", async () => {
    const mockPrisma = {
      $queryRaw: vi.fn().mockRejectedValue(new Error("Connection terminated")),
    } as unknown as PrismaClient;

    const result = await checkDatabaseReadiness(mockPrisma);
    expect(result.ok).toBe(false);
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it("disconnectDatabase cleanly disconnects prisma client without throwing", async () => {
    const disconnectMock = vi.fn().mockResolvedValue(undefined);
    const mockPrisma = {
      $disconnect: disconnectMock,
    } as unknown as PrismaClient;

    await expect(disconnectDatabase(mockPrisma)).resolves.toBeUndefined();
    expect(disconnectMock).toHaveBeenCalledTimes(1);
  });

  describe("Prisma Diagnostic Log Sanitization", () => {
    it("strips raw messages, passwords, and connection strings from error diagnostic", () => {
      const sensitiveEvent = {
        message:
          "Authentication failed for user fillcart_user with password fillcart_pass at postgresql://fillcart_user:fillcart_pass@127.0.0.1:5432/fillcart?sslmode=disable",
        target: "postgresql://fillcart_user:fillcart_pass@127.0.0.1:5432",
      };

      const diag = extractSafePrismaDiagnostic(sensitiveEvent, "error");

      // Verify safe allowlisted structure
      expect(diag.level).toBe("error");
      expect(diag.category).toBe("general");
      expect(diag.errorCode).toBe("PRISMA_UNSPECIFIED");
      expect(diag.description).toBe("Prisma database error occurred");
      expect(diag.target).toBeUndefined();

      // Verify no sensitive substrings leak into any serialized output
      const serialized = JSON.stringify(diag);
      expect(serialized).not.toContain("fillcart_pass");
      expect(serialized).not.toContain("fillcart_user");
      expect(serialized).not.toContain("postgresql://");
      expect(serialized).not.toContain("127.0.0.1:5432");
    });

    it("extracts recognized Prisma error code and maps to safe category and description", () => {
      const p1001Event = {
        message:
          "Can't reach database server at 127.0.0.1:5432 with secret_password. Error code: P1001",
        target: "prisma:client",
      };

      const diag = extractSafePrismaDiagnostic(p1001Event, "error");

      expect(diag.level).toBe("error");
      expect(diag.category).toBe("connection");
      expect(diag.errorCode).toBe("P1001");
      expect(diag.description).toBe("Cannot reach database server");
      expect(diag.target).toBe("prisma:client");

      const serialized = JSON.stringify(diag);
      expect(serialized).not.toContain("secret_password");
      expect(serialized).not.toContain("127.0.0.1:5432");
    });

    it("extracts recognized Prisma query error code P2002", () => {
      const p2002Event = {
        message:
          "Unique constraint failed on the fields: (`email`) with sensitive value 'admin@test.com'. (P2002)",
      };

      const diag = extractSafePrismaDiagnostic(p2002Event, "error");

      expect(diag.level).toBe("error");
      expect(diag.category).toBe("query");
      expect(diag.errorCode).toBe("P2002");
      expect(diag.description).toBe("Unique constraint violation");

      const serialized = JSON.stringify(diag);
      expect(serialized).not.toContain("admin@test.com");
    });

    it("filters unverified targets and retains only allowlisted targets", () => {
      const unverifiedTargetEvent = {
        message: "Warning occurred (P1008)",
        target: "internal_sensitive_connection_target",
      };

      const diag = extractSafePrismaDiagnostic(unverifiedTargetEvent, "warn");
      expect(diag.target).toBeUndefined();

      const allowlistedTargetEvent = {
        message: "Warning occurred (P1008)",
        target: "quaint::connector",
      };

      const diagAllowlisted = extractSafePrismaDiagnostic(
        allowlistedTargetEvent,
        "warn"
      );
      expect(diagAllowlisted.target).toBe("quaint::connector");
    });

    it("verifies getPrismaClient logs only sanitized diagnostic objects when Prisma events fire", () => {
      const mockLogger = {
        error: vi.fn(),
        warn: vi.fn(),
        info: vi.fn(),
        debug: vi.fn(),
        fatal: vi.fn(),
        trace: vi.fn(),
      };
      vi.spyOn(loggerModule, "getLogger").mockReturnValue(
        mockLogger as unknown as ReturnType<typeof loggerModule.getLogger>
      );

      // Deterministically capture the error and warn event handlers registered by getPrismaClient
      const registeredHandlers = new Map<
        string,
        (event: { message?: string; target?: string }) => void
      >();

      vi.spyOn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        PrismaClient.prototype as any,
        "$on"
      ).mockImplementation(function (this: unknown, ...args: unknown[]) {
        const [event, handler] = args;
        if (typeof event === "string" && typeof handler === "function") {
          registeredHandlers.set(
            event,
            handler as (e: { message?: string; target?: string }) => void
          );
        }
        return this;
      });

      getPrismaClient(config);

      // Verify and exercise the error event callback unconditionally
      const errorHandler = registeredHandlers.get("error");
      expect(errorHandler).toBeDefined();
      expect(typeof errorHandler).toBe("function");

      errorHandler!({
        message:
          "Authentication failed for user admin with password super_secret at postgresql://admin:super_secret@127.0.0.1:5432/db (P1000)",
        target: "unverified_internal_target",
      });

      expect(mockLogger.error).toHaveBeenCalledTimes(1);
      const errorCall = mockLogger.error.mock.calls[0];
      expect(errorCall).toBeDefined();
      const [errorPayload, errorMsg] = errorCall!;
      expect(errorMsg).toBe("Prisma error encountered");
      expect(errorPayload.level).toBe("error");
      expect(errorPayload.category).toBe("connection");
      expect(errorPayload.errorCode).toBe("P1000");
      expect(errorPayload.description).toBe(
        "Authentication failed against database server"
      );
      expect(errorPayload.target).toBeUndefined();

      const serializedError = JSON.stringify(errorPayload);
      expect(serializedError).not.toContain("super_secret");
      expect(serializedError).not.toContain("admin");
      expect(serializedError).not.toContain("postgresql://");
      expect(serializedError).not.toContain("unverified_internal_target");

      // Verify and exercise the warn event callback unconditionally
      const warnHandler = registeredHandlers.get("warn");
      expect(warnHandler).toBeDefined();
      expect(typeof warnHandler).toBe("function");

      warnHandler!({
        message:
          "Database connection pool timed out waiting for connection (P1002)",
        target: "prisma:client", // allowlisted target
      });

      expect(mockLogger.warn).toHaveBeenCalledTimes(1);
      const warnCall = mockLogger.warn.mock.calls[0];
      expect(warnCall).toBeDefined();
      const [warnPayload, warnMsg] = warnCall!;
      expect(warnMsg).toBe("Prisma warning encountered");
      expect(warnPayload.level).toBe("warn");
      expect(warnPayload.category).toBe("connection");
      expect(warnPayload.errorCode).toBe("P1002");
      expect(warnPayload.description).toBe(
        "Database server connection timed out"
      );
      expect(warnPayload.target).toBe("prisma:client");
    });
  });
});
