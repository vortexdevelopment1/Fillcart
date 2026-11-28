import { Router } from "express";
import {
  getProducts,
  getProductBySlug,
} from "../controllers/product.controller.js";
import {
  getProductReviews,
  createReview,
  updateMyReview,
  deleteMyReview,
} from "../controllers/review.controller.js";
import {
  subscribeToStockNotification,
  unsubscribeFromStockNotification,
} from "../controllers/stockNotification.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { optionalAuth } from "../middlewares/optionalAuth.js";
import { rateLimit } from "../middlewares/rateLimit.js";
import { validate } from "../middlewares/validate.js";
import {
  getProductsSchema,
  getProductParamsSchema,
} from "../validators/product.validator.js";
import {
  getReviewsQuerySchema,
  createReviewSchema,
  updateReviewSchema,
  reviewSlugParamSchema,
} from "../validators/review.validator.js";
import {
  subscribeStockNotificationSchema,
  unsubscribeStockNotificationSchema,
} from "../validators/stockNotification.validator.js";

export const productRouter = Router();

// Public Catalog Queries
productRouter.get("/", validate(getProductsSchema), getProducts);

// Reviews Endpoints
productRouter.get("/:slugOrId/reviews", validate(getReviewsQuerySchema), getProductReviews);
productRouter.post("/:slugOrId/reviews", requireAuth, validate(createReviewSchema), createReview);
productRouter.patch("/:slugOrId/reviews/mine", requireAuth, validate(updateReviewSchema), updateMyReview);
productRouter.delete("/:slugOrId/reviews/mine", requireAuth, validate(reviewSlugParamSchema), deleteMyReview);

// Stock Notification ("Notify Me") Endpoints
productRouter.post(
  "/:slugOrId/notify-me",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: "Too many restock notification requests. Please try again later.",
  }),
  optionalAuth,
  validate(subscribeStockNotificationSchema),
  subscribeToStockNotification
);
productRouter.delete(
  "/:slugOrId/notify-me",
  requireAuth,
  validate(unsubscribeStockNotificationSchema),
  unsubscribeFromStockNotification
);

// Single Product Detail
productRouter.get("/:slug", validate(getProductParamsSchema), getProductBySlug);
