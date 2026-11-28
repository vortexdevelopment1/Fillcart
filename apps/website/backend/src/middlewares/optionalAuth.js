import { requireAuth } from "./requireAuth.js";

/**
 * Optional authentication middleware.
 * If Authorization header is provided, verifies token and populates req.user.
 * If absent, gracefully proceeds as unauthenticated (req.user = undefined).
 */
export async function optionalAuth(req, res, next) {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader || typeof authHeader !== "string") {
    return next();
  }

  // If header exists, execute requireAuth
  return requireAuth(req, res, next);
}
