import { Router } from "express";
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeCart,
} from "../controllers/cart.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { validate } from "../middlewares/validate.js";
import {
  addCartItemSchema,
  updateCartItemSchema,
  deleteCartItemSchema,
  mergeCartSchema,
} from "../validators/cart.validator.js";

export const cartRouter = Router();

// All cart endpoints require customer authentication
cartRouter.use(requireAuth);

cartRouter.get("/", getCart);
cartRouter.post("/items", validate(addCartItemSchema), addCartItem);
cartRouter.patch("/items/:itemId", validate(updateCartItemSchema), updateCartItem);
cartRouter.delete("/items/:itemId", validate(deleteCartItemSchema), removeCartItem);
cartRouter.delete("/", clearCart);
cartRouter.post("/merge", validate(mergeCartSchema), mergeCart);
