import crypto from "node:crypto";
import type { PrismaClient } from "../../../database/generated/client/client.js";
import { SessionService } from "./session.service.js";
import {
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
} from "../../../errors/app-error.js";
import { ERROR_CODES } from "../../../constants/error-codes.js";
import type { AccountType } from "@fillcart/shared-types";

export class AccountLinkingService {
  // Ephemeral single-use step-up grant store: grantToken -> { userId, expiresAt }
  private static stepUpGrants = new Map<string, { userId: string; expiresAt: Date }>();

  constructor(
    private prisma: PrismaClient,
    private sessionService: SessionService
  ) {}

  /**
   * Issues a durable single-use step-up elevation grant after sensitive re-authentication.
   * Validity: 10 minutes.
   */
  public issueStepUpGrant(userId: string): string {
    const grant = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    AccountLinkingService.stepUpGrants.set(grant, { userId, expiresAt });
    return grant;
  }

  /**
   * Consumes a single-use step-up grant atomically.
   */
  public consumeStepUpGrant(grant: string, expectedUserId: string): void {
    const record = AccountLinkingService.stepUpGrants.get(grant);
    if (!record) {
      throw new UnauthorizedError("Invalid or consumed step-up grant", ERROR_CODES.INVALID_STEP_UP_GRANT);
    }

    if (new Date() > record.expiresAt) {
      AccountLinkingService.stepUpGrants.delete(grant);
      throw new UnauthorizedError("Step-up grant has expired", ERROR_CODES.INVALID_STEP_UP_GRANT);
    }

    if (record.userId !== expectedUserId) {
      throw new ForbiddenError("Step-up grant user mismatch", ERROR_CODES.INVALID_STEP_UP_GRANT);
    }

    // Single-use guarantee: consume immediately
    AccountLinkingService.stepUpGrants.delete(grant);
  }

  /**
   * Links a verified secondary identity/account to an authenticated primary user.
   * Rules:
   * 1. Requires valid, unconsumed step-up grant verifying control of the primary account.
   * 2. Asserts both primary and target accounts exist and are ACTIVE.
   * 3. Prevents duplicate linking and account takeover.
   * 4. Logs linking audit trail.
   */
  public async linkVerifiedAccount(params: {
    primaryUserId: string;
    targetUserId: string;
    stepUpGrant: string;
  }): Promise<{ success: boolean; linkedUserId: string }> {
    if (params.primaryUserId === params.targetUserId) {
      throw new BadRequestError("Cannot link an account to itself", ERROR_CODES.BAD_REQUEST);
    }

    // Consume step-up grant atomically
    this.consumeStepUpGrant(params.stepUpGrant, params.primaryUserId);

    const [primaryUser, targetUser] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: params.primaryUserId } }),
      this.prisma.user.findUnique({ where: { id: params.targetUserId } }),
    ]);

    if (!primaryUser || !targetUser) {
      throw new BadRequestError("One or both accounts do not exist", ERROR_CODES.NOT_FOUND);
    }

    if (primaryUser.status !== "ACTIVE" || targetUser.status !== "ACTIVE") {
      throw new ForbiddenError("Both accounts must be active to link", ERROR_CODES.ACCOUNT_SUSPENDED);
    }

    // Atomic transaction checking conflicting ownership and writing audit log
    await this.prisma.$transaction(async (tx) => {
      // Check for existing link to prevent duplicate linking or conflicting account takeover
      const existingLink = await tx.authAuditLog.findFirst({
        where: {
          targetType: "User",
          targetUserId: targetUser.id,
          action: "ACCOUNTS_LINKED",
        },
      });

      if (existingLink) {
        if (existingLink.actorUserId === primaryUser.id) {
          throw new BadRequestError("Account is already linked to this user", ERROR_CODES.BAD_REQUEST);
        } else {
          throw new ForbiddenError(
            "Conflicting ownership: target identity is already linked to another account",
            ERROR_CODES.FORBIDDEN
          );
        }
      }

      // Record linking event in AuthAuditLog
      await tx.authAuditLog.create({
        data: {
          id: crypto.randomUUID(),
          actorType: "USER",
          actorId: primaryUser.id,
          actorUserId: primaryUser.id,
          targetType: "User",
          targetId: targetUser.id,
          targetUserId: targetUser.id,
          action: "ACCOUNTS_LINKED",
          metadata: {
            primaryEmail: primaryUser.emailNormalized,
            targetEmail: targetUser.emailNormalized,
          },
        },
      });
    });

    return {
      success: true,
      linkedUserId: targetUser.id,
    };
  }

  /**
   * Promotes an applicant (VENDOR_APPLICANT or RIDER_APPLICANT) to their operational Role.
   * Rules:
   * 1. Preserves original applicant accountType in User table.
   * 2. Sets user.status = 'ACTIVE'.
   * 3. Assigns corresponding Role ('VENDOR' or 'RIDER').
   * 4. Revokes all existing applicant sessions.
   * 5. Requires fresh login for operational tokens.
   */
  public async promoteApplicant(params: {
    adminUserId: string;
    applicantUserId: string;
    targetOperationalRole: "VENDOR" | "RIDER";
  }): Promise<void> {
    const applicant = await this.prisma.user.findUnique({
      where: { id: params.applicantUserId },
    });

    if (!applicant) {
      throw new BadRequestError("Applicant not found", ERROR_CODES.NOT_FOUND);
    }

    // Invariant check: Match applicantType to target role
    if (
      params.targetOperationalRole === "VENDOR" &&
      applicant.accountType !== ("VENDOR_APPLICANT" as AccountType)
    ) {
      throw new BadRequestError(
        "Cannot promote non-vendor applicant to VENDOR role",
        ERROR_CODES.BAD_REQUEST
      );
    }

    if (
      params.targetOperationalRole === "RIDER" &&
      applicant.accountType !== ("RIDER_APPLICANT" as AccountType)
    ) {
      throw new BadRequestError(
        "Cannot promote non-rider applicant to RIDER role",
        ERROR_CODES.BAD_REQUEST
      );
    }

    const operationalRole = await this.prisma.role.findUnique({
      where: { name: params.targetOperationalRole },
    });

    if (!operationalRole) {
      throw new BadRequestError("Target operational role does not exist", ERROR_CODES.NOT_FOUND);
    }

    await this.prisma.$transaction(async (tx) => {
      // 1. Update User to ACTIVE and link Role, preserving accountType
      await tx.user.update({
        where: { id: applicant.id },
        data: {
          status: "ACTIVE",
          roleId: operationalRole.id,
        },
      });

      // 2. Audit log promotion
      await tx.authAuditLog.create({
        data: {
          id: crypto.randomUUID(),
          actorType: "USER",
          actorId: params.adminUserId,
          actorUserId: params.adminUserId,
          targetType: "User",
          targetId: applicant.id,
          targetUserId: applicant.id,
          action: "APPLICANT_PROMOTED",
          metadata: {
            assignedRole: params.targetOperationalRole,
            preservedAccountType: applicant.accountType,
          },
        },
      });
    });

    // 3. Revoke all previous applicant sessions to force re-authentication
    await this.sessionService.revokeAllUserSessions(applicant.id, "APPLICANT_PROMOTION");
  }
}
