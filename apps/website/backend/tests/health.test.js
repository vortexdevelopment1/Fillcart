import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";

describe("Health Check API", () => {
  it("GET /api/v1/health should return 200 with status ok", async () => {
    const res = await request(app).get("/api/v1/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: {
        status: "ok",
      },
    });
  });

  it("GET /api/v1/unknown-route should return 404 in standardized error format", async () => {
    const res = await request(app).get("/api/v1/unknown-route");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Cannot GET /api/v1/unknown-route",
      },
    });
  });
});
