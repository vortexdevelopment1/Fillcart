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
    expect(config.DATABASE_URL).toBe(
      "postgresql://fillcart_user:fillcart_pass@127.0.0.1:5432/fillcart?schema=public"
    );
  });

  it("accepts custom valid PORT, HOST, NODE_ENV, and LOG_LEVEL", () => {
    const config = validateConfig({
      PORT: "8080",
      HOST: "0.0.0.0",
      NODE_ENV: "production",
      LOG_LEVEL: "warn",
      CORS_ORIGIN: "https://admin.fillcart.com",
      DATABASE_URL:
        "postgresql://prod_user:secret@db.internal:5432/fillcart_prod",
    });
    expect(config.PORT).toBe(8080);
    expect(config.HOST).toBe("0.0.0.0");
    expect(config.NODE_ENV).toBe("production");
    expect(config.LOG_LEVEL).toBe("warn");
    expect(config.CORS_ORIGIN).toEqual(["https://admin.fillcart.com"]);
    expect(config.DATABASE_URL).toBe(
      "postgresql://prod_user:secret@db.internal:5432/fillcart_prod"
    );
  });

  it("validates DATABASE_URL with postgresql:// and postgres:// protocols", () => {
    const config1 = validateConfig({
      DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
    });
    expect(config1.DATABASE_URL).toBe(
      "postgresql://user:pass@localhost:5432/db"
    );

    const config2 = validateConfig({
      DATABASE_URL: "postgres://user:pass@localhost:5432/db",
    });
    expect(config2.DATABASE_URL).toBe("postgres://user:pass@localhost:5432/db");
  });

  it("rejects invalid DATABASE_URL scheme", () => {
    expect(() =>
      validateConfig({ DATABASE_URL: "mysql://user:pass@localhost:3306/db" })
    ).toThrow(/DATABASE_URL/i);

    expect(() =>
      validateConfig({ DATABASE_URL: "mongodb://localhost:27017/db" })
    ).toThrow(/DATABASE_URL/i);
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
