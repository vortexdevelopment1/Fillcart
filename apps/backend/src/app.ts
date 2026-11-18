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
import { validateRequest } from "./middleware/validate-request.js";
import { verifySessionRequestSchema } from "@fillcart/validations";
import { healthRouter } from "./routes/health.routes.js";
import { createReadyRouter } from "./routes/ready.routes.js";
import { getPrismaClient } from "./database/index.js";
import {
  CryptoService,
  IdentityService,
  SessionService,
  OtpService,
  S2SService,
  LiveVerificationService,
  AccountLinkingService,
} from "./modules/auth/services/index.js";
import { AuthController } from "./modules/auth/controllers/auth.controller.js";
import { createAuthRouter } from "./modules/auth/routes/auth.routes.js";

/**
 * Express application factory.
 * Configures middleware, Central Auth modular routes, liveness/readiness probes, and error handling.
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

  // ---------------------------------------------------------------------------
  // Central Auth Dependencies & Services
  // ---------------------------------------------------------------------------
  const prisma = getPrismaClient(config);
  const cryptoService = new CryptoService(config);
  const sessionService = new SessionService(prisma, cryptoService, config.JWT_ISSUER_URL);
  const identityService = new IdentityService(prisma, sessionService);
  const otpService = new OtpService(
    prisma,
    config.OTP_HMAC_SECRET,
    config.MSG91_AUTH_KEY,
    config.MSG91_TEMPLATE_ID,
    config.MSG91_BASE_URL
  );
  const s2sService = new S2SService(prisma, cryptoService);
  const liveVerificationService = new LiveVerificationService(prisma, cryptoService, s2sService);
  const accountLinkingService = new AccountLinkingService(prisma, sessionService);

  const authController = new AuthController(
    cryptoService,
    identityService,
    sessionService,
    otpService,
    liveVerificationService,
    accountLinkingService
  );

  // 6. Root Endpoints & Well-Known
  // GET /.well-known/jwks.json
  app.get("/.well-known/jwks.json", authController.getJwks);

  // Root Liveness: GET /health
  app.use("/health", healthRouter);

  // Root Readiness: GET /health/ready
  const readyRouter = createReadyRouter(config);
  app.use("/health/ready", readyRouter);

  // 7. Versioned API Routes under /api/v1
  const v1Router = Router();
  v1Router.use("/health/ready", readyRouter);
  v1Router.use("/health", healthRouter);

  // Mount Public Central Auth module under /api/v1/auth
  const authRouter = createAuthRouter(authController);
  v1Router.use("/auth", authRouter);

  // Canonical S2S Internal Live Verification Endpoint:
  // POST /api/v1/internal/auth/verify-session
  const internalAuthRouter = Router();
  internalAuthRouter.post(
    "/verify-session",
    validateRequest({ body: verifySessionRequestSchema }),
    authController.verifySession
  );
  v1Router.use("/internal/auth", internalAuthRouter);

  app.use("/api/v1", v1Router);

  // 8. Not Found 404 Catch-All
  app.use(notFoundHandler);

  // 9. Central Error Handler
  app.use(errorHandler);

  return app;
}
