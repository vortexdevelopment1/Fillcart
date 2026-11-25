import type { Response, NextFunction } from "express";
import type { AdminAuthRequest } from "../../middleware/admin-auth.middleware.js";
import type { VendorsService } from "../services/vendors.service.js";
import type {
  GetVendorsQuery,
  UpdateVendorStatusRequest,
  UpdateVendorCommissionRequest,
} from "@fillcart/validations";

export class VendorsController {
  constructor(private vendorsService: VendorsService) {}

  public getVendors = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const query = req.query as unknown as GetVendorsQuery;
      const result = await this.vendorsService.getVendors(query);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public getVendorDetails = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const result = await this.vendorsService.getVendorDetails(id);
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
      const payload = req.body as UpdateVendorStatusRequest;
      const result = await this.vendorsService.updateStatus(id, adminUserId, payload);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public updateCommission = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const adminUserId = req.adminUser?.id || "system";
      const payload = req.body as UpdateVendorCommissionRequest;
      const result = await this.vendorsService.updateCommission(id, adminUserId, payload);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
