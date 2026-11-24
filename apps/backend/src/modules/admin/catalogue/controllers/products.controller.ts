import type { Response, NextFunction } from "express";
import type { AdminAuthRequest } from "../../middleware/admin-auth.middleware.js";
import type { ProductsService } from "../services/products.service.js";
import { UnauthorizedError } from "../../../../errors/app-error.js";
import { ERROR_CODES } from "../../../../constants/error-codes.js";
import type {
  GetProductsQuery,
  CreateProductRequest,
  UpdateProductRequest,
  UpdateProductStatusRequest,
  ModerateProductRequest,
  BulkUpdateProductStatusRequest,
} from "@fillcart/validations";

export class ProductsController {
  constructor(private productsService: ProductsService) {}

  public list = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const query = req.query as unknown as GetProductsQuery;
      const result = await this.productsService.list(query);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public getById = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const result = await this.productsService.getById(id);
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
      const body = req.body as CreateProductRequest;
      const result = await this.productsService.create(
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
      const body = req.body as UpdateProductRequest;
      const result = await this.productsService.update(
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
      const body = req.body as UpdateProductStatusRequest;
      const result = await this.productsService.updateStatus(
        id,
        body.status,
        req.adminUser.id,
        req.ip,
        req.get("user-agent")
      );
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public moderate = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.adminUser) {
        throw new UnauthorizedError("Admin authentication required", ERROR_CODES.UNAUTHORIZED);
      }
      const id = req.params.id as string;
      const body = req.body as ModerateProductRequest;
      const result = await this.productsService.moderate(
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

  public bulkUpdateStatus = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.adminUser) {
        throw new UnauthorizedError("Admin authentication required", ERROR_CODES.UNAUTHORIZED);
      }
      const body = req.body as BulkUpdateProductStatusRequest;
      const result = await this.productsService.bulkUpdateStatus(
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
}
