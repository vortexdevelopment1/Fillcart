import type { Response, NextFunction } from "express";
import type { AdminAuthRequest } from "../middleware/admin-auth.middleware.js";
import { AdminAuthService } from "../services/admin-auth.service.js";
import { UnauthorizedError } from "../../../errors/app-error.js";
import { ERROR_CODES } from "../../../constants/error-codes.js";
import type { VerifySettingsAccessRequest } from "@fillcart/validations";

export class AdminAuthController {
  constructor(private adminAuthService: AdminAuthService) {}

  public verifySettingsAccess = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.adminUser) {
        throw new UnauthorizedError("Admin authentication required", ERROR_CODES.UNAUTHORIZED);
      }

      const body = req.body as VerifySettingsAccessRequest;
      const clientInfo = {
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
        requestId: (req as Request & { id?: string }).id || (req.headers["x-request-id"] as string),
      };

      const result = await this.adminAuthService.verifySettingsAccess({
        userId: req.adminUser.id,
        password: body.password,
        clientInfo,
      });

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
