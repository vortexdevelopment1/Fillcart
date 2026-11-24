import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import request from "supertest";
import crypto from "node:crypto";
import { createApp } from "../../src/app.js";
import { validateConfig } from "../../src/config/env.js";
import { getPrismaClient } from "../../src/database/index.js";
import { CryptoService } from "../../src/modules/auth/services/crypto.service.js";
import { SessionService } from "../../src/modules/auth/services/session.service.js";
import type { Express } from "express";
import type { PrismaClient } from "../../src/database/generated/client/client.js";

describe("Live Admin Flows Integration (Real PostgreSQL DB)", () => {
  let app: Express;
  let prisma: PrismaClient;
  let cryptoService: CryptoService;
  let sessionService: SessionService;
  let adminToken: string;
  let settingsGrantToken: string;
  let adminUserId: string;
  let testStoreId: string;
  let isDbAvailable = false;

  beforeAll(async () => {
    const authPriv = crypto.generateKeyPairSync("ed25519").privateKey;
    const authPub = crypto.generateKeyPairSync("ed25519").publicKey;
    const jwtActivePrivateKeyPem = authPriv.export({ type: "pkcs8", format: "pem" }) as string;
    const jwtActivePublicKeyPem = authPub.export({ type: "spki", format: "pem" }) as string;

    const config = validateConfig({
      DATABASE_URL:
        "postgresql://fillcart_app_user:fillcart_app_pass@127.0.0.1:5432/fillcart?schema=public",
      MIGRATION_DATABASE_URL:
        "postgresql://fillcart_user:fillcart_pass@127.0.0.1:5432/fillcart?schema=public",
      JWT_ISSUER_URL: "https://auth.fillcart.internal",
      JWT_ACTIVE_KID: "k-test-admin-live-1",
      JWT_ACTIVE_PRIVATE_KEY_PEM: jwtActivePrivateKeyPem,
      JWT_ACTIVE_PUBLIC_KEY_PEM: jwtActivePublicKeyPem,
      LOG_LEVEL: "silent",
      NODE_ENV: "test",
    });

    app = createApp(config);
    prisma = getPrismaClient(config);

    try {
      await prisma.$queryRaw`SELECT 1`;
      isDbAvailable = true;
    } catch {
      // Database not reachable in current environment
      return;
    }

    cryptoService = new CryptoService(config);
    sessionService = new SessionService(prisma, cryptoService, config.JWT_ISSUER_URL);

    // 1. Ensure Super Admin role exists
    const adminRole = await prisma.role.upsert({
      where: { name: "ADMIN" },
      update: {},
      create: {
        name: "ADMIN",
        description: "Super Admin Role",
        isSystem: true,
      },
    });

    // 2. Create test admin user
    adminUserId = "adm_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    const adminEmail = `admin_probe_${Date.now()}@fillcart.internal`;
    await prisma.user.create({
      data: {
        id: adminUserId,
        emailNormalized: adminEmail.toLowerCase(),
        displayEmail: adminEmail,
        fullName: "Prachi Rohit (Super Admin)",
        accountType: "ADMIN",
        status: "ACTIVE",
        roleId: adminRole.id,
      },
    });

    // 3. Create active session and access token
    const session = await sessionService.createSession(adminUserId, {
      ipAddress: "127.0.0.1",
      userAgent: "vitest-agent",
    });
    adminToken = session.accessToken;

    // 4. Mint settings grant token
    settingsGrantToken = cryptoService.signJwt({
      sub: adminUserId,
      userId: adminUserId,
      scope: "settings",
      exp: Math.floor(Date.now() / 1000) + 900,
    });

    // 5. Ensure a Vendor & Store exists for Inventory testing
    const vendorUserId = "usr_v_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    await prisma.user.create({
      data: {
        id: vendorUserId,
        emailNormalized: `vendor_${Date.now()}@fillcart.internal`,
        fullName: "Test Merchant Owner",
        accountType: "VENDOR_APPLICANT",
        status: "ACTIVE",
      },
    });

    const vendor = await prisma.vendor.create({
      data: {
        userId: vendorUserId,
        businessName: "Fillcart Express Merchant Hub",
        ownerName: "Test Merchant Owner",
        businessCategory: "Grocery & FMCG",
        city: "Mumbai",
        shopAddress: "Sector 17, Vashi, Navi Mumbai",
      },
    });

    const store = await prisma.store.create({
      data: {
        vendorId: vendor.id,
        storeName: "Vashi Express Darkstore",
        storeCode: "DS-VASHI-" + Date.now().toString().slice(-4),
        phone: "+919876543210",
        addressLine1: "Plot 42, APMC Market",
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400703",
        latitude: 19.076,
        longitude: 72.8777,
      },
    });
    testStoreId = store.id;
  });

  beforeEach((context) => {
    if (!isDbAvailable) {
      context.skip();
    }
  });

  describe("Flow 1: Categories Lifecycle & Hierarchy", () => {
    let parentCatId: string;
    let subCatId: string;

    it("POST /api/v1/admin/categories (creates root category)", async () => {
      const res = await request(app)
        .post("/api/v1/admin/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Groceries & Staples",
          description: "Fresh pantry, rice, flour, spices",
          iconName: "shopping-bag",
          displayOrder: 1,
          isActive: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe("Groceries & Staples");
      parentCatId = res.body.id;
    });

    it("POST /api/v1/admin/categories (creates sub-category with parentId)", async () => {
      const res = await request(app)
        .post("/api/v1/admin/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Dairy & Eggs",
          description: "Fresh milk, paneer, curd, eggs",
          iconName: "milk",
          parentCategoryId: parentCatId,
          displayOrder: 1,
          isActive: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.parentCategoryId).toBe(parentCatId);
      subCatId = res.body.id;
    });

    it("GET /api/v1/admin/categories (returns nested category hierarchy tree)", async () => {
      const res = await request(app)
        .get("/api/v1/admin/categories")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("items");
      const parent = res.body.items.find((c: any) => c.id === parentCatId);
      expect(parent).toBeDefined();
      expect(parent.subCategories.some((s: any) => s.id === subCatId)).toBe(true);
    });

    it("PUT /api/v1/admin/categories/reorder (reorders categories)", async () => {
      const res = await request(app)
        .put("/api/v1/admin/categories/reorder")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          items: [
            { id: parentCatId, displayOrder: 5 },
            { id: subCatId, displayOrder: 2 },
          ],
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("reordered");
    });

    it("PATCH /api/v1/admin/categories/:id/status (soft status toggle)", async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/categories/${subCatId}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ isActive: false });

      expect(res.status).toBe(200);
      expect(res.body.isActive).toBe(false);
    });
  });

  describe("Flow 2: Brands Lifecycle", () => {
    let brandId: string;

    it("POST /api/v1/admin/brands (creates new brand)", async () => {
      const res = await request(app)
        .post("/api/v1/admin/brands")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Amul Fresh " + Date.now(),
          logoUrl: "https://cdn.fillcart.internal/brands/amul.png",
          isActive: true,
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      brandId = res.body.id;
    });

    it("GET /api/v1/admin/brands (lists paginated brands)", async () => {
      const res = await request(app)
        .get("/api/v1/admin/brands")
        .set("Authorization", `Bearer ${adminToken}`)
        .query({ page: 1, limit: 10 });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("items");
      expect(res.body).toHaveProperty("pagination");
    });

    it("PATCH /api/v1/admin/brands/:id/status (toggles brand status)", async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/brands/${brandId}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ isActive: false });

      expect(res.status).toBe(200);
      expect(res.body.isActive).toBe(false);
    });
  });

  describe("Flow 3: Products, Variants & Moderation Lifecycle", () => {
    let categoryId: string;
    let productId: string;
    let variantId: string;

    beforeAll(async () => {
      if (!isDbAvailable) return;
      const cat = await prisma.category.create({
        data: {
          name: "Fresh Produce " + Date.now(),
          slug: "fresh-produce-" + Date.now(),
          iconName: "apple",
          displayOrder: 1,
        },
      });
      categoryId = cat.id;
    });

    it("POST /api/v1/admin/products (creates product with variants and submitter info)", async () => {
      const res = await request(app)
        .post("/api/v1/admin/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Organic Farm Whole Milk",
          description: "Fresh pasteurized milk 3.5% fat",
          categoryId,
          status: "DRAFT",
          variants: [
            {
              sku: "MILK-ORG-" + Date.now(),
              variantName: "1 Litre Bottle",
              unitQuantity: 1,
              unitType: "LITER",
              mrpPaisa: "7500",
              salePricePaisa: "6900",
              discountPct: 8,
              isDefault: true,
            },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe("Organic Farm Whole Milk");
      expect(res.body.submittedByUserId).toBe(adminUserId);
      expect(res.body.variants).toHaveLength(1);
      expect(res.body.variants[0].mrpPaisa).toBe("7500");
      expect(res.body.variants[0].salePricePaisa).toBe("6900");

      productId = res.body.id;
      variantId = res.body.variants[0].id;
    });

    it("GET /api/v1/admin/products (queries products with search & pagination)", async () => {
      const res = await request(app)
        .get("/api/v1/admin/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .query({ search: "Organic Farm", page: 1, limit: 10 });

      expect(res.status).toBe(200);
      expect(res.body.items.some((p: any) => p.id === productId)).toBe(true);
    });

    it("GET /api/v1/admin/products/:id (returns detailed product with string paisa)", async () => {
      const res = await request(app)
        .get(`/api/v1/admin/products/${productId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(productId);
      expect(typeof res.body.variants[0].mrpPaisa).toBe("string");
      expect(res.body.variants[0].mrpPaisa).toBe("7500");
    });

    it("POST /api/v1/admin/products/:id/moderate (approves product and marks ACTIVE)", async () => {
      const res = await request(app)
        .post(`/api/v1/admin/products/${productId}/moderate`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ action: "APPROVE" });

      expect(res.status).toBe(200);
      expect(res.body.moderationStatus).toBe("APPROVED");
      expect(res.body.status).toBe("ACTIVE");
      expect(res.body.isActive).toBe(true);
      expect(res.body.moderatedByUserId).toBe(adminUserId);
    });

    it("POST /api/v1/admin/products/bulk-status (bulk status update)", async () => {
      const res = await request(app)
        .post("/api/v1/admin/products/bulk-status")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          productIds: [productId],
          status: "INACTIVE",
        });

      expect(res.status).toBe(200);
      expect(res.body.affectedCount).toBe(1);
      expect(res.body.status).toBe("INACTIVE");
    });

    describe("Flow 4: Inventory Balances & Stock Adjustment", () => {
      it("POST /api/v1/admin/inventory/adjust (adjusts stock with audit reason)", async () => {
        const res = await request(app)
          .post("/api/v1/admin/inventory/adjust")
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            storeId: testStoreId,
            variantId,
            adjustmentQuantity: 50,
            reason: "Initial warehouse intake batch 401",
          });

        expect(res.status).toBe(200);
        expect(res.body.quantityOnHand).toBe(50);
        expect(res.body.storeId).toBe(testStoreId);
        expect(res.body.variantId).toBe(variantId);
      });

      it("GET /api/v1/admin/inventory (reads stock per store & variant)", async () => {
        const res = await request(app)
          .get("/api/v1/admin/inventory")
          .set("Authorization", `Bearer ${adminToken}`)
          .query({ storeId: testStoreId, variantId });

        expect(res.status).toBe(200);
        expect(res.body.items).toHaveLength(1);
        expect(res.body.items[0].quantityOnHand).toBe(50);
        expect(res.body.items[0].productName).toBe("Organic Farm Whole Milk");
      });
    });
  });

  describe("Flow 5: System Settings with Re-Auth & Secret Masking", () => {
    it("PUT /api/v1/admin/settings/FINANCE (updates settings group and masks secrets in audit)", async () => {
      const res = await request(app)
        .put("/api/v1/admin/settings/FINANCE")
        .set("Authorization", `Bearer ${adminToken}`)
        .set("x-settings-grant", settingsGrantToken)
        .send({
          settings: {
            payoutCycleDays: 7,
            paymentGatewayApiKey: "sec_live_prod_super_secret_9981",
            commissionRatePct: 4.5,
          },
        });

      expect(res.status).toBe(200);
      expect(res.body.settings.payoutCycleDays).toBe(7);
      // Secret must be masked in response!
      expect(res.body.settings.paymentGatewayApiKey).toBe("••••••••");
    });

    it("GET /api/v1/admin/settings/FINANCE (returns settings with masked secret)", async () => {
      const res = await request(app)
        .get("/api/v1/admin/settings/FINANCE")
        .set("Authorization", `Bearer ${adminToken}`)
        .set("x-settings-grant", settingsGrantToken);

      expect(res.status).toBe(200);
      expect(res.body.settings.paymentGatewayApiKey).toBe("••••••••");
      expect(res.body.settings.payoutCycleDays).toBe(7);
    });
  });

  describe("Flow 6: Immutable Admin Audit Logs Verification", () => {
    it("GET /api/v1/admin/audit-logs (confirms audit records written in transaction)", async () => {
      const res = await request(app)
        .get("/api/v1/admin/audit-logs")
        .set("Authorization", `Bearer ${adminToken}`)
        .query({ adminUserId, page: 1, limit: 50 });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("items");
      expect(res.body.items.length).toBeGreaterThanOrEqual(5);

      // Verify that audit log records exist for CATALOG and SETTING
      const actions = res.body.items.map((i: any) => `${i.targetType}:${i.action}`);
      expect(actions.some((a: string) => a.startsWith("CATALOG:CREATE"))).toBe(true);
      expect(actions.some((a: string) => a.startsWith("CATALOG:APPROVE"))).toBe(true);
      expect(actions.some((a: string) => a.startsWith("SETTING:CONFIG_CHANGE"))).toBe(true);

      // Verify that NO secret was written in the audit log
      const financeAudit = res.body.items.find(
        (i: any) => i.targetType === "SETTING" && i.targetId === "FINANCE"
      );
      expect(financeAudit).toBeDefined();
      expect(JSON.stringify(financeAudit.changesSummary)).not.toContain("sec_live_prod_super_secret_9981");
    });
  });
});
