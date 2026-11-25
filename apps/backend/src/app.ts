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
import {
  createAdminAuthMiddleware,
  createRequireSettingsAccessMiddleware,
} from "./modules/admin/middleware/index.js";
import {
  AdminAuthService,
  StaffService,
} from "./modules/admin/services/index.js";
import {
  AdminAuthController,
  StaffController,
} from "./modules/admin/controllers/index.js";
import { createAdminRouter } from "./modules/admin/routes/index.js";
import { CategoriesService } from "./modules/admin/catalogue/services/categories.service.js";
import { BrandsService } from "./modules/admin/catalogue/services/brands.service.js";
import { ProductsService } from "./modules/admin/catalogue/services/products.service.js";
import { InventoryService } from "./modules/admin/catalogue/services/inventory.service.js";
import { CategoriesController } from "./modules/admin/catalogue/controllers/categories.controller.js";
import { BrandsController } from "./modules/admin/catalogue/controllers/brands.controller.js";
import { ProductsController } from "./modules/admin/catalogue/controllers/products.controller.js";
import { InventoryController } from "./modules/admin/catalogue/controllers/inventory.controller.js";
import { SettingsService } from "./modules/admin/settings/services/settings.service.js";
import { SettingsController } from "./modules/admin/settings/controllers/settings.controller.js";
import { AuditLogsService } from "./modules/admin/audit-logs/services/audit-logs.service.js";
import { AuditLogsController } from "./modules/admin/audit-logs/controllers/audit-logs.controller.js";
import { NotificationsService } from "./modules/admin/notifications/services/notifications.service.js";
import { NotificationsController } from "./modules/admin/notifications/controllers/notifications.controller.js";
import { SupportService } from "./modules/admin/support/services/support.service.js";
import { SupportController } from "./modules/admin/support/controllers/support.controller.js";
import { DashboardService } from "./modules/admin/dashboard/services/dashboard.service.js";
import { DashboardController } from "./modules/admin/dashboard/controllers/dashboard.controller.js";
import { VerificationService } from "./modules/admin/verification/services/verification.service.js";
import { VerificationController } from "./modules/admin/verification/controllers/verification.controller.js";
import { VendorsService } from "./modules/admin/vendors/services/vendors.service.js";
import { VendorsController } from "./modules/admin/vendors/controllers/vendors.controller.js";
import { RidersService } from "./modules/admin/riders/services/riders.service.js";
import { RidersController } from "./modules/admin/riders/controllers/riders.controller.js";
import { OrdersService } from "./modules/admin/orders/services/orders.service.js";
import { OrdersController } from "./modules/admin/orders/controllers/orders.controller.js";
import { FinanceService } from "./modules/admin/finance/services/finance.service.js";
import { FinanceController } from "./modules/admin/finance/controllers/finance.controller.js";
import { ReportsService } from "./modules/admin/reports/services/reports.service.js";
import { ReportsController } from "./modules/admin/reports/controllers/reports.controller.js";

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

  // ---------------------------------------------------------------------------
  // Super Admin Module Dependencies & Services
  // ---------------------------------------------------------------------------
  const adminAuthMiddleware = createAdminAuthMiddleware(prisma, cryptoService);
  const requireSettingsAccessMiddleware = createRequireSettingsAccessMiddleware(cryptoService);
  const adminAuthService = new AdminAuthService(prisma, cryptoService);
  const staffService = new StaffService(prisma, cryptoService);
  const adminAuthController = new AdminAuthController(adminAuthService);
  const staffController = new StaffController(staffService);

  const categoriesService = new CategoriesService(prisma);
  const brandsService = new BrandsService(prisma);
  const productsService = new ProductsService(prisma);
  const inventoryService = new InventoryService(prisma);
  const categoriesController = new CategoriesController(categoriesService);
  const brandsController = new BrandsController(brandsService);
  const productsController = new ProductsController(productsService);
  const inventoryController = new InventoryController(inventoryService);

  const settingsService = new SettingsService(prisma);
  const settingsController = new SettingsController(settingsService);

  const auditLogsService = new AuditLogsService(prisma);
  const auditLogsController = new AuditLogsController(auditLogsService);

  const notificationsService = new NotificationsService(prisma);
  const notificationsController = new NotificationsController(notificationsService);

  const supportService = new SupportService(prisma);
  const supportController = new SupportController(supportService);

  const dashboardService = new DashboardService(prisma);
  const dashboardController = new DashboardController(dashboardService);

  const verificationService = new VerificationService(prisma);
  const verificationController = new VerificationController(verificationService);

  const vendorsService = new VendorsService(prisma);
  const vendorsController = new VendorsController(vendorsService);

  const ridersService = new RidersService(prisma);
  const ridersController = new RidersController(ridersService);

  const ordersService = new OrdersService(prisma);
  const ordersController = new OrdersController(ordersService);

  const financeService = new FinanceService(prisma);
  const financeController = new FinanceController(financeService);

  const reportsService = new ReportsService(prisma);
  const reportsController = new ReportsController(reportsService);

  const adminRouter = createAdminRouter({
    adminAuthMiddleware,
    adminAuthController,
    staffController,
    categoriesController,
    brandsController,
    productsController,
    inventoryController,
    settingsController,
    auditLogsController,
    notificationsController,
    supportController,
    dashboardController,
    verificationController,
    vendorsController,
    ridersController,
    ordersController,
    financeController,
    reportsController,
    requireSettingsAccessMiddleware,
  });

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

  // Mount Super Admin module under /api/v1/admin
  v1Router.use("/admin", adminRouter);

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
