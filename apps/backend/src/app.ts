import express, { type Express } from "express";
import { type AppConfig } from "./config/env.schema.js";
import {
  requestIdMiddleware,
  createLoggingMiddleware,
  createCorsMiddleware,
  createSecurityMiddleware,
  notFoundHandler,
  errorHandler,
} from "./middleware/index.js";
import { healthRouter } from "./routes/health.routes.js";
import { v1Router } from "./routes/index.js";

/**
 * Express application factory.
 * Creates and configures the Express app with middleware and routes,
 * but does not bind to a network port (ideal for testing).
 */
export function createApp(config: AppConfig): Express {
  const app = express();

  // 1. Request ID Middleware (strict UUID inspection & assignment)
  app.use(requestIdMiddleware);

  // 2. Structured Pino HTTP Logging (using assigned req.id and redaction)
  app.use(createLoggingMiddleware(config));

  // 3. Helmet Security Middleware
  app.use(createSecurityMiddleware());

  // 4. CORS Middleware (strictly validated origins)
  app.use(createCorsMiddleware(config));

  // 5. Body Parsers with limits
  app.use(express.json({ limit: "100kb" }));
  app.use(express.urlencoded({ extended: true, limit: "100kb" }));

  // 6. Routes
  // Root liveness check: GET /health
  app.use("/health", healthRouter);

  // Versioned API routes: /api/v1 (e.g. GET /api/v1/health)
  app.use("/api/v1", v1Router);

  // 7. Not Found 404 Catch-All
  app.use(notFoundHandler);

  // 8. Central Error Handler (400 validation vs 500 internal mapping)
  app.use(errorHandler);

  return app;
}
