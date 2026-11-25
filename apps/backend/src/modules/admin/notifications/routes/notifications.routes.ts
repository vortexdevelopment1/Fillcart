import { Router } from "express";
import { requirePermission } from "../../middleware/admin-auth.middleware.js";
import type { NotificationsController } from "../controllers/notifications.controller.js";

export interface NotificationsRouterDependencies {
  notificationsController: NotificationsController;
}

export function createNotificationsRouter(deps: NotificationsRouterDependencies): Router {
  const router = Router();

  router.get(
    "/",
    requirePermission("notifications", "view"),
    deps.notificationsController.getNotifications
  );
  router.patch(
    "/:id/read",
    requirePermission("notifications", "manage"),
    deps.notificationsController.markRead
  );
  router.post(
    "/mark-all-read",
    requirePermission("notifications", "manage"),
    deps.notificationsController.markAllRead
  );

  return router;
}
