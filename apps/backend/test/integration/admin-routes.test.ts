import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { createApp } from "../../src/app.js";
import { validateConfig } from "../../src/config/env.js";
import { CryptoService } from "../../src/modules/auth/services/crypto.service.js";
import type { Express } from "express";

describe("Super Admin Endpoints HTTP Integration Tests", () => {
  let app: Express;
  let cryptoService: CryptoService;

  beforeAll(() => {
    const config = validateConfig({
      JWT_ISSUER_URL: "https://auth.fillcart.internal",
      JWT_ACTIVE_KID: "k-test-admin-routes-1",
    });
    app = createApp(config);
    cryptoService = new CryptoService(config);
  });

  describe("Authentication Gate (adminAuth middleware)", () => {
    it("rejects unauthorized request with 401 on GET /api/v1/admin/roles", async () => {
      const res = await request(app).get("/api/v1/admin/roles");
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error.code).toBe("UNAUTHORIZED");
    });

    it("rejects request with 401 on malformed Authorization header", async () => {
      const res = await request(app)
        .get("/api/v1/admin/staff")
        .set("Authorization", "NotBearer token");
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHORIZED");
    });

    it("rejects request with 401 when token has non-admin audience", async () => {
      const customerToken = cryptoService.signJwt({
        sub: "user-1",
        aud: "customer-backend",
        sid: "session-1",
        account_type: "ADMIN",
        exp: Math.floor(Date.now() / 1000) + 900,
      });

      const res = await request(app)
        .get("/api/v1/admin/roles")
        .set("Authorization", `Bearer ${customerToken}`);
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHORIZED");
    });

    it("rejects request with 403 when token has non-ADMIN account_type", async () => {
      const riderToken = cryptoService.signJwt({
        sub: "user-1",
        aud: "admin-backend",
        sid: "session-1",
        account_type: "RIDER",
        exp: Math.floor(Date.now() / 1000) + 900,
      });

      const res = await request(app)
        .get("/api/v1/admin/roles")
        .set("Authorization", `Bearer ${riderToken}`);
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });
  });

  describe("Validation boundaries with admin authorization", () => {
    // Generate valid admin token for validation tests
    let validAdminToken: string;

    beforeAll(() => {
      validAdminToken = cryptoService.signJwt({
        sub: "user-1",
        aud: "admin-backend",
        sid: "session-1",
        account_type: "ADMIN",
        exp: Math.floor(Date.now() / 1000) + 900,
      });
    });

    it("validates request body on POST /api/v1/admin/auth/verify-settings-access", async () => {
      // Empty body should fail validation
      const res = await request(app)
        .post("/api/v1/admin/auth/verify-settings-access")
        .set("Authorization", `Bearer ${validAdminToken}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("validates request query on GET /api/v1/admin/staff", async () => {
      const res = await request(app)
        .get("/api/v1/admin/staff?limit=999") // limit max is 100
        .set("Authorization", `Bearer ${validAdminToken}`);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("validates request body on POST /api/v1/admin/staff/invite", async () => {
      const res = await request(app)
        .post("/api/v1/admin/staff/invite")
        .set("Authorization", `Bearer ${validAdminToken}`)
        .send({ email: "invalid-email" });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("validates request body on PATCH /api/v1/admin/staff/:id/status", async () => {
      const res = await request(app)
        .patch("/api/v1/admin/staff/some-id/status")
        .set("Authorization", `Bearer ${validAdminToken}`)
        .send({ status: "UNKNOWN_STATUS" });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });
});
