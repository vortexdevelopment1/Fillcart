import { Router } from "express";
import { validateRequest } from "../../../../middleware/validate-request.js";
import { requirePermission } from "../../middleware/admin-auth.middleware.js";
import type { AuditLogsController } from "../controllers/audit-logs.controller.js";
import { getAuditLogsQuerySchema } from "@fillcart/validations";

export interface AuditLogsRouterDependencies {
  auditLogsController: AuditLogsController;
}

export function createAuditLogsRouter(deps: AuditLogsRouterDependencies): Router {
  const router = Router();

  router.get(
    "/audit-logs",
    requirePermission("admin", "audit_view"),
    validateRequest({ query: getAuditLogsQuerySchema }),
    deps.auditLogsController.getAuditLogs
  );

  return router;
}
