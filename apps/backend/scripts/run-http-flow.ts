import request from "supertest";
import crypto from "node:crypto";
import { createApp } from "../src/app.js";
import { validateConfig } from "../src/config/env.js";
import { getPrismaClient } from "../src/database/index.js";
import { CryptoService } from "../src/modules/auth/services/crypto.service.js";
import { SessionService } from "../src/modules/auth/services/session.service.js";
import { PasswordService } from "../src/modules/auth/services/password.service.js";

function sanitizeBody(body: any): any {
  if (!body) return body;
  const clone = JSON.parse(JSON.stringify(body));
  function recurse(obj: any) {
    if (typeof obj !== "object" || obj === null) return;
    for (const key of Object.keys(obj)) {
      if (/token|secret|password|key/i.test(key) && typeof obj[key] === "string" && obj[key] !== "••••••••") {
        obj[key] = "[REDACTED]";
      } else if (typeof obj[key] === "object") {
        recurse(obj[key]);
      }
    }
  }
  recurse(clone);
  return clone;
}

function printStep(stepNum: number, name: string, status: number, body: any) {
  const sanitized = sanitizeBody(body);
  const trimmed = JSON.stringify(sanitized).slice(0, 350);
  console.log(`\n=== STEP ${stepNum}: ${name} ===`);
  console.log(`HTTP Status: ${status}`);
  console.log(`Response Body: ${trimmed}${trimmed.length >= 350 ? " ... (trimmed)" : ""}`);
}

async function run() {
  const { privateKey: authPriv, publicKey: authPub } = crypto.generateKeyPairSync("ed25519");
  const jwtActivePrivateKeyPem = authPriv.export({ type: "pkcs8", format: "pem" }) as string;
  const jwtActivePublicKeyPem = authPub.export({ type: "spki", format: "pem" }) as string;

  const config = validateConfig({
    DATABASE_URL: "postgresql://fillcart_app_user:fillcart_app_pass@127.0.0.1:5432/fillcart?schema=public",
    MIGRATION_DATABASE_URL: "postgresql://fillcart_user:fillcart_pass@127.0.0.1:5432/fillcart?schema=public",
    JWT_ISSUER_URL: "https://auth.fillcart.internal",
    JWT_ACTIVE_KID: "k-flow-demo-1",
    JWT_ACTIVE_PRIVATE_KEY_PEM: jwtActivePrivateKeyPem,
    JWT_ACTIVE_PUBLIC_KEY_PEM: jwtActivePublicKeyPem,
    LOG_LEVEL: "silent",
    NODE_ENV: "test",
  });

  const app = createApp(config);
  const prisma = getPrismaClient(config);
  const cryptoService = new CryptoService(config);
  const sessionService = new SessionService(prisma, cryptoService, config.JWT_ISSUER_URL);

  console.log("Connecting to PostgreSQL...");
  await prisma.$queryRaw`SELECT 1`;

  // 1. Seed Super Admin
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN", description: "Super Admin Role", isSystem: true },
  });

  const adminEmail = `superadmin_${Date.now()}@fillcart.internal`;
  const adminPassword = "SuperAdminPassword123!";
  const passwordHash = await PasswordService.hashPassword(adminPassword);

  const adminUser = await prisma.user.create({
    data: {
      emailNormalized: adminEmail.toLowerCase(),
      displayEmail: adminEmail,
      fullName: "Super Admin Demo",
      accountType: "ADMIN",
      status: "ACTIVE",
      roleId: adminRole.id,
      credentials: {
        create: {
          type: "PASSWORD",
          secretHash: passwordHash,
        },
      },
    },
  });

  // Step 1: Login as Super Admin
  const loginRes = await request(app)
    .post("/api/v1/auth/login")
    .send({ email: adminEmail, password: adminPassword });
  printStep(1, "Login as Super Admin (POST /api/v1/auth/login)", loginRes.status, loginRes.body);
  const adminToken = loginRes.body.accessToken;

  // Step 2: Create root Category
  const rootCatRes = await request(app)
    .post("/api/v1/admin/categories")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      name: "Food & Staples " + Date.now(),
      description: "Pantry groceries, cooking essentials",
      iconName: "package",
      displayOrder: 1,
      isActive: true,
    });
  printStep(2, "Create Root Category (POST /api/v1/admin/categories)", rootCatRes.status, rootCatRes.body);
  const rootCatId = rootCatRes.body.id;

  // Step 3: Create Sub-Category
  const subCatRes = await request(app)
    .post("/api/v1/admin/categories")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      name: "Flour & Grains " + Date.now(),
      description: "Whole wheat, rice, grains",
      iconName: "wheat",
      parentCategoryId: rootCatId,
      displayOrder: 1,
      isActive: true,
    });
  printStep(3, "Create Sub-Category (POST /api/v1/admin/categories)", subCatRes.status, subCatRes.body);
  const subCatId = subCatRes.body.id;

  // Step 4: Reorder Categories
  const reorderRes = await request(app)
    .put("/api/v1/admin/categories/reorder")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      items: [
        { id: rootCatId, displayOrder: 10 },
        { id: subCatId, displayOrder: 5 },
      ],
    });
  printStep(4, "Reorder Categories (PUT /api/v1/admin/categories/reorder)", reorderRes.status, reorderRes.body);

  // Step 5: Create Brand
  const brandRes = await request(app)
    .post("/api/v1/admin/brands")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      name: "Aashirvaad Mills " + Date.now(),
      logoUrl: "https://cdn.fillcart.internal/brands/aashirvaad.png",
      isActive: true,
    });
  printStep(5, "Create Brand (POST /api/v1/admin/brands)", brandRes.status, brandRes.body);
  const brandId = brandRes.body.id;

  // Step 6: Create Product with Variant
  const prodRes = await request(app)
    .post("/api/v1/admin/products")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      name: "Whole Wheat Sharbati Atta " + Date.now(),
      description: "100% pure Sharbati grain stone-ground atta",
      categoryId: subCatId,
      brandId: brandId,
      status: "DRAFT",
      variants: [
        {
          sku: "ATTA-5KG-" + Date.now(),
          variantName: "5 kg Bag",
          unitQuantity: 5,
          unitType: "KG",
          mrpPaisa: "32000",
          salePricePaisa: "28900",
          discountPct: 10,
          isDefault: true,
        },
      ],
    });
  printStep(6, "Create Product with Variant (POST /api/v1/admin/products)", prodRes.status, prodRes.body);
  const productId = prodRes.body.id;

  // Step 7: List Products with Filters & Pagination
  const listProdRes = await request(app)
    .get("/api/v1/admin/products")
    .set("Authorization", `Bearer ${adminToken}`)
    .query({ categoryId: subCatId, status: "DRAFT", page: 1, limit: 10 });
  printStep(7, "List Products with Filters (GET /api/v1/admin/products)", listProdRes.status, listProdRes.body);

  // Step 8: Reject Product without reason (expect 400)
  const rejectNoReasonRes = await request(app)
    .post(`/api/v1/admin/products/${productId}/moderate`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ action: "REJECT" });
  printStep(8, "Reject Product without Reason [Expect 400] (POST /api/v1/admin/products/:id/moderate)", rejectNoReasonRes.status, rejectNoReasonRes.body);

  // Step 9: Reject Product with reason
  const rejectWithReasonRes = await request(app)
    .post(`/api/v1/admin/products/${productId}/moderate`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ action: "REJECT", reason: "Packaging image resolution does not meet 1080p standard" });
  printStep(9, "Reject Product with Reason (POST /api/v1/admin/products/:id/moderate)", rejectWithReasonRes.status, rejectWithReasonRes.body);

  // Step 10: Approve Product
  const approveRes = await request(app)
    .post(`/api/v1/admin/products/${productId}/moderate`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ action: "APPROVE" });
  printStep(10, "Approve Product (POST /api/v1/admin/products/:id/moderate)", approveRes.status, approveRes.body);

  // Step 11: Bulk Status Update
  const bulkStatusRes = await request(app)
    .post("/api/v1/admin/products/bulk-status")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ productIds: [productId], status: "INACTIVE" });
  printStep(11, "Bulk Status Update (POST /api/v1/admin/products/bulk-status)", bulkStatusRes.status, bulkStatusRes.body);

  // Step 12: Toggle Status via PATCH
  const toggleStatusRes = await request(app)
    .patch(`/api/v1/admin/products/${productId}/status`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ status: "ACTIVE" });
  printStep(12, "Toggle Status via PATCH (PATCH /api/v1/admin/products/:id/status)", toggleStatusRes.status, toggleStatusRes.body);

  // Step 13: Read Settings without token (expect 401/403)
  const settingsNoTokenRes = await request(app)
    .get("/api/v1/admin/settings/FINANCE")
    .set("Authorization", `Bearer ${adminToken}`);
  printStep(13, "Read Settings Without Grant Token [Expect 401/403] (GET /api/v1/admin/settings/FINANCE)", settingsNoTokenRes.status, settingsNoTokenRes.body);

  // Step 14: Verify Settings Access (Re-auth)
  const verifySettingsRes = await request(app)
    .post("/api/v1/admin/auth/verify-settings-access")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ password: adminPassword });
  printStep(14, "Verify Settings Access (POST /api/v1/admin/auth/verify-settings-access)", verifySettingsRes.status, verifySettingsRes.body);
  const settingsGrantToken = verifySettingsRes.body.token;

  // Step 15: Read Settings with token
  const readSettingsRes = await request(app)
    .get("/api/v1/admin/settings/FINANCE")
    .set("Authorization", `Bearer ${adminToken}`)
    .set("x-settings-grant", settingsGrantToken);
  printStep(15, "Read Settings With Grant Token (GET /api/v1/admin/settings/FINANCE)", readSettingsRes.status, readSettingsRes.body);

  // Step 16: Update Settings Group and confirm secret masking
  const updateSettingsRes = await request(app)
    .put("/api/v1/admin/settings/FINANCE")
    .set("Authorization", `Bearer ${adminToken}`)
    .set("x-settings-grant", settingsGrantToken)
    .send({
      settings: {
        payoutCycleDays: 14,
        paymentGatewayApiKey: "secret_live_key_9999_demo",
        commissionRatePct: 5.0,
      },
    });
  printStep(16, "Update Settings Group (PUT /api/v1/admin/settings/FINANCE)", updateSettingsRes.status, updateSettingsRes.body);

  // Step 17: GET /api/v1/admin/audit-logs
  const auditLogsRes = await request(app)
    .get("/api/v1/admin/audit-logs")
    .set("Authorization", `Bearer ${adminToken}`)
    .query({ adminUserId: adminUser.id, page: 1, limit: 20 });
  printStep(17, "Query Audit Logs (GET /api/v1/admin/audit-logs)", auditLogsRes.status, {
    total: auditLogsRes.body.pagination?.total,
    sampleLogs: auditLogsRes.body.items?.slice(0, 5).map((l: any) => ({
      action: l.action,
      targetType: l.targetType,
      targetId: l.targetId,
      changesSummary: l.changesSummary,
    })),
  });

  // Step 18: Unauthorized Staff User without permission (expect 403)
  const limitedRole = await prisma.role.create({
    data: { name: "SUPPORT_STAFF_" + Date.now(), description: "Limited staff", isSystem: false },
  });
  const limitedUser = await prisma.user.create({
    data: {
      emailNormalized: `staff_${Date.now()}@fillcart.internal`,
      fullName: "Limited Staff Member",
      accountType: "ADMIN",
      status: "ACTIVE",
      roleId: limitedRole.id,
    },
  });
  const limitedSession = await sessionService.createSession(limitedUser.id, { ipAddress: "127.0.0.1" });
  const unauthorizedRes = await request(app)
    .post("/api/v1/admin/categories")
    .set("Authorization", `Bearer ${limitedSession.accessToken}`)
    .send({ name: "Unauthorized Cat", displayOrder: 1 });
  printStep(18, "Staff Without Permission [Expect 403] (POST /api/v1/admin/categories)", unauthorizedRes.status, unauthorizedRes.body);

  // Step 19: Customer Token accessing Admin Backend (expect 401 Audience Mismatch)
  const custRole = await prisma.role.findUnique({ where: { name: "CUSTOMER" } });
  const custUser = await prisma.user.create({
    data: {
      emailNormalized: `cust_${Date.now()}@fillcart.internal`,
      fullName: "Shopper Alice",
      accountType: "CUSTOMER",
      status: "ACTIVE",
      roleId: custRole?.id,
    },
  });
  const custSession = await sessionService.createSession(custUser.id, { ipAddress: "127.0.0.1" });
  const customerAdminRes = await request(app)
    .get("/api/v1/admin/products")
    .set("Authorization", `Bearer ${custSession.accessToken}`);
  printStep(19, "Customer Token on Admin Endpoint [Expect 401 Audience Mismatch] (GET /api/v1/admin/products)", customerAdminRes.status, customerAdminRes.body);

  console.log("\n>>> ALL 19 HTTP FLOW STEPS COMPLETED SUCCESSFULLY! <<<");
  await prisma.$disconnect();
}

run().catch((err) => {
  console.error("Execution failed:", err);
  process.exit(1);
});
