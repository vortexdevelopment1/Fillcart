import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/client/client.js";
import { getLogger } from "../../utils/logger.js";
import type { AppConfig } from "../../config/env.schema.js";

let prismaInstance: PrismaClient | null = null;

export interface SafePrismaDiagnostic {
  level: "error" | "warn";
  category: "connection" | "query" | "schema" | "engine" | "general";
  errorCode: string;
  description: string;
  target?: string;
}

const SAFE_PRISMA_TARGETS = new Set([
  "prisma:client",
  "prisma:engine",
  "quaint::connector",
  "client",
]);

const SAFE_PRISMA_CODE_DESCRIPTIONS: Record<string, string> = {
  P1000: "Authentication failed against database server",
  P1001: "Cannot reach database server",
  P1002: "Database server connection timed out",
  P1003: "Database does not exist",
  P1008: "Operations timed out",
  P1017: "Server closed the connection",
  P2000: "Input value too long for column",
  P2001: "Record does not exist",
  P2002: "Unique constraint violation",
  P2025: "Record to update or delete not found",
};

const PRISMA_CODE_REGEX = /\b(P\d{4})\b/;

/**
 * Extracts strictly safe, allowlisted diagnostic metadata from Prisma log events.
 * Prevents raw error messages, connection strings, credentials, or arbitrary fields
 * from leaking into captured application logs.
 */
export function extractSafePrismaDiagnostic(
  event: { message?: unknown; target?: unknown },
  level: "error" | "warn"
): SafePrismaDiagnostic {
  const rawMessage = typeof event.message === "string" ? event.message : "";
  const codeMatch = rawMessage.match(PRISMA_CODE_REGEX);
  const matchedCode = codeMatch?.[1];
  const errorCode = matchedCode ?? "PRISMA_UNSPECIFIED";

  let category: SafePrismaDiagnostic["category"] = "general";
  if (errorCode.startsWith("P1")) {
    category = "connection";
  } else if (errorCode.startsWith("P2")) {
    category = "query";
  } else if (errorCode.startsWith("P3")) {
    category = "schema";
  } else if (errorCode.startsWith("P4")) {
    category = "engine";
  }

  const description =
    SAFE_PRISMA_CODE_DESCRIPTIONS[errorCode] ??
    (level === "error"
      ? "Prisma database error occurred"
      : "Prisma database warning emitted");

  const rawTarget = typeof event.target === "string" ? event.target : "";
  const target = SAFE_PRISMA_TARGETS.has(rawTarget) ? rawTarget : undefined;

  const diagnostic: SafePrismaDiagnostic = {
    level,
    category,
    errorCode,
    description,
  };

  if (target) {
    diagnostic.target = target;
  }

  return diagnostic;
}

/**
 * Instantiates or retrieves the singleton PrismaClient.
 * PrismaPg constructor owns the underlying connection pool, configured with
 * explicit pool limits and timeout safeguards.
 */
export function getPrismaClient(config: AppConfig): PrismaClient {
  if (prismaInstance) {
    return prismaInstance;
  }

  const logger = getLogger(config);

  // PrismaPg owns the connection pool configuration
  const adapter = new PrismaPg({
    connectionString: config.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  prismaInstance = new PrismaClient({
    adapter,
    log: [
      { emit: "event", level: "error" },
      { emit: "event", level: "warn" },
    ],
  });

  // Diagnostic logging with strictly allowlisted metadata (no raw error messages or credentials)
  prismaInstance.$on(
    "error" as never,
    (e: { message?: string; target?: string }) => {
      const safeDiag = extractSafePrismaDiagnostic(e, "error");
      logger.error(safeDiag, "Prisma error encountered");
    }
  );

  prismaInstance.$on(
    "warn" as never,
    (e: { message?: string; target?: string }) => {
      const safeDiag = extractSafePrismaDiagnostic(e, "warn");
      logger.warn(safeDiag, "Prisma warning encountered");
    }
  );

  return prismaInstance;
}

/**
 * Resets the cached singleton instance (primarily for testing harnesses).
 */
export function resetPrismaClient(): void {
  prismaInstance = null;
}
