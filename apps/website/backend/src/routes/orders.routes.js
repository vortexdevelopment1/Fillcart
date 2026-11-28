import { Router } from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  reorder,
  trackOrder,
} from "../controllers/order.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { validate } from "../middlewares/validate.js";
import {
  createOrderSchema,
  getOrdersQuerySchema,
  orderIdParamSchema,
  cancelOrderSchema,
} from "../validators/order.validator.js";

export const orderRouter = Router();

// All customer order endpoints require authentication
orderRouter.use(requireAuth);

orderRouter.post("/", validate(createOrderSchema), createOrder);
orderRouter.get("/", validate(getOrdersQuerySchema), getOrders);
orderRouter.get("/:orderId", validate(orderIdParamSchema), getOrderById);
orderRouter.post("/:orderId/cancel", validate(cancelOrderSchema), cancelOrder);
orderRouter.post("/:orderId/reorder", validate(orderIdParamSchema), reorder);
orderRouter.get("/:orderId/track", validate(orderIdParamSchema), trackOrder);
