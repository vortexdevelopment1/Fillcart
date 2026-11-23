import type { PrismaClient } from "../../../database/generated/client/client.js";
import { CryptoService } from "./crypto.service.js";
import { S2SService } from "./s2s.service.js";
import {
  UnauthorizedError,
  ForbiddenError,
  BadRequestError,
} from "../../../errors/app-error.js";
import { ERROR_CODES } from "../../../constants/error-codes.js";
import type {
  UserAccessTokenClaims,
  LiveSessionVerificationResponse,
  TokenAudience,
} from "@fillcart/shared-types";

export class LiveVerificationService {
  constructor(
    private prisma: PrismaClient,
    private cryptoService: CryptoService,
    private s2sService: S2SService
  ) {}

  /**
   * Authoritative audience ownership map.
   * Defines which authenticated S2S service is permitted to verify which token audience.
   */
  private static AUDIENCE_OWNERSHIP_MAP: Record<string, TokenAudience[]> = {
    "customer-backend": ["customer-backend"],
    "vendor-backend": ["vendor-backend", "vendor-onboarding"],
    "rider-backend": ["rider-backend", "rider-onboarding"],
    "admin-backend": ["admin-backend"],
  };

  /**
   * Synchronously verifies live validity of a user access token AND evaluates live permissions.
   * Steps:
   * 1. Authenticate caller via S2S service assertion and assert 'auth:verify_session' scope.
   * 2. Independently verify cryptographic signature, issuer, and claims of userAccessToken.
   * 3. Verify caller's ownership/authorization over the token's audience.
   * 4. Query live database status for User, SessionFamily, Role, RolePermissions, and StaffDirectPermissions.
   * 5. Evaluate the requested authorization decision (requiredPermission) if provided.
   * 6. Return explicit versioned result.
   */
  public async verifyLiveSession(params: {
    serviceAuthorizationHeader: string;
    userAccessToken: string;
    requiredPermission?: string;
  }): Promise<LiveSessionVerificationResponse> {
    if (!params.userAccessToken) {
      throw new BadRequestError("Missing userAccessToken", ERROR_CODES.VALIDATION_ERROR);
    }

    // 1. Authenticate S2S Caller
    const callerToken = params.serviceAuthorizationHeader?.replace(/^Bearer\s+/i, "");
    const caller = await this.s2sService.authenticateServiceAssertion(
      callerToken,
      "auth:verify_session"
    );

    // 2. Independently verify the user token's Ed25519 signature and claims
    const userClaims = this.cryptoService.verifyJwt<UserAccessTokenClaims>(params.userAccessToken);

    if (userClaims.token_use !== "access") {
      throw new UnauthorizedError("Invalid token purpose", ERROR_CODES.INVALID_TOKEN);
    }

    // 3. Assert calling service has audience verification ownership
    const allowedAudiences = LiveVerificationService.AUDIENCE_OWNERSHIP_MAP[caller.serviceIdentifier] || [];
    if (!allowedAudiences.includes(userClaims.aud)) {
      throw new ForbiddenError(
        `Service '${caller.serviceIdentifier}' is not authorized to verify audience '${userClaims.aud}'`,
        ERROR_CODES.AUDIENCE_MISMATCH
      );
    }

    // 4. Live Database Check for SessionFamily and User Status with Role & Permissions
    const session = await this.prisma.sessionFamily.findUnique({
      where: { id: userClaims.session_id },
      include: {
        user: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true },
                },
              },
            },
            staffDirectPermissions: {
              where: { revokedAt: null },
              include: { permission: true },
            },
          },
        },
      },
    });

    if (!session) {
      return { valid: false, authorized: false, reason: "SESSION_NOT_FOUND" };
    }

    if (session.isRevoked) {
      return { valid: false, authorized: false, reason: "SESSION_REVOKED" };
    }

    if (new Date() > session.expiresAt) {
      return { valid: false, authorized: false, reason: "SESSION_EXPIRED" };
    }

    const user = session.user;
    if (user.status === "SUSPENDED") {
      return { valid: false, authorized: false, reason: "ACCOUNT_SUSPENDED" };
    }

    if (user.status === "DEACTIVATED") {
      return { valid: false, authorized: false, reason: "ACCOUNT_DEACTIVATED" };
    }

    // Applicant Audience vs Live Status
    if (userClaims.aud === "vendor-onboarding" || userClaims.aud === "rider-onboarding") {
      if (user.status !== "PENDING_APPROVAL" && user.status !== "ACTIVE") {
        return { valid: false, authorized: false, reason: "APPLICANT_STATUS_INVALID" };
      }
    } else {
      if (user.status !== "ACTIVE") {
        return { valid: false, authorized: false, reason: "ACCOUNT_NOT_ACTIVE" };
      }
    }

    // Resolve current authoritative permissions from role + direct staff permissions
    const activePermissions = new Set<string>();

    if (user.role?.rolePermissions) {
      for (const rp of user.role.rolePermissions) {
        activePermissions.add(`${rp.permission.action}:${rp.permission.resource}`);
      }
    }

    if (user.staffDirectPermissions) {
      for (const sp of user.staffDirectPermissions) {
        const key = `${sp.permission.action}:${sp.permission.resource}`;
        if (sp.effect === "ALLOW") {
          activePermissions.add(key);
        } else if (sp.effect === "DENY") {
          activePermissions.delete(key);
        }
      }
    }

    const resolvedPermissionsList = Array.from(activePermissions);

    // 5. Evaluate Required Permission Authorization Decision
    if (params.requiredPermission) {
      const isAuthorized = activePermissions.has(params.requiredPermission);
      if (!isAuthorized) {
        return {
          valid: true,
          authorized: false,
          userId: user.id,
          sessionId: session.id,
          accountType: user.accountType as UserAccessTokenClaims["account_type"],
          status: user.status as UserAccessTokenClaims["account_status"],
          role: user.role?.name,
          permissions: resolvedPermissionsList,
          reason: "INSUFFICIENT_PERMISSIONS",
        };
      }
    }

    return {
      valid: true,
      authorized: true,
      userId: user.id,
      sessionId: session.id,
      accountType: user.accountType as UserAccessTokenClaims["account_type"],
      status: user.status as UserAccessTokenClaims["account_status"],
      role: user.role?.name,
      permissions: resolvedPermissionsList,
    };
  }
}
