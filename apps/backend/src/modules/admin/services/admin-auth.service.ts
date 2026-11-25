import crypto from "node:crypto";
import type { PrismaClient } from "../../../database/generated/client/client.js";
import type { CryptoService } from "../../auth/services/crypto.service.js";
import { PasswordService } from "../../auth/services/password.service.js";
import {
  UnauthorizedError,
  ForbiddenError,
} from "../../../errors/app-error.js";
import { ERROR_CODES } from "../../../constants/error-codes.js";

export class AdminAuthService {
  constructor(
    private prisma: PrismaClient,
    private cryptoService: CryptoService
  ) {}

  /**
   * Verifies the admin password with Argon2id and rate limiting.
   * On success: Returns a short-lived 15-minute Ed25519 JWT grant token.
   * On failure: Records rate limit and audit log. Enforces 60-second lock after 5 failed attempts.
   */
  public async verifySettingsAccess(params: {
    userId: string;
    password: string;
    clientInfo?: { ipAddress?: string; userAgent?: string; requestId?: string };
  }): Promise<{ verified: boolean; token: string; expiresIn: number }> {
    const rateLimitKey = `settings-attempt:${params.userId}`;
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

    // 1. Check rate limits (max 5 failed attempts in the last 60 seconds)
    const recentFailures = await this.prisma.rateLimitRecord.count({
      where: {
        key: rateLimitKey,
        timestamp: { gte: oneMinuteAgo },
      },
    });

    if (recentFailures >= 5) {
      // Log lockout event
      await this.prisma.authAuditLog.create({
        data: {
          id: crypto.randomUUID(),
          actorType: "USER",
          actorId: params.userId,
          actorUserId: params.userId,
          targetType: "SettingsAccess",
          targetId: params.userId,
          targetUserId: params.userId,
          action: "SETTINGS_ACCESS_LOCKOUT",
          requestId: params.clientInfo?.requestId,
          ipAddress: params.clientInfo?.ipAddress,
          userAgent: params.clientInfo?.userAgent,
          metadata: { reason: "Rate limit exceeded (5 attempts in 60s)" },
        },
      });

      throw new ForbiddenError(
        "Too many failed verification attempts. Please wait 60 seconds before trying again.",
        ERROR_CODES.ACCOUNT_LOCKED
      );
    }

    // 2. Verification logic: strictly verify logged-in admin user's password credential with Argon2id
    let isPasswordValid = false;
    const credential = await this.prisma.credential.findFirst({
      where: {
        userId: params.userId,
        type: "PASSWORD",
      },
    });

    if (credential) {
      const { valid } = await PasswordService.verifyPassword(params.password, credential.secretHash);
      isPasswordValid = valid;
    }

    if (!isPasswordValid) {
      // Record rate limit failure entry
      await this.prisma.rateLimitRecord.create({
        data: {
          id: crypto.randomUUID(),
          key: rateLimitKey,
          timestamp: new Date(),
        },
      });

      // Write failure audit log
      await this.prisma.authAuditLog.create({
        data: {
          id: crypto.randomUUID(),
          actorType: "USER",
          actorId: params.userId,
          actorUserId: params.userId,
          targetType: "SettingsAccess",
          targetId: params.userId,
          targetUserId: params.userId,
          action: "SETTINGS_ACCESS_FAILED",
          requestId: params.clientInfo?.requestId,
          ipAddress: params.clientInfo?.ipAddress,
          userAgent: params.clientInfo?.userAgent,
        },
      });

      throw new UnauthorizedError("Invalid password", ERROR_CODES.INVALID_CREDENTIALS);
    }

    // 4. Success: Clear rate limits for clean next access
    try {
      await this.prisma.rateLimitRecord.deleteMany({
        where: { key: rateLimitKey },
      });
    } catch {
      // If delete is revoked by DB policy, entries naturally age out by timestamp filter
    }

    // 5. Issue short-lived 15-minute Ed25519 settings grant token
    const nowSec = Math.floor(Date.now() / 1000);
    const expiresIn = 900; // 15 minutes
    const expSec = nowSec + expiresIn;
    const jti = crypto.randomUUID();

    const grantClaims = {
      sub: params.userId,
      userId: params.userId,
      scope: "settings",
      jti,
      iat: nowSec,
      nbf: nowSec,
      exp: expSec,
    };

    const token = this.cryptoService.signJwt(grantClaims);

    // 6. Write success audit log
    await this.prisma.authAuditLog.create({
      data: {
        id: crypto.randomUUID(),
        actorType: "USER",
        actorId: params.userId,
        actorUserId: params.userId,
        targetType: "SettingsAccess",
        targetId: params.userId,
        targetUserId: params.userId,
        action: "SETTINGS_ACCESS_VERIFIED",
        requestId: params.clientInfo?.requestId,
        ipAddress: params.clientInfo?.ipAddress,
        userAgent: params.clientInfo?.userAgent,
      },
    });

    return {
      verified: true,
      token,
      expiresIn,
    };
  }
}
