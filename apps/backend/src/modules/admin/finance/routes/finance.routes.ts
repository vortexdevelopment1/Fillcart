import { Router } from "express";
import { validateRequest } from "../../../../middleware/validate-request.js";
import { requirePermission } from "../../middleware/admin-auth.middleware.js";
import type { FinanceController } from "../controllers/finance.controller.js";
import {
  createCommissionRuleSchema,
  createCouponSchema,
} from "@fillcart/validations";

export interface FinanceRouterDependencies {
  financeController: FinanceController;
}

export function createFinanceRouter(deps: FinanceRouterDependencies): Router {
  const router = Router();

  // GET /api/v1/admin/finance/overview
  router.get(
    "/overview",
    requirePermission("finance", "view"),
    deps.financeController.getOverview
  );

  // GET /api/v1/admin/finance/settlements
  router.get(
    "/settlements",
    requirePermission("finance", "view"),
    deps.financeController.getSettlements
  );

  // POST /api/v1/admin/finance/settlements/:id/process
  router.post(
    "/settlements/:id/process",
    requirePermission("finance", "process"),
    deps.financeController.processSettlement
  );

  // GET /api/v1/admin/finance/commissions
  router.get(
    "/commissions",
    requirePermission("finance", "view"),
    deps.financeController.getCommissions
  );

  // POST /api/v1/admin/finance/commissions
  router.post(
    "/commissions",
    requirePermission("finance", "manage"),
    validateRequest({ body: createCommissionRuleSchema }),
    deps.financeController.createCommissionRule
  );

  // GET /api/v1/admin/finance/coupons
  router.get(
    "/coupons",
    requirePermission("finance", "view"),
    deps.financeController.getCoupons
  );

  // POST /api/v1/admin/finance/coupons
  router.post(
    "/coupons",
    requirePermission("finance", "manage"),
    validateRequest({ body: createCouponSchema }),
    deps.financeController.createCoupon
  );

  // GET /api/v1/admin/finance/taxes
  router.get(
    "/taxes",
    requirePermission("finance", "view"),
    deps.financeController.getTaxes
  );

  return router;
}
