import { Router } from "express";
import { validateRequest } from "../../../../middleware/validate-request.js";
import { createSupportTicketSchema } from "@fillcart/validations";
import type { SupportController } from "../controllers/support.controller.js";

export interface SupportRouterDependencies {
  supportController: SupportController;
}

export function createSupportRouter(deps: SupportRouterDependencies): Router {
  const router = Router();

  router.get("/info", deps.supportController.getSupportInfo);
  router.post(
    "/tickets",
    validateRequest({ body: createSupportTicketSchema }),
    deps.supportController.createTicket
  );

  return router;
}
