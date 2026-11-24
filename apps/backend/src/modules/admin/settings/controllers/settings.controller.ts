import type { Response, NextFunction } from "express";
import type { AdminAuthRequest } from "../../middleware/admin-auth.middleware.js";
import type { SettingsService } from "../services/settings.service.js";
import { UnauthorizedError, BadRequestError } from "../../../../errors/app-error.js";
import { ERROR_CODES } from "../../../../constants/error-codes.js";
import { settingsTabIdSchema, type SettingsTabId, type UpdateSettingsGroupRequest } from "@fillcart/validations";

export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  public getByGroup = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const groupParam = (req.params.group as string).toUpperCase();
      const parseResult = settingsTabIdSchema.safeParse(groupParam);
      if (!parseResult.success) {
        throw new BadRequestError(`Invalid settings group '${groupParam}'`, ERROR_CODES.BAD_REQUEST);
      }

      const result = await this.settingsService.getSettingsByGroup(parseResult.data as SettingsTabId);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public updateByGroup = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.adminUser) {
        throw new UnauthorizedError("Admin authentication required", ERROR_CODES.UNAUTHORIZED);
      }

      const groupParam = (req.params.group as string).toUpperCase();
      const parseResult = settingsTabIdSchema.safeParse(groupParam);
      if (!parseResult.success) {
        throw new BadRequestError(`Invalid settings group '${groupParam}'`, ERROR_CODES.BAD_REQUEST);
      }

      const body = req.body as UpdateSettingsGroupRequest;
      const result = await this.settingsService.updateSettingsByGroup(
        parseResult.data as SettingsTabId,
        body.settings,
        req.adminUser.id,
        req.ip,
        req.get("user-agent")
      );
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
