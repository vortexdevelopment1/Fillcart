import { Router } from "express";
import { validateRequest } from "../../../../middleware/validate-request.js";
import type { VendorsController } from "../controllers/vendors.controller.js";
import {
  getVendorsQuerySchema,
  updateVendorStatusSchema,
  updateVendorCommissionSchema,
} from "@fillcart/validations";

export interface VendorsRouterDependencies {
  vendorsController: VendorsController;
}

export function createVendorsRouter(deps: VendorsRouterDependencies): Router {
  const router = Router();

  // GET /api/v1/admin/vendors
  router.get(
    "/",
    validateRequest({ query: getVendorsQuerySchema }),
    deps.vendorsController.getVendors
  );

  // GET /api/v1/admin/vendors/:id
  router.get("/:id", deps.vendorsController.getVendorDetails);

  // PATCH /api/v1/admin/vendors/:id/status
  router.patch(
    "/:id/status",
    validateRequest({ body: updateVendorStatusSchema }),
    deps.vendorsController.updateStatus
  );

  // PATCH /api/v1/admin/vendors/:id/commission
  router.patch(
    "/:id/commission",
    validateRequest({ body: updateVendorCommissionSchema }),
    deps.vendorsController.updateCommission
  );

  return router;
}
