import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import crypto from "node:crypto";
import { createApp } from "../../src/app.js";
import { validateConfig } from "../../src/config/env.js";
import { CryptoService } from "../../src/modules/auth/services/crypto.service.js";
import type { Express } from "express";

describe("Super Admin Endpoints HTTP Integration Tests", () => {
  let app: Express;
  let cryptoService: CryptoService;

  beforeAll(() => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync("ed25519");
    const privateKeyPem = privateKey.export({ type: "pkcs8", format: "pem" }) as string;
    const publicKeyPem = publicKey.export({ type: "spki", format: "pem" }) as string;

    const config = validateConfig({
      JWT_ISSUER_URL: "https://auth.fillcart.internal",
      JWT_ACTIVE_KID: "k-test-admin-routes-1",
      JWT_ACTIVE_PRIVATE_KEY_PEM: privateKeyPem,
      JWT_ACTIVE_PUBLIC_KEY_PEM: publicKeyPem,
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
      expect(res.body).toHaveProperty("error");
      expect(res.body.error.code).toBe("UNAUTHORIZED");
    });

    it("rejects request with 401 when token has non-admin audience", async () => {
      const customerToken = cryptoService.signJwt({
        sub: "user-1",
        aud: "customer-backend",
        session_id: "session-1",
        account_type: "ADMIN",
        token_use: "access",
        exp: Math.floor(Date.now() / 1000) + 900,
      });

      const res = await request(app)
        .get("/api/v1/admin/roles")
        .set("Authorization", `Bearer ${customerToken}`);
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error.code).toBe("AUDIENCE_MISMATCH");
    });

    it("rejects request with 403 when token has non-ADMIN account_type", async () => {
      const riderToken = cryptoService.signJwt({
        sub: "user-1",
        aud: "admin-backend",
        session_id: "session-1",
        account_type: "RIDER",
        token_use: "access",
        exp: Math.floor(Date.now() / 1000) + 900,
      });

      const res = await request(app)
        .get("/api/v1/admin/roles")
        .set("Authorization", `Bearer ${riderToken}`);
      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error.code).toBe("FORBIDDEN");
    });

    it("rejects request with 401 when session does not exist in store", async () => {
      const adminTokenWithoutSession = cryptoService.signJwt({
        sub: "user-nonexistent",
        aud: "admin-backend",
        session_id: "session-nonexistent",
        account_type: "ADMIN",
        token_use: "access",
        exp: Math.floor(Date.now() / 1000) + 900,
      });

      const res = await request(app)
        .get("/api/v1/admin/roles")
        .set("Authorization", `Bearer ${adminTokenWithoutSession}`);
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error.code).toBe("UNAUTHORIZED");
    });
  });
});
