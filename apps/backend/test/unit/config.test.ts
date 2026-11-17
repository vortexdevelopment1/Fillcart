import { describe, it, expect } from "vitest";
import { validateConfig } from "../../src/config/env.js";

describe("Config Validation Unit Tests", () => {
  it("accepts valid default configuration", () => {
    const config = validateConfig({});
    expect(config.PORT).toBe(4000);
    expect(config.HOST).toBe("127.0.0.1");
    expect(config.NODE_ENV).toBe("development");
    expect(config.LOG_LEVEL).toBe("info");
    expect(config.CORS_ORIGIN).toEqual([
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ]);
  });

  it("accepts custom valid PORT, HOST, NODE_ENV, and LOG_LEVEL", () => {
    const config = validateConfig({
      PORT: "8080",
      HOST: "0.0.0.0",
      NODE_ENV: "production",
      LOG_LEVEL: "warn",
      CORS_ORIGIN: "https://admin.fillcart.com",
    });
    expect(config.PORT).toBe(8080);
    expect(config.HOST).toBe("0.0.0.0");
    expect(config.NODE_ENV).toBe("production");
    expect(config.LOG_LEVEL).toBe("warn");
    expect(config.CORS_ORIGIN).toEqual(["https://admin.fillcart.com"]);
  });

  it("rejects non-numeric or out-of-range PORT", () => {
    expect(() => validateConfig({ PORT: "abc" })).toThrow(/PORT/);
    expect(() => validateConfig({ PORT: "-1" })).toThrow(/PORT/);
    expect(() => validateConfig({ PORT: "70000" })).toThrow(/PORT/);
  });

  it("rejects invalid LOG_LEVEL", () => {
    expect(() => validateConfig({ LOG_LEVEL: "verbose" })).toThrow(/LOG_LEVEL/);
  });

  it("normalizes and de-duplicates valid CORS origins", () => {
    const config = validateConfig({
      CORS_ORIGIN:
        "https://app.fillcart.com, https://app.fillcart.com/, http://localhost:5173",
    });
    expect(config.CORS_ORIGIN).toEqual([
      "https://app.fillcart.com",
      "http://localhost:5173",
    ]);
  });

  it("rejects CORS origin with path", () => {
    expect(() =>
      validateConfig({ CORS_ORIGIN: "https://fillcart.com/api" })
    ).toThrow(/path/i);
  });

  it("rejects CORS origin with query parameters", () => {
    expect(() =>
      validateConfig({ CORS_ORIGIN: "https://fillcart.com?query=1" })
    ).toThrow(/query/i);
  });

  it("rejects CORS origin with hash fragment", () => {
    expect(() =>
      validateConfig({ CORS_ORIGIN: "https://fillcart.com#section" })
    ).toThrow(/hash/i);
  });

  it("rejects CORS origin with credentials", () => {
    expect(() =>
      validateConfig({ CORS_ORIGIN: "https://user:pass@fillcart.com" })
    ).toThrow(/credentials/i);
  });

  it("rejects wildcard CORS origin *", () => {
    expect(() => validateConfig({ CORS_ORIGIN: "*" })).toThrow(/wildcard/i);
  });

  it("rejects non-http/https protocols for CORS origin", () => {
    expect(() =>
      validateConfig({ CORS_ORIGIN: "ftp://files.fillcart.com" })
    ).toThrow(/protocol/i);
  });
});
