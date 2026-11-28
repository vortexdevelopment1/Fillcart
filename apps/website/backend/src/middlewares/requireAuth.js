import crypto from "node:crypto";
import { env } from "../config/env.js";
import { getPublicKeyByKid } from "../utils/jwks.js";

/**
 * Middleware that authenticates incoming requests using Central Auth's asymmetric Ed25519 JWT.
 * Implements Tier 1 stateless local JWKS verification as defined in AUTH_INTEGRATION_NOTES.md.
 */
export async function requireAuth(req, res, next) {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];

  if (!authHeader || typeof authHeader !== "string") {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHENTICATED",
        message: "Missing Authorization header",
      },
    });
  }

  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match || !match[1]) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHENTICATED",
        message: "Authorization header must use Bearer scheme",
      },
    });
  }

  const compactJwt = match[1].trim();
  const parts = compactJwt.split(".");
  if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHENTICATED",
        message: "Malformed JWT structure",
      },
    });
  }

  const [headerB64, payloadB64, signatureB64] = parts;

  let header;
  let payload;
  try {
    header = JSON.parse(Buffer.from(headerB64, "base64url").toString("utf8"));
    payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
  } catch {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHENTICATED",
        message: "Malformed JWT encoding",
      },
    });
  }

  // 1. Algorithm check: strictly EdDSA
  if (header.alg !== "EdDSA") {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHENTICATED",
        message: `Unsupported algorithm: ${header.alg}. Expected EdDSA`,
      },
    });
  }

  if (!header.kid) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHENTICATED",
        message: "Missing kid in token header",
      },
    });
  }

  // 2. Fetch public key from JWKS
  let publicKey;
  try {
    publicKey = await getPublicKeyByKid(header.kid);
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHENTICATED",
        message: "Unable to verify token at this time",
      },
    });
  }

  if (!publicKey) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHENTICATED",
        message: `Unknown or revoked key id: ${header.kid}`,
      },
    });
  }

  // 3. Cryptographic signature check
  try {
    const signingInput = Buffer.from(`${headerB64}.${payloadB64}`);
    const signature = Buffer.from(signatureB64, "base64url");
    const isValid = crypto.verify(null, signingInput, publicKey, signature);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHENTICATED",
          message: "Invalid token signature",
        },
      });
    }
  } catch {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHENTICATED",
        message: "Token verification failed",
      },
    });
  }

  // 4. Validate timing claims (with 5-second clock skew)
  const nowSec = Math.floor(Date.now() / 1000);
  const clockSkewSec = 5;

  if (typeof payload.exp === "number" && nowSec - clockSkewSec > payload.exp) {
    return res.status(401).json({
      success: false,
      error: {
        code: "TOKEN_EXPIRED",
        message: "Token has expired",
      },
    });
  }

  if (typeof payload.nbf === "number" && nowSec + clockSkewSec < payload.nbf) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHENTICATED",
        message: "Token is not yet active",
      },
    });
  }

  // 5. Validate Issuer
  if (payload.iss && payload.iss !== env.CENTRAL_AUTH_ISSUER) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHENTICATED",
        message: "Token issuer mismatch",
      },
    });
  }

  // 6. Validate Audience (strictly customer-backend)
  const aud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!aud.includes(env.CENTRAL_AUTH_AUDIENCE)) {
    return res.status(403).json({
      success: false,
      error: {
        code: "FORBIDDEN",
        message: "Token audience mismatch: access denied",
      },
    });
  }

  // 7. Validate token purpose
  if (payload.token_use !== "access") {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHENTICATED",
        message: "Invalid token purpose",
      },
    });
  }

  // 8. Validate Account Type (strictly CUSTOMER)
  if (payload.account_type !== "CUSTOMER") {
    return res.status(403).json({
      success: false,
      error: {
        code: "FORBIDDEN",
        message: "Access restricted to customer accounts",
      },
    });
  }

  // 9. Validate Account Status (must be ACTIVE)
  if (payload.account_status !== "ACTIVE") {
    return res.status(403).json({
      success: false,
      error: {
        code: "FORBIDDEN",
        message: "Account is not active",
      },
    });
  }

  // 10. Populate req.user context
  req.user = {
    id: payload.sub,
    sessionId: payload.session_id,
    accountType: payload.account_type,
    accountStatus: payload.account_status,
    role: payload.role || "CUSTOMER",
    permissions: Array.isArray(payload.permissions) ? payload.permissions : [],
  };

  next();
}
