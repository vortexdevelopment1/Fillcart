import { Router } from "express";
import type { ReportsController } from "../controllers/reports.controller.js";

export interface ReportsRouterDependencies {
  reportsController: ReportsController;
}

export function createReportsRouter(deps: ReportsRouterDependencies): Router {
  const router = Router();

  // GET /api/v1/admin/reports/sales
  router.get("/sales", deps.reportsController.getSalesReports);

  // GET /api/v1/admin/reports/vendors
  router.get("/vendors", deps.reportsController.getVendorReports);

  // GET /api/v1/admin/reports/riders
  router.get("/riders", deps.reportsController.getRiderReports);

  return router;
}
