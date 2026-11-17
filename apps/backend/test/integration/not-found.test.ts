import request from "supertest";
import { describe, it, expect } from "vitest";
import { createApp } from "../../src/app.js";
import { validateConfig } from "../../src/config/env.js";
import { ERROR_CODES } from "../../src/constants/error-codes.js";

describe("404 Not Found Integration Tests", () => {
  const config = validateConfig({
    NODE_ENV: "test",
    LOG_LEVEL: "silent",
  });

  const app = createApp(config);

  it("unmatched route returns HTTP 404 matching ErrorResponse schema", async () => {
    const res = await request(app).get("/api/v1/non-existent-route");

    expect(res.status).toBe(404);
    expect(res.header["content-type"]).toMatch(/application\/json/);
    expect(res.header["x-request-id"]).toBeDefined();

    expect(res.body).toEqual({
      error: {
        code: ERROR_CODES.NOT_FOUND,
        message: expect.stringMatching(/not found/i),
        requestId: res.header["x-request-id"],
      },
    });
  });

  it("unmatched POST route returns HTTP 404 matching ErrorResponse schema", async () => {
    const res = await request(app)
      .post("/unknown-endpoint")
      .send({ some: "data" });

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe(ERROR_CODES.NOT_FOUND);
    expect(res.body.error.requestId).toBe(res.header["x-request-id"]);
  });
});
