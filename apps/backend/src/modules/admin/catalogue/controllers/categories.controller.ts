import type { Response, NextFunction } from "express";
import type { AdminAuthRequest } from "../../middleware/admin-auth.middleware.js";
import type { CategoriesService } from "../services/categories.service.js";
import { UnauthorizedError } from "../../../../errors/app-error.js";
import { ERROR_CODES } from "../../../../constants/error-codes.js";
import type {
  GetCategoriesQuery,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  UpdateCategoryStatusRequest,
  ReorderCategoriesRequest,
} from "@fillcart/validations";

export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  public getTree = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const query = req.query as unknown as GetCategoriesQuery;
      const result = await this.categoriesService.getTree(query);
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
      const body = req.body as CreateCategoryRequest;
      const result = await this.categoriesService.create(
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
      const body = req.body as UpdateCategoryRequest;
      const result = await this.categoriesService.update(
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
      const body = req.body as UpdateCategoryStatusRequest;
      const result = await this.categoriesService.updateStatus(
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

  public reorder = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.adminUser) {
        throw new UnauthorizedError("Admin authentication required", ERROR_CODES.UNAUTHORIZED);
      }
      const body = req.body as ReorderCategoriesRequest;
      const result = await this.categoriesService.reorder(
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
