import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createApp } from "../../src/app.js";
import { validateConfig } from "../../src/config/env.js";
import * as dbConnection from "../../src/database/connection/check-connection.js";

describe("Readiness Probes Integration Tests", () => {
  const config = validateConfig({
    DATABASE_URL:
      "postgresql://fillcart_user:fillcart_pass@127.0.0.1:5432/fillcart?schema=public",
    NODE_ENV: "test",
    LOG_LEVEL: "silent",
  });

  const app = createApp(config);

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("GET /health/ready returns HTTP 200 with ReadyResponse schema when database is reachable", async () => {
    vi.spyOn(dbConnection, "checkDatabaseReadiness").mockResolvedValue({
      ok: true,
      latencyMs: 3,
    });

    const res = await request(app).get("/health/ready");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: "ready",
      database: "connected",
      timestamp: expect.any(String),
    });
    expect(res.header["x-request-id"]).toBeDefined();
  });

  it("GET /api/v1/health/ready returns HTTP 200 with ReadyResponse schema when database is reachable", async () => {
    vi.spyOn(dbConnection, "checkDatabaseReadiness").mockResolvedValue({
      ok: true,
      latencyMs: 5,
    });

    const res = await request(app).get("/api/v1/health/ready");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: "ready",
      database: "connected",
      timestamp: expect.any(String),
    });
  });

  it("GET /health/ready returns HTTP 503 with generic DegradedResponse schema when database is unreachable", async () => {
    vi.spyOn(dbConnection, "checkDatabaseReadiness").mockResolvedValue({
      ok: false,
      latencyMs: 12,
    });

    const res = await request(app).get("/health/ready");

    expect(res.status).toBe(503);
    expect(res.body).toEqual({
      status: "degraded",
      database: "disconnected",
      message: "Database service is temporarily unavailable",
      timestamp: expect.any(String),
    });

    // Zero credential leakage verification
    const bodyStr = JSON.stringify(res.body);
    expect(bodyStr).not.toContain("postgresql://");
    expect(bodyStr).not.toContain("fillcart_pass");
    expect(bodyStr).not.toContain("password");
  });

  it("Liveness probe GET /health remains HTTP 200 even when database is disconnected", async () => {
    vi.spyOn(dbConnection, "checkDatabaseReadiness").mockResolvedValue({
      ok: false,
      latencyMs: 15,
    });

    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: "healthy",
      timestamp: expect.any(String),
      version: "0.1.0",
    });
  });
});
