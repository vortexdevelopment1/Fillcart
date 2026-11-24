import type { Response, NextFunction } from "express";
import type { AdminAuthRequest } from "../../middleware/admin-auth.middleware.js";
import type { BrandsService } from "../services/brands.service.js";
import { UnauthorizedError } from "../../../../errors/app-error.js";
import { ERROR_CODES } from "../../../../constants/error-codes.js";
import type {
  GetBrandsQuery,
  CreateBrandRequest,
  UpdateBrandRequest,
  UpdateBrandStatusRequest,
} from "@fillcart/validations";

export class BrandsController {
  constructor(private brandsService: BrandsService) {}

  public list = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const query = req.query as unknown as GetBrandsQuery;
      const result = await this.brandsService.list(query);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public create = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.adminUser) {
        throw new UnauthorizedError("Admin authentication required", ERROR_CODES.UNAUTHORIZED);
      }
      const body = req.body as CreateBrandRequest;
      const result = await this.brandsService.create(
        body,
        req.adminUser.id,
        req.ip,
        req.get("user-agent")
      );
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };

  public update = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.adminUser) {
        throw new UnauthorizedError("Admin authentication required", ERROR_CODES.UNAUTHORIZED);
      }
      const id = req.params.id as string;
      const body = req.body as UpdateBrandRequest;
      const result = await this.brandsService.update(
        id,
        body,
        req.adminUser.id,
        req.ip,
        req.get("user-agent")
      );
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
      if (!req.adminUser) {
        throw new UnauthorizedError("Admin authentication required", ERROR_CODES.UNAUTHORIZED);
      }
      const id = req.params.id as string;
      const body = req.body as UpdateBrandStatusRequest;
      const result = await this.brandsService.updateStatus(
        id,
        body.isActive,
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
