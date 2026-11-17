import request from "supertest";
import { describe, it, expect } from "vitest";
import { createApp } from "../../src/app.js";
import { validateConfig } from "../../src/config/env.js";

describe("Health Endpoints Integration Tests", () => {
  const config = validateConfig({
    PORT: "4000",
    HOST: "127.0.0.1",
    NODE_ENV: "test",
    LOG_LEVEL: "silent",
  });

  const app = createApp(config);

  it("GET /health responds with 200 and matches HealthResponse schema", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.header["content-type"]).toMatch(/application\/json/);
    expect(res.header["x-request-id"]).toBeDefined();

    expect(res.body).toEqual({
      status: "healthy",
      timestamp: expect.any(String),
      version: "0.1.0",
    });

    // Verify timestamp is a valid ISO date-time string
    expect(new Date(res.body.timestamp).toISOString()).toBe(res.body.timestamp);
  });

  it("GET /api/v1/health responds with 200 and matches HealthResponse schema", async () => {
    const res = await request(app).get("/api/v1/health");

    expect(res.status).toBe(200);
    expect(res.header["content-type"]).toMatch(/application\/json/);
    expect(res.header["x-request-id"]).toBeDefined();

    expect(res.body).toEqual({
      status: "healthy",
      timestamp: expect.any(String),
      version: "0.1.0",
    });
  });

  it("Preserves client x-request-id header across health probe response", async () => {
    const customId = "123e4567-e89b-12d3-a456-426614174000";
    const res = await request(app)
      .get("/api/v1/health")
      .set("x-request-id", customId);

    expect(res.status).toBe(200);
    expect(res.header["x-request-id"]).toBe(customId);
  });

  it("Applies Helmet security headers on health probe response", async () => {
    const res = await request(app).get("/health");

    expect(res.header["x-content-type-options"]).toBe("nosniff");
    expect(res.header["x-frame-options"]).toBe("DENY");
  });
});
