import crypto from "node:crypto";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { prisma } from "../src/db/prisma.js";
import { setMockJwks, clearJwksCache } from "../src/utils/jwks.js";
import { CouponRepository } from "../src/repositories/coupon.repository.js";
import { OrderRepository } from "../src/repositories/order.repository.js";

describe("Customer Orders, Tracking & Coupons APIs", () => {
  let testPrivateKey;
  let testPublicKey;
  let userAToken;
  let userBToken;
  const userAId = "33333333-3333-4333-8333-333333333333";
  const userBId = "44444444-4444-4444-8444-444444444444";

  let testProduct;
  let initialStock = 50;
  let testAddressAId;
  let testAddressBId;
  let createdOrderNumber;
  let createdOrderId;

  function mintToken({
    sub = userAId,
    iss = "https://auth.fillcart.internal",
    aud = "customer-backend",
    account_type = "CUSTOMER",
    account_status = "ACTIVE",
    exp = Math.floor(Date.now() / 1000) + 900,
    nbf = Math.floor(Date.now() / 1000) - 10,
    alg = "EdDSA",
    kid = "test-ed25519-key-orders",
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
        kid: "test-ed25519-key-orders",
        kty: "OKP",
        crv: "Ed25519",
        use: "sig",
        alg: "EdDSA",
      },
    ]);

    userAToken = mintToken({ sub: userAId });
    userBToken = mintToken({ sub: userBId });

    // 2. Fetch or prepare test product from database
    if (prisma.product) {
      testProduct = await prisma.product.findFirst({
        where: { isActive: true },
      });
      if (testProduct) {
        initialStock = testProduct.countInStock;
        // Ensure healthy stock for testing
        await prisma.product.update({
          where: { id: testProduct.id },
          data: { inStock: true, countInStock: 50 },
        });
      }
    }

    // 3. Create test addresses for User A and User B
    const addrResA = await request(app)
      .post("/api/v1/addresses")
      .set("Authorization", `Bearer ${userAToken}`)
      .send({
        label: "Home",
        fullName: "Rahul Verma",
        phone: "9876543210",
        line1: "Flat 402, Sunshine Heights",
        city: "Indore",
        state: "Madhya Pradesh",
        pincode: "452001",
        isDefault: true,
      });
    testAddressAId = addrResA.body?.data?.id;

    const addrResB = await request(app)
      .post("/api/v1/addresses")
      .set("Authorization", `Bearer ${userBToken}`)
      .send({
        label: "Office",
        fullName: "Neha Sharma",
        phone: "9876543211",
        line1: "Tower B, Silicon Valley",
        city: "Indore",
        state: "Madhya Pradesh",
        pincode: "452010",
        isDefault: true,
      });
    testAddressBId = addrResB.body?.data?.id;

    // 4. Ensure seed test coupons are present in DB / fallback
    if (prisma.coupon) {
      await prisma.coupon.upsert({
        where: { code: "TEST_WELCOME" },
        update: { isActive: true, discountType: "PERCENT", discountValue: 10, minOrderValue: 0, maxDiscount: 50, perUserLimit: 1 },
        create: { code: "TEST_WELCOME", discountType: "PERCENT", discountValue: 10, minOrderValue: 0, maxDiscount: 50, perUserLimit: 1, isActive: true },
      });
      await prisma.coupon.upsert({
        where: { code: "TEST_FLAT50" },
        update: { isActive: true, discountType: "FLAT", discountValue: 50, minOrderValue: 500, perUserLimit: 2 },
        create: { code: "TEST_FLAT50", discountType: "FLAT", discountValue: 50, minOrderValue: 500, perUserLimit: 2, isActive: true },
      });
      await prisma.coupon.upsert({
        where: { code: "TEST_EXPIRED" },
        update: { isActive: true, discountType: "PERCENT", discountValue: 15, expiresAt: new Date("2020-01-01"), perUserLimit: 1 },
        create: { code: "TEST_EXPIRED", discountType: "PERCENT", discountValue: 15, expiresAt: new Date("2020-01-01"), perUserLimit: 1, isActive: true },
      });
    }

    CouponRepository.seedFallbackCoupon({
      code: "TEST_WELCOME",
      discountType: "PERCENT",
      discountValue: 10,
      minOrderValue: 0,
      maxDiscount: 50,
      perUserLimit: 1,
      isActive: true,
    });
    CouponRepository.seedFallbackCoupon({
      code: "TEST_FLAT50",
      discountType: "FLAT",
      discountValue: 50,
      minOrderValue: 500,
      perUserLimit: 2,
      isActive: true,
    });
    CouponRepository.seedFallbackCoupon({
      code: "TEST_EXPIRED",
      discountType: "PERCENT",
      discountValue: 15,
      expiresAt: new Date("2020-01-01"),
      perUserLimit: 1,
      isActive: true,
    });
  });

  afterAll(async () => {
    clearJwksCache();

    // Clean up created orders & state
    if (prisma.couponRedemption?.deleteMany) {
      await prisma.couponRedemption.deleteMany({
        where: { userId: { in: [userAId, userBId] } },
      }).catch(() => {});
    }
    if (prisma.orderStatusEvent?.deleteMany) {
      await prisma.orderStatusEvent.deleteMany({}).catch(() => {});
    }
    if (prisma.orderItem?.deleteMany) {
      await prisma.orderItem.deleteMany({}).catch(() => {});
    }
    if (prisma.order?.deleteMany) {
      await prisma.order.deleteMany({
        where: { userId: { in: [userAId, userBId] } },
      }).catch(() => {});
    }
    if (prisma.cartItem?.deleteMany) {
      await prisma.cartItem.deleteMany({}).catch(() => {});
    }
    if (prisma.cart?.deleteMany) {
      await prisma.cart.deleteMany({
        where: { userId: { in: [userAId, userBId] } },
      }).catch(() => {});
    }
    if (prisma.address?.deleteMany) {
      await prisma.address.deleteMany({
        where: { userId: { in: [userAId, userBId] } },
      }).catch(() => {});
    }
    if (prisma.coupon?.deleteMany) {
      await prisma.coupon.deleteMany({
        where: { code: { in: ["TEST_WELCOME", "TEST_FLAT50", "TEST_EXPIRED"] } },
      }).catch(() => {});
    }

    // Restore test product original stock
    if (prisma.product && testProduct) {
      await prisma.product.update({
        where: { id: testProduct.id },
        data: { inStock: true, countInStock: initialStock },
      }).catch(() => {});
    }

    CouponRepository.clearFallback();
    OrderRepository.clearFallback();
  });

  describe("1. Coupon Lifecycle & Edge Cases", () => {
    it("should reject coupon apply when cart is empty (400 CART_EMPTY)", async () => {
      // Ensure cart is empty
      await request(app).delete("/api/v1/cart").set("Authorization", `Bearer ${userAToken}`);

      const res = await request(app)
        .post("/api/v1/coupons/apply")
        .set("Authorization", `Bearer ${userAToken}`)
        .send({ code: "TEST_WELCOME" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("CART_EMPTY");
    });

    it("should reject invalid/non-existent coupon code (400 COUPON_INVALID)", async () => {
      // Add product to cart
      await request(app)
        .post("/api/v1/cart/items")
        .set("Authorization", `Bearer ${userAToken}`)
        .send({ productId: testProduct?.id, quantity: 2 });

      const res = await request(app)
        .post("/api/v1/coupons/apply")
        .set("Authorization", `Bearer ${userAToken}`)
        .send({ code: "FAKE_NON_EXISTENT_COUPON" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("COUPON_INVALID");
    });

    it("should reject expired coupon code (400 COUPON_EXPIRED)", async () => {
      const res = await request(app)
        .post("/api/v1/coupons/apply")
        .set("Authorization", `Bearer ${userAToken}`)
        .send({ code: "TEST_EXPIRED" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("COUPON_EXPIRED");
    });

    it("should reject coupon if subtotal is below minimum order value (400 COUPON_MIN_ORDER)", async () => {
      const res = await request(app)
        .post("/api/v1/coupons/apply")
        .set("Authorization", `Bearer ${userAToken}`)
        .send({ code: "TEST_FLAT50" }); // Min order value is 500

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("COUPON_MIN_ORDER");
    });

    it("should successfully apply valid coupon, calculate discount & grand total (200)", async () => {
      const res = await request(app)
        .post("/api/v1/coupons/apply")
        .set("Authorization", `Bearer ${userAToken}`)
        .send({ code: "TEST_WELCOME" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.appliedCouponCode).toBe("TEST_WELCOME");
      expect(res.body.data.discount).toBeGreaterThan(0);
      expect(res.body.data.total).toBeGreaterThan(0);
      expect(res.body.data.deliveryFee).toBeDefined();
      expect(res.body.data.tax).toBe(15);
    });

    it("should remove applied coupon and recalculate cart totals (200)", async () => {
      const res = await request(app)
        .delete("/api/v1/coupons/remove")
        .set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.appliedCouponCode).toBeNull();
      expect(res.body.data.discount).toBe(0);
    });
  });

  describe("2. Place Order & Stock Decrement (POST /api/v1/orders)", () => {
    it("should reject order when payment method is unsupported (400 PAYMENT_METHOD_NOT_SUPPORTED)", async () => {
      const res = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${userAToken}`)
        .send({
          addressId: testAddressAId,
          paymentMethod: "ONLINE",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("PAYMENT_METHOD_NOT_SUPPORTED");
    });

    it("should reject order when cart is empty (400 CART_EMPTY)", async () => {
      // Clear cart
      await request(app).delete("/api/v1/cart").set("Authorization", `Bearer ${userAToken}`);

      const res = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${userAToken}`)
        .send({
          addressId: testAddressAId,
          paymentMethod: "COD",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("CART_EMPTY");
    });

    it("should reject order if address does not belong to user (404 ADDRESS_NOT_FOUND)", async () => {
      // Add product to cart
      await request(app)
        .post("/api/v1/cart/items")
        .set("Authorization", `Bearer ${userAToken}`)
        .send({ productId: testProduct?.id, quantity: 2 });

      // Pass userB's address for userA
      const res = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${userAToken}`)
        .send({
          addressId: testAddressBId,
          paymentMethod: "COD",
        });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("ADDRESS_NOT_FOUND");
    });

    it("should reject order if items exceed available stock (409 OUT_OF_STOCK)", async () => {
      // Temporarily mark product countInStock to 1
      if (prisma.product && testProduct) {
        await prisma.product.update({
          where: { id: testProduct.id },
          data: { countInStock: 1 },
        });
      }

      const res = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${userAToken}`)
        .send({
          addressId: testAddressAId,
          paymentMethod: "COD",
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("OUT_OF_STOCK");

      // Restore stock
      if (prisma.product && testProduct) {
        await prisma.product.update({
          where: { id: testProduct.id },
          data: { countInStock: 50 },
        });
      }
    });

    it("should successfully place order, decrement stock, and clear cart (201 Created)", async () => {
      // Apply coupon first
      await request(app)
        .post("/api/v1/coupons/apply")
        .set("Authorization", `Bearer ${userAToken}`)
        .send({ code: "TEST_WELCOME" });

      const stockBefore = prisma.product && testProduct
        ? (await prisma.product.findUnique({ where: { id: testProduct.id } }))?.countInStock
        : 50;

      const res = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${userAToken}`)
        .send({
          addressId: testAddressAId,
          paymentMethod: "COD",
          notes: "Please call on arrival",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);

      const order = res.body.data;
      expect(order.orderNumber).toMatch(/^FC-\d{6}$/);
      expect(order.status).toBe("PLACED");
      expect(order.paymentMethod).toBe("COD");
      expect(order.paymentStatus).toBe("PENDING");
      expect(order.items.length).toBeGreaterThan(0);
      expect(order.subtotal).toBeGreaterThan(0);
      expect(order.total).toBeGreaterThan(0);
      expect(order.addressSnapshot.line1).toBe("Flat 402, Sunshine Heights");
      expect(order.statusEvents[0].status).toBe("PLACED");

      createdOrderNumber = order.orderNumber;
      createdOrderId = order.id;

      // Verify stock was decremented by 2
      if (prisma.product && testProduct) {
        const stockAfter = (
          await prisma.product.findUnique({ where: { id: testProduct.id } })
        )?.countInStock;
        expect(stockAfter).toBe(stockBefore - 2);
      }

      // Verify cart was emptied and applied coupon removed
      const cartRes = await request(app)
        .get("/api/v1/cart")
        .set("Authorization", `Bearer ${userAToken}`);
      expect(cartRes.body.data.items.length).toBe(0);
      expect(cartRes.body.data.appliedCouponCode).toBeNull();
    });

    it("should enforce per-user coupon limit on subsequent order (400 COUPON_LIMIT_REACHED)", async () => {
      // Re-add product to cart
      await request(app)
        .post("/api/v1/cart/items")
        .set("Authorization", `Bearer ${userAToken}`)
        .send({ productId: testProduct?.id, quantity: 1 });

      // TEST_WELCOME perUserLimit is 1, and userA already placed an order with it
      const res = await request(app)
        .post("/api/v1/coupons/apply")
        .set("Authorization", `Bearer ${userAToken}`)
        .send({ code: "TEST_WELCOME" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("COUPON_LIMIT_REACHED");

      // Clean cart
      await request(app).delete("/api/v1/cart").set("Authorization", `Bearer ${userAToken}`);
    });
  });

  describe("3. Order Retrieval & User Isolation (GET /api/v1/orders)", () => {
    it("should list user's orders with pagination (200)", async () => {
      const res = await request(app)
        .get("/api/v1/orders?page=1&limit=10")
        .set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.orders)).toBe(true);
      expect(res.body.data.orders.length).toBeGreaterThan(0);
      expect(res.body.data.pagination.page).toBe(1);
    });

    it("should get single order by ID or orderNumber (200)", async () => {
      const res = await request(app)
        .get(`/api/v1/orders/${createdOrderNumber}`)
        .set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.orderNumber).toBe(createdOrderNumber);
    });

    it("should return 404 NOT_FOUND (not 403) when user attempts to access another user's order", async () => {
      // User B attempts to access User A's order
      const res = await request(app)
        .get(`/api/v1/orders/${createdOrderNumber}`)
        .set("Authorization", `Bearer ${userBToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });
  });

  describe("4. Order Tracking (GET /api/v1/orders/:orderId/track)", () => {
    it("should return order tracking timeline and estimated delivery without rider GPS (200)", async () => {
      const res = await request(app)
        .get(`/api/v1/orders/${createdOrderId}/track`)
        .set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe("PLACED");
      expect(Array.isArray(res.body.data.statusTimeline)).toBe(true);
      expect(res.body.data.statusTimeline.length).toBeGreaterThan(0);
      expect(res.body.data.statusTimeline[0].status).toBe("PLACED");
      expect(res.body.data.estimatedDeliveryAt).toBeDefined();
      expect(res.body.data.rider).toBeNull();
    });

    it("should return 404 when tracking another user's order", async () => {
      const res = await request(app)
        .get(`/api/v1/orders/${createdOrderId}/track`)
        .set("Authorization", `Bearer ${userBToken}`);

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });
  });

  describe("5. Order Cancellation & Stock Restoration (POST /api/v1/orders/:orderId/cancel)", () => {
    it("should successfully cancel order in PLACED status and restore inventory (200)", async () => {
      const stockBefore = prisma.product && testProduct
        ? (await prisma.product.findUnique({ where: { id: testProduct.id } }))?.countInStock
        : 48;

      const res = await request(app)
        .post(`/api/v1/orders/${createdOrderId}/cancel`)
        .set("Authorization", `Bearer ${userAToken}`)
        .send({ reason: "Changed my mind" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe("CANCELLED");
      expect(res.body.data.cancelReason).toBe("Changed my mind");

      // Verify stock was restored
      if (prisma.product && testProduct) {
        const stockAfter = (
          await prisma.product.findUnique({ where: { id: testProduct.id } })
        )?.countInStock;
        expect(stockAfter).toBe(stockBefore + 2);
      }
    });

    it("should reject cancellation if order is already cancelled (409 ORDER_NOT_CANCELLABLE)", async () => {
      const res = await request(app)
        .post(`/api/v1/orders/${createdOrderId}/cancel`)
        .set("Authorization", `Bearer ${userAToken}`)
        .send({ reason: "Cancelling again" });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("ORDER_NOT_CANCELLABLE");
    });
  });

  describe("6. Reorder (POST /api/v1/orders/:orderId/reorder)", () => {
    it("should re-add order items back into user's cart (200)", async () => {
      const res = await request(app)
        .post(`/api/v1/orders/${createdOrderId}/reorder`)
        .set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.reorderedItems.length).toBeGreaterThan(0);

      // Verify cart now contains the items
      const cartRes = await request(app)
        .get("/api/v1/cart")
        .set("Authorization", `Bearer ${userAToken}`);
      expect(cartRes.body.data.items.length).toBeGreaterThan(0);
    });

    it("should return 404 when reordering another user's order", async () => {
      const res = await request(app)
        .post(`/api/v1/orders/${createdOrderId}/reorder`)
        .set("Authorization", `Bearer ${userBToken}`);

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });
  });
});
