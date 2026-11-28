import { Router } from "express";
import {
  getProducts,
  getProductBySlug,
} from "../controllers/product.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  getProductsSchema,
  getProductParamsSchema,
} from "../validators/product.validator.js";

export const productRouter = Router();

productRouter.get("/", validate(getProductsSchema), getProducts);
productRouter.get("/:slug", validate(getProductParamsSchema), getProductBySlug);
