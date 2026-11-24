import { Router } from "express";
import type { RequestHandler } from "express";
import { validateRequest } from "../../../../middleware/validate-request.js";
import { requirePermission } from "../../middleware/admin-auth.middleware.js";
import type { SettingsController } from "../controllers/settings.controller.js";
import { updateSettingsGroupSchema } from "@fillcart/validations";

export interface SettingsRouterDependencies {
  settingsController: SettingsController;
  requireSettingsAccessMiddleware: RequestHandler;
}

export function createSettingsRouter(deps: SettingsRouterDependencies): Router {
  const router = Router();

  // All settings endpoints require both admin auth + settings re-auth grant token
  router.use(deps.requireSettingsAccessMiddleware);

  router.get(
    "/:group",
    requirePermission("admin", "view"),
    deps.settingsController.getByGroup
  );

  router.put(
    "/:group",
    requirePermission("admin", "manage"),
    validateRequest({ body: updateSettingsGroupSchema }),
    deps.settingsController.updateByGroup
  );

  return router;
}
