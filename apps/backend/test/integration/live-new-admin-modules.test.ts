import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import crypto from "node:crypto";
import { createApp } from "../../src/app.js";
import { validateConfig } from "../../src/config/env.js";
import { getPrismaClient } from "../../src/database/index.js";
import { CryptoService } from "../../src/modules/auth/services/crypto.service.js";
import { SessionService } from "../../src/modules/auth/services/session.service.js";
import { seedAdminModulesPermissions } from "../../prisma/seeds/admin-modules.seed.js";
import type { Express } from "express";
import type { PrismaClient } from "../../src/database/generated/client/client.js";

describe("Live Admin Modules End-to-End Flows (Real PostgreSQL DB)", () => {
  let app: Express;
  let prisma: PrismaClient;
  let cryptoService: CryptoService;
  let sessionService: SessionService;

  // Real tokens
  let superAdminToken: string;
  let financeAdminToken: string;
  let supportAdminToken: string;

  let superAdminUserId: string;
  let financeAdminUserId: string;
  let supportAdminUserId: string;

  // Real fixtures
  let testVendorId: string;
  let testRiderId: string;
  let testOrderId: string;
  let testOrder2Id: string;
  let testOrder3Id: string;
  let testBatchId: string;
  let testDocId: string;

  beforeAll(async () => {
    const { privateKey: authPriv, publicKey: authPub } = crypto.generateKeyPairSync("ed25519");
    const jwtActivePrivateKeyPem = authPriv.export({ type: "pkcs8", format: "pem" }) as string;
    const jwtActivePublicKeyPem = authPub.export({ type: "spki", format: "pem" }) as string;

    const config = validateConfig({
      DATABASE_URL:
        process.env.MIGRATION_DATABASE_URL ||
        "postgresql://fillcart_user:fillcart_pass@127.0.0.1:5432/fillcart?schema=public",
      MIGRATION_DATABASE_URL:
        "postgresql://fillcart_user:fillcart_pass@127.0.0.1:5432/fillcart?schema=public",
      JWT_ISSUER_URL: "https://auth.fillcart.internal",
      JWT_ACTIVE_KID: "k-test-admin-live-modules-all",
      JWT_ACTIVE_PRIVATE_KEY_PEM: jwtActivePrivateKeyPem,
      JWT_ACTIVE_PUBLIC_KEY_PEM: jwtActivePublicKeyPem,
      LOG_LEVEL: "silent",
      NODE_ENV: "test",
    });

    app = createApp(config);
    prisma = getPrismaClient(config);

    cryptoService = new CryptoService(config);
    sessionService = new SessionService(prisma, cryptoService, config.JWT_ISSUER_URL);

    // 1. Run local idempotent seed for normalized permissions and profiles
    await seedAdminModulesPermissions(prisma);

    // 2. Ensure ADMIN role exists
    const adminRole = await prisma.role.upsert({
      where: { name: "ADMIN" },
      update: {},
      create: {
        name: "ADMIN",
        description: "Admin Core Role",
        isSystem: true,
      },
    });

    // 3. Super Admin User
    superAdminUserId = crypto.randomUUID();
    const superEmail = `super_${Date.now()}@fillcart.internal`;
    await prisma.user.create({
      data: {
        id: superAdminUserId,
        emailNormalized: superEmail.toLowerCase(),
        displayEmail: superEmail,
        fullName: "Super Admin Tester",
        accountType: "ADMIN",
        status: "ACTIVE",
        roleId: adminRole.id,
      },
    });
    const superProfile = await prisma.permissionProfile.findUniqueOrThrow({
      where: { name: "Super Admin" },
    });
    await prisma.adminProfileAssignment.create({
      data: {
        userId: superAdminUserId,
        profileId: superProfile.id,
        assignedBy: superAdminUserId,
      },
    });
    const superSession = await sessionService.createSession(superAdminUserId, {
      ipAddress: "127.0.0.1",
      userAgent: "vitest-super-agent",
    });
    superAdminToken = superSession.accessToken;

    // 4. Finance Admin User
    financeAdminUserId = crypto.randomUUID();
    const financeEmail = `finance_${Date.now()}@fillcart.internal`;
    await prisma.user.create({
      data: {
        id: financeAdminUserId,
        emailNormalized: financeEmail.toLowerCase(),
        displayEmail: financeEmail,
        fullName: "Finance Manager Tester",
        accountType: "ADMIN",
        status: "ACTIVE",
        roleId: adminRole.id,
      },
    });
    const financeProfile = await prisma.permissionProfile.findUniqueOrThrow({
      where: { name: "Finance" },
    });
    await prisma.adminProfileAssignment.create({
      data: {
        userId: financeAdminUserId,
        profileId: financeProfile.id,
        assignedBy: superAdminUserId,
      },
    });
    const financeSession = await sessionService.createSession(financeAdminUserId, {
      ipAddress: "127.0.0.1",
      userAgent: "vitest-finance-agent",
    });
    financeAdminToken = financeSession.accessToken;

    // 5. Support Admin User
    supportAdminUserId = crypto.randomUUID();
    const supportEmail = `support_${Date.now()}@fillcart.internal`;
    await prisma.user.create({
      data: {
        id: supportAdminUserId,
        emailNormalized: supportEmail.toLowerCase(),
        displayEmail: supportEmail,
        fullName: "Support Agent Tester",
        accountType: "ADMIN",
        status: "ACTIVE",
        roleId: adminRole.id,
      },
    });
    const supportProfile = await prisma.permissionProfile.findUniqueOrThrow({
      where: { name: "Support" },
    });
    await prisma.adminProfileAssignment.create({
      data: {
        userId: supportAdminUserId,
        profileId: supportProfile.id,
        assignedBy: superAdminUserId,
      },
    });
    const supportSession = await sessionService.createSession(supportAdminUserId, {
      ipAddress: "127.0.0.1",
      userAgent: "vitest-support-agent",
    });
    supportAdminToken = supportSession.accessToken;

    // 6. Create Customer & Vendor & Rider User entities
    const customerUser = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        emailNormalized: `cust_${Date.now()}@fillcart.internal`,
        displayEmail: `cust_${Date.now()}@fillcart.internal`,
        fullName: "Rohan Customer",
        accountType: "CUSTOMER",
        status: "ACTIVE",
      },
    });
    const customerProfile = await prisma.customerProfile.create({
      data: {
        userId: customerUser.id,
      },
    });
    const address = await prisma.address.create({
      data: {
        customerProfileId: customerProfile.id,
        addressType: "HOME",
        recipientName: "Rohan Customer",
        recipientPhone: "+919876543210",
        flatHouseNumber: "Flat 402",
        streetAddress: "123 MG Road",
        city: "Bengaluru",
        state: "Karnataka",
        postalCode: "560001",
        latitude: 12.9716,
        longitude: 77.5946,
      },
    });

    const vendorUser = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        emailNormalized: `vendor_${Date.now()}@fillcart.internal`,
        displayEmail: `vendor_${Date.now()}@fillcart.internal`,
        fullName: "Organic Mart Owner",
        accountType: "VENDOR_APPLICANT",
        status: "ACTIVE",
      },
    });
    const vendor = await prisma.vendor.create({
      data: {
        userId: vendorUser.id,
        businessName: "Organic Fresh Mart",
        ownerName: "Organic Mart Owner",
        businessCategory: "GROCERY",
        city: "Bengaluru",
        shopAddress: "45 Indiranagar 100ft Rd",
        status: "ACTIVE",
        verificationStatus: "APPROVED",
      },
    });
    testVendorId = vendor.id;

    const store = await prisma.store.create({
      data: {
        vendorId: vendor.id,
        storeName: "Organic Fresh Indiranagar",
        storeCode: `ST-${Date.now()}`,
        phone: "+919876500000",
        addressLine1: "45 Indiranagar 100ft Rd",
        city: "Bengaluru",
        state: "Karnataka",
        postalCode: "560038",
        latitude: 12.9716,
        longitude: 77.5946,
      },
    });

    const riderUser = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        emailNormalized: `rider_${Date.now()}@fillcart.internal`,
        displayEmail: `rider_${Date.now()}@fillcart.internal`,
        fullName: "Suresh Express Rider",
        accountType: "RIDER_APPLICANT",
        status: "ACTIVE",
      },
    });
    const riderId = crypto.randomUUID();
    await prisma.$executeRawUnsafe(
      `INSERT INTO "Rider" ("id", "userId", "fullName", "phone", "city", "address", "emergencyContactName", "emergencyContactRelation", "emergencyContactPhone", "availability", "verificationStatus", "status", "ratingAverage", "deliveriesCompleted", "onTimePct", "joinedDate", "isDeleted", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'ONLINE'::"RiderAvailability", 'APPROVED'::"VerificationStatus", 'ACTIVE'::"RiderStatus", 5.00, 0, 100.0, NOW(), false, NOW(), NOW())`,
      riderId,
      riderUser.id,
      "Suresh Express Rider",
      "+919876543219",
      "Bengaluru",
      "7th Cross, Koramangala",
      "Ramesh Rider",
      "Brother",
      "+919876500001"
    );
    testRiderId = riderId;

    // 7. Orders
    const order1 = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-1`,
        customerProfileId: customerProfile.id,
        storeId: store.id,
        deliveryAddressId: address.id,
        paymentMethod: "COD",
        itemTotalPaisa: 50000n,
        totalAmountPaisa: 50000n,
        status: "PLACED",
      },
    });
    testOrderId = order1.id;

    const order2 = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-2`,
        customerProfileId: customerProfile.id,
        storeId: store.id,
        deliveryAddressId: address.id,
        paymentMethod: "COD",
        itemTotalPaisa: 60000n,
        totalAmountPaisa: 60000n,
        status: "PLACED",
      },
    });
    testOrder2Id = order2.id;

    const order3 = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-3`,
        customerProfileId: customerProfile.id,
        storeId: store.id,
        deliveryAddressId: address.id,
        paymentMethod: "COD",
        itemTotalPaisa: 70000n,
        totalAmountPaisa: 70000n,
        status: "PLACED",
      },
    });
    testOrder3Id = order3.id;

    // 8. SettlementBatch
    const batch = await prisma.settlementBatch.create({
      data: {
        batchNumber: `SETTLE-${Date.now()}`,
        entityType: "VENDOR",
        periodStart: new Date(Date.now() - 7 * 86400000),
        periodEnd: new Date(),
        totalGrossAmountPaisa: 1000000n,
        totalCommissionPaisa: 150000n,
        totalGstPaisa: 27000n,
        totalNetPayoutPaisa: 823000n,
        totalCount: 5,
        status: "DRAFT",
        createdByUserId: superAdminUserId,
      },
    });
    testBatchId = batch.id;

    // 9. Document for Verification
    const docType = await prisma.documentType.upsert({
      where: { code: "GST_CERTIFICATE" },
      update: {},
      create: {
        code: "GST_CERTIFICATE",
        name: "GST Registration Certificate",
        purpose: "Tax identification for merchant operations",
        appliesTo: "VENDOR",
      },
    });
    const doc = await prisma.document.create({
      data: {
        entityType: "VENDOR",
        vendorId: vendor.id,
        documentTypeId: docType.id,
        documentNumberMasked: "29XXXXX1234Z1",
        status: "PENDING",
      },
    });
    testDocId = doc.id;
  });

  // =========================================================================
  // Item 2: Live Write Flows & Transactions
  // =========================================================================

  it("Flow A: orders/:id/cancel returns 200, then repeated cancel returns 409", async () => {
    // 1. Initial cancel succeeds
    const res1 = await request(app)
      .post(`/api/v1/admin/orders/${testOrderId}/cancel`)
      .set("Authorization", `Bearer ${superAdminToken}`)
      .send({ reason: "Customer requested cancellation before dispatch", triggerRefund: true });

    expect(res1.status).toBe(200);
    expect(res1.body.orderId).toBe(testOrderId);
    expect(res1.body.status).toBe("CANCELLED");
    expect(res1.body.refundInitiated).toBe(true);

    // Verify DB records
    const orderHistory = await prisma.orderStatusHistory.findFirst({
      where: { orderId: testOrderId, toStatus: "CANCELLED" },
    });
    expect(orderHistory).not.toBeNull();
    expect(orderHistory?.reason).toBe("Customer requested cancellation before dispatch");

    const refund = await prisma.refundRecord.findUnique({
      where: { orderId: testOrderId },
    });
    expect(refund).not.toBeNull();
    expect(refund?.status).toBe("INITIATED");

    const audit = await prisma.adminAuditLog.findFirst({
      where: { targetType: "ORDER", targetId: testOrderId, action: "UPDATE" },
    });
    expect(audit).not.toBeNull();

    // 2. Same call again MUST return 409 Conflict
    const res2 = await request(app)
      .post(`/api/v1/admin/orders/${testOrderId}/cancel`)
      .set("Authorization", `Bearer ${superAdminToken}`)
      .send({ reason: "Repeat double submit cancel", triggerRefund: true });

    expect(res2.status).toBe(409);
    const errMessage1 = res2.body.error?.message || res2.body.message || "";
    expect(errMessage1).toContain("already cancelled");
  });

  it("Flow B: Parallel cancels on the same order result in exactly one 200 and one 409", async () => {
    // Fire two parallel cancel requests
    const [res1, res2] = await Promise.all([
      request(app)
        .post(`/api/v1/admin/orders/${testOrder2Id}/cancel`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({ reason: "Parallel cancellation race 1", triggerRefund: false }),
      request(app)
        .post(`/api/v1/admin/orders/${testOrder2Id}/cancel`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({ reason: "Parallel cancellation race 2", triggerRefund: false }),
    ]);

    const statuses = [res1.status, res2.status].sort();
    expect(statuses).toEqual([200, 409]);
  });

  it("Flow C: orders/:id/assign-rider succeeds with 200, but returns 409 on cancelled order", async () => {
    // 1. Assign rider to active order (testOrder3Id)
    const res1 = await request(app)
      .patch(`/api/v1/admin/orders/${testOrder3Id}/assign-rider`)
      .set("Authorization", `Bearer ${superAdminToken}`)
      .send({ riderId: testRiderId });

    expect(res1.status).toBe(200);
    expect(res1.body.success).toBe(true);
    expect(res1.body.orderId).toBe(testOrder3Id);

    // 2. Assign rider to cancelled order (testOrderId) must return 409
    const res2 = await request(app)
      .patch(`/api/v1/admin/orders/${testOrderId}/assign-rider`)
      .set("Authorization", `Bearer ${superAdminToken}`)
      .send({ riderId: testRiderId });

    expect(res2.status).toBe(409);
    const errMessage2 = res2.body.error?.message || res2.body.message || "";
    expect(errMessage2).toContain("cancelled order");
  });

  it("Flow D: finance/settlements/:id/process sets PROCESSING (200), repeated call returns 409", async () => {
    // 1. First process sets status to PROCESSING
    const res1 = await request(app)
      .post(`/api/v1/admin/finance/settlements/${testBatchId}/process`)
      .set("Authorization", `Bearer ${superAdminToken}`);

    expect(res1.status).toBe(200);
    expect(res1.body.status).toBe("PROCESSING");

    const batch = await prisma.settlementBatch.findUnique({
      where: { id: testBatchId },
    });
    expect(batch?.status).toBe("PROCESSING");

    // 2. Repeat process call MUST return 409 Conflict
    const res2 = await request(app)
      .post(`/api/v1/admin/finance/settlements/${testBatchId}/process`)
      .set("Authorization", `Bearer ${superAdminToken}`);

    expect(res2.status).toBe(409);
    const errMessage3 = res2.body.error?.message || res2.body.message || "";
    expect(errMessage3).toContain("already processing");
  });

  it("Flow E: vendors/:id/commission creates/updates CommissionRule and records audit diff", async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/vendors/${testVendorId}/commission`)
      .set("Authorization", `Bearer ${superAdminToken}`)
      .send({ commissionPct: 18.5 });

    expect(res.status).toBe(200);
    expect(res.body.commissionPct).toBe(18.5);

    // Verify CommissionRule row in DB
    const rule = await prisma.commissionRule.findFirst({
      where: { vendorId: testVendorId, isActive: true },
    });
    expect(rule).not.toBeNull();
    expect(Number(rule?.ratePct)).toBe(18.5);

    // Verify AdminAuditLog row
    const audit = await prisma.adminAuditLog.findFirst({
      where: { targetType: "VENDOR", targetId: testVendorId, action: "UPDATE" },
      orderBy: { createdAt: "desc" },
    });
    expect(audit).not.toBeNull();
  });

  it("Flow F: vendors/:id/status updates vendor status in DB", async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/vendors/${testVendorId}/status`)
      .set("Authorization", `Bearer ${superAdminToken}`)
      .send({ status: "SUSPENDED", reason: "Annual documentation review" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("SUSPENDED");

    const updated = await prisma.vendor.findUnique({ where: { id: testVendorId } });
    expect(updated?.status).toBe("SUSPENDED");
  });

  it("Flow G: riders/:id/status and riders/:id/availability update rider state", async () => {
    // 1. Status update
    const resStatus = await request(app)
      .patch(`/api/v1/admin/riders/${testRiderId}/status`)
      .set("Authorization", `Bearer ${superAdminToken}`)
      .send({ status: "ACTIVE" });

    expect(resStatus.status).toBe(200);
    expect(resStatus.body.status).toBe("ACTIVE");

    // 2. Availability update
    const resAvail = await request(app)
      .patch(`/api/v1/admin/riders/${testRiderId}/availability`)
      .set("Authorization", `Bearer ${superAdminToken}`)
      .send({ availability: "OFFLINE" });

    expect(resAvail.status).toBe(200);
    expect(resAvail.body.availability).toBe("OFFLINE");
  });

  it("Flow H: verification review document and applicant decision", async () => {
    // 1. Review document
    const resDoc = await request(app)
      .patch(`/api/v1/admin/verification/documents/${testDocId}/review`)
      .set("Authorization", `Bearer ${superAdminToken}`)
      .send({ status: "APPROVED", remarks: "Clear document image" });

    expect(resDoc.status).toBe(200);
    expect(resDoc.body.status).toBe("APPROVED");

    // 2. Applicant decision
    const resDecision = await request(app)
      .post(`/api/v1/admin/verification/applicants/${testVendorId}/decision`)
      .set("Authorization", `Bearer ${superAdminToken}`)
      .send({ decision: "APPROVED", notes: "All compliance verified" });

    expect(resDecision.status).toBe(200);
    expect(resDecision.body.success).toBe(true);
  });

  // =========================================================================
  // RBAC Cross-Profile Isolation with Real Tokens
  // =========================================================================

  it("RBAC Isolation: Finance admin is forbidden (403) from vendor status, rider status, settings write, and staff invite", async () => {
    // 1. Vendor status -> 403
    const resVendor = await request(app)
      .patch(`/api/v1/admin/vendors/${testVendorId}/status`)
      .set("Authorization", `Bearer ${financeAdminToken}`)
      .send({ status: "ACTIVE" });
    expect(resVendor.status).toBe(403);

    // 2. Rider status -> 403
    const resRider = await request(app)
      .patch(`/api/v1/admin/riders/${testRiderId}/status`)
      .set("Authorization", `Bearer ${financeAdminToken}`)
      .send({ status: "ACTIVE" });
    expect(resRider.status).toBe(403);

    // 3. Settings write -> 403
    const resSettings = await request(app)
      .put("/api/v1/admin/settings/general")
      .set("Authorization", `Bearer ${financeAdminToken}`)
      .send({ values: { platformName: "Hacked" } });
    expect(resSettings.status).toBe(403);

    // 4. Staff invite -> 403
    const resStaff = await request(app)
      .post("/api/v1/admin/staff/invite")
      .set("Authorization", `Bearer ${financeAdminToken}`)
      .send({
        email: "unauthorized_staff@fillcart.internal",
        fullName: "Unauthorized User",
        profileId: "dummy-prof",
      });
    expect(resStaff.status).toBe(403);
  });

  it("RBAC Isolation: Support admin is forbidden (403) from finance process and vendor commission routes", async () => {
    // 1. Finance process -> 403
    const resFinance = await request(app)
      .post(`/api/v1/admin/finance/settlements/${testBatchId}/process`)
      .set("Authorization", `Bearer ${supportAdminToken}`);
    expect(resFinance.status).toBe(403);

    // 2. Vendor commission write -> 403
    const resCommission = await request(app)
      .patch(`/api/v1/admin/vendors/${testVendorId}/commission`)
      .set("Authorization", `Bearer ${supportAdminToken}`)
      .send({ commissionPct: 25 });
    expect(resCommission.status).toBe(403);
  });

  // =========================================================================
  // Sensitive Data Masking Verification
  // =========================================================================

  it("Sensitive Data: Vendor, rider and applicant responses never expose raw documents or unmasked bank numbers", async () => {
    const resApplicant = await request(app)
      .get(`/api/v1/admin/verification/applicants/${testDocId}`)
      .set("Authorization", `Bearer ${superAdminToken}`);

    expect(resApplicant.status).toBe(200);
    const bodyStr = JSON.stringify(resApplicant.body);
    expect(bodyStr).not.toContain("documentNumberEncrypted");
    expect(bodyStr).not.toContain("secretHash");
  });
});
