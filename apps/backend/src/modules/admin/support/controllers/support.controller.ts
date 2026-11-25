import type { Response, NextFunction } from "express";
import type { AdminAuthRequest } from "../../middleware/admin-auth.middleware.js";
import type { SupportService } from "../services/support.service.js";
import { UnauthorizedError } from "../../../../errors/app-error.js";
import { ERROR_CODES } from "../../../../constants/error-codes.js";
import type { CreateSupportTicketRequest } from "@fillcart/validations";

export class SupportController {
  constructor(private supportService: SupportService) {}

  public getSupportInfo = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.adminUser) {
        throw new UnauthorizedError("Admin authentication required", ERROR_CODES.UNAUTHORIZED);
      }

      const result = await this.supportService.getSupportInfo();
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public createTicket = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.adminUser) {
        throw new UnauthorizedError("Admin authentication required", ERROR_CODES.UNAUTHORIZED);
      }

      const body = req.body as CreateSupportTicketRequest;
      const result = await this.supportService.createTicket(
        req.adminUser.id,
        req.adminUser.fullName || req.adminUser.email,
        body
      );
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };
}
