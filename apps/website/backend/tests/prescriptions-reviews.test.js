import crypto from "node:crypto";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { prisma } from "../src/db/prisma.js";
import { setMockJwks, clearJwksCache } from "../src/utils/jwks.js";
import { PrescriptionRepository } from "../src/repositories/prescription.repository.js";
import { ReviewRepository } from "../src/repositories/review.repository.js";

describe("Customer Prescriptions & Product Reviews APIs", () => {
  let testPrivateKey;
  let testPublicKey;
  let userAToken;
  let userBToken;
  const userAId = "55555555-5555-4555-8555-555555555555";
  const userBId = "66666666-6666-4666-8666-666666666666";

  let testProduct;
  let createdPrescriptionId;
  let deliveredOrder;

  function mintToken({
    sub = userAId,
    iss = "https://auth.fillcart.internal",
    aud = "customer-backend",
    account_type = "CUSTOMER",
    account_status = "ACTIVE",
    exp = Math.floor(Date.now() / 1000) + 900,
    nbf = Math.floor(Date.now() / 1000) - 10,
    alg = "EdDSA",
    kid = "test-ed25519-key-rx-rev",
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
        kid: "test-ed25519-key-rx-rev",
        kty: "OKP",
        crv: "Ed25519",
        use: "sig",
        alg: "EdDSA",
      },
    ]);

    userAToken = mintToken({ sub: userAId });
    userBToken = mintToken({ sub: userBId });

    // 2. Locate or create test product
    if (prisma.product) {
      testProduct = await prisma.product.findFirst({
        where: { isActive: true },
      });
    }

    // 3. Seed a DELIVERED order for user B with testProduct (to verify verified purchase badge)
    if (prisma.order && prisma.orderItem && testProduct) {
      deliveredOrder = await prisma.order.create({
        data: {
          orderNumber: `FC-${Math.floor(100000 + Math.random() * 900000)}`,
          userId: userBId,
          status: "DELIVERED",
          paymentMethod: "COD",
          paymentStatus: "COMPLETED",
          subtotal: 100,
          total: 115,
          addressSnapshot: { line1: "Test Office Address", city: "Indore" },
          items: {
            create: [
              {
                productId: testProduct.id,
                nameSnapshot: testProduct.name,
                unitPriceSnapshot: testProduct.price,
                unit: testProduct.unit || "1 unit",
                quantity: 1,
                lineTotal: testProduct.price,
              },
            ],
          },
        },
      });
    }
  });

  afterAll(async () => {
    clearJwksCache();

    // Clean up created prescriptions
    if (prisma.prescription?.deleteMany) {
      await prisma.prescription.deleteMany({
        where: { userId: { in: [userAId, userBId] } },
      }).catch(() => {});
    }

    // Clean up created reviews
    if (prisma.productReview?.deleteMany && testProduct) {
      await prisma.productReview.deleteMany({
        where: { productId: testProduct.id },
      }).catch(() => {});
    }

    // Clean up delivered order
    if (prisma.orderItem?.deleteMany && deliveredOrder) {
      await prisma.orderItem.deleteMany({
        where: { orderId: deliveredOrder.id },
      }).catch(() => {});
    }
    if (prisma.order?.deleteMany && deliveredOrder) {
      await prisma.order.deleteMany({
        where: { id: deliveredOrder.id },
      }).catch(() => {});
    }

    PrescriptionRepository.clearFallback();
    ReviewRepository.clearFallback();
  });

  describe("1. Prescriptions Management (requireAuth)", () => {
    it("should return 401 UNAUTHENTICATED when token is missing", async () => {
      const res = await request(app).get("/api/v1/prescriptions");
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("UNAUTHENTICATED");
    });

    it("should reject invalid non-https file URL (400 validation error)", async () => {
      const res = await request(app)
        .post("/api/v1/prescriptions")
        .set("Authorization", `Bearer ${userAToken}`)
        .send({
          fileName: "prescription_scan.pdf",
          fileUrl: "http://insecure-link.com/rx.pdf", // Insecure HTTP
          fileType: "pdf",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should reject disallowed file type (400 validation error)", async () => {
      const res = await request(app)
        .post("/api/v1/prescriptions")
        .set("Authorization", `Bearer ${userAToken}`)
        .send({
          fileName: "prescription.docx",
          fileUrl: "https://example.com/rx.docx",
          fileType: "docx", // Only jpg, jpeg, png, pdf allowed
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should successfully create prescription record with PENDING status (201 Created)", async () => {
      const res = await request(app)
        .post("/api/v1/prescriptions")
        .set("Authorization", `Bearer ${userAToken}`)
        .send({
          fileName: "dr_mehta_rx_nov2026.pdf",
          fileUrl: "https://res.cloudinary.com/fillcart/rx/dr_mehta_rx_nov2026.pdf",
          fileType: "pdf",
          patientName: "Rahul Verma",
          doctorName: "Dr. Arvind Mehta, MD",
          notes: "Blood pressure and regular vitamins prescription",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.fileName).toBe("dr_mehta_rx_nov2026.pdf");
      expect(res.body.data.status).toBe("PENDING");
      expect(res.body.data.patientName).toBe("Rahul Verma");
      expect(res.body.data.doctorName).toBe("Dr. Arvind Mehta, MD");

      createdPrescriptionId = res.body.data.id;
    });

    it("should list user's uploaded prescriptions (200)", async () => {
      const res = await request(app)
        .get("/api/v1/prescriptions")
        .set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].id).toBe(createdPrescriptionId);
    });

    it("should retrieve single prescription by ID (200)", async () => {
      const res = await request(app)
        .get(`/api/v1/prescriptions/${createdPrescriptionId}`)
        .set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createdPrescriptionId);
    });

    it("should enforce user isolation: return 404 NOT_FOUND (not 403) for another user's prescription", async () => {
      // User B attempts to access User A's prescription
      const res = await request(app)
        .get(`/api/v1/prescriptions/${createdPrescriptionId}`)
        .set("Authorization", `Bearer ${userBToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });

    it("should enforce user isolation on delete: return 404 when user B tries to delete user A's prescription", async () => {
      const res = await request(app)
        .delete(`/api/v1/prescriptions/${createdPrescriptionId}`)
        .set("Authorization", `Bearer ${userBToken}`);

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });

    it("should successfully delete own prescription (200)", async () => {
      const res = await request(app)
        .delete(`/api/v1/prescriptions/${createdPrescriptionId}`)
        .set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify it is gone
      const checkRes = await request(app)
        .get(`/api/v1/prescriptions/${createdPrescriptionId}`)
        .set("Authorization", `Bearer ${userAToken}`);
      expect(checkRes.status).toBe(404);
    });
  });

  describe("2. Product Reviews & Rating Summary", () => {
    it("should allow public access to GET reviews without token (200)", async () => {
      const targetSlug = testProduct?.slug || "fresh-royal-apples";
      const res = await request(app).get(`/api/v1/products/${targetSlug}/reviews`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toBeDefined();
      expect(res.body.data.summary).toBeDefined();
      expect(res.body.data.summary.distribution).toBeDefined();
    });

    it("should reject review submission when unauthenticated (401)", async () => {
      const targetSlug = testProduct?.slug || "fresh-royal-apples";
      const res = await request(app)
        .post(`/api/v1/products/${targetSlug}/reviews`)
        .send({
          rating: 5,
          comment: "Excellent fresh quality, fast delivery!",
        });

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHENTICATED");
    });

    it("should reject review with rating outside 1-5 (400 validation error)", async () => {
      const targetSlug = testProduct?.slug || "fresh-royal-apples";
      const res = await request(app)
        .post(`/api/v1/products/${targetSlug}/reviews`)
        .set("Authorization", `Bearer ${userAToken}`)
        .send({
          rating: 6, // Invalid
          comment: "Superb product!",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should create review with isVerifiedPurchase=false when user has no delivered order (201 Created)", async () => {
      const targetSlug = testProduct?.slug || "fresh-royal-apples";
      const res = await request(app)
        .post(`/api/v1/products/${targetSlug}/reviews`)
        .set("Authorization", `Bearer ${userAToken}`)
        .send({
          rating: 4,
          title: "Good Everyday Product",
          comment: "Fresh and crisp, delivered in neat packaging.",
          displayName: "Rahul V.",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.rating).toBe(4);
      expect(res.body.data.title).toBe("Good Everyday Product");
      expect(res.body.data.displayName).toBe("Rahul V.");
      expect(res.body.data.isVerifiedPurchase).toBe(false);
    });

    it("should reject duplicate review for same product by same user (409 REVIEW_EXISTS)", async () => {
      const targetSlug = testProduct?.slug || "fresh-royal-apples";
      const res = await request(app)
        .post(`/api/v1/products/${targetSlug}/reviews`)
        .set("Authorization", `Bearer ${userAToken}`)
        .send({
          rating: 5,
          comment: "Trying to post a second review",
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("REVIEW_EXISTS");
    });

    it("should create review with isVerifiedPurchase=true when user has delivered order (201 Created)", async () => {
      const targetSlug = testProduct?.slug || "fresh-royal-apples";
      const res = await request(app)
        .post(`/api/v1/products/${targetSlug}/reviews`)
        .set("Authorization", `Bearer ${userBToken}`)
        .send({
          rating: 5,
          title: "Top Notch Quality",
          comment: "Ordered yesterday, delivered on time. Truly verified purchase quality!",
          displayName: "Neha S.",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.rating).toBe(5);
      if (deliveredOrder) {
        expect(res.body.data.isVerifiedPurchase).toBe(true);
      }
    });

    it("should accurately compute review summary math (count, average, distribution 1-5)", async () => {
      const targetSlug = testProduct?.slug || "fresh-royal-apples";
      const res = await request(app).get(`/api/v1/products/${targetSlug}/reviews`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const summary = res.body.data.summary;

      expect(summary.count).toBe(2);
      expect(summary.average).toBe(4.5); // (4 + 5) / 2 = 4.5
      expect(summary.distribution[5]).toBe(1);
      expect(summary.distribution[4]).toBe(1);
      expect(summary.distribution[3]).toBe(0);
      expect(summary.distribution[2]).toBe(0);
      expect(summary.distribution[1]).toBe(0);
    });

    it("should successfully update own review (PATCH /mine -> 200)", async () => {
      const targetSlug = testProduct?.slug || "fresh-royal-apples";
      const res = await request(app)
        .patch(`/api/v1/products/${targetSlug}/reviews/mine`)
        .set("Authorization", `Bearer ${userAToken}`)
        .send({
          rating: 5,
          comment: "Updated review: Outstanding freshness after cooking!",
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.rating).toBe(5);
      expect(res.body.data.comment).toBe("Updated review: Outstanding freshness after cooking!");
    });

    it("should successfully delete own review (DELETE /mine -> 200)", async () => {
      const targetSlug = testProduct?.slug || "fresh-royal-apples";
      const res = await request(app)
        .delete(`/api/v1/products/${targetSlug}/reviews/mine`)
        .set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify user can now submit a fresh review without 409
      const rePostRes = await request(app)
        .post(`/api/v1/products/${targetSlug}/reviews`)
        .set("Authorization", `Bearer ${userAToken}`)
        .send({
          rating: 5,
          comment: "Brand new review after deleting old one",
        });
      expect(rePostRes.status).toBe(201);
    });
  });
});
