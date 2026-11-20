import crypto from "node:crypto";
import { UnauthorizedError, ForbiddenError, InternalServerError } from "../../../errors/app-error.js";
import { ERROR_CODES } from "../../../constants/error-codes.js";
import type { AppConfig } from "../../../config/env.schema.js";
import type { JwksResponse, JwkPublicKey } from "@fillcart/shared-types";

export interface KeyPairConfig {
  kid: string;
  privateKeyPem: string;
  publicKeyPem: string;
}

export class CryptoService {
  private activeKid: string;
  private activePrivateKey: crypto.KeyObject;
  private activePublicKey: crypto.KeyObject;
  private activePublicKeyPem: string;
  private retiredKeys: Map<string, { key: crypto.KeyObject; pem: string }>;
  private revokedKids: Set<string>;
  private issuer: string;

  constructor(config: AppConfig) {
    this.issuer = config.JWT_ISSUER_URL;
    this.activeKid = config.JWT_ACTIVE_KID;
    this.revokedKids = new Set(config.JWT_REVOKED_KIDS);
    this.retiredKeys = new Map();

    if (config.JWT_ACTIVE_PRIVATE_KEY_PEM && config.JWT_ACTIVE_PUBLIC_KEY_PEM) {
      try {
        this.activePrivateKey = crypto.createPrivateKey(config.JWT_ACTIVE_PRIVATE_KEY_PEM);
        this.activePublicKey = crypto.createPublicKey(config.JWT_ACTIVE_PUBLIC_KEY_PEM);
        this.activePublicKeyPem = config.JWT_ACTIVE_PUBLIC_KEY_PEM;
      } catch (err) {
        throw new InternalServerError(`Failed to parse configured Ed25519 PEM keys: ${(err as Error).message}`);
      }
    } else {
      // Auto-generate ephemeral Ed25519 keypair for development/testing if omitted
      const { privateKey, publicKey } = crypto.generateKeyPairSync("ed25519");
      this.activePrivateKey = privateKey;
      this.activePublicKey = publicKey;
      this.activePublicKeyPem = publicKey.export({ type: "spki", format: "pem" }) as string;
    }

    // Load retired keys for verification
    if (config.JWT_RETIRED_PUBLIC_KEYS) {
      for (const item of config.JWT_RETIRED_PUBLIC_KEYS) {
        try {
          const keyObj = crypto.createPublicKey(item.publicKeyPem);
          this.retiredKeys.set(item.kid, { key: keyObj, pem: item.publicKeyPem });
        } catch {
          // ignore or log malformed retired key
        }
      }
    }
  }

  public getActiveKid(): string {
    return this.activeKid;
  }

  public getJwks(): JwksResponse {
    const keys: JwkPublicKey[] = [];

    // Export active key
    const activeJwk = this.activePublicKey.export({ format: "jwk" }) as { x: string };
    keys.push({
      kty: "OKP",
      crv: "Ed25519",
      x: activeJwk.x,
      kid: this.activeKid,
      use: "sig",
      alg: "EdDSA",
    });

    // Export retired keys (excluding any that are revoked)
    for (const [kid, { key }] of this.retiredKeys.entries()) {
      if (this.revokedKids.has(kid)) continue;
      const jwk = key.export({ format: "jwk" }) as { x: string };
      keys.push({
        kty: "OKP",
        crv: "Ed25519",
        x: jwk.x,
        kid,
        use: "sig",
        alg: "EdDSA",
      });
    }

    return { keys };
  }

  public signJwt(payload: Record<string, unknown>, kid?: string): string {
    const signingKid = kid || this.activeKid;
    if (this.revokedKids.has(signingKid)) {
      throw new ForbiddenError("Cannot sign with a revoked key ID", ERROR_CODES.REVOKED_KEY);
    }

    const header = {
      alg: "EdDSA",
      typ: "JWT",
      kid: signingKid,
    };

    const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signingInput = Buffer.from(`${encodedHeader}.${encodedPayload}`);

    const signature = crypto.sign(null, signingInput, this.activePrivateKey).toString("base64url");
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  public verifyJwt<T = Record<string, unknown>>(
    compactJwt: string,
    options?: { expectedAudience?: string | string[]; customPublicKey?: crypto.KeyObject }
  ): T {
    if (!compactJwt || typeof compactJwt !== "string") {
      throw new UnauthorizedError("JWT string must be provided", ERROR_CODES.INVALID_TOKEN);
    }

    const parts = compactJwt.split(".");
    if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) {
      throw new UnauthorizedError("Malformed JWT structure", ERROR_CODES.INVALID_TOKEN);
    }

    const [headerB64, payloadB64, signatureB64] = parts;

    let header: { alg?: string; typ?: string; kid?: string };
    let payload: Record<string, unknown>;

    try {
      header = JSON.parse(Buffer.from(headerB64, "base64url").toString("utf8"));
      payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
    } catch {
      throw new UnauthorizedError("Malformed JWT header or payload encoding", ERROR_CODES.INVALID_TOKEN);
    }

    // 1. Algorithm Allowlist
    if (header.alg !== "EdDSA") {
      throw new UnauthorizedError(`Unsupported or prohibited algorithm: ${header.alg}`, ERROR_CODES.INVALID_TOKEN);
    }

    // 2. Resolve Public Key
    let verificationKey: crypto.KeyObject;
    if (options?.customPublicKey) {
      verificationKey = options.customPublicKey;
    } else {
      const kid = header.kid;
      if (!kid) {
        throw new UnauthorizedError("Missing kid in JWT header", ERROR_CODES.INVALID_TOKEN);
      }

      if (this.revokedKids.has(kid)) {
        throw new UnauthorizedError(`Key ${kid} has been revoked`, ERROR_CODES.REVOKED_KEY);
      }

      if (kid === this.activeKid) {
        verificationKey = this.activePublicKey;
      } else if (this.retiredKeys.has(kid)) {
        verificationKey = this.retiredKeys.get(kid)!.key;
      } else {
        throw new UnauthorizedError(`Unknown key ID: ${kid}`, ERROR_CODES.UNKNOWN_KEY);
      }
    }

    // 3. Verify Signature
    const signingInput = Buffer.from(`${headerB64}.${payloadB64}`);
    const signature = Buffer.from(signatureB64, "base64url");
    const isValid = crypto.verify(null, signingInput, verificationKey, signature);

    if (!isValid) {
      throw new UnauthorizedError("Invalid token signature", ERROR_CODES.INVALID_TOKEN);
    }

    // 4. Validate Claims
    const nowSec = Math.floor(Date.now() / 1000);
    const clockSkewSec = 5;

    // Issuer
    if (payload.iss && payload.iss !== this.issuer) {
      throw new UnauthorizedError(`Invalid token issuer: ${payload.iss}`, ERROR_CODES.INVALID_TOKEN);
    }

    // Expiration
    if (typeof payload.exp === "number") {
      if (nowSec - clockSkewSec > payload.exp) {
        throw new UnauthorizedError("Token has expired", ERROR_CODES.TOKEN_EXPIRED);
      }
    }

    // Not Before
    if (typeof payload.nbf === "number") {
      if (nowSec + clockSkewSec < payload.nbf) {
        throw new UnauthorizedError("Token not yet valid (nbf violation)", ERROR_CODES.INVALID_TOKEN);
      }
    }

    // Audience
    if (options?.expectedAudience) {
      const expected = Array.isArray(options.expectedAudience)
        ? options.expectedAudience
        : [options.expectedAudience];
      const aud = payload.aud as string | string[] | undefined;
      const tokenAudiences = Array.isArray(aud) ? aud : aud ? [aud] : [];

      const matches = expected.some((e) => tokenAudiences.includes(e));
      if (!matches) {
        throw new UnauthorizedError(
          `Token audience mismatch. Expected one of [${expected.join(", ")}], got [${tokenAudiences.join(", ")}]`,
          ERROR_CODES.AUDIENCE_MISMATCH
        );
      }
    }

    return payload as T;
  }

  public hashOpaqueToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  public generateRandomBytesHex(length = 32): string {
    return crypto.randomBytes(length).toString("hex");
  }
}
