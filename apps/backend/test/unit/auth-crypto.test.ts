import { describe, it, expect, beforeEach } from "vitest";
import { CryptoService } from "../../src/modules/auth/services/crypto.service.js";
import { validateConfig } from "../../src/config/env.js";

describe("Milestone 2.1 — CryptoService Unit Tests", () => {
  let cryptoService: CryptoService;

  beforeEach(() => {
    const config = validateConfig({
      JWT_ISSUER_URL: "https://auth.fillcart.internal",
      JWT_ACTIVE_KID: "k-test-1",
      JWT_REVOKED_KIDS: "k-revoked-bad",
    });
    cryptoService = new CryptoService(config);
  });

  it("generates JWKS matching RFC 8037 format", () => {
    const jwks = cryptoService.getJwks();
    expect(jwks).toBeDefined();
    expect(jwks.keys).toBeInstanceOf(Array);
    expect(jwks.keys.length).toBeGreaterThanOrEqual(1);

    const activeKey = jwks.keys.find((k) => k.kid === "k-test-1");
    expect(activeKey).toBeDefined();
    expect(activeKey?.kty).toBe("OKP");
    expect(activeKey?.crv).toBe("Ed25519");
    expect(activeKey?.alg).toBe("EdDSA");
    expect(activeKey?.x).toBeDefined();
  });

  it("signs and verifies an Ed25519 compact JWT", () => {
    const payload = {
      sub: "123e4567-e89b-12d3-a456-426614174000",
      iss: "https://auth.fillcart.internal",
      aud: "customer-backend",
      exp: Math.floor(Date.now() / 1000) + 900,
      token_use: "access",
    };

    const token = cryptoService.signJwt(payload);
    expect(token.split(".")).toHaveLength(3);

    const decoded = cryptoService.verifyJwt<{ sub: string; aud: string }>(token, {
      expectedAudience: "customer-backend",
    });

    expect(decoded.sub).toBe("123e4567-e89b-12d3-a456-426614174000");
    expect(decoded.aud).toBe("customer-backend");
  });

  it("fails verification on tampered JWT payload", () => {
    const payload = { sub: "user-1", exp: Math.floor(Date.now() / 1000) + 900 };
    const token = cryptoService.signJwt(payload);
    const [h, p, s] = token.split(".");

    const tamperedPayload = Buffer.from(JSON.stringify({ sub: "attacker", exp: payload.exp })).toString("base64url");
    const tamperedJwt = `${h}.${tamperedPayload}.${s}`;

    expect(() => cryptoService.verifyJwt(tamperedJwt)).toThrowError(/Invalid token signature/);
  });

  it("rejects token signed with revoked key", () => {
    expect(() => cryptoService.signJwt({ sub: "user-1" }, "k-revoked-bad")).toThrowError(
      /Cannot sign with a revoked key ID/
    );
  });

  it("enforces audience check and throws AUDIENCE_MISMATCH on mismatch", () => {
    const token = cryptoService.signJwt({
      sub: "user-1",
      aud: "vendor-backend",
      exp: Math.floor(Date.now() / 1000) + 900,
    });

    expect(() =>
      cryptoService.verifyJwt(token, { expectedAudience: "customer-backend" })
    ).toThrowError(/Token audience mismatch/);
  });
});
