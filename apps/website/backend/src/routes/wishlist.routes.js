import { Router } from "express";
import {
  getWishlist,
  addWishlistItem,
  removeWishlistItem,
} from "../controllers/wishlist.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { validate } from "../middlewares/validate.js";
import {
  addWishlistItemSchema,
  deleteWishlistItemSchema,
} from "../validators/wishlist.validator.js";

export const wishlistRouter = Router();

// All wishlist endpoints require customer authentication
wishlistRouter.use(requireAuth);

wishlistRouter.get("/", getWishlist);
wishlistRouter.post("/items", validate(addWishlistItemSchema), addWishlistItem);
wishlistRouter.delete("/items/:productId", validate(deleteWishlistItemSchema), removeWishlistItem);
