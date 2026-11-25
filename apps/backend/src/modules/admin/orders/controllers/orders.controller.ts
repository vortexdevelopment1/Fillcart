import type { Response, NextFunction } from "express";
import type { AdminAuthRequest } from "../../middleware/admin-auth.middleware.js";
import type { OrdersService } from "../services/orders.service.js";
import type {
  GetOrdersQuery,
  CancelOrderRequest,
  AssignRiderRequest,
} from "@fillcart/validations";

export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  public getOrders = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const query = req.query as unknown as GetOrdersQuery;
      const result = await this.ordersService.getOrders(query);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public getOrderDetails = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const result = await this.ordersService.getOrderDetails(id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public cancelOrder = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const adminUserId = req.adminUser?.id || "system";
      const payload = req.body as CancelOrderRequest;
      const result = await this.ordersService.cancelOrder(id, adminUserId, payload);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public assignRider = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const adminUserId = req.adminUser?.id || "system";
      const payload = req.body as AssignRiderRequest;
      const result = await this.ordersService.assignRider(id, adminUserId, payload);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
