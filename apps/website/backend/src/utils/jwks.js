import crypto from "node:crypto";
import { env } from "../config/env.js";

let jwksCache = null;
let jwksCacheExpiresAt = 0;

/**
 * Resets the in-memory JWKS cache (useful in automated tests).
 */
export function clearJwksCache() {
  jwksCache = null;
  jwksCacheExpiresAt = 0;
}

/**
 * Overrides the cached keys directly (useful in unit/integration tests).
 */
export function setMockJwks(keys) {
  jwksCache = new Map();
  for (const k of keys) {
    try {
      const keyObj = crypto.createPublicKey({ key: k, format: "jwk" });
      jwksCache.set(k.kid, keyObj);
    } catch {
      // Ignore invalid test keys
    }
  }
  jwksCacheExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
}

/**
 * Fetches JSON Web Key Set from Central Auth and parses into a Map of CryptoKey objects.
 */
export async function fetchJwks(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && jwksCache && now < jwksCacheExpiresAt) {
    return jwksCache;
  }

  const url = `${env.CENTRAL_AUTH_URL}/.well-known/jwks.json`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch JWKS from Central Auth: HTTP ${response.status}`);
  }

  const data = await response.json();
  const keys = Array.isArray(data?.keys) ? data.keys : [];

  const map = new Map();
  for (const k of keys) {
    if (k.kty === "OKP" && k.crv === "Ed25519" && k.kid) {
      try {
        const keyObj = crypto.createPublicKey({ key: k, format: "jwk" });
        map.set(k.kid, keyObj);
      } catch (err) {
        // Skip malformed key
      }
    }
  }

  jwksCache = map;
  jwksCacheExpiresAt = now + env.JWKS_CACHE_TTL_MS;
  return jwksCache;
}

/**
 * Resolves an active public key by kid. Refetches once if kid is missing in cache.
 */
export async function getPublicKeyByKid(kid) {
  let cache = await fetchJwks(false);
  if (cache.has(kid)) {
    return cache.get(kid);
  }

  // Key miss: could be newly rotated key. Refetch once.
  cache = await fetchJwks(true);
  return cache.get(kid) || null;
}
