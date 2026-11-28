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
import { requireAuth } from "../middlewares/requireAuth.js";
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

export const productRouter = Router();

// Public Catalog Queries
productRouter.get("/", validate(getProductsSchema), getProducts);

// Reviews Endpoints
productRouter.get("/:slugOrId/reviews", validate(getReviewsQuerySchema), getProductReviews);
productRouter.post("/:slugOrId/reviews", requireAuth, validate(createReviewSchema), createReview);
productRouter.patch("/:slugOrId/reviews/mine", requireAuth, validate(updateReviewSchema), updateMyReview);
productRouter.delete("/:slugOrId/reviews/mine", requireAuth, validate(reviewSlugParamSchema), deleteMyReview);

// Single Product Detail
productRouter.get("/:slug", validate(getProductParamsSchema), getProductBySlug);

