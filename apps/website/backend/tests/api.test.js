import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { prisma } from "../src/db/prisma.js";

describe("Customer Storefront APIs", () => {
  const createdContactIds = [];

  afterAll(async () => {
    // Cleanup any contact messages created during tests
    if (createdContactIds.length > 0) {
      await prisma.contactMessage.deleteMany({
        where: { id: { in: createdContactIds } },
      });
    }
  });

  describe("1. GET /api/v1/home", () => {
    it("should return home page hero banners, categories, and 4 product sections", async () => {
      const res = await request(app).get("/api/v1/home");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();

      const { banners, categories, sections } = res.body.data;
      expect(Array.isArray(banners)).toBe(true);
      expect(Array.isArray(categories)).toBe(true);
      expect(Array.isArray(sections)).toBe(true);
      expect(sections.length).toBe(4);

      const sectionIds = sections.map((s) => s.id);
      expect(sectionIds).toEqual([
        "popular",
        "chill-frozen",
        "daily-care",
        "home-essentials",
      ]);

      // Every section must contain products array
      for (const section of sections) {
        expect(Array.isArray(section.products)).toBe(true);
        expect(typeof section.title).toBe("string");
      }
    });
  });

  describe("2. GET /api/v1/categories", () => {
    it("should return list of active categories ordered by position", async () => {
      const res = await request(app).get("/api/v1/categories");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);

      const first = res.body.data[0];
      expect(first).toHaveProperty("id");
      expect(first).toHaveProperty("slug");
      expect(first).toHaveProperty("name");
    });

    it("should filter featured categories when featured=true query is provided", async () => {
      const res = await request(app).get("/api/v1/categories?featured=true");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);

      for (const cat of res.body.data) {
        expect(cat.isFeatured).toBe(true);
      }
    });
  });

  describe("3. GET /api/v1/stores", () => {
    it("should return list of active stores", async () => {
      const res = await request(app).get("/api/v1/stores");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);

      const store = res.body.data[0];
      expect(store).toHaveProperty("id");
      expect(store).toHaveProperty("slug");
      expect(store).toHaveProperty("name");
      expect(store).toHaveProperty("cover");
      expect(store).toHaveProperty("logo");
    });

    it("should filter stores by search query q", async () => {
      const res = await request(app).get("/api/v1/stores?q=fresh");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("4. GET /api/v1/stores/:slug", () => {
    it("should return store details with only that store's linked products (excluding non-store products like cricket-bat)", async () => {
      const res = await request(app).get("/api/v1/stores/fresh-mart-supermarket");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.slug).toBe("fresh-mart-supermarket");
      expect(Array.isArray(res.body.data.products)).toBe(true);
      expect(res.body.data.products.length).toBeGreaterThan(0);

      // Verify that non-grocery items like cricket-bat or power-bank are NOT in FreshMart
      const productSlugs = res.body.data.products.map((p) => p.slug);
      expect(productSlugs).not.toContain("cricket-bat");
      expect(productSlugs).not.toContain("power-bank");
    });

    it("should return distinctly different product catalogs for two different stores", async () => {
      const [freshMartRes, bakeryRes] = await Promise.all([
        request(app).get("/api/v1/stores/fresh-mart-supermarket"),
        request(app).get("/api/v1/stores/city-artisan-bakery"),
      ]);

      expect(freshMartRes.status).toBe(200);
      expect(bakeryRes.status).toBe(200);

      const freshMartSlugs = freshMartRes.body.data.products.map((p) => p.slug);
      const bakerySlugs = bakeryRes.body.data.products.map((p) => p.slug);

      expect(freshMartSlugs.length).toBeGreaterThan(0);
      expect(bakerySlugs.length).toBeGreaterThan(0);
      expect(freshMartSlugs).not.toEqual(bakerySlugs);
    });

    it("should return 404 NOT_FOUND for unknown store slug", async () => {
      const res = await request(app).get("/api/v1/stores/unknown-non-existent-store");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });
  });

  describe("5. GET /api/v1/products", () => {
    it("should return paginated products with default limit 20 and total count", async () => {
      const res = await request(app).get("/api/v1/products");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const { items, page, limit, total, totalPages } = res.body.data;
      expect(Array.isArray(items)).toBe(true);
      expect(page).toBe(1);
      expect(limit).toBe(20);
      expect(typeof total).toBe("number");
      expect(typeof totalPages).toBe("number");

      if (items.length > 0) {
        const item = items[0];
        expect(typeof item.price).toBe("number");
        expect(typeof item.mrp).toBe("number");
        expect(item).toHaveProperty("image");
      }
    });

    it("should reject limit exceeding 50 with 400 VALIDATION_ERROR", async () => {
      const res = await request(app).get("/api/v1/products?limit=999");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("should reject invalid sort option with 400 VALIDATION_ERROR", async () => {
      const res = await request(app).get("/api/v1/products?sort=abc");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("should filter products by category slug and sort option", async () => {
      const res = await request(app).get("/api/v1/products?category=grocery&sort=price_asc");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.items)).toBe(true);
    });
  });

  describe("6. GET /api/v1/products/:slug", () => {
    it("should return product detail and related products array for valid slug", async () => {
      // Fetch a valid product slug first
      const listRes = await request(app).get("/api/v1/products?limit=1");
      const sampleSlug = listRes.body.data.items[0]?.slug || "fresh-royal-apples";

      const res = await request(app).get(`/api/v1/products/${sampleSlug}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.slug).toBe(sampleSlug);
      expect(typeof res.body.data.price).toBe("number");
      expect(Array.isArray(res.body.data.related)).toBe(true);
      expect(res.body.data.category).toBeDefined();
    });

    it("should return 404 NOT_FOUND for unknown product slug", async () => {
      const res = await request(app).get("/api/v1/products/non-existent-product-slug");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });
  });

  describe("7. GET /api/v1/offers", () => {
    it("should return list of active payment offers", async () => {
      const res = await request(app).get("/api/v1/offers");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should filter offers by type (BANK, WALLET, UPI)", async () => {
      const res = await request(app).get("/api/v1/offers?type=BANK");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);

      for (const off of res.body.data) {
        expect(off.type).toBe("BANK");
      }
    });
  });

  describe("8. POST /api/v1/contact", () => {
    it("should create a new contact message and return 201 with ID", async () => {
      const payload = {
        fullName: "Aarav Sharma",
        email: "aarav.sharma@example.com",
        phone: "+91 98765 43210",
        subject: "Bulk Order Inquiry",
        message: "Hello Fillcart team, I would like to inquire about bulk ordering for our office.",
      };

      const res = await request(app).post("/api/v1/contact").send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");

      createdContactIds.push(res.body.data.id);
    });

    it("should reject invalid email with 400 VALIDATION_ERROR", async () => {
      const payload = {
        fullName: "Test User",
        email: "not-a-valid-email",
        message: "This message is valid and has enough characters.",
      };

      const res = await request(app).post("/api/v1/contact").send(payload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("should reject message shorter than 10 characters with 400 VALIDATION_ERROR", async () => {
      const payload = {
        fullName: "Test User",
        email: "user@example.com",
        message: "Short",
      };

      const res = await request(app).post("/api/v1/contact").send(payload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });
});
