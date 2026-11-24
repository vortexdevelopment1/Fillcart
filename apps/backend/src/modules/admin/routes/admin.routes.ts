import { Router } from "express";
import type { RequestHandler } from "express";
import type { AdminAuthController } from "../controllers/admin-auth.controller.js";
import type { StaffController } from "../controllers/staff.controller.js";
import type { CategoriesController } from "../catalogue/controllers/categories.controller.js";
import type { BrandsController } from "../catalogue/controllers/brands.controller.js";
import type { ProductsController } from "../catalogue/controllers/products.controller.js";
import type { InventoryController } from "../catalogue/controllers/inventory.controller.js";
import type { SettingsController } from "../settings/controllers/settings.controller.js";
import type { AuditLogsController } from "../audit-logs/controllers/audit-logs.controller.js";
import { createCatalogueRouter } from "../catalogue/routes/catalogue.routes.js";
import { createSettingsRouter } from "../settings/routes/settings.routes.js";
import { createAuditLogsRouter } from "../audit-logs/routes/audit-logs.routes.js";
import { validateRequest } from "../../../middleware/validate-request.js";
import { requirePermission } from "../middleware/admin-auth.middleware.js";
import {
  verifySettingsAccessSchema,
  getStaffQuerySchema,
  inviteStaffSchema,
  updateStaffStatusSchema,
} from "@fillcart/validations";

export interface AdminRouterDependencies {
  adminAuthMiddleware: RequestHandler;
  adminAuthController: AdminAuthController;
  staffController: StaffController;
  categoriesController: CategoriesController;
  brandsController: BrandsController;
  productsController: ProductsController;
  inventoryController: InventoryController;
  settingsController: SettingsController;
  auditLogsController: AuditLogsController;
  requireSettingsAccessMiddleware: RequestHandler;
}

export function createAdminRouter(deps: AdminRouterDependencies): Router {
  const router = Router();

  // 1. Apply ONE adminAuth middleware across all admin routes
  router.use(deps.adminAuthMiddleware);

  // 2. Sensitive Settings Re-Authentication
  // POST /api/v1/admin/auth/verify-settings-access
  router.post(
    "/auth/verify-settings-access",
    validateRequest({ body: verifySettingsAccessSchema }),
    deps.adminAuthController.verifySettingsAccess
  );

  // 3. Admin Roles & Permission Profiles Matrix (Read-Only)
  // GET /api/v1/admin/roles
  router.get(
    "/roles",
    requirePermission("staff", "view"),
    deps.staffController.getRoles
  );

  // 4. Admin Staff Directory (Paginated & Filterable)
  // GET /api/v1/admin/staff
  router.get(
    "/staff",
    requirePermission("staff", "view"),
    validateRequest({ query: getStaffQuerySchema }),
    deps.staffController.getStaff
  );

  // 5. Invite New Admin Staff Member
  // POST /api/v1/admin/staff/invite
  router.post(
    "/staff/invite",
    requirePermission("staff", "manage"),
    validateRequest({ body: inviteStaffSchema }),
    deps.staffController.inviteStaff
  );

  // 6. Update Admin Staff Status (Activate / Deactivate / Suspend)
  // PATCH /api/v1/admin/staff/:id/status
  router.patch(
    "/staff/:id/status",
    requirePermission("staff", "manage"),
    validateRequest({ body: updateStaffStatusSchema }),
    deps.staffController.updateStaffStatus
  );

  // 7. Mount Catalogue Sub-Module (Categories, Brands, Products, Inventory)
  const catalogueRouter = createCatalogueRouter({
    categoriesController: deps.categoriesController,
    brandsController: deps.brandsController,
    productsController: deps.productsController,
    inventoryController: deps.inventoryController,
  });
  router.use(catalogueRouter);

  // 8. Mount Settings Sub-Module
  // /api/v1/admin/settings/:group
  const settingsRouter = createSettingsRouter({
    settingsController: deps.settingsController,
    requireSettingsAccessMiddleware: deps.requireSettingsAccessMiddleware,
  });
  router.use("/settings", settingsRouter);

  // 9. Mount Audit Logs Sub-Module
  // /api/v1/admin/audit-logs
  const auditLogsRouter = createAuditLogsRouter({
    auditLogsController: deps.auditLogsController,
  });
  router.use(auditLogsRouter);

  return router;
}
