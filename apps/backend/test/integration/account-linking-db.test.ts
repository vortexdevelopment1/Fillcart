import { describe, it, expect, beforeAll } from "vitest";
import crypto from "node:crypto";
import { validateConfig } from "../../src/config/env.js";
import { getPrismaClient } from "../../src/database/client/prisma.js";
import { CryptoService } from "../../src/modules/auth/services/crypto.service.js";
import { SessionService } from "../../src/modules/auth/services/session.service.js";
import { AccountLinkingService } from "../../src/modules/auth/services/account-linking.service.js";
import { ERROR_CODES } from "../../src/constants/error-codes.js";

describe("Milestone 2.4 — Account Linking & Applicant Promotion Integration Tests", () => {
  let prisma: ReturnType<typeof getPrismaClient>;
  let sessionService: SessionService;
  let linkingService: AccountLinkingService;

  let primaryUser: string;
  let targetUser: string;
  let applicantUser: string;
  let adminUser: string;

  beforeAll(async () => {
    const config = validateConfig({
      DATABASE_URL:
        "postgresql://fillcart_app_user:fillcart_app_pass@127.0.0.1:5432/fillcart?schema=public",
      LOG_LEVEL: "silent",
      NODE_ENV: "test",
    });

    prisma = getPrismaClient(config);
    const cryptoService = new CryptoService(config);
    sessionService = new SessionService(prisma, cryptoService, config.JWT_ISSUER_URL);
    linkingService = new AccountLinkingService(prisma, sessionService);

    // Create primary active user
    primaryUser = "usr_link_prim_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    await prisma.user.create({
      data: {
        id: primaryUser,
        emailNormalized: `prim_${Date.now()}@fillcart.internal`,
        fullName: "Primary User",
        accountType: "CUSTOMER",
        status: "ACTIVE",
      },
    });

    // Create target active user
    targetUser = "usr_link_targ_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    await prisma.user.create({
      data: {
        id: targetUser,
        emailNormalized: `targ_${Date.now()}@fillcart.internal`,
        fullName: "Target User",
        accountType: "CUSTOMER",
        status: "ACTIVE",
      },
    });

    // Create vendor applicant
    applicantUser = "usr_app_vend_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    await prisma.user.create({
      data: {
        id: applicantUser,
        emailNormalized: `vend_app_${Date.now()}@fillcart.internal`,
        fullName: "Vendor Applicant",
        accountType: "VENDOR_APPLICANT",
        status: "PENDING_APPROVAL",
      },
    });

    // Create admin user for audit trail
    adminUser = "usr_link_admin_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    await prisma.user.create({
      data: {
        id: adminUser,
        emailNormalized: `admin_${Date.now()}@fillcart.internal`,
        fullName: "Admin Staff",
        accountType: "ADMIN",
        status: "ACTIVE",
      },
    });
  });

  it("links verified account with single-use step-up grant", async () => {
    const grant = linkingService.issueStepUpGrant(primaryUser);

    const res = await linkingService.linkVerifiedAccount({
      primaryUserId: primaryUser,
      targetUserId: targetUser,
      stepUpGrant: grant,
    });

    expect(res.success).toBe(true);
    expect(res.linkedUserId).toBe(targetUser);

    // Verify audit log was created in DB
    const auditRecord = await prisma.authAuditLog.findFirst({
      where: {
        actorUserId: primaryUser,
        targetUserId: targetUser,
        action: "ACCOUNTS_LINKED",
      },
    });
    expect(auditRecord).not.toBeNull();
  });

  it("rejects duplicate linking attempt for already linked account", async () => {
    // Fresh valid grant for primaryUser
    const freshGrant = linkingService.issueStepUpGrant(primaryUser);

    // Primary user attempts to link targetUser again
    await expect(
      linkingService.linkVerifiedAccount({
        primaryUserId: primaryUser,
        targetUserId: targetUser,
        stepUpGrant: freshGrant,
      })
    ).rejects.toThrow("Account is already linked to this user");
  });

  it("rejects conflicting ownership attempt (account takeover prevention)", async () => {
    // Create third active user
    const otherUser = "usr_link_oth_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    await prisma.user.create({
      data: {
        id: otherUser,
        emailNormalized: `other_${Date.now()}@fillcart.internal`,
        fullName: "Other User",
        accountType: "CUSTOMER",
        status: "ACTIVE",
      },
    });

    const grantForOther = linkingService.issueStepUpGrant(otherUser);

    // Other user attempts to link targetUser which belongs to primaryUser
    await expect(
      linkingService.linkVerifiedAccount({
        primaryUserId: otherUser,
        targetUserId: targetUser,
        stepUpGrant: grantForOther,
      })
    ).rejects.toThrow(
      "Conflicting ownership: target identity is already linked to another account"
    );
  });

  it("rejects expired step-up grant", async () => {
    const expiredGrant = crypto.randomUUID();
    (AccountLinkingService as any).stepUpGrants.set(expiredGrant, {
      userId: primaryUser,
      expiresAt: new Date(Date.now() - 5000),
    });

    await expect(
      linkingService.linkVerifiedAccount({
        primaryUserId: primaryUser,
        targetUserId: targetUser,
        stepUpGrant: expiredGrant,
      })
    ).rejects.toThrow("Step-up grant has expired");
  });

  it("rejects replayed step-up grant", async () => {
    // Create separate users for single-use replay testing
    const testUserA = "usr_link_ra_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    const testUserB = "usr_link_rb_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    await prisma.user.createMany({
      data: [
        {
          id: testUserA,
          emailNormalized: `ra_${Date.now()}@fillcart.internal`,
          fullName: "Replay Test A",
          accountType: "CUSTOMER",
          status: "ACTIVE",
        },
        {
          id: testUserB,
          emailNormalized: `rb_${Date.now()}@fillcart.internal`,
          fullName: "Replay Test B",
          accountType: "CUSTOMER",
          status: "ACTIVE",
        },
      ],
    });

    const grant = linkingService.issueStepUpGrant(testUserA);

    // First use consumes grant and succeeds
    await linkingService.linkVerifiedAccount({
      primaryUserId: testUserA,
      targetUserId: testUserB,
      stepUpGrant: grant,
    });

    // Replay exact same grant
    await expect(
      linkingService.linkVerifiedAccount({
        primaryUserId: testUserA,
        targetUserId: testUserB,
        stepUpGrant: grant,
      })
    ).rejects.toThrow("Invalid or consumed step-up grant");
  });

  it("rolls back transaction and does not create audit log on failure", async () => {
    const nonExistentTarget = "usr_link_nonexistent_" + crypto.randomUUID().slice(0, 8);
    const grant = linkingService.issueStepUpGrant(primaryUser);

    const initialAuditCount = await prisma.authAuditLog.count({
      where: { action: "ACCOUNTS_LINKED", targetUserId: nonExistentTarget },
    });

    await expect(
      linkingService.linkVerifiedAccount({
        primaryUserId: primaryUser,
        targetUserId: nonExistentTarget,
        stepUpGrant: grant,
      })
    ).rejects.toThrow("One or both accounts do not exist");

    const postAuditCount = await prisma.authAuditLog.count({
      where: { action: "ACCOUNTS_LINKED", targetUserId: nonExistentTarget },
    });

    expect(postAuditCount).toBe(initialAuditCount);
  });

  it("rejects step-up grant issued to a different user", async () => {
    const grantForTarget = linkingService.issueStepUpGrant(targetUser);

    await expect(
      linkingService.linkVerifiedAccount({
        primaryUserId: primaryUser,
        targetUserId: targetUser,
        stepUpGrant: grantForTarget,
      })
    ).rejects.toThrow("Step-up grant user mismatch");
  });

  it("promotes applicant, preserves accountType in User, and invalidates applicant sessions", async () => {
    // 1. Applicant logs in and acquires onboarding session
    const applicantSession = await sessionService.createSession(applicantUser);
    expect(applicantSession.refreshToken).toBeDefined();

    // 2. Admin promotes applicant to VENDOR
    await linkingService.promoteApplicant({
      adminUserId: adminUser,
      applicantUserId: applicantUser,
      targetOperationalRole: "VENDOR",
    });

    // 3. Verify User record in PostgreSQL
    const updatedApplicant = await prisma.user.findUnique({
      where: { id: applicantUser },
      include: { role: true },
    });

    expect(updatedApplicant?.status).toBe("ACTIVE");
    // Invariant: accountType must remain VENDOR_APPLICANT
    expect(updatedApplicant?.accountType).toBe("VENDOR_APPLICANT");
    // Operational role assigned
    expect(updatedApplicant?.role?.name).toBe("VENDOR");

    // 4. Verify previous applicant session is invalidated in DB
    await expect(
      sessionService.rotateRefreshToken(applicantSession.refreshToken)
    ).rejects.toThrow("Session has expired or been revoked");
  });

  it("rejects invalid role promotion mismatch", async () => {
    // Attempting to promote VENDOR_APPLICANT to RIDER must fail validation
    await expect(
      linkingService.promoteApplicant({
        adminUserId: adminUser,
        applicantUserId: applicantUser,
        targetOperationalRole: "RIDER",
      })
    ).rejects.toThrow("Cannot promote non-rider applicant to RIDER role");
  });
});
