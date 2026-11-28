import crypto from "node:crypto";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { prisma } from "../src/db/prisma.js";
import { setMockJwks, clearJwksCache } from "../src/utils/jwks.js";
import { generateDeliverySlots, getIstDateTime } from "../src/config/deliverySlots.js";

describe("Customer Delivery Slots, Blogs & Restock Notifications APIs", () => {
  let testPrivateKey;
  let testPublicKey;
  let userAToken;
  const userAId = "77777777-7777-4777-8777-777777777777";
  const kid = "test-ed25519-key-slots-blogs";

  let testProduct;
  let originalStockState = { inStock: true, countInStock: 50 };
  let createdBlogSlug = "unit-test-hyperlocal-insights-post";
  let createdDraftSlug = "unit-test-draft-unpublished-post";

  function mintToken({
    sub = userAId,
    iss = "https://auth.fillcart.internal",
    aud = "customer-backend",
    account_type = "CUSTOMER",
    account_status = "ACTIVE",
    exp = Math.floor(Date.now() / 1000) + 900,
    nbf = Math.floor(Date.now() / 1000) - 10,
    alg = "EdDSA",
    privateKey = testPrivateKey,
  } = {}) {
    const header = { alg, typ: "JWT", kid };
    const payload = {
      sub,
      iss,
      aud,
      iat: Math.floor(Date.now() / 1000) - 10,
      nbf,
      exp,
      jti: crypto.randomUUID(),
      token_use: "access",
      session_id: crypto.randomUUID(),
      account_type,
      account_status,
      role: "CUSTOMER",
      permissions: [],
    };

    const headerB64 = Buffer.from(JSON.stringify(header)).toString("base64url");
    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signingInput = Buffer.from(`${headerB64}.${payloadB64}`);
    const sigB64 = crypto.sign(null, signingInput, privateKey).toString("base64url");

    return `${headerB64}.${payloadB64}.${sigB64}`;
  }

  beforeAll(async () => {
    // 1. Setup mock Ed25519 JWKS
    const { privateKey, publicKey } = crypto.generateKeyPairSync("ed25519");
    testPrivateKey = privateKey;
    testPublicKey = publicKey;

    const jwk = publicKey.export({ format: "jwk" });
    setMockJwks([
      {
        ...jwk,
        kid,
        kty: "OKP",
        crv: "Ed25519",
        use: "sig",
        alg: "EdDSA",
      },
    ]);

    userAToken = mintToken({ sub: userAId });

    // 2. Fetch a real product for out-of-stock and notification tests
    if (prisma.product) {
      testProduct = await prisma.product.findFirst({
        where: { isActive: true },
      });
      if (testProduct) {
        originalStockState = {
          inStock: testProduct.inStock,
          countInStock: testProduct.countInStock,
        };
      }
    }

    // 3. Seed a test published and test draft blog post if model exists
    if (prisma.blogPost) {
      await prisma.blogPost.upsert({
        where: { slug: createdBlogSlug },
        update: {
          title: "Unit Test Hyperlocal Post",
          excerpt: "Automated test post excerpt",
          content: "### Test Content\nThis is markdown test content.",
          category: "Hyperlocal Tech",
          authorName: "Test Author",
          readTimeMinutes: 3,
          isPublished: true,
          publishedAt: new Date(),
        },
        create: {
          slug: createdBlogSlug,
          title: "Unit Test Hyperlocal Post",
          excerpt: "Automated test post excerpt",
          content: "### Test Content\nThis is markdown test content.",
          category: "Hyperlocal Tech",
          authorName: "Test Author",
          readTimeMinutes: 3,
          isPublished: true,
          publishedAt: new Date(),
        },
      });

      await prisma.blogPost.upsert({
        where: { slug: createdDraftSlug },
        update: {
          title: "Unit Test Draft Post",
          excerpt: "Unpublished draft excerpt",
          content: "Draft content",
          category: "Hyperlocal Tech",
          authorName: "Test Author",
          readTimeMinutes: 2,
          isPublished: false,
          publishedAt: new Date(),
        },
        create: {
          slug: createdDraftSlug,
          title: "Unit Test Draft Post",
          excerpt: "Unpublished draft excerpt",
          content: "Draft content",
          category: "Hyperlocal Tech",
          authorName: "Test Author",
          readTimeMinutes: 2,
          isPublished: false,
          publishedAt: new Date(),
        },
      });
    }
  });

  afterAll(async () => {
    clearJwksCache();

    // Clean up created notifications
    if (prisma.stockNotification && testProduct) {
      await prisma.stockNotification.deleteMany({
        where: { productId: testProduct.id },
      });
    }

    // Clean up created blog posts
    if (prisma.blogPost) {
      await prisma.blogPost.deleteMany({
        where: { slug: { in: [createdBlogSlug, createdDraftSlug] } },
      });
    }

    // Restore product stock state
    if (prisma.product && testProduct) {
      await prisma.product.update({
        where: { id: testProduct.id },
        data: {
          inStock: originalStockState.inStock,
          countInStock: originalStockState.countInStock,
        },
      });
    }
  });

  // =========================================================================
  // 1. DELIVERY SLOTS TESTS
  // =========================================================================
  describe("Delivery Slots Logic & Endpoints", () => {
    it("generates correct slots for morning fixed time (all today slots available)", () => {
      // 06:00 AM IST on Nov 28, 2026 (UTC = Nov 28 00:30)
      const fixedMorning = new Date("2026-11-28T00:30:00.000Z");
      const slots = generateDeliverySlots({ days: 1, now: fixedMorning });

      expect(slots).toHaveLength(3);
      expect(slots[0]).toMatchObject({
        id: "slot-today-morn",
        label: "Today · 7–9 AM",
        available: true,
        startTime: "07:00",
        endTime: "09:00",
      });
      expect(slots[1]).toMatchObject({
        id: "slot-today-aft",
        label: "Today · 1–3 PM",
        available: true,
      });
      expect(slots[2]).toMatchObject({
        id: "slot-today-eve",
        label: "Today · 7–9 PM",
        available: true,
        badge: "Fastest",
      });
    });

    it("marks passed today slots as available: false for afternoon fixed time", () => {
      // 14:15 IST on Nov 28, 2026 (UTC = Nov 28 08:45)
      const fixedAfternoon = new Date("2026-11-28T08:45:00.000Z");
      const slots = generateDeliverySlots({ days: 2, now: fixedAfternoon });

      expect(slots).toHaveLength(6);
      // Today morning (07:00) and afternoon (13:00) should be unavailable
      expect(slots[0].available).toBe(false);
      expect(slots[1].available).toBe(false);
      // Today evening (19:00) should still be available
      expect(slots[2].available).toBe(true);

      // Tomorrow slots should all be available
      expect(slots[3].available).toBe(true);
      expect(slots[4].available).toBe(true);
      expect(slots[5].available).toBe(true);
    });

    it("GET /api/v1/delivery-slots returns 200 with default 2 days slots", async () => {
      const res = await request(app).get("/api/v1/delivery-slots");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(6);

      const firstSlot = res.body.data[0];
      expect(firstSlot).toHaveProperty("id");
      expect(firstSlot).toHaveProperty("date");
      expect(firstSlot).toHaveProperty("label");
      expect(firstSlot).toHaveProperty("startTime");
      expect(firstSlot).toHaveProperty("endTime");
      expect(firstSlot).toHaveProperty("available");
    });

    it("GET /api/v1/delivery-slots?days=3 returns 9 slots", async () => {
      const res = await request(app).get("/api/v1/delivery-slots?days=3");

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(9);
    });

    it("GET /api/v1/delivery-slots?days=10 returns 400 validation error", async () => {
      const res = await request(app).get("/api/v1/delivery-slots?days=10");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  // =========================================================================
  // 2. BLOGS TESTS
  // =========================================================================
  describe("Blogs Endpoints", () => {
    it("GET /api/v1/blogs returns published blog posts without full content", async () => {
      if (!prisma.blogPost) return;

      const res = await request(app).get("/api/v1/blogs");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body).toHaveProperty("pagination");

      // Verify content is excluded in listing
      for (const item of res.body.data) {
        expect(item.content).toBeUndefined();
        expect(item).toHaveProperty("slug");
        expect(item).toHaveProperty("title");
        expect(item).toHaveProperty("excerpt");
        expect(item).toHaveProperty("authorName");
      }
    });

    it("GET /api/v1/blogs?category=Hyperlocal%20Tech filters by category", async () => {
      if (!prisma.blogPost) return;

      const res = await request(app).get("/api/v1/blogs?category=Hyperlocal%20Tech");

      expect(res.status).toBe(200);
      for (const item of res.body.data) {
        expect(item.category).toBe("Hyperlocal Tech");
      }
    });

    it("GET /api/v1/blogs/:slug returns full content for published article", async () => {
      if (!prisma.blogPost) return;

      const res = await request(app).get(`/api/v1/blogs/${createdBlogSlug}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.slug).toBe(createdBlogSlug);
      expect(res.body.data).toHaveProperty("content");
      expect(res.body.data.content).toContain("This is markdown test content.");
    });

    it("GET /api/v1/blogs/:slug returns 404 for draft / unpublished post", async () => {
      if (!prisma.blogPost) return;

      const res = await request(app).get(`/api/v1/blogs/${createdDraftSlug}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("BLOG_NOT_FOUND");
    });

    it("GET /api/v1/blogs/:slug returns 404 for unknown slug", async () => {
      const res = await request(app).get("/api/v1/blogs/unknown-slug-never-exists");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("BLOG_NOT_FOUND");
    });
  });

  // =========================================================================
  // 3. NOTIFY ME (OUT OF STOCK) TESTS
  // =========================================================================
  describe("Stock Notification ('Notify Me') Endpoints", () => {
    it("returns 409 PRODUCT_IN_STOCK when product is currently in stock", async () => {
      if (!prisma.product || !testProduct) return;

      // Ensure product is in stock
      await prisma.product.update({
        where: { id: testProduct.id },
        data: { inStock: true, countInStock: 25 },
      });

      const res = await request(app)
        .post(`/api/v1/products/${testProduct.slug}/notify-me`)
        .send({ email: "shopper@example.com" });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("PRODUCT_IN_STOCK");
    });

    it("subscribes guest user with email when product is out of stock (201 Created)", async () => {
      if (!prisma.stockNotification || !testProduct) return;

      // Mark product out of stock
      await prisma.product.update({
        where: { id: testProduct.id },
        data: { inStock: false, countInStock: 0 },
      });

      const res = await request(app)
        .post(`/api/v1/products/${testProduct.slug}/notify-me`)
        .send({ email: "guest-test@fillcart.test" });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe("guest-test@fillcart.test");
      expect(res.body.data.status).toBe("PENDING");
    });

    it("handles duplicate guest subscription idempotently (200 OK)", async () => {
      if (!prisma.stockNotification || !testProduct) return;

      const res = await request(app)
        .post(`/api/v1/products/${testProduct.slug}/notify-me`)
        .send({ email: "guest-test@fillcart.test" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain("Already subscribed");
    });

    it("subscribes authenticated user using req.user.id (201 Created)", async () => {
      if (!prisma.stockNotification || !testProduct) return;

      const res = await request(app)
        .post(`/api/v1/products/${testProduct.id}/notify-me`)
        .set("Authorization", `Bearer ${userAToken}`)
        .send({});

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.userId).toBe(userAId);
    });

    it("allows authenticated user to unsubscribe (DELETE 200 OK)", async () => {
      if (!prisma.stockNotification || !testProduct) return;

      const res = await request(app)
        .delete(`/api/v1/products/${testProduct.id}/notify-me`)
        .set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain("removed successfully");
    });

    it("returns 404 NOTIFICATION_NOT_FOUND if user deletes when not subscribed", async () => {
      if (!prisma.stockNotification || !testProduct) return;

      const res = await request(app)
        .delete(`/api/v1/products/${testProduct.id}/notify-me`)
        .set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("NOTIFICATION_NOT_FOUND");
    });

    it("returns 400 when unauthenticated caller provides neither email nor phone", async () => {
      if (!testProduct) return;

      const res = await request(app)
        .post(`/api/v1/products/${testProduct.slug}/notify-me`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("NOTIFICATION_CONTACT_REQUIRED");
    });

    it("returns 404 PRODUCT_NOT_FOUND when product does not exist", async () => {
      const res = await request(app)
        .post("/api/v1/products/non-existent-product-12345/notify-me")
        .send({ email: "guest@example.com" });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("PRODUCT_NOT_FOUND");
    });
  });
});
