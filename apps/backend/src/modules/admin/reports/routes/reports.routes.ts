import { Router } from "express";
import { requirePermission } from "../../middleware/admin-auth.middleware.js";
import type { ReportsController } from "../controllers/reports.controller.js";

export interface ReportsRouterDependencies {
  reportsController: ReportsController;
}

export function createReportsRouter(deps: ReportsRouterDependencies): Router {
  const router = Router();

  // GET /api/v1/admin/reports/sales
  router.get(
    "/sales",
    requirePermission("reports", "view"),
    deps.reportsController.getSalesReports
  );

  // GET /api/v1/admin/reports/vendors
  router.get(
    "/vendors",
    requirePermission("reports", "view"),
    deps.reportsController.getVendorReports
  );

  // GET /api/v1/admin/reports/riders
  router.get(
    "/riders",
    requirePermission("reports", "view"),
    deps.reportsController.getRiderReports
  );

  return router;
}
