import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { createApp } from "../../src/app.js";
import { validateConfig } from "../../src/config/env.js";
import type { Express } from "express";

describe("Phase 3 Full Central Auth Route Integration Tests", () => {
  let app: Express;

  beforeAll(() => {
    const config = validateConfig({
      JWT_ISSUER_URL: "https://auth.fillcart.internal",
      JWT_ACTIVE_KID: "k-test-integration-1",
    });
    app = createApp(config);
  });

  it("serves RFC 8037 JWKS at GET /.well-known/jwks.json", async () => {
    const res = await request(app).get("/.well-known/jwks.json");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("keys");
    expect(Array.isArray(res.body.keys)).toBe(true);

    const active = res.body.keys.find((k: any) => k.kid === "k-test-integration-1");
    expect(active).toBeDefined();
    expect(active.kty).toBe("OKP");
    expect(active.crv).toBe("Ed25519");
  });

  it("validates request boundary on POST /api/v1/auth/register", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "invalid-email" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("prohibits registration with ADMIN accountType", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        email: "admin@fillcart.internal",
        password: "SuperSecretPassword123!",
        fullName: "Fake Admin",
        accountType: "ADMIN",
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("validates request boundary on POST /api/v1/auth/login", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("validates request boundary on POST /api/v1/auth/otp/send", async () => {
    const res = await request(app)
      .post("/api/v1/auth/otp/send")
      .send({ phone: "not-e164" });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("initiates OTP challenge on valid phone format", async () => {
    const res = await request(app)
      .post("/api/v1/auth/otp/send")
      .send({ phone: "+919876543210", accountType: "CUSTOMER", purpose: "LOGIN" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("challengeId");
    expect(res.body.cooldownSeconds).toBe(60);
  });

  it("rejects unauthorized request to POST /api/v1/internal/auth/verify-session without S2S token", async () => {
    const validLengthDummyJwt = "eyJhbGciOiJFZERTQTEyMyJ9.eyJzdWIiOiIxMjM0NTY3OCJ9.c2lnbmF0dXJlMTIzNDU2Nzg";
    const res = await request(app)
      .post("/api/v1/internal/auth/verify-session")
      .send({ userAccessToken: validLengthDummyJwt });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });
});
