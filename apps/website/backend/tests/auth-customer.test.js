import crypto from "node:crypto";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { prisma } from "../src/db/prisma.js";
import { setMockJwks, clearJwksCache } from "../src/utils/jwks.js";

describe("Customer Authentication & Protected State APIs", () => {
  let testPrivateKey;
  let testPublicKey;
  let userAToken;
  let userBToken;
  const userAId = "11111111-1111-4111-8111-111111111111";
  const userBId = "22222222-2222-4222-8222-222222222222";

  // Helper to mint test Ed25519 JWTs
  function mintToken({
    sub = userAId,
    iss = "https://auth.fillcart.internal",
    aud = "customer-backend",
    account_type = "CUSTOMER",
    account_status = "ACTIVE",
    exp = Math.floor(Date.now() / 1000) + 900,
    nbf = Math.floor(Date.now() / 1000) - 10,
    alg = "EdDSA",
    kid = "test-ed25519-key-1",
    privateKey = testPrivateKey,
    tamper = false,
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
    let sigB64 = crypto.sign(null, signingInput, privateKey).toString("base64url");

    if (tamper) {
      sigB64 = sigB64.slice(0, -6) + "XXXXXX";
    }

    return `${headerB64}.${payloadB64}.${sigB64}`;
  }

  beforeAll(() => {
    // 1. Generate local Ed25519 keypair for test verification
    const { privateKey, publicKey } = crypto.generateKeyPairSync("ed25519");
    testPrivateKey = privateKey;
    testPublicKey = publicKey;

    const jwk = publicKey.export({ format: "jwk" });
    setMockJwks([
      {
        ...jwk,
        kid: "test-ed25519-key-1",
        kty: "OKP",
        crv: "Ed25519",
        use: "sig",
        alg: "EdDSA",
      },
    ]);

    userAToken = mintToken({ sub: userAId });
    userBToken = mintToken({ sub: userBId });
  });

  afterAll(async () => {
    clearJwksCache();

    // Clean up DB rows if models were generated
    if (prisma.cartItem?.deleteMany) {
      await prisma.cartItem.deleteMany({}).catch(() => {});
    }
    if (prisma.cart?.deleteMany) {
      await prisma.cart.deleteMany({ where: { userId: { in: [userAId, userBId] } } }).catch(() => {});
    }
    if (prisma.wishlistItem?.deleteMany) {
      await prisma.wishlistItem.deleteMany({ where: { userId: { in: [userAId, userBId] } } }).catch(() => {});
    }
    if (prisma.address?.deleteMany) {
      await prisma.address.deleteMany({ where: { userId: { in: [userAId, userBId] } } }).catch(() => {});
    }
    if (prisma.customerProfile?.deleteMany) {
      await prisma.customerProfile.deleteMany({ where: { userId: { in: [userAId, userBId] } } }).catch(() => {});
    }
  });

  describe("1. requireAuth Middleware Security Cases", () => {
    it("should return 401 UNAUTHENTICATED when Authorization header is missing", async () => {
      const res = await request(app).get("/api/v1/cart");
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("UNAUTHENTICATED");
    });

    it("should return 401 UNAUTHENTICATED when scheme is not Bearer", async () => {
      const res = await request(app)
        .get("/api/v1/cart")
        .set("Authorization", `Basic ${userAToken}`);
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHENTICATED");
    });

    it("should return 401 UNAUTHENTICATED for malformed JWT", async () => {
      const res = await request(app)
        .get("/api/v1/cart")
        .set("Authorization", "Bearer not.a.valid.jwt");
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHENTICATED");
    });

    it("should return 401 UNAUTHENTICATED when token signature is tampered", async () => {
      const tampered = mintToken({ tamper: true });
      const res = await request(app)
        .get("/api/v1/cart")
        .set("Authorization", `Bearer ${tampered}`);
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHENTICATED");
      expect(res.body.error.message).toMatch(/signature/i);
    });

    it("should return 401 TOKEN_EXPIRED when token has expired", async () => {
      const expiredToken = mintToken({ exp: Math.floor(Date.now() / 1000) - 100 });
      const res = await request(app)
        .get("/api/v1/cart")
        .set("Authorization", `Bearer ${expiredToken}`);
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("TOKEN_EXPIRED");
    });

    it("should return 401 UNAUTHENTICATED when algorithm is not EdDSA", async () => {
      const wrongAlg = mintToken({ alg: "HS256" });
      const res = await request(app)
        .get("/api/v1/cart")
        .set("Authorization", `Bearer ${wrongAlg}`);
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHENTICATED");
    });

    it("should return 401 UNAUTHENTICATED when issuer does not match", async () => {
      const wrongIssuer = mintToken({ iss: "https://evil.attacker.com" });
      const res = await request(app)
        .get("/api/v1/cart")
        .set("Authorization", `Bearer ${wrongIssuer}`);
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHENTICATED");
    });

    it("should return 403 FORBIDDEN when audience is not customer-backend", async () => {
      const vendorToken = mintToken({ aud: "vendor-backend" });
      const res = await request(app)
        .get("/api/v1/cart")
        .set("Authorization", `Bearer ${vendorToken}`);
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
      expect(res.body.error.message).toMatch(/audience mismatch/i);
    });

    it("should return 403 FORBIDDEN when account_type is not CUSTOMER", async () => {
      const riderToken = mintToken({ account_type: "RIDER_APPLICANT" });
      const res = await request(app)
        .get("/api/v1/cart")
        .set("Authorization", `Bearer ${riderToken}`);
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });

    it("should return 403 FORBIDDEN when account_status is not ACTIVE", async () => {
      const suspendedToken = mintToken({ account_status: "SUSPENDED" });
      const res = await request(app)
        .get("/api/v1/cart")
        .set("Authorization", `Bearer ${suspendedToken}`);
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });
  });

  describe("2. Cart APIs & User Isolation", () => {
    let createdItemId;

    it("should get an empty cart for authenticated User A", async () => {
      const res = await request(app)
        .get("/api/v1/cart")
        .set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("items");
      expect(res.body.data.userId).toBe(userAId);
      expect(res.body.data.subtotal).toBe(0);
      expect(res.body.data.totalItems).toBe(0);
    });

    it("should add a product to User A's cart using slug", async () => {
      const res = await request(app)
        .post("/api/v1/cart/items")
        .set("Authorization", `Bearer ${userAToken}`)
        .send({ slug: "fortune-sunflower-oil", quantity: 2 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items.length).toBeGreaterThanOrEqual(1);

      const added = res.body.data.items[0];
      createdItemId = added.id;
      expect(added.quantity).toBe(2);
      expect(res.body.data.subtotal).toBeGreaterThan(0);
    });

    it("should update quantity of item in User A's cart", async () => {
      if (!createdItemId) return;
      const res = await request(app)
        .patch(`/api/v1/cart/items/${createdItemId}`)
        .set("Authorization", `Bearer ${userAToken}`)
        .send({ quantity: 4 });

      expect(res.status).toBe(200);
      const item = res.body.data.items.find((i) => i.id === createdItemId);
      expect(item.quantity).toBe(4);
    });

    it("Isolation Test: User B should NOT see User A's cart items", async () => {
      const res = await request(app)
        .get("/api/v1/cart")
        .set("Authorization", `Bearer ${userBToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.userId).toBe(userBId);
      expect(res.body.data.items.length).toBe(0);
    });

    it("Isolation Test: User B cannot modify User A's cart item (404 Not Found)", async () => {
      if (!createdItemId) return;
      const res = await request(app)
        .patch(`/api/v1/cart/items/${createdItemId}`)
        .set("Authorization", `Bearer ${userBToken}`)
        .send({ quantity: 1 });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });

    it("should merge guest cart items into User A's cart", async () => {
      const res = await request(app)
        .post("/api/v1/cart/merge")
        .set("Authorization", `Bearer ${userAToken}`)
        .send({
          items: [
            { slug: "fortune-sunflower-oil", quantity: 2 },
            { slug: "fresh-banana-robusta", quantity: 3 },
          ],
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items.length).toBeGreaterThanOrEqual(1);
    });

    it("should remove item when quantity is updated to 0", async () => {
      if (!createdItemId) return;
      const res = await request(app)
        .patch(`/api/v1/cart/items/${createdItemId}`)
        .set("Authorization", `Bearer ${userAToken}`)
        .send({ quantity: 0 });

      expect(res.status).toBe(200);
      const found = res.body.data.items.some((i) => i.id === createdItemId);
      expect(found).toBe(false);
    });

    it("should clear User A's entire cart", async () => {
      const res = await request(app)
        .delete("/api/v1/cart")
        .set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const check = await request(app)
        .get("/api/v1/cart")
        .set("Authorization", `Bearer ${userAToken}`);
      expect(check.body.data.items.length).toBe(0);
    });
  });

  describe("3. Wishlist APIs & User Isolation", () => {
    it("should get empty wishlist for User A", async () => {
      const res = await request(app)
        .get("/api/v1/wishlist")
        .set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(0);
    });

    it("should add a product to User A's wishlist using slug", async () => {
      const res = await request(app)
        .post("/api/v1/wishlist/items")
        .set("Authorization", `Bearer ${userAToken}`)
        .send({ slug: "fortune-sunflower-oil" });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.userId).toBe(userAId);
    });

    it("Isolation Test: User B's wishlist does NOT include User A's items", async () => {
      const res = await request(app)
        .get("/api/v1/wishlist")
        .set("Authorization", `Bearer ${userBToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(0);
    });

    it("should delete item from User A's wishlist", async () => {
      const res = await request(app)
        .delete("/api/v1/wishlist/items/fortune-sunflower-oil")
        .set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const check = await request(app)
        .get("/api/v1/wishlist")
        .set("Authorization", `Bearer ${userAToken}`);
      expect(check.body.data.length).toBe(0);
    });
  });

  describe("4. Addresses APIs & User Isolation", () => {
    let addressA1Id;
    let addressA2Id;

    it("should create first address for User A (automatically set to default)", async () => {
      const res = await request(app)
        .post("/api/v1/addresses")
        .set("Authorization", `Bearer ${userAToken}`)
        .send({
          label: "Home",
          fullName: "Aarav Sharma",
          phone: "+91 98765 43210",
          line1: "Flat 402, Sunshine Heights",
          city: "Indore",
          state: "Madhya Pradesh",
          pincode: "452010",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.userId).toBe(userAId);
      expect(res.body.data.isDefault).toBe(true);
      addressA1Id = res.body.data.id;
    });

    it("should create second address for User A with isDefault=true, unsetting first address", async () => {
      const res = await request(app)
        .post("/api/v1/addresses")
        .set("Authorization", `Bearer ${userAToken}`)
        .send({
          label: "Office",
          fullName: "Aarav Sharma (Office)",
          phone: "+91 98765 43210",
          line1: "Tech Park, Building B",
          city: "Indore",
          state: "Madhya Pradesh",
          pincode: "452011",
          isDefault: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.isDefault).toBe(true);
      addressA2Id = res.body.data.id;

      // Verify list: exactly 1 default
      const list = await request(app)
        .get("/api/v1/addresses")
        .set("Authorization", `Bearer ${userAToken}`);
      const defaults = list.body.data.filter((a) => a.isDefault);
      expect(defaults.length).toBe(1);
      expect(defaults[0].id).toBe(addressA2Id);
    });

    it("Isolation Test: User B cannot see User A's addresses", async () => {
      const res = await request(app)
        .get("/api/v1/addresses")
        .set("Authorization", `Bearer ${userBToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(0);
    });

    it("Isolation Test: User B cannot edit or delete User A's address (404 Not Found)", async () => {
      const res = await request(app)
        .patch(`/api/v1/addresses/${addressA1Id}`)
        .set("Authorization", `Bearer ${userBToken}`)
        .send({ label: "Hacked Label" });

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });

    it("should set addressA1Id back as default", async () => {
      const res = await request(app)
        .patch(`/api/v1/addresses/${addressA1Id}/default`)
        .set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.isDefault).toBe(true);
    });

    it("should delete addressA2Id", async () => {
      const res = await request(app)
        .delete(`/api/v1/addresses/${addressA2Id}`)
        .set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("5. Customer Profile APIs & User Isolation", () => {
    it("should get profile for User A", async () => {
      const res = await request(app)
        .get("/api/v1/me/profile")
        .set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.userId).toBe(userAId);
    });

    it("should update User A's profile", async () => {
      const res = await request(app)
        .patch("/api/v1/me/profile")
        .set("Authorization", `Bearer ${userAToken}`)
        .send({
          fullName: "Aarav Sharma Updated",
          phone: "+91 99999 88888",
        });

      expect(res.status).toBe(200);
      expect(res.body.data.fullName).toBe("Aarav Sharma Updated");
      expect(res.body.data.phone).toBe("+91 99999 88888");
    });

    it("Isolation Test: User B has their own independent profile", async () => {
      const res = await request(app)
        .get("/api/v1/me/profile")
        .set("Authorization", `Bearer ${userBToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.userId).toBe(userBId);
      expect(res.body.data.fullName).not.toBe("Aarav Sharma Updated");
    });
  });
});
