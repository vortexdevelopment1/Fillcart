import type { Response, NextFunction } from "express";
import type { AdminAuthRequest } from "../middleware/admin-auth.middleware.js";
import { StaffService } from "../services/staff.service.js";
import { UnauthorizedError } from "../../../errors/app-error.js";
import { ERROR_CODES } from "../../../constants/error-codes.js";
import type {
  GetStaffQuery,
  InviteStaffRequest,
  UpdateStaffStatusRequest,
} from "@fillcart/validations";

export class StaffController {
  constructor(private staffService: StaffService) {}

  public getRoles = async (
    _req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.staffService.getRoles();
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public getStaff = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const query = req.query as unknown as GetStaffQuery;
      const result = await this.staffService.getStaff(query);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public inviteStaff = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.adminUser) {
        throw new UnauthorizedError("Admin authentication required", ERROR_CODES.UNAUTHORIZED);
      }

      const body = req.body as InviteStaffRequest;
      const result = await this.staffService.inviteStaff(body, req.adminUser.id);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };

  public updateStaffStatus = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.adminUser) {
        throw new UnauthorizedError("Admin authentication required", ERROR_CODES.UNAUTHORIZED);
      }

      const { id } = req.params;
      const body = req.body as UpdateStaffStatusRequest;
      const result = await this.staffService.updateStaffStatus(id, body, req.adminUser.id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
