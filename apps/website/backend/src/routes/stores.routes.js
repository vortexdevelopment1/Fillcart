import { Router } from "express";
import { getStores, getStoreBySlug } from "../controllers/store.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  getStoresSchema,
  getStoreParamsSchema,
} from "../validators/store.validator.js";

export const storeRouter = Router();

storeRouter.get("/", validate(getStoresSchema), getStores);
storeRouter.get("/:slug", validate(getStoreParamsSchema), getStoreBySlug);
