import { describe, it, expect, beforeEach, vi } from "vitest";
import { CategoriesService } from "../../src/modules/admin/catalogue/services/categories.service.js";
import { BrandsService } from "../../src/modules/admin/catalogue/services/brands.service.js";
import { ProductsService } from "../../src/modules/admin/catalogue/services/products.service.js";
import { InventoryService } from "../../src/modules/admin/catalogue/services/inventory.service.js";
import { SettingsService } from "../../src/modules/admin/settings/services/settings.service.js";
import { AuditLogsService } from "../../src/modules/admin/audit-logs/services/audit-logs.service.js";
import { createRequireSettingsAccessMiddleware } from "../../src/modules/admin/middleware/admin-auth.middleware.js";
import { CryptoService } from "../../src/modules/auth/services/crypto.service.js";
import { validateConfig } from "../../src/config/env.js";
import { BadRequestError, NotFoundError, ForbiddenError } from "../../src/errors/app-error.js";
import type { Response } from "express";

describe("Admin Catalogue, Settings & Audit Logs Unit Tests", () => {
  let mockPrisma: any;
  let categoriesService: CategoriesService;
  let brandsService: BrandsService;
  let productsService: ProductsService;
  let inventoryService: InventoryService;
  let settingsService: SettingsService;
  let auditLogsService: AuditLogsService;
  let cryptoService: CryptoService;

  const adminUserId = "11111111-1111-4111-8111-111111111111";

  beforeEach(() => {
    const config = validateConfig({
      JWT_ISSUER_URL: "https://auth.fillcart.internal",
      JWT_ACTIVE_KID: "k-test-unit-1",
    });
    cryptoService = new CryptoService(config);

    mockPrisma = {
      $transaction: vi.fn(async (cb: (tx: any) => Promise<any>) => cb(mockPrisma)),
      category: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      brand: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        count: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      product: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        count: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        updateMany: vi.fn(),
      },
      productVariant: {
        findUnique: vi.fn(),
      },
      inventoryBalance: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        count: vi.fn(),
        upsert: vi.fn(),
      },
      store: {
        findUnique: vi.fn(),
      },
      systemSetting: {
        findMany: vi.fn(),
        upsert: vi.fn(),
      },
      adminAuditLog: {
        create: vi.fn().mockResolvedValue({}),
        findMany: vi.fn(),
        count: vi.fn(),
      },
    };

    categoriesService = new CategoriesService(mockPrisma);
    brandsService = new BrandsService(mockPrisma);
    productsService = new ProductsService(mockPrisma);
    inventoryService = new InventoryService(mockPrisma);
    settingsService = new SettingsService(mockPrisma);
    auditLogsService = new AuditLogsService(mockPrisma);
  });

  // =========================================================================
  // Categories
  // =========================================================================
  describe("CategoriesService", () => {
    it("returns hierarchical category tree and filters inactive when requested", async () => {
      mockPrisma.category.findMany.mockResolvedValue([
        {
          id: "cat-1",
          name: "Groceries",
          slug: "groceries",
          iconName: "shopping-bag",
          parentCategoryId: null,
          displayOrder: 1,
          isActive: true,
          subCategories: [
            {
              id: "cat-sub-1",
              name: "Dairy",
              slug: "dairy",
              iconName: "milk",
              parentCategoryId: "cat-1",
              displayOrder: 1,
              isActive: true,
              subCategories: [],
            },
          ],
        },
      ]);

      const res = await categoriesService.getTree({ includeInactive: false });
      expect(res.items).toHaveLength(1);
      expect(res.items[0]?.subCategories).toHaveLength(1);
      expect(mockPrisma.category.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isDeleted: false, parentCategoryId: null, isActive: true },
        })
      );
    });

    it("creates a new category and records audit log in transaction", async () => {
      mockPrisma.category.findUnique.mockResolvedValue(null);
      mockPrisma.category.create.mockResolvedValue({
        id: "cat-new",
        name: "Snacks",
        slug: "snacks",
        iconName: "cookie",
        parentCategoryId: null,
        displayOrder: 2,
        isActive: true,
      });

      const res = await categoriesService.create(
        { name: "Snacks", iconName: "cookie", displayOrder: 2, isActive: true },
        adminUserId
      );

      expect(res.id).toBe("cat-new");
      expect(mockPrisma.category.create).toHaveBeenCalled();
      expect(mockPrisma.adminAuditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          adminUserId,
          action: "CREATE",
          targetType: "CATALOG",
          targetId: "cat-new",
        }),
      });
    });

    it("prevents assigning a category as its own parent", async () => {
      mockPrisma.category.findUnique.mockResolvedValue({
        id: "cat-self",
        name: "Beverages",
        slug: "beverages",
        isDeleted: false,
      });

      await expect(
        categoriesService.update("cat-self", { parentCategoryId: "cat-self" }, adminUserId)
      ).rejects.toThrow(BadRequestError);
    });

    it("toggles category status and records audit log", async () => {
      mockPrisma.category.findUnique.mockResolvedValue({
        id: "cat-1",
        isActive: true,
        isDeleted: false,
      });
      mockPrisma.category.update.mockResolvedValue({
        id: "cat-1",
        isActive: false,
      });

      const updated = await categoriesService.updateStatus("cat-1", false, adminUserId);
      expect(updated.isActive).toBe(false);
      expect(mockPrisma.adminAuditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: "UPDATE",
          targetId: "cat-1",
        }),
      });
    });

    it("reorders categories in batch transaction", async () => {
      mockPrisma.category.update.mockImplementation(({ data }: any) => ({
        id: "cat-x",
        displayOrder: data.displayOrder,
      }));

      const res = await categoriesService.reorder(
        { items: [{ id: "c1", displayOrder: 10 }, { id: "c2", displayOrder: 20 }] },
        adminUserId
      );

      expect(res.reordered).toHaveLength(2);
      expect(mockPrisma.adminAuditLog.create).toHaveBeenCalled();
    });
  });

  // =========================================================================
  // Brands
  // =========================================================================
  describe("BrandsService", () => {
    it("lists brands with pagination", async () => {
      mockPrisma.brand.findMany.mockResolvedValue([
        { id: "b1", name: "Amul", slug: "amul", isActive: true },
      ]);
      mockPrisma.brand.count.mockResolvedValue(1);

      const res = await brandsService.list({ page: 1, limit: 10 });
      expect(res.items).toHaveLength(1);
      expect(res.pagination.total).toBe(1);
    });

    it("creates brand with slug generation and audit logging", async () => {
      mockPrisma.brand.findFirst.mockResolvedValue(null);
      mockPrisma.brand.create.mockResolvedValue({
        id: "b-new",
        name: "Nestle India",
        slug: "nestle-india",
        isActive: true,
      });

      const res = await brandsService.create({ name: "Nestle India", isActive: true }, adminUserId);
      expect(res.slug).toBe("nestle-india");
      expect(mockPrisma.adminAuditLog.create).toHaveBeenCalled();
    });

    it("rejects duplicate brand name", async () => {
      mockPrisma.brand.findFirst.mockResolvedValue({ id: "b-exist", name: "Amul" });

      await expect(
        brandsService.create({ name: "Amul", isActive: true }, adminUserId)
      ).rejects.toThrow(BadRequestError);
    });
  });

  // =========================================================================
  // Products & Variants
  // =========================================================================
  describe("ProductsService", () => {
    it("creates product with variants, submitter metadata, and serializes BigInt as string", async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);
      mockPrisma.category.findUnique.mockResolvedValue({ id: "cat-1", isDeleted: false });
      mockPrisma.product.create.mockResolvedValue({
        id: "prod-1",
        name: "Fresh Milk",
        slug: "fresh-milk",
        status: "DRAFT",
        moderationStatus: "PENDING_APPROVAL",
        submittedByUserId: adminUserId,
        variants: [
          {
            id: "var-1",
            sku: "MILK-500ML",
            variantName: "500ml Pouch",
            unitQuantity: "500.000",
            unitType: "MILLILITER",
            mrpPaisa: 3000n,
            salePricePaisa: 2800n,
            isDefault: true,
          },
        ],
      });

      const res = await productsService.create(
        {
          name: "Fresh Milk",
          categoryId: "cat-1",
          status: "DRAFT",
          variants: [
            {
              sku: "MILK-500ML",
              variantName: "500ml Pouch",
              unitQuantity: 500,
              unitType: "MILLILITER",
              mrpPaisa: "3000",
              salePricePaisa: "2800",
              isDefault: true,
              discountPct: 0,
            },
          ],
        },
        adminUserId
      );

      expect(res.id).toBe("prod-1");
      expect(typeof res.variants[0]?.mrpPaisa).toBe("string");
      expect(res.variants[0]?.mrpPaisa).toBe("3000");
      expect(res.variants[0]?.salePricePaisa).toBe("2800");
      expect(mockPrisma.adminAuditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: "CREATE",
          targetType: "CATALOG",
          targetId: "prod-1",
        }),
      });
    });

    it("approves product and marks it ACTIVE", async () => {
      mockPrisma.product.findUnique.mockResolvedValue({
        id: "prod-1",
        name: "Fresh Milk",
        status: "DRAFT",
        moderationStatus: "PENDING_APPROVAL",
        isActive: false,
        isDeleted: false,
      });

      mockPrisma.product.update.mockResolvedValue({
        id: "prod-1",
        status: "ACTIVE",
        moderationStatus: "APPROVED",
        isActive: true,
        rejectReason: null,
        variants: [],
      });

      const res = await productsService.moderate(
        "prod-1",
        { action: "APPROVE" },
        adminUserId
      );

      expect(res.moderationStatus).toBe("APPROVED");
      expect(res.status).toBe("ACTIVE");
      expect(mockPrisma.adminAuditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: "APPROVE",
          targetId: "prod-1",
        }),
      });
    });

    it("rejects product and sets rejectReason and INACTIVE status", async () => {
      mockPrisma.product.findUnique.mockResolvedValue({
        id: "prod-1",
        name: "Fresh Milk",
        status: "DRAFT",
        moderationStatus: "PENDING_APPROVAL",
        isActive: false,
        isDeleted: false,
      });

      mockPrisma.product.update.mockResolvedValue({
        id: "prod-1",
        status: "INACTIVE",
        moderationStatus: "REJECTED",
        isActive: false,
        rejectReason: "Missing FSSAI license on packaging label",
        variants: [],
      });

      const res = await productsService.moderate(
        "prod-1",
        { action: "REJECT", reason: "Missing FSSAI license on packaging label" },
        adminUserId
      );

      expect(res.moderationStatus).toBe("REJECTED");
      expect(res.rejectReason).toBe("Missing FSSAI license on packaging label");
      expect(mockPrisma.adminAuditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: "REJECT",
          targetId: "prod-1",
        }),
      });
    });

    it("performs bulk status update and records affected count", async () => {
      mockPrisma.product.updateMany.mockResolvedValue({ count: 5 });

      const res = await productsService.bulkUpdateStatus(
        { productIds: ["p1", "p2", "p3", "p4", "p5"], status: "ARCHIVED" },
        adminUserId
      );

      expect(res.affectedCount).toBe(5);
      expect(res.status).toBe("ARCHIVED");
      expect(mockPrisma.adminAuditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: "UPDATE",
          targetId: "product-bulk-status",
        }),
      });
    });
  });

  // =========================================================================
  // Inventory
  // =========================================================================
  describe("InventoryService", () => {
    it("adjusts inventory quantity, updates restock timestamp, and writes audit", async () => {
      mockPrisma.store.findUnique.mockResolvedValue({ id: "store-1", isDeleted: false });
      mockPrisma.productVariant.findUnique.mockResolvedValue({ id: "var-1", isDeleted: false });
      mockPrisma.inventoryBalance.findUnique.mockResolvedValue({
        storeId: "store-1",
        variantId: "var-1",
        quantityOnHand: 10,
      });
      mockPrisma.inventoryBalance.upsert.mockResolvedValue({
        id: "inv-1",
        storeId: "store-1",
        variantId: "var-1",
        quantityOnHand: 25,
        reservedQuantity: 2,
        lastRestockedAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await inventoryService.adjustInventory(
        { storeId: "store-1", variantId: "var-1", adjustmentQuantity: 15, reason: "Weekly stock delivery" },
        adminUserId
      );

      expect(res.quantityOnHand).toBe(25);
      expect(mockPrisma.adminAuditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: "UPDATE",
          targetType: "CATALOG",
          targetId: "var-1",
        }),
      });
    });

    it("prevents inventory adjustment that causes negative balance", async () => {
      mockPrisma.store.findUnique.mockResolvedValue({ id: "store-1", isDeleted: false });
      mockPrisma.productVariant.findUnique.mockResolvedValue({ id: "var-1", isDeleted: false });
      mockPrisma.inventoryBalance.findUnique.mockResolvedValue({
        storeId: "store-1",
        variantId: "var-1",
        quantityOnHand: 5,
      });

      await expect(
        inventoryService.adjustInventory(
          { storeId: "store-1", variantId: "var-1", adjustmentQuantity: -10, reason: "Damaged goods" },
          adminUserId
        )
      ).rejects.toThrow(BadRequestError);
    });
  });

  // =========================================================================
  // System Settings
  // =========================================================================
  describe("SettingsService", () => {
    it("masks sensitive secrets when returning settings group", async () => {
      mockPrisma.systemSetting.findMany.mockResolvedValue([
        { key: "platformName", value: "Fillcart Quick Commerce", isEncrypted: false },
        { key: "paymentGatewaySecretKey", value: "sk_live_verysecret123", isEncrypted: true },
      ]);

      const res = await settingsService.getSettingsByGroup("FINANCE");
      expect(res.settings.platformName).toBe("Fillcart Quick Commerce");
      expect(res.settings.paymentGatewaySecretKey).toBe("••••••••");
    });

    it("preserves existing DB secret when masked dots placeholder is submitted", async () => {
      mockPrisma.systemSetting.findMany.mockResolvedValue([
        { key: "stripeApiKey", value: "real_active_secret_key", isEncrypted: true },
      ]);

      await settingsService.updateSettingsByGroup(
        "FINANCE",
        { stripeApiKey: "••••••••", platformFeePercent: 2.5 },
        adminUserId
      );

      // Verify upsert kept existing value for stripeApiKey
      expect(mockPrisma.systemSetting.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { key: "stripeApiKey" },
          create: expect.objectContaining({ value: "real_active_secret_key" }),
          update: expect.objectContaining({ value: "real_active_secret_key" }),
        })
      );

      // Verify audit log never stores real secret
      expect(mockPrisma.adminAuditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: "CONFIG_CHANGE",
          targetType: "SETTING",
          targetId: "FINANCE",
          changesSummary: expect.objectContaining({
            after: expect.objectContaining({ stripeApiKey: "••••••••" }),
          }),
        }),
      });
    });

    it("enforces requireSettingsAccess middleware boundary", () => {
      const middleware = createRequireSettingsAccessMiddleware(cryptoService);
      const req: any = { headers: {} };
      const res: any = {};
      const next = vi.fn();

      middleware(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });
  });

  // =========================================================================
  // Audit Logs
  // =========================================================================
  describe("AuditLogsService", () => {
    it("queries audit logs with pagination and filters", async () => {
      mockPrisma.adminAuditLog.findMany.mockResolvedValue([
        {
          id: "aud-1",
          adminUserId,
          action: "CREATE",
          targetType: "CATALOG",
          targetId: "prod-1",
          adminUser: { id: adminUserId, fullName: "Super Admin", emailNormalized: "admin@fillcart.com" },
        },
      ]);
      mockPrisma.adminAuditLog.count.mockResolvedValue(1);

      const res = await auditLogsService.getAuditLogs({
        action: "CREATE",
        targetType: "CATALOG",
        page: 1,
        limit: 10,
      });

      expect(res.items).toHaveLength(1);
      expect(res.pagination.total).toBe(1);
      expect(mockPrisma.adminAuditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { action: "CREATE", targetType: "CATALOG" },
        })
      );
    });
  });
});
