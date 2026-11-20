import { describe, it, expect, beforeEach, vi } from "vitest";
import { AccountLinkingService } from "../../src/modules/auth/services/account-linking.service.js";

describe("Milestone 2.4 — AccountLinkingService Tests", () => {
  let linkingService: AccountLinkingService;
  let mockPrisma: any;
  let mockSessionService: any;

  beforeEach(() => {
    mockPrisma = {
      user: {
        findUnique: vi.fn(),
        update: vi.fn().mockResolvedValue({}),
      },
      role: {
        findUnique: vi.fn(),
      },
      authAuditLog: {
        findFirst: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({}),
      },
      $transaction: vi.fn(async (cb) => cb(mockPrisma)),
    };
    mockSessionService = {
      revokeAllUserSessions: vi.fn().mockResolvedValue(undefined),
    };

    linkingService = new AccountLinkingService(mockPrisma, mockSessionService);
  });

  it("links two verified accounts with valid step-up grant", async () => {
    const primaryId = "11111111-1111-4111-8111-111111111111";
    const targetId = "22222222-2222-4222-8222-222222222222";
    const grant = linkingService.issueStepUpGrant(primaryId);

    mockPrisma.user.findUnique.mockImplementation(({ where }: any) => {
      if (where.id === primaryId) return Promise.resolve({ id: primaryId, status: "ACTIVE", emailNormalized: "p@fillcart.internal" });
      if (where.id === targetId) return Promise.resolve({ id: targetId, status: "ACTIVE", emailNormalized: "t@fillcart.internal" });
      return Promise.resolve(null);
    });

    const res = await linkingService.linkVerifiedAccount({
      primaryUserId: primaryId,
      targetUserId: targetId,
      stepUpGrant: grant,
    });

    expect(res.success).toBe(true);
    expect(res.linkedUserId).toBe(targetId);
    expect(mockPrisma.authAuditLog.create).toHaveBeenCalledOnce();
  });

  it("promotes VENDOR_APPLICANT to operational VENDOR role and revokes previous sessions", async () => {
    const applicantId = "applicant-123";
    const adminId = "admin-123";

    mockPrisma.user.findUnique.mockResolvedValueOnce({
      id: applicantId,
      accountType: "VENDOR_APPLICANT",
      status: "PENDING_APPROVAL",
    });

    mockPrisma.role.findUnique.mockResolvedValueOnce({
      id: "role-vendor-id",
      name: "VENDOR",
    });

    await linkingService.promoteApplicant({
      adminUserId: adminId,
      applicantUserId: applicantId,
      targetOperationalRole: "VENDOR",
    });

    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: applicantId },
      data: {
        status: "ACTIVE",
        roleId: "role-vendor-id",
      },
    });

    expect(mockSessionService.revokeAllUserSessions).toHaveBeenCalledWith(
      applicantId,
      "APPLICANT_PROMOTION"
    );
  });
});
