import type { Response, NextFunction } from "express";
import type { AdminAuthRequest } from "../../middleware/admin-auth.middleware.js";
import type { NotificationsService } from "../services/notifications.service.js";
import { UnauthorizedError } from "../../../../errors/app-error.js";
import { ERROR_CODES } from "../../../../constants/error-codes.js";

export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  public getNotifications = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.adminUser) {
        throw new UnauthorizedError("Admin authentication required", ERROR_CODES.UNAUTHORIZED);
      }

      const result = await this.notificationsService.getNotifications(req.adminUser.id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public markRead = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.adminUser) {
        throw new UnauthorizedError("Admin authentication required", ERROR_CODES.UNAUTHORIZED);
      }

      const idParam = req.params.id;
      const notificationId: string = (Array.isArray(idParam) ? idParam[0] : idParam) ?? "";
      const result = await this.notificationsService.markRead(notificationId);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public markAllRead = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.adminUser) {
        throw new UnauthorizedError("Admin authentication required", ERROR_CODES.UNAUTHORIZED);
      }

      const result = await this.notificationsService.markAllRead();
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
