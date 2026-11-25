import { Router } from "express";
import type { NotificationsController } from "../controllers/notifications.controller.js";

export interface NotificationsRouterDependencies {
  notificationsController: NotificationsController;
}

export function createNotificationsRouter(deps: NotificationsRouterDependencies): Router {
  const router = Router();

  router.get("/", deps.notificationsController.getNotifications);
  router.patch("/:id/read", deps.notificationsController.markRead);
  router.post("/mark-all-read", deps.notificationsController.markAllRead);

  return router;
}
