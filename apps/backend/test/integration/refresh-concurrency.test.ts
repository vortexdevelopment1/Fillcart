import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import crypto from "node:crypto";
import { createApp } from "../../src/app.js";
import { validateConfig } from "../../src/config/env.js";
import { getPrismaClient } from "../../src/database/client/prisma.js";
import { CryptoService } from "../../src/modules/auth/services/crypto.service.js";
import { SessionService } from "../../src/modules/auth/services/session.service.js";
import { ERROR_CODES } from "../../src/constants/error-codes.js";
import type { Express } from "express";

describe("Milestone 2.1 — Refresh Token Concurrency & Session Revocation Tests", () => {
  let app: Express;
  let prisma: ReturnType<typeof getPrismaClient>;
  let sessionService: SessionService;
  let testUserId: string;

  beforeAll(async () => {
    const config = validateConfig({
      DATABASE_URL:
        "postgresql://fillcart_app_user:fillcart_app_pass@127.0.0.1:5432/fillcart?schema=public",
      JWT_ISSUER_URL: "https://auth.fillcart.internal",
      JWT_ACTIVE_KID: "k-test-concurrency-1",
      LOG_LEVEL: "silent",
      NODE_ENV: "test",
    });

    app = createApp(config);
    prisma = getPrismaClient(config);
    const cryptoService = new CryptoService(config);
    sessionService = new SessionService(prisma, cryptoService, config.JWT_ISSUER_URL);

    // Create test user (avoiding DELETE operations in cleanup to adhere to Stage 1 zero-DELETE baseline)
    testUserId = "usr_concurrency_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    const email = `concurrency_${Date.now()}@fillcart.internal`;
    await prisma.user.create({
      data: {
        id: testUserId,
        emailNormalized: email.toLowerCase(),
        displayEmail: email,
        fullName: "Concurrency Integration Tester",
        accountType: "CUSTOMER",
        status: "ACTIVE",
      },
    });
  });

  it("handles simultaneous refresh requests atomically: 1 succeeds, 1 triggers family revocation", async () => {
    const session = await sessionService.createSession(testUserId);
    const initialRefreshToken = session.refreshToken;

    // Dispatch 2 simultaneous refresh operations with identical token
    const [resA, resB] = await Promise.allSettled([
      sessionService.rotateRefreshToken(initialRefreshToken),
      sessionService.rotateRefreshToken(initialRefreshToken),
    ]);

    const results = [resA, resB];
    const fulfilled = results.filter((r) => r.status === "fulfilled") as PromiseFulfilledResult<any>[];
    const rejected = results.filter((r) => r.status === "rejected") as PromiseRejectedResult[];

    // Exactly 1 must succeed and exactly 1 must fail due to zero-grace replay detection
    expect(fulfilled).toHaveLength(1);
    expect(rejected).toHaveLength(1);

    const firstFulfilled = fulfilled[0];
    const firstRejected = rejected[0];
    expect(firstFulfilled).toBeDefined();
    expect(firstRejected).toBeDefined();
    if (!firstFulfilled || !firstRejected) {
      throw new Error("Missing concurrency promise results");
    }

    expect(firstFulfilled.value.accessToken).toBeDefined();
    expect(firstFulfilled.value.refreshToken).toBeDefined();

    const rejectionReason = firstRejected.reason;
    expect(rejectionReason.code).toBe(ERROR_CODES.TOKEN_REPLAY_DETECTED);

    // Verify SessionFamily state in database: must be marked revoked with reason REFRESH_TOKEN_REPLAY_DETECTED
    const prelookupHash = new CryptoService(validateConfig({})).hashOpaqueToken(initialRefreshToken);
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { tokenHash: prelookupHash },
      include: { session: true },
    });

    expect(tokenRecord?.session.isRevoked).toBe(true);
    expect(tokenRecord?.session.revocationReason).toBe("REFRESH_TOKEN_REPLAY_DETECTED");

    // The newly minted refresh token from the fulfilled branch must now also fail because family is revoked
    const nextToken = firstFulfilled.value.refreshToken;
    await expect(sessionService.rotateRefreshToken(nextToken)).rejects.toThrow(
      "Session has expired or been revoked"
    );
  });

  it("genuinely races simultaneous logout/revocation against refresh rotation", async () => {
    const session = await sessionService.createSession(testUserId);
    const initialRefreshToken = session.refreshToken;
    const tokenHash = new CryptoService(validateConfig({})).hashOpaqueToken(initialRefreshToken);
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { tokenHash },
    });
    expect(tokenRecord).toBeDefined();
    const sessionId = tokenRecord!.sessionId;

    // Dispatch simultaneous revocation (logout) and refresh rotation against live PostgreSQL
    const [logoutResult, refreshResult] = await Promise.allSettled([
      sessionService.revokeSession(sessionId),
      sessionService.rotateRefreshToken(initialRefreshToken),
    ]);

    expect(logoutResult.status).toBe("fulfilled");

    // Assert final database state: SessionFamily must be revoked
    const sessionFamily = await prisma.sessionFamily.findUnique({
      where: { id: sessionId },
    });
    expect(sessionFamily?.isRevoked).toBe(true);

    if (refreshResult.status === "rejected") {
      // Logout won the lock race: refresh failed closed immediately
      expect(refreshResult.reason.message).toContain("Session has expired or been revoked");
    } else {
      // Refresh committed right before logout updated the row.
      // CRITICAL VERIFICATION: The newly minted refresh token cannot be used because family is revoked
      const mintedRefreshToken = refreshResult.value.refreshToken;
      expect(mintedRefreshToken).toBeDefined();

      await expect(sessionService.rotateRefreshToken(mintedRefreshToken)).rejects.toThrow(
        "Session has expired or been revoked"
      );
    }

    // In all outcomes, original token is unusable
    await expect(sessionService.rotateRefreshToken(initialRefreshToken)).rejects.toThrow();
  });

  it("rejects refresh request when session family has been revoked (logout race)", async () => {
    const session = await sessionService.createSession(testUserId);
    
    // Revoke the session family
    const prelookupHash = new CryptoService(validateConfig({})).hashOpaqueToken(session.refreshToken);
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { tokenHash: prelookupHash },
    });
    expect(tokenRecord).toBeDefined();

    await sessionService.revokeSession(tokenRecord!.sessionId);

    // Attempt refresh on revoked session
    await expect(sessionService.rotateRefreshToken(session.refreshToken)).rejects.toThrow(
      "Session has expired or been revoked"
    );
  });

  it("rejects refresh request when user is suspended", async () => {
    // Create dedicated suspended user
    const suspendedUserId = "usr_susp_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    const suspEmail = `suspended_${Date.now()}@fillcart.internal`;
    await prisma.user.create({
      data: {
        id: suspendedUserId,
        emailNormalized: suspEmail.toLowerCase(),
        displayEmail: suspEmail,
        fullName: "Suspended Test User",
        accountType: "CUSTOMER",
        status: "ACTIVE",
      },
    });

    const session = await sessionService.createSession(suspendedUserId);

    // Suspend user
    await prisma.user.update({
      where: { id: suspendedUserId },
      data: { status: "SUSPENDED" },
    });

    // Attempt refresh on suspended user
    await expect(sessionService.rotateRefreshToken(session.refreshToken)).rejects.toThrow(
      "User is suspended"
    );
  });

  it("coordinates concurrent HTTP refresh requests via POST /api/v1/auth/refresh", async () => {
    const session = await sessionService.createSession(testUserId);
    const rawRefreshToken = session.refreshToken;

    const [res1, res2] = await Promise.all([
      request(app)
        .post("/api/v1/auth/refresh")
        .send({ refreshToken: rawRefreshToken }),
      request(app)
        .post("/api/v1/auth/refresh")
        .send({ refreshToken: rawRefreshToken }),
    ]);

    const statuses = [res1.status, res2.status].sort();
    // One succeeds (200), one detects replay and fails (401)
    expect(statuses).toEqual([200, 401]);

    const failedRes = res1.status === 401 ? res1 : res2;
    expect(failedRes.body.error.code).toBe(ERROR_CODES.TOKEN_REPLAY_DETECTED);
  });

  it("rejects refresh request when refresh token is expired", async () => {
    const session = await sessionService.createSession(testUserId);
    const tokenHash = new CryptoService(validateConfig({})).hashOpaqueToken(session.refreshToken);

    // Set refresh token expiration to the past (respecting refresh_token_dates_chk: expiresAt >= createdAt)
    await prisma.refreshToken.update({
      where: { tokenHash },
      data: {
        createdAt: new Date(Date.now() - 200000),
        expiresAt: new Date(Date.now() - 1000),
      },
    });

    await expect(sessionService.rotateRefreshToken(session.refreshToken)).rejects.toThrow(
      "Refresh token has expired"
    );
  });

  it("rejects refresh request when session family is expired", async () => {
    const session = await sessionService.createSession(testUserId);
    const tokenHash = new CryptoService(validateConfig({})).hashOpaqueToken(session.refreshToken);
    const tokenRec = await prisma.refreshToken.findUnique({ where: { tokenHash } });

    // Set SessionFamily expiration to past (respecting session_family_dates_chk: expiresAt >= createdAt)
    await prisma.sessionFamily.update({
      where: { id: tokenRec!.sessionId },
      data: {
        createdAt: new Date(Date.now() - 200000),
        expiresAt: new Date(Date.now() - 1000),
      },
    });

    await expect(sessionService.rotateRefreshToken(session.refreshToken)).rejects.toThrow(
      "Session has expired or been revoked"
    );
  });

  it("verifies session-family revocation on replay is committed and NOT rolled back when exception is thrown", async () => {
    const session = await sessionService.createSession(testUserId);
    const rawInitialToken = session.refreshToken;

    // Legitimate rotation 1
    const rotated = await sessionService.rotateRefreshToken(rawInitialToken);
    expect(rotated.refreshToken).toBeDefined();

    // Replay initial token: must trigger family revocation and throw TOKEN_REPLAY_DETECTED
    let thrownError: any;
    try {
      await sessionService.rotateRefreshToken(rawInitialToken);
    } catch (err) {
      thrownError = err;
    }

    expect(thrownError).toBeDefined();
    expect(thrownError.code).toBe(ERROR_CODES.TOKEN_REPLAY_DETECTED);

    // CRITICAL ACCEPTANCE CHECK: Inspect database directly to prove revocation was committed
    const initialHash = new CryptoService(validateConfig({})).hashOpaqueToken(rawInitialToken);
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { tokenHash: initialHash },
      include: { session: true },
    });

    expect(tokenRecord?.session.isRevoked).toBe(true);
    expect(tokenRecord?.session.revocationReason).toBe("REFRESH_TOKEN_REPLAY_DETECTED");

    // Check committed AuthAuditLog entry
    const auditEntry = await prisma.authAuditLog.findFirst({
      where: {
        targetId: tokenRecord?.sessionId,
        action: "TOKEN_REUSE_DETECTED",
      },
    });
    expect(auditEntry).toBeDefined();
    expect(auditEntry?.actorUserId).toBe(testUserId);
  });
});
