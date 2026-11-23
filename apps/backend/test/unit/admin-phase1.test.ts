import { describe, it, expect, beforeEach, vi } from "vitest";
import { AdminAuthService } from "../../src/modules/admin/services/admin-auth.service.js";
import { StaffService } from "../../src/modules/admin/services/staff.service.js";
import {
  createAdminAuthMiddleware,
  requirePermission,
  createRequireSettingsAccessMiddleware,
  type AdminAuthRequest,
} from "../../src/modules/admin/middleware/admin-auth.middleware.js";
import { CryptoService } from "../../src/modules/auth/services/crypto.service.js";
import { PasswordService } from "../../src/modules/auth/services/password.service.js";
import { validateConfig } from "../../src/config/env.js";
import { ForbiddenError, UnauthorizedError, BadRequestError } from "../../src/errors/app-error.js";
import type { Response, NextFunction } from "express";

describe("Super Admin Backend Phase 1 Unit Tests", () => {
  let config: any;
  let cryptoService: CryptoService;
  let mockPrisma: any;
  let adminAuthService: AdminAuthService;
  let staffService: StaffService;

  const adminUserId = "11111111-1111-4111-8111-111111111111";
  const superAdminRoleId = "role-admin-super";
  const validPassword = "SuperAdminPassword123!";

  beforeEach(() => {
    config = validateConfig({
      JWT_ISSUER_URL: "https://auth.fillcart.internal",
      JWT_ACTIVE_KID: "k-admin-test-1",
      ARGON2_MEMORY_COST: 19456,
      ARGON2_TIME_COST: 2,
      ARGON2_PARALLELISM: 1,
    });
    cryptoService = new CryptoService(config);

    mockPrisma = {
      user: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn(),
        update: vi.fn(),
      },
      credential: {
        findFirst: vi.fn(),
      },
      rateLimitRecord: {
        count: vi.fn(),
        create: vi.fn(),
      },
      authAuditLog: {
        create: vi.fn().mockResolvedValue({}),
      },
      role: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
      },
      permissionProfile: {
        findMany: vi.fn(),
      },
      adminInvitation: {
        create: vi.fn(),
      },
      sessionFamily: {
        updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      },
      session: {
        findUnique: vi.fn(),
      },
    };

    adminAuthService = new AdminAuthService(mockPrisma, cryptoService);
    staffService = new StaffService(mockPrisma, cryptoService);
  });

  describe("adminAuth middleware & 3-Tier RBAC", () => {
    it("rejects request without authorization header", async () => {
      const middleware = createAdminAuthMiddleware(mockPrisma, cryptoService);
      const req = { headers: {} } as AdminAuthRequest;
      const res = {} as Response;
      const next = vi.fn();

      await middleware(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it("rejects token with wrong audience (not admin-backend)", async () => {
      const middleware = createAdminAuthMiddleware(mockPrisma, cryptoService);
      const wrongAudToken = cryptoService.signJwt({
        sub: adminUserId,
        aud: "customer-backend",
        sid: "session-123",
        account_type: "ADMIN",
        exp: Math.floor(Date.now() / 1000) + 900,
      });

      const req = {
        headers: { authorization: `Bearer ${wrongAudToken}` },
      } as AdminAuthRequest;
      const res = {} as Response;
      const next = vi.fn();

      await middleware(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it("rejects token when account_type is not ADMIN", async () => {
      const middleware = createAdminAuthMiddleware(mockPrisma, cryptoService);
      const customerToken = cryptoService.signJwt({
        sub: adminUserId,
        aud: "admin-backend",
        sid: "session-123",
        account_type: "CUSTOMER",
        exp: Math.floor(Date.now() / 1000) + 900,
      });

      const req = {
        headers: { authorization: `Bearer ${customerToken}` },
      } as AdminAuthRequest;
      const res = {} as Response;
      const next = vi.fn();

      await middleware(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });

    it("rejects inactive admin user", async () => {
      const middleware = createAdminAuthMiddleware(mockPrisma, cryptoService);
      const token = cryptoService.signJwt({
        sub: adminUserId,
        aud: "admin-backend",
        sid: "session-123",
        account_type: "ADMIN",
        exp: Math.floor(Date.now() / 1000) + 900,
      });

      mockPrisma.session.findUnique.mockResolvedValue({
        id: "session-123",
        isRevoked: false,
        expiresAt: new Date(Date.now() + 60000),
        user: {
          id: adminUserId,
          emailNormalized: "admin@fillcart.internal",
          fullName: "Admin",
          accountType: "ADMIN",
          status: "SUSPENDED",
        },
      });

      const req = {
        headers: { authorization: `Bearer ${token}` },
      } as AdminAuthRequest;
      const res = {} as Response;
      const next = vi.fn();

      await middleware(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });

    it("resolves 3-tier RBAC with StaffDirectPermission DENY override", async () => {
      const middleware = createAdminAuthMiddleware(mockPrisma, cryptoService);
      const token = cryptoService.signJwt({
        sub: adminUserId,
        aud: "admin-backend",
        sid: "session-123",
        account_type: "ADMIN",
        exp: Math.floor(Date.now() / 1000) + 900,
      });

      mockPrisma.session.findUnique.mockResolvedValue({
        id: "session-123",
        isRevoked: false,
        expiresAt: new Date(Date.now() + 60000),
        user: {
          id: adminUserId,
          emailNormalized: "admin@fillcart.internal",
          fullName: "Ops Admin",
          accountType: "ADMIN",
          status: "ACTIVE",
          roleId: "role-ops",
          role: {
            name: "OPERATIONS",
            rolePermissions: [
              { permission: { action: "view", resource: "orders" } },
              { permission: { action: "view", resource: "staff" } },
            ],
          },
          adminProfileAssignments: [
            {
              profile: {
                permissions: [
                  { permission: { action: "manage", resource: "orders" } },
                ],
              },
            },
          ],
          staffDirectPermissions: [
            // Tier 1 direct DENY override for staff:view
            {
              effect: "DENY",
              permission: { action: "view", resource: "staff" },
            },
          ],
        },
      });

      const req = {
        headers: { authorization: `Bearer ${token}` },
      } as AdminAuthRequest;
      const res = {} as Response;
      const next = vi.fn();

      await middleware(req, res, next);
      expect(next).toHaveBeenCalledWith();
      expect(req.adminUser).toBeDefined();

      // Permission orders:view exists
      expect(req.adminUser?.permissions.has("orders:view")).toBe(true);
      // Staff view was explicitly DENIED at Tier 1
      expect(req.adminUser?.permissions.has("staff:view")).toBe(false);
    });

    it("requirePermission allows authorized users and Super Admin", () => {
      const superAdminReq = {
        adminUser: {
          id: adminUserId,
          roleName: "ADMIN",
          permissions: new Set<string>(),
        },
      } as AdminAuthRequest;

      const next = vi.fn();
      requirePermission("staff", "view")(superAdminReq, {} as Response, next);
      expect(next).toHaveBeenCalledWith();

      const forbiddenReq = {
        adminUser: {
          id: adminUserId,
          roleName: "SUPPORT",
          permissions: new Set(["orders:view"]),
        },
      } as AdminAuthRequest;
      const forbiddenNext = vi.fn();
      requirePermission("staff", "view")(forbiddenReq, {} as Response, forbiddenNext);
      expect(forbiddenNext).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });
  });

  describe("POST /auth/verify-settings-access", () => {
    it("verifies password, returns 15-minute token, and logs success audit log", async () => {
      const passwordHash = await PasswordService.hashPassword(validPassword, config);
      mockPrisma.rateLimitRecord.count.mockResolvedValue(0);
      mockPrisma.credential.findFirst.mockResolvedValue({
        id: "cred-1",
        userId: adminUserId,
        type: "PASSWORD",
        secretHash: passwordHash,
      });

      const result = await adminAuthService.verifySettingsAccess({
        userId: adminUserId,
        password: validPassword,
      });

      expect(result.verified).toBe(true);
      expect(result.expiresIn).toBe(900);
      expect(result.token).toBeDefined();

      // Verify token is Ed25519 signed with scope 'settings'
      const decoded = cryptoService.verifyJwt<{ userId: string; scope: string }>(result.token);
      expect(decoded.userId).toBe(adminUserId);
      expect(decoded.scope).toBe("settings");

      // Verify success audit log
      expect(mockPrisma.authAuditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: "SETTINGS_ACCESS_VERIFIED",
            targetUserId: adminUserId,
          }),
        })
      );
    });

    it("rejects invalid password, records rate limit and logs failure audit log", async () => {
      const passwordHash = await PasswordService.hashPassword(validPassword, config);
      mockPrisma.rateLimitRecord.count.mockResolvedValue(2);
      mockPrisma.credential.findFirst.mockResolvedValue({
        id: "cred-1",
        userId: adminUserId,
        type: "PASSWORD",
        secretHash: passwordHash,
      });

      await expect(
        adminAuthService.verifySettingsAccess({
          userId: adminUserId,
          password: "WrongPassword!",
        })
      ).rejects.toThrow(UnauthorizedError);

      expect(mockPrisma.rateLimitRecord.create).toHaveBeenCalledOnce();
      expect(mockPrisma.authAuditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: "SETTINGS_ACCESS_FAILED",
          }),
        })
      );
    });

    it("locks out user after 5 failed attempts in 60s and logs lockout audit log", async () => {
      mockPrisma.rateLimitRecord.count.mockResolvedValue(5);

      await expect(
        adminAuthService.verifySettingsAccess({
          userId: adminUserId,
          password: validPassword,
        })
      ).rejects.toThrow(ForbiddenError);

      expect(mockPrisma.authAuditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: "SETTINGS_ACCESS_LOCKOUT",
          }),
        })
      );
    });

    it("requireSettingsAccess middleware enforces valid token and scope", () => {
      const middleware = createRequireSettingsAccessMiddleware(cryptoService);
      const validToken = cryptoService.signJwt({
        userId: adminUserId,
        scope: "settings",
        exp: Math.floor(Date.now() / 1000) + 900,
      });

      const validReq = {
        headers: { "x-settings-grant": validToken },
        adminUser: { id: adminUserId },
      } as AdminAuthRequest;
      const next = vi.fn();

      middleware(validReq, {} as Response, next);
      expect(next).toHaveBeenCalledWith();
      expect(validReq.settingsGrant?.scope).toBe("settings");

      // Wrong user token
      const invalidReq = {
        headers: { "x-settings-grant": validToken },
        adminUser: { id: "different-user-id" },
      } as AdminAuthRequest;
      const invalidNext = vi.fn();
      middleware(invalidReq, {} as Response, invalidNext);
      expect(invalidNext).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });
  });

  describe("GET /roles", () => {
    it("returns formatted system roles and permission profiles matrix", async () => {
      mockPrisma.role.findMany.mockResolvedValue([
        {
          id: "role-1",
          name: "ADMIN",
          description: "Super Admin",
          isSystem: true,
          rolePermissions: [
            { permission: { action: "view", resource: "staff" } },
          ],
        },
      ]);
      mockPrisma.permissionProfile.findMany.mockResolvedValue([
        {
          id: "profile-1",
          name: "Operations Admin",
          description: "Ops Manager",
          isSystem: true,
          permissions: [
            { permission: { action: "view", resource: "orders" } },
          ],
        },
      ]);

      const result = await staffService.getRoles();
      expect(result.roles).toHaveLength(2);
      expect(result.roles[0]).toEqual(
        expect.objectContaining({
          name: "ADMIN",
          permissions: ["view:staff"],
        })
      );
      expect(result.roles[1]).toEqual(
        expect.objectContaining({
          name: "Operations Admin",
          permissions: ["view:orders"],
        })
      );
    });
  });

  describe("GET /staff", () => {
    it("returns paginated staff users with profile and last login", async () => {
      mockPrisma.user.count.mockResolvedValue(1);
      mockPrisma.user.findMany.mockResolvedValue([
        {
          id: adminUserId,
          fullName: "Admin User",
          emailNormalized: "admin@fillcart.internal",
          phone: "+919876543210",
          status: "ACTIVE",
          role: { name: "ADMIN" },
          adminProfileAssignments: [
            { profile: { name: "Super Admin Profile" } },
          ],
          sessionFamilies: [
            { createdAt: new Date("2026-11-20T10:00:00Z") },
          ],
          createdAt: new Date("2026-11-01T00:00:00Z"),
        },
      ]);

      const result = await staffService.getStaff({ page: 1, limit: 10 });
      expect(result.items).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
      expect(result.items[0]).toEqual(
        expect.objectContaining({
          fullName: "Admin User",
          email: "admin@fillcart.internal",
          profile: "Super Admin Profile",
          status: "ACTIVE",
        })
      );
    });
  });

  describe("POST /staff/invite", () => {
    it("creates an AdminInvitation and returns non-secret fields", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.role.findUnique.mockResolvedValue({ id: superAdminRoleId });
      mockPrisma.adminInvitation.create.mockImplementation(({ data }: any) =>
        Promise.resolve({
          ...data,
          id: "invite-123",
          createdAt: new Date(),
        })
      );

      const result = await staffService.inviteStaff(
        {
          email: "newstaff@fillcart.internal",
          fullName: "New Staff",
          roleId: superAdminRoleId,
        },
        adminUserId
      );

      expect(result.id).toBe("invite-123");
      expect(result.email).toBe("newstaff@fillcart.internal");
      expect(result.fullName).toBe("New Staff");
      expect(result.roleId).toBe(superAdminRoleId);
      expect((result as any).tokenHash).toBeUndefined();
      expect((result as any).rawToken).toBeUndefined();
    });

    it("rejects invitation when user already exists", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: "existing-user" });

      await expect(
        staffService.inviteStaff(
          {
            email: "existing@fillcart.internal",
            fullName: "Existing",
            roleId: superAdminRoleId,
          },
          adminUserId
        )
      ).rejects.toThrow(BadRequestError);
    });
  });

  describe("PATCH /staff/:id/status", () => {
    const targetUserId = "22222222-2222-4222-8222-222222222222";

    it("prevents self-deactivation", async () => {
      await expect(
        staffService.updateStaffStatus(
          adminUserId,
          { status: "DEACTIVATED" },
          adminUserId
        )
      ).rejects.toThrow(ForbiddenError);
    });

    it("prevents deactivating the last remaining active Super Admin", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: targetUserId,
        accountType: "ADMIN",
        status: "ACTIVE",
        role: { name: "ADMIN" },
      });
      // Only 1 active super admin in database
      mockPrisma.user.count.mockResolvedValue(1);

      await expect(
        staffService.updateStaffStatus(
          targetUserId,
          { status: "DEACTIVATED" },
          adminUserId
        )
      ).rejects.toThrow(ForbiddenError);
    });

    it("successfully deactivates staff and revokes active sessions", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: targetUserId,
        accountType: "ADMIN",
        status: "ACTIVE",
        role: { name: "OPERATIONS" },
      });
      mockPrisma.user.update.mockResolvedValue({
        id: targetUserId,
        status: "DEACTIVATED",
        suspensionReason: "Terminated",
      });

      const result = await staffService.updateStaffStatus(
        targetUserId,
        { status: "DEACTIVATED", reason: "Terminated" },
        adminUserId
      );

      expect(result.status).toBe("DEACTIVATED");
      expect(mockPrisma.sessionFamily.updateMany).toHaveBeenCalledWith({
        where: { userId: targetUserId, isRevoked: false },
        data: expect.objectContaining({ isRevoked: true }),
      });
    });
  });
});
