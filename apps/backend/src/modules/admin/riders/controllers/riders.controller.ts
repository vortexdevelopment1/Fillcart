import type { Response, NextFunction } from "express";
import type { AdminAuthRequest } from "../../middleware/admin-auth.middleware.js";
import type { RidersService } from "../services/riders.service.js";
import type {
  GetRidersQuery,
  UpdateRiderStatusRequest,
  UpdateRiderAvailabilityRequest,
} from "@fillcart/validations";

export class RidersController {
  constructor(private ridersService: RidersService) {}

  public getRiders = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const query = req.query as unknown as GetRidersQuery;
      const result = await this.ridersService.getRiders(query);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public getRiderDetails = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const result = await this.ridersService.getRiderDetails(id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public updateStatus = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const adminUserId = req.adminUser?.id || "system";
      const payload = req.body as UpdateRiderStatusRequest;
      const result = await this.ridersService.updateStatus(id, adminUserId, payload);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public updateAvailability = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const adminUserId = req.adminUser?.id || "system";
      const payload = req.body as UpdateRiderAvailabilityRequest;
      const result = await this.ridersService.updateAvailability(id, adminUserId, payload);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
