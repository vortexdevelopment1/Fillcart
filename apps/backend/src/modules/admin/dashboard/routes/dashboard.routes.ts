import { Router } from "express";
import { requirePermission } from "../../middleware/admin-auth.middleware.js";
import type { DashboardController } from "../controllers/dashboard.controller.js";

export interface DashboardRouterDependencies {
  dashboardController: DashboardController;
}

export function createDashboardRouter(deps: DashboardRouterDependencies): Router {
  const router = Router();

  router.get(
    "/summary",
    requirePermission("dashboard", "view"),
    deps.dashboardController.getSummary
  );

  return router;
}
