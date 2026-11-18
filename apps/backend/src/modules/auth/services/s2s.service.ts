import crypto from "node:crypto";
import type { PrismaClient } from "../../../database/generated/client/client.js";
import { CryptoService } from "./crypto.service.js";
import { UnauthorizedError, ForbiddenError } from "../../../errors/app-error.js";
import { ERROR_CODES } from "../../../constants/error-codes.js";
import type { ServiceAssertionClaims } from "@fillcart/shared-types";

export class S2SService {
  constructor(private prisma: PrismaClient, private cryptoService: CryptoService) {}

  /**
   * Authenticates an asymmetric Ed25519 Service-to-Service assertion token.
   * Enforces:
   * 1. Header kid lookup against active ServicePublicKey.
   * 2. iss === sub === registered serviceIdentifier.
   * 3. aud === "central-auth".
   * 4. Lifetime <= 60 seconds.
   * 5. 5-second clock skew.
   * 6. Durable conflict-safe replay protection via ServiceTokenReplay (ON CONFLICT DO NOTHING).
   * 7. Required scope authorization.
   */
  public async authenticateServiceAssertion(
    serviceJwt: string,
    requiredScope?: string
  ): Promise<{ serviceClientId: string; serviceIdentifier: string; scopes: string[] }> {
    if (!serviceJwt || typeof serviceJwt !== "string") {
      throw new UnauthorizedError("Missing service authorization header", ERROR_CODES.UNAUTHORIZED);
    }

    const parts = serviceJwt.split(".");
    if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) {
      throw new UnauthorizedError("Malformed service token", ERROR_CODES.INVALID_TOKEN);
    }

    let header: { alg?: string; kid?: string };
    let claims: ServiceAssertionClaims;

    try {
      header = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
      claims = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
    } catch {
      throw new UnauthorizedError("Failed to parse service token header or claims", ERROR_CODES.INVALID_TOKEN);
    }

    if (header.alg !== "EdDSA") {
      throw new UnauthorizedError("Prohibited or unsupported service token algorithm", ERROR_CODES.INVALID_TOKEN);
    }

    if (!header.kid) {
      throw new UnauthorizedError("Missing kid in service token header", ERROR_CODES.INVALID_TOKEN);
    }

    if (!claims.iss || !claims.sub || claims.iss !== claims.sub) {
      throw new UnauthorizedError("Service token issuer and subject must match", ERROR_CODES.INVALID_SERVICE_ASSERTION);
    }

    if (claims.aud !== "central-auth") {
      throw new UnauthorizedError("Service token audience must be 'central-auth'", ERROR_CODES.AUDIENCE_MISMATCH);
    }

    const nowSec = Math.floor(Date.now() / 1000);
    const clockSkewSec = 5;

    if (claims.exp - claims.iat > 60 + clockSkewSec) {
      throw new UnauthorizedError("Service token lifetime cannot exceed 60 seconds", ERROR_CODES.INVALID_SERVICE_ASSERTION);
    }

    if (nowSec - clockSkewSec > claims.exp) {
      throw new UnauthorizedError("Service token has expired", ERROR_CODES.TOKEN_EXPIRED);
    }

    if (nowSec + clockSkewSec < claims.nbf) {
      throw new UnauthorizedError("Service token not yet valid", ERROR_CODES.INVALID_TOKEN);
    }

    // 1. Fetch ServiceClient & matching ServicePublicKey from database
    const serviceClient = await this.prisma.serviceClient.findUnique({
      where: { serviceIdentifier: claims.iss },
      include: {
        publicKeys: {
          where: { keyId: header.kid, isRevoked: false },
        },
      },
    });

    if (!serviceClient) {
      throw new UnauthorizedError(`Unknown service identifier: ${claims.iss}`, ERROR_CODES.INVALID_SERVICE_ASSERTION);
    }

    if (serviceClient.status !== "ACTIVE") {
      throw new ForbiddenError(`Service client is ${serviceClient.status}`, ERROR_CODES.INACTIVE_SERVICE);
    }

    const activeKey = serviceClient.publicKeys[0];
    if (!activeKey) {
      throw new UnauthorizedError(
        `Active public key with kid '${header.kid}' not registered to service '${claims.iss}'`,
        ERROR_CODES.INVALID_SERVICE_ASSERTION
      );
    }

    if (new Date() > activeKey.expiresAt) {
      throw new UnauthorizedError("Service public key has expired", ERROR_CODES.INVALID_SERVICE_ASSERTION);
    }

    // 2. Cryptographic signature verification with registered SPKI PEM
    try {
      const pubKeyObject = crypto.createPublicKey(activeKey.publicKeyPem);
      const signingInput = Buffer.from(`${parts[0]}.${parts[1]}`);
      const sigBuffer = Buffer.from(parts[2], "base64url");
      const isValid = crypto.verify(null, signingInput, pubKeyObject, sigBuffer);

      if (!isValid) {
        throw new UnauthorizedError("Invalid service token signature", ERROR_CODES.INVALID_TOKEN);
      }
    } catch (err) {
      throw new UnauthorizedError(
        `Service cryptographic verification failed: ${(err as Error).message}`,
        ERROR_CODES.INVALID_TOKEN
      );
    }

    // 3. Conflict-safe durable replay protection via ServiceTokenReplay
    const replayId = crypto.randomUUID();
    const replayExpiresAt = new Date(claims.exp * 1000 + 300 * 1000); // exp + 300s TTL buffer

    const insertedRows = await this.prisma.$queryRawUnsafe<Array<{ id: string }>>(
      `INSERT INTO "ServiceTokenReplay" ("id", "serviceClientId", "jti", "expiresAt", "consumedAt")
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT ("serviceClientId", "jti") DO NOTHING
       RETURNING "id"`,
      replayId,
      serviceClient.id,
      claims.jti,
      replayExpiresAt
    );

    if (insertedRows.length === 0) {
      throw new UnauthorizedError(
        "Service token replay detected. Assertion token has already been consumed.",
        ERROR_CODES.TOKEN_REPLAY_DETECTED
      );
    }

    // 4. Scope authorization check
    if (requiredScope) {
      if (!serviceClient.allowedScopes.includes(requiredScope)) {
        throw new ForbiddenError(
          `Service client '${serviceClient.serviceIdentifier}' lacks required scope '${requiredScope}'`,
          ERROR_CODES.INSUFFICIENT_SCOPE
        );
      }
    }

    return {
      serviceClientId: serviceClient.id,
      serviceIdentifier: serviceClient.serviceIdentifier,
      scopes: serviceClient.allowedScopes,
    };
  }

  /**
   * Helper to mint S2S assertion tokens (used by tests and client libraries).
   */
  public static mintServiceAssertion(params: {
    serviceIdentifier: string;
    privateKeyPem: string;
    kid: string;
    jti?: string;
    expiresInSec?: number;
  }): string {
    const nowSec = Math.floor(Date.now() / 1000);
    const expSec = nowSec + (params.expiresInSec ?? 60);
    const jti = params.jti ?? crypto.randomUUID();

    const header = {
      alg: "EdDSA",
      typ: "JWT",
      kid: params.kid,
    };

    const claims: ServiceAssertionClaims = {
      iss: params.serviceIdentifier,
      sub: params.serviceIdentifier,
      aud: "central-auth",
      iat: nowSec,
      nbf: nowSec,
      exp: expSec,
      jti,
    };

    const hB64 = Buffer.from(JSON.stringify(header)).toString("base64url");
    const pB64 = Buffer.from(JSON.stringify(claims)).toString("base64url");
    const privKey = crypto.createPrivateKey(params.privateKeyPem);
    const sig = crypto.sign(null, Buffer.from(`${hB64}.${pB64}`), privKey).toString("base64url");

    return `${hB64}.${pB64}.${sig}`;
  }
}
