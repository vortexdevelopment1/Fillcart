import cors from "cors";
import type { RequestHandler } from "express";
import type { AppConfig } from "../config/env.schema.js";

/**
 * Creates CORS middleware configured with the validated origins.
 */
export function createCorsMiddleware(config: AppConfig): RequestHandler {
  const allowedOrigins = new Set(config.CORS_ORIGIN);

  return cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (e.g. mobile apps, curl, server-to-server) with no origin header
      if (!origin) {
        callback(null, true);
        return;
      }

      // Check against validated allowlist
      if (allowedOrigins.has(origin)) {
        callback(null, true);
      } else {
        // Disallow: do not return Access-Control-Allow-Origin header
        callback(null, false);
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-request-id"],
    credentials: true,
  });
}
