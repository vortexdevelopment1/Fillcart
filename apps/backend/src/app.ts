import express, { Router, type Express } from "express";
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
import { createReadyRouter } from "./routes/ready.routes.js";

/**
 * Express application factory.
 * Configures middleware, liveness probes, readiness probes, and error handling.
 */
export function createApp(config: AppConfig): Express {
  const app = express();

  // 1. Request ID Middleware
  app.use(requestIdMiddleware);

  // 2. Structured Pino HTTP Logging
  app.use(createLoggingMiddleware(config));

  // 3. Helmet Security Middleware
  app.use(createSecurityMiddleware());

  // 4. CORS Middleware
  app.use(createCorsMiddleware(config));

  // 5. Body Parsers with limits
  app.use(express.json({ limit: "100kb" }));
  app.use(express.urlencoded({ extended: true, limit: "100kb" }));

  // 6. Probes & Routes
  // Root Liveness: GET /health
  app.use("/health", healthRouter);

  // Root Readiness: GET /health/ready
  const readyRouter = createReadyRouter(config);
  app.use("/health/ready", readyRouter);

  // Versioned API routes under /api/v1
  const v1Router = Router();
  v1Router.use("/health/ready", readyRouter);
  v1Router.use("/health", healthRouter);
  app.use("/api/v1", v1Router);

  // 7. Not Found 404 Catch-All
  app.use(notFoundHandler);

  // 8. Central Error Handler
  app.use(errorHandler);

  return app;
}
