import { Router } from "express";
import type { RequestHandler } from "express";
import { AdminAuthController } from "../controllers/admin-auth.controller.js";
import { StaffController } from "../controllers/staff.controller.js";
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

  return router;
}
