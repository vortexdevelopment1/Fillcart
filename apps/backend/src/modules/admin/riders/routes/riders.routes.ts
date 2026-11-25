import { Router } from "express";
import { validateRequest } from "../../../../middleware/validate-request.js";
import type { RidersController } from "../controllers/riders.controller.js";
import {
  getRidersQuerySchema,
  updateRiderStatusSchema,
  updateRiderAvailabilitySchema,
} from "@fillcart/validations";

export interface RidersRouterDependencies {
  ridersController: RidersController;
}

export function createRidersRouter(deps: RidersRouterDependencies): Router {
  const router = Router();

  // GET /api/v1/admin/riders
  router.get(
    "/",
    validateRequest({ query: getRidersQuerySchema }),
    deps.ridersController.getRiders
  );

  // GET /api/v1/admin/riders/:id
  router.get("/:id", deps.ridersController.getRiderDetails);

  // PATCH /api/v1/admin/riders/:id/status
  router.patch(
    "/:id/status",
    validateRequest({ body: updateRiderStatusSchema }),
    deps.ridersController.updateStatus
  );

  // PATCH /api/v1/admin/riders/:id/availability
  router.patch(
    "/:id/availability",
    validateRequest({ body: updateRiderAvailabilitySchema }),
    deps.ridersController.updateAvailability
  );

  return router;
}
