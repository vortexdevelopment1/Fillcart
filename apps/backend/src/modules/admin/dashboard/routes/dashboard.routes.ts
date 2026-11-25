import { Router } from "express";
import type { DashboardController } from "../controllers/dashboard.controller.js";

export interface DashboardRouterDependencies {
  dashboardController: DashboardController;
}

export function createDashboardRouter(deps: DashboardRouterDependencies): Router {
  const router = Router();

  router.get("/summary", deps.dashboardController.getSummary);

  return router;
}
