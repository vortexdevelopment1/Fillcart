import { Router } from "express";
import { validateRequest } from "../../../../middleware/validate-request.js";
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
  router.get("/overview", deps.financeController.getOverview);

  // GET /api/v1/admin/finance/settlements
  router.get("/settlements", deps.financeController.getSettlements);

  // POST /api/v1/admin/finance/settlements/:id/process
  router.post("/settlements/:id/process", deps.financeController.processSettlement);

  // GET /api/v1/admin/finance/commissions
  router.get("/commissions", deps.financeController.getCommissions);

  // POST /api/v1/admin/finance/commissions
  router.post(
    "/commissions",
    validateRequest({ body: createCommissionRuleSchema }),
    deps.financeController.createCommissionRule
  );

  // GET /api/v1/admin/finance/coupons
  router.get("/coupons", deps.financeController.getCoupons);

  // POST /api/v1/admin/finance/coupons
  router.post(
    "/coupons",
    validateRequest({ body: createCouponSchema }),
    deps.financeController.createCoupon
  );

  // GET /api/v1/admin/finance/taxes
  router.get("/taxes", deps.financeController.getTaxes);

  return router;
}
