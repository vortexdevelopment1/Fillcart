import type { Response, NextFunction } from "express";
import type { AdminAuthRequest } from "../../middleware/admin-auth.middleware.js";
import type { InventoryService } from "../services/inventory.service.js";
import { UnauthorizedError } from "../../../../errors/app-error.js";
import { ERROR_CODES } from "../../../../constants/error-codes.js";
import type {
  GetInventoryQuery,
  AdjustInventoryRequest,
} from "@fillcart/validations";

export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  public getInventory = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const query = req.query as unknown as GetInventoryQuery;
      const result = await this.inventoryService.getInventory(query);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public adjustInventory = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.adminUser) {
        throw new UnauthorizedError("Admin authentication required", ERROR_CODES.UNAUTHORIZED);
      }
      const body = req.body as AdjustInventoryRequest;
      const result = await this.inventoryService.adjustInventory(
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
