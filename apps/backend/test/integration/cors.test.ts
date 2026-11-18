import request from "supertest";
import { describe, it, expect } from "vitest";
import { createApp } from "../../src/app.js";
import { validateConfig } from "../../src/config/env.js";

describe("CORS Behavior Integration Tests", () => {
  const config = validateConfig({
    CORS_ORIGIN: "http://localhost:3000,https://admin.fillcart.com",
    NODE_ENV: "test",
    LOG_LEVEL: "silent",
  });

  const app = createApp(config);

  it("returns Access-Control-Allow-Origin for allowed origin", async () => {
    const res = await request(app)
      .get("/api/v1/health")
      .set("Origin", "http://localhost:3000");

    expect(res.status).toBe(200);
    expect(res.header["access-control-allow-origin"]).toBe(
      "http://localhost:3000"
    );
  });

  it("does not return Access-Control-Allow-Origin for disallowed origin", async () => {
    const res = await request(app)
      .get("/api/v1/health")
      .set("Origin", "http://malicious-site.example.com");

    expect(res.status).toBe(200);
    expect(res.header["access-control-allow-origin"]).toBeUndefined();
  });

  it("handles CORS preflight OPTIONS request from allowed origin", async () => {
    const res = await request(app)
      .options("/api/v1/health")
      .set("Origin", "https://admin.fillcart.com")
      .set("Access-Control-Request-Method", "GET")
      .set("Access-Control-Request-Headers", "Content-Type,x-request-id");

    expect(res.status).toBe(204);
    expect(res.header["access-control-allow-origin"]).toBe(
      "https://admin.fillcart.com"
    );
    expect(res.header["access-control-allow-methods"]).toBeDefined();
  });

  it("does not return allow headers for preflight OPTIONS from disallowed origin", async () => {
    const res = await request(app)
      .options("/api/v1/health")
      .set("Origin", "http://unauthorized.com")
      .set("Access-Control-Request-Method", "POST");

    expect(res.header["access-control-allow-origin"]).toBeUndefined();
  });
});
