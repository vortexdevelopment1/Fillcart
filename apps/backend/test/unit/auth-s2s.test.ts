import { describe, it, expect, beforeEach } from "vitest";
import { CryptoService } from "../../src/modules/auth/services/crypto.service.js";
import { S2SService } from "../../src/modules/auth/services/s2s.service.js";
import { validateConfig } from "../../src/config/env.js";
import crypto from "node:crypto";

describe("Milestone 2.1 — S2SService Unit Tests", () => {
  let cryptoService: CryptoService;
  let serviceKeyPair: { privateKeyPem: string; publicKeyPem: string };

  beforeEach(() => {
    const config = validateConfig({
      JWT_ISSUER_URL: "https://auth.fillcart.internal",
      JWT_ACTIVE_KID: "k-test-1",
    });
    cryptoService = new CryptoService(config);

    const { privateKey, publicKey } = crypto.generateKeyPairSync("ed25519");
    serviceKeyPair = {
      privateKeyPem: privateKey.export({ type: "pkcs8", format: "pem" }) as string,
      publicKeyPem: publicKey.export({ type: "spki", format: "pem" }) as string,
    };
  });

  it("mints and formats a valid S2S assertion token", () => {
    const assertion = S2SService.mintServiceAssertion({
      serviceIdentifier: "customer-backend",
      privateKeyPem: serviceKeyPair.privateKeyPem,
      kid: "s2s-key-1",
      expiresInSec: 60,
    });

    expect(assertion).toBeDefined();
    const parts = assertion.split(".");
    expect(parts).toHaveLength(3);

    const header = JSON.parse(Buffer.from(parts[0]!, "base64url").toString());
    const claims = JSON.parse(Buffer.from(parts[1]!, "base64url").toString());

    expect(header.alg).toBe("EdDSA");
    expect(header.kid).toBe("s2s-key-1");
    expect(claims.iss).toBe("customer-backend");
    expect(claims.sub).toBe("customer-backend");
    expect(claims.aud).toBe("central-auth");
    expect(claims.exp - claims.iat).toBe(60);
  });
});
