import crypto from "node:crypto";
import type { PrismaClient } from "../../../database/generated/client/client.js";
import { CryptoService } from "./crypto.service.js";
import {
  UnauthorizedError,
  ForbiddenError,
  BadRequestError,
} from "../../../errors/app-error.js";
import { ERROR_CODES } from "../../../constants/error-codes.js";
import type {
  UserAccessTokenClaims,
  TokenAudience,
  AccountType,
  UserStatus,
  AuthTokens,
} from "@fillcart/shared-types";

export class SessionService {
  constructor(
    private prisma: PrismaClient,
    private cryptoService: CryptoService,
    private issuerUrl: string
  ) {}

  /**
   * Derive the authoritative target audience based strictly on accountType and approval status.
   */
  public deriveAudience(accountType: AccountType, status: UserStatus): TokenAudience {
    if (status === "PENDING_APPROVAL") {
      if (accountType === "VENDOR_APPLICANT") return "vendor-onboarding";
      if (accountType === "RIDER_APPLICANT") return "rider-onboarding";
      throw new ForbiddenError(
        "Invalid account state for session issuance",
        ERROR_CODES.ACCOUNT_SUSPENDED
      );
    }

    if (status === "ACTIVE") {
      switch (accountType) {
        case "CUSTOMER":
          return "customer-backend";
        case "VENDOR_APPLICANT":
          return "vendor-backend";
        case "RIDER_APPLICANT":
          return "rider-backend";
        case "ADMIN":
          return "admin-backend";
      }
    }

    throw new ForbiddenError(
      `Account is not active (current status: ${status})`,
      ERROR_CODES.ACCOUNT_SUSPENDED
    );
  }

  /**
   * Mints a cryptographically signed Ed25519 15-minute access token containing all 11 mandatory claims.
   */
  public mintUserAccessToken(params: {
    userId: string;
    sessionId: string;
    accountType: AccountType;
    status: UserStatus;
    role?: string;
    permissions?: string[];
  }): string {
    const nowSec = Math.floor(Date.now() / 1000);
    const expSec = nowSec + 900; // 15 minutes
    const jti = crypto.randomUUID();
    const audience = this.deriveAudience(params.accountType, params.status);

    const claims: UserAccessTokenClaims = {
      sub: params.userId,
      iss: this.issuerUrl,
      aud: audience,
      iat: nowSec,
      nbf: nowSec,
      exp: expSec,
      jti,
      token_use: "access",
      session_id: params.sessionId,
      account_type: params.accountType,
      account_status: params.status,
      ...(params.role ? { role: params.role } : {}),
      ...(params.permissions ? { permissions: params.permissions } : {}),
    };

    return this.cryptoService.signJwt(claims as unknown as Record<string, unknown>);
  }

  /**
   * Creates an active session family and initial rolling refresh token for an authenticated principal.
   * Enforces commit-before-return semantics.
   */
  public async createSession(
    userId: string,
    clientInfo?: { ipAddress?: string; userAgent?: string }
  ): Promise<AuthTokens> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: { include: { rolePermissions: { include: { permission: true } } } } },
    });

    if (!user) {
      throw new UnauthorizedError("User does not exist", ERROR_CODES.UNAUTHORIZED);
    }

    if (user.status === "SUSPENDED") {
      throw new ForbiddenError("Account is suspended", ERROR_CODES.ACCOUNT_SUSPENDED);
    }
    if (user.status === "DEACTIVATED") {
      throw new ForbiddenError("Account is deactivated", ERROR_CODES.ACCOUNT_DEACTIVATED);
    }

    const sessionId = crypto.randomUUID();
    const rawRefreshToken = this.cryptoService.generateRandomBytesHex(32);
    const tokenHash = this.cryptoService.hashOpaqueToken(rawRefreshToken);

    const now = new Date();
    const familyExpiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
    const refreshExpiresAt = new Date(
      Math.min(now.getTime() + 7 * 24 * 60 * 60 * 1000, familyExpiresAt.getTime())
    ); // 7 days

    await this.prisma.$transaction(async (tx) => {
      // 1. Create SessionFamily
      await tx.sessionFamily.create({
        data: {
          id: sessionId,
          userId: user.id,
          ipAddress: clientInfo?.ipAddress,
          userAgent: clientInfo?.userAgent,
          expiresAt: familyExpiresAt,
          isRevoked: false,
        },
      });

      // 2. Create RefreshToken
      await tx.refreshToken.create({
        data: {
          id: crypto.randomUUID(),
          sessionId,
          tokenHash,
          expiresAt: refreshExpiresAt,
          isRevoked: false,
        },
      });
    });

    const roleName = user.role?.name;
    const permissions = user.role?.rolePermissions.map(
      (rp) => `${rp.permission.action}:${rp.permission.resource}`
    );

    const accessToken = this.mintUserAccessToken({
      userId: user.id,
      sessionId,
      accountType: user.accountType as AccountType,
      status: user.status as UserStatus,
      role: roleName,
      permissions,
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      expiresIn: 900,
    };
  }

  /**
   * Performs atomic zero-grace refresh token rotation with replay detection.
   * Lock order: User -> SessionFamily -> RefreshToken
   */
  public async rotateRefreshToken(
    rawRefreshToken: string,
    clientInfo?: { ipAddress?: string; userAgent?: string }
  ): Promise<AuthTokens> {
    if (!rawRefreshToken || typeof rawRefreshToken !== "string") {
      throw new BadRequestError("Missing refresh token", ERROR_CODES.VALIDATION_ERROR);
    }

    const inputHash = this.cryptoService.hashOpaqueToken(rawRefreshToken);

    // 1. Prelookup RefreshToken record to find session and user
    const prelookup = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: inputHash },
      select: { id: true, sessionId: true, rotatedAt: true, session: { select: { userId: true } } },
    });

    if (!prelookup) {
      throw new UnauthorizedError("Invalid refresh token", ERROR_CODES.INVALID_TOKEN);
    }

    const userId = prelookup.session.userId;
    const sessionId = prelookup.sessionId;
    const rawNewRefreshToken = this.cryptoService.generateRandomBytesHex(32);
    const newHash = this.cryptoService.hashOpaqueToken(rawNewRefreshToken);

    let isReplay = false;
    let updatedUser: {
      id: string;
      accountType: string;
      status: string;
      roleName?: string;
      permissions?: string[];
    };

    // 2. Atomic Transaction with Hierarchical Locking & Replay Evaluation
    await this.prisma.$transaction(async (tx) => {
      // Lock User FOR UPDATE
      const userRows = await tx.$queryRawUnsafe<Array<{ id: string; accountType: string; status: string; roleId: string | null }>>(
        `SELECT "id", "accountType", "status", "roleId" FROM "User" WHERE "id" = $1 FOR UPDATE`,
        userId
      );
      const lockedUser = userRows[0];
      if (!lockedUser) {
        throw new UnauthorizedError("User not found", ERROR_CODES.UNAUTHORIZED);
      }

      if (lockedUser.status === "SUSPENDED") {
        throw new ForbiddenError("User is suspended", ERROR_CODES.ACCOUNT_SUSPENDED);
      }
      if (lockedUser.status === "DEACTIVATED") {
        throw new ForbiddenError("User is deactivated", ERROR_CODES.ACCOUNT_DEACTIVATED);
      }

      // Lock SessionFamily FOR UPDATE
      const familyRows = await tx.$queryRawUnsafe<Array<{ id: string; isRevoked: boolean; expiresAt: Date }>>(
        `SELECT "id", "isRevoked", "expiresAt" FROM "SessionFamily" WHERE "id" = $1 FOR UPDATE`,
        sessionId
      );
      const lockedFamily = familyRows[0];
      if (!lockedFamily) {
        throw new UnauthorizedError("Session family not found", ERROR_CODES.UNAUTHORIZED);
      }

      if (lockedFamily.isRevoked || new Date() > lockedFamily.expiresAt) {
        throw new UnauthorizedError("Session has expired or been revoked", ERROR_CODES.SESSION_REVOKED);
      }

      // Lock RefreshToken FOR UPDATE
      const tokenRows = await tx.$queryRawUnsafe<Array<{ id: string; rotatedAt: Date | null; expiresAt: Date; isRevoked: boolean }>>(
        `SELECT "id", "rotatedAt", "expiresAt", "isRevoked" FROM "RefreshToken" WHERE "id" = $1 FOR UPDATE`,
        prelookup.id
      );
      const lockedToken = tokenRows[0];
      if (!lockedToken) {
        throw new UnauthorizedError("Token record not found", ERROR_CODES.INVALID_TOKEN);
      }

      // Replay Detection: Token has already been rotated!
      if (lockedToken.rotatedAt !== null) {
        // Instant Family Revocation - committed so database permanently records revocation and audit entry
        await tx.sessionFamily.update({
          where: { id: sessionId },
          data: {
            isRevoked: true,
            revokedAt: new Date(),
            revocationReason: "REFRESH_TOKEN_REPLAY_DETECTED",
          },
        });

        // Audit Log entry
        await tx.authAuditLog.create({
          data: {
            id: crypto.randomUUID(),
            actorType: "USER",
            actorId: userId,
            actorUserId: userId,
            targetType: "SessionFamily",
            targetId: sessionId,
            targetUserId: userId,
            action: "TOKEN_REUSE_DETECTED",
            ipAddress: clientInfo?.ipAddress,
            userAgent: clientInfo?.userAgent,
          },
        });

        isReplay = true;
        return;
      }

      if (lockedToken.isRevoked || new Date() > lockedToken.expiresAt) {
        throw new UnauthorizedError("Refresh token has expired", ERROR_CODES.TOKEN_EXPIRED);
      }

      // Legitimate Rotation
      await tx.refreshToken.update({
        where: { id: lockedToken.id },
        data: {
          rotatedAt: new Date(),
          replacedByTokenHash: newHash,
        },
      });

      const now = new Date();
      const nextRefreshExpiresAt = new Date(
        Math.min(now.getTime() + 7 * 24 * 60 * 60 * 1000, lockedFamily.expiresAt.getTime())
      );

      await tx.refreshToken.create({
        data: {
          id: crypto.randomUUID(),
          sessionId,
          tokenHash: newHash,
          expiresAt: nextRefreshExpiresAt,
          isRevoked: false,
        },
      });

      updatedUser = {
        id: lockedUser.id,
        accountType: lockedUser.accountType,
        status: lockedUser.status,
      };
    });

    if (isReplay) {
      throw new UnauthorizedError(
        "Token reuse detected. Entire session has been revoked.",
        ERROR_CODES.TOKEN_REPLAY_DETECTED
      );
    }

    const accessToken = this.mintUserAccessToken({
      userId: updatedUser!.id,
      sessionId,
      accountType: updatedUser!.accountType as AccountType,
      status: updatedUser!.status as UserStatus,
    });

    return {
      accessToken,
      refreshToken: rawNewRefreshToken,
      expiresIn: 900,
    };
  }

  /**
   * Revokes an individual session family (logout).
   */
  public async revokeSession(sessionId: string): Promise<void> {
    await this.prisma.sessionFamily.updateMany({
      where: { id: sessionId },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
        revocationReason: "USER_LOGOUT",
      },
    });
  }

  /**
   * Revokes all active sessions for a user (global logout / suspension / promotion).
   */
  public async revokeAllUserSessions(userId: string, reason = "GLOBAL_REVOCATION"): Promise<void> {
    await this.prisma.sessionFamily.updateMany({
      where: { userId, isRevoked: false },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
        revocationReason: reason,
      },
    });
  }
}
