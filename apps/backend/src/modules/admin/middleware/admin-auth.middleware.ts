import type { Request, Response, NextFunction } from "express";
import type { PrismaClient } from "../../../database/generated/client/client.js";
import type { CryptoService } from "../../auth/services/crypto.service.js";
import { UnauthorizedError, ForbiddenError } from "../../../errors/app-error.js";
import { ERROR_CODES } from "../../../constants/error-codes.js";
import type { UserAccessTokenClaims } from "@fillcart/shared-types";

export interface AuthenticatedAdmin {
  id: string;
  email: string;
  fullName: string;
  accountType: "ADMIN";
  status: "ACTIVE";
  sessionId: string;
  roleId: string | null;
  roleName?: string;
  permissions: Set<string>;
}

export interface AdminAuthRequest extends Request {
  adminUser?: AuthenticatedAdmin;
  settingsGrant?: {
    userId: string;
    scope: "settings";
    exp: number;
  };
}

/**
 * Creates the adminAuth middleware to enforce Central Auth token validity,
 * audience 'admin-backend', accountType 'ADMIN', and active user status.
 */
export function createAdminAuthMiddleware(prisma: PrismaClient, cryptoService: CryptoService) {
  return async (req: AdminAuthRequest, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("Missing or malformed Authorization header", ERROR_CODES.UNAUTHORIZED);
      }

      const token = authHeader.substring(7).trim();
      if (!token) {
        throw new UnauthorizedError("Bearer token is empty", ERROR_CODES.INVALID_TOKEN);
      }

      // 1. Asymmetric Ed25519 JWT verification
      let claims: UserAccessTokenClaims;
      try {
        claims = cryptoService.verifyJwt<UserAccessTokenClaims>(token);
      } catch {
        throw new UnauthorizedError("Invalid or expired token signature", ERROR_CODES.INVALID_TOKEN);
      }

      // 2. Token Purpose & Audience verification
      if (claims.token_use !== "access") {
        throw new UnauthorizedError("Invalid token purpose", ERROR_CODES.INVALID_TOKEN);
      }

      if (claims.aud !== "admin-backend") {
        throw new UnauthorizedError(
          `Token audience '${claims.aud}' is not authorized for the Super Admin backend`,
          ERROR_CODES.AUDIENCE_MISMATCH
        );
      }

      if (claims.account_type !== "ADMIN") {
        throw new ForbiddenError("User account type is not ADMIN", ERROR_CODES.FORBIDDEN);
      }

      // 3. Database session & user verification
      const session = await prisma.sessionFamily.findUnique({
        where: { id: claims.session_id },
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
              adminProfileAssignments: {
                where: { revokedAt: null },
                include: {
                  profile: {
                    include: {
                      permissions: {
                        include: { permission: true },
                      },
                    },
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
        throw new UnauthorizedError("Session not found", ERROR_CODES.UNAUTHORIZED);
      }

      if (session.isRevoked || new Date() > session.expiresAt) {
        throw new UnauthorizedError("Session expired or revoked", ERROR_CODES.SESSION_REVOKED);
      }

      const user = session.user;
      if (user.status !== "ACTIVE") {
        throw new ForbiddenError(
          `Admin account is not active (current status: ${user.status})`,
          ERROR_CODES.ACCOUNT_SUSPENDED
        );
      }

      // 4. Resolve Authoritative 3-tier permissions
      const activePermissions = new Set<string>();

      // Tier 3: Canonical Role Permissions
      if (user.role?.rolePermissions) {
        for (const rp of user.role.rolePermissions) {
          activePermissions.add(`${rp.permission.action}:${rp.permission.resource}`);
          activePermissions.add(`${rp.permission.resource}:${rp.permission.action}`);
        }
      }

      // Tier 2: Admin Profile Assignments
      if (user.adminProfileAssignments) {
        for (const pa of user.adminProfileAssignments) {
          for (const pp of pa.profile.permissions) {
            activePermissions.add(`${pp.permission.action}:${pp.permission.resource}`);
            activePermissions.add(`${pp.permission.resource}:${pp.permission.action}`);
          }
        }
      }

      // Tier 1: Staff Direct Permission Overrides (ALLOW adds, DENY removes)
      if (user.staffDirectPermissions) {
        for (const sp of user.staffDirectPermissions) {
          const key1 = `${sp.permission.action}:${sp.permission.resource}`;
          const key2 = `${sp.permission.resource}:${sp.permission.action}`;
          if (sp.effect === "ALLOW") {
            activePermissions.add(key1);
            activePermissions.add(key2);
          } else if (sp.effect === "DENY") {
            activePermissions.delete(key1);
            activePermissions.delete(key2);
          }
        }
      }

      // 5. Attach authenticated actor to request
      req.adminUser = {
        id: user.id,
        email: user.emailNormalized,
        fullName: user.fullName,
        accountType: "ADMIN",
        status: "ACTIVE",
        sessionId: session.id,
        roleId: user.roleId,
        roleName: user.role?.name,
        permissions: activePermissions,
      };

      next();
    } catch (err) {
      next(err);
    }
  };
}

/**
 * Middleware factory to enforce a required permission formatted as "resource:action" or (action, resource).
 */
export function requirePermission(actionOrResource: string, resourceOrAction?: string) {
  let requiredKey: string;
  if (resourceOrAction) {
    requiredKey = `${actionOrResource}:${resourceOrAction}`;
  } else {
    requiredKey = actionOrResource;
  }

  return (req: AdminAuthRequest, _res: Response, next: NextFunction): void => {
    try {
      if (!req.adminUser) {
        throw new UnauthorizedError("Unauthenticated admin request", ERROR_CODES.UNAUTHORIZED);
      }

      // Super Admin bypass or wildcard
      if (req.adminUser.roleName === "ADMIN" || req.adminUser.permissions.has("*:*")) {
        return next();
      }

      let hasPerm = req.adminUser.permissions.has(requiredKey);
      if (!hasPerm && requiredKey.includes(":")) {
        const [p1, p2] = requiredKey.split(":");
        hasPerm = req.adminUser.permissions.has(`${p2}:${p1}`);
      }

      if (!hasPerm) {
        throw new ForbiddenError(
          `Insufficient permissions: Requires permission '${requiredKey}'`,
          ERROR_CODES.FORBIDDEN
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

/**
 * Middleware to require a valid short-lived settings grant token for sensitive operations.
 */
export function createRequireSettingsAccessMiddleware(cryptoService: CryptoService) {
  return (req: AdminAuthRequest, _res: Response, next: NextFunction): void => {
    try {
      const grantHeader = req.headers["x-settings-grant"] as string;
      if (!grantHeader) {
        throw new ForbiddenError(
          "Settings grant token is required for this operation. Please verify admin password first.",
          ERROR_CODES.FORBIDDEN
        );
      }

      let payload: { userId: string; scope: string; exp: number };
      try {
        payload = cryptoService.verifyJwt<{ userId: string; scope: string; exp: number }>(grantHeader);
      } catch {
        throw new ForbiddenError("Invalid or expired settings grant token", ERROR_CODES.FORBIDDEN);
      }

      if (payload.scope !== "settings") {
        throw new ForbiddenError("Invalid settings grant scope", ERROR_CODES.FORBIDDEN);
      }

      if (req.adminUser && payload.userId !== req.adminUser.id) {
        throw new ForbiddenError("Settings grant token does not match authenticated user", ERROR_CODES.FORBIDDEN);
      }

      req.settingsGrant = {
        userId: payload.userId,
        scope: "settings",
        exp: payload.exp,
      };

      next();
    } catch (err) {
      next(err);
    }
  };
}
