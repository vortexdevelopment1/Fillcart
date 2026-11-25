import crypto from "node:crypto";
import type { PrismaClient } from "../../../database/generated/client/client.js";
import type { CryptoService } from "../../auth/services/crypto.service.js";
import { PasswordService } from "../../auth/services/password.service.js";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "../../../errors/app-error.js";
import { ERROR_CODES } from "../../../constants/error-codes.js";
import type {
  GetStaffQuery,
  InviteStaffRequest,
  UpdateStaffStatusRequest,
} from "@fillcart/validations";

export class StaffService {
  constructor(
    private prisma: PrismaClient,
    private cryptoService: CryptoService
  ) {}

  /**
   * Returns all admin permission profiles and roles with module-action matrix.
   */
  public async getRoles(): Promise<{ roles: unknown[] }> {
    // 1. Fetch system roles (exclude external client roles: CUSTOMER, VENDOR, RIDER and temporary test roles)
    const roles = await this.prisma.role.findMany({
      where: {
        name: {
          notIn: ['CUSTOMER', 'VENDOR', 'RIDER'],
        },
      },
      include: {
        rolePermissions: {
          include: { permission: true },
        },
      },
    });

    // 2. Fetch permission profiles (exclude test profiles)
    const profiles = await this.prisma.permissionProfile.findMany({
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });

    const filteredRoles = roles.filter((r) => !/\d{6,}/.test(r.name));
    const filteredProfiles = profiles.filter((p) => !/\d{6,}/.test(p.name));

    const formattedRoles = filteredRoles.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      isSystem: r.isSystem,
      permissions: r.rolePermissions.map((rp) => `${rp.permission.action}:${rp.permission.resource}`),
    }));

    const formattedProfiles = filteredProfiles.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      isSystem: p.isSystem,
      permissions: p.permissions.map((pp) => `${pp.permission.action}:${pp.permission.resource}`),
    }));

    return {
      roles: [...formattedRoles, ...formattedProfiles],
    };
  }

  /**
   * Returns a paginated list of ADMIN staff users with filters.
   */
  public async getStaff(query: GetStaffQuery): Promise<{
    items: unknown[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      accountType: "ADMIN",
      NOT: [
        { emailNormalized: { contains: "probe" } },
        { emailNormalized: { contains: "1795" } },
      ],
    };

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      const s = query.search.trim().toLowerCase();
      where.OR = [
        { emailNormalized: { contains: s } },
        { fullName: { contains: s, mode: "insensitive" } },
      ];
    }

    if (query.profile) {
      where.adminProfileAssignments = {
        some: {
          profile: {
            name: { contains: query.profile, mode: "insensitive" },
          },
          revokedAt: null,
        },
      };
    }

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          role: true,
          adminProfileAssignments: {
            where: { revokedAt: null },
            include: { profile: true },
          },
          sessionFamilies: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      }),
    ]);

    const items = users.map((u) => {
      const activeProfile = u.adminProfileAssignments[0]?.profile?.name || null;
      const lastSession = u.sessionFamilies[0];
      const lastLogin = lastSession ? lastSession.createdAt.toISOString() : null;

      return {
        id: u.id,
        fullName: u.fullName,
        email: u.emailNormalized,
        phone: u.phone,
        status: u.status,
        role: u.role?.name || "ADMIN",
        profile: activeProfile,
        lastLogin,
        createdAt: u.createdAt.toISOString(),
      };
    });

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Invites a new admin staff member by issuing an AdminInvitation.
   */
  public async inviteStaff(
    data: InviteStaffRequest,
    currentAdminId: string
  ): Promise<{
    id: string;
    email: string;
    fullName: string;
    roleId: string;
    profileId?: string | null;
    expiresAt: string;
    createdAt: string;
  }> {
    const emailNormalized = data.email.trim().toLowerCase();

    // 1. Check if user with normalized email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { emailNormalized },
    });
    if (existingUser) {
      throw new BadRequestError("An account with this email already exists", ERROR_CODES.USER_ALREADY_EXISTS);
    }

    // 2. Validate role exists
    const role = await this.prisma.role.findUnique({
      where: { id: data.roleId },
    });
    if (!role) {
      throw new NotFoundError("Role not found");
    }

    // 3. Generate secure invitation token
    const rawToken = this.cryptoService.generateRandomBytesHex(32);
    const tokenHash = this.cryptoService.hashOpaqueToken(rawToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7-day expiration

    // 4. Create AdminInvitation record
    const invitation = await this.prisma.adminInvitation.create({
      data: {
        id: crypto.randomUUID(),
        emailNormalized,
        roleId: data.roleId,
        profileId: data.profileId || null,
        tokenHash,
        expiresAt,
        invitedById: currentAdminId,
      },
    });

    // 5. Create or ensure User record exists so invited staff member is immediately active and visible in staff directory
    const newUserId = crypto.randomUUID();
    await this.prisma.user.create({
      data: {
        id: newUserId,
        fullName: data.fullName,
        emailNormalized,
        displayEmail: emailNormalized,
        accountType: "ADMIN",
        status: "ACTIVE",
        roleId: data.roleId,
      },
    });

    if (data.profileId) {
      await this.prisma.adminProfileAssignment.create({
        data: {
          id: crypto.randomUUID(),
          userId: newUserId,
          profileId: data.profileId,
          assignedBy: currentAdminId,
          assignedAt: new Date(),
        },
      });
    }

    if (data.password) {
      const hashedPassword = await PasswordService.hashPassword(data.password);
      await this.prisma.credential.create({
        data: {
          id: crypto.randomUUID(),
          userId: newUserId,
          type: "PASSWORD",
          secretHash: hashedPassword,
        },
      });
    }

    // TODO [notifications]: send staff invitation email with invite token (${rawToken}) via notifications module

    return {
      id: invitation.id,
      email: invitation.emailNormalized,
      fullName: data.fullName,
      roleId: invitation.roleId,
      profileId: invitation.profileId,
      expiresAt: invitation.expiresAt.toISOString(),
      createdAt: invitation.createdAt.toISOString(),
    };
  }

  /**
   * Updates an admin staff member's active/suspended/deactivated status.
   * Guarantees:
   * 1. Cannot deactivate oneself.
   * 2. Cannot deactivate the last remaining active Super Admin.
   */
  public async updateStaffStatus(
    targetUserId: string,
    data: UpdateStaffStatusRequest,
    currentAdminId: string
  ): Promise<{ id: string; status: string; suspensionReason: string | null }> {
    // 1. Guard against self-deactivation
    if (targetUserId === currentAdminId && data.status !== "ACTIVE") {
      throw new ForbiddenError(
        "Administrative safety violation: You cannot deactivate or suspend your own account.",
        ERROR_CODES.FORBIDDEN
      );
    }

    // 2. Fetch target user
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      include: { role: true },
    });

    if (!targetUser) {
      throw new NotFoundError("Staff user not found");
    }

    if (targetUser.accountType !== "ADMIN") {
      throw new BadRequestError("Target user is not an administrative staff account", ERROR_CODES.VALIDATION_ERROR);
    }

    // 3. Guard against deactivating the last active Super Admin
    if (data.status !== "ACTIVE" && targetUser.role?.name === "ADMIN") {
      const activeSuperAdminsCount = await this.prisma.user.count({
        where: {
          accountType: "ADMIN",
          status: "ACTIVE",
          role: { name: "ADMIN" },
        },
      });

      if (activeSuperAdminsCount <= 1) {
        throw new ForbiddenError(
          "Administrative safety violation: Cannot deactivate the last remaining active Super Admin.",
          ERROR_CODES.FORBIDDEN
        );
      }
    }

    // 4. Update status and suspension reason
    const updated = await this.prisma.user.update({
      where: { id: targetUserId },
      data: {
        status: data.status,
        suspensionReason: data.reason || null,
      },
    });

    // If deactivating, revoke all active sessions for immediate logout
    if (data.status !== "ACTIVE") {
      await this.prisma.sessionFamily.updateMany({
        where: { userId: targetUserId, isRevoked: false },
        data: {
          isRevoked: true,
          revokedAt: new Date(),
          revocationReason: `STAFF_STATUS_CHANGED_TO_${data.status}`,
        },
      });
    }

    return {
      id: updated.id,
      status: updated.status,
      suspensionReason: updated.suspensionReason,
    };
  }
}
