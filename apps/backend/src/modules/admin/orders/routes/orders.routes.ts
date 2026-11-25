import { Router } from "express";
import { validateRequest } from "../../../../middleware/validate-request.js";
import { requirePermission } from "../../middleware/admin-auth.middleware.js";
import type { OrdersController } from "../controllers/orders.controller.js";
import {
  getOrdersQuerySchema,
  cancelOrderSchema,
  assignRiderSchema,
} from "@fillcart/validations";

export interface OrdersRouterDependencies {
  ordersController: OrdersController;
}

export function createOrdersRouter(deps: OrdersRouterDependencies): Router {
  const router = Router();

  // GET /api/v1/admin/orders
  router.get(
    "/",
    requirePermission("orders", "view"),
    validateRequest({ query: getOrdersQuerySchema }),
    deps.ordersController.getOrders
  );

  // GET /api/v1/admin/orders/:id
  router.get(
    "/:id",
    requirePermission("orders", "view"),
    deps.ordersController.getOrderDetails
  );

  // POST /api/v1/admin/orders/:id/cancel
  router.post(
    "/:id/cancel",
    requirePermission("orders", "cancel"),
    validateRequest({ body: cancelOrderSchema }),
    deps.ordersController.cancelOrder
  );

  // PATCH /api/v1/admin/orders/:id/assign-rider
  router.patch(
    "/:id/assign-rider",
    requirePermission("orders", "assign_rider"),
    validateRequest({ body: assignRiderSchema }),
    deps.ordersController.assignRider
  );

  return router;
}
