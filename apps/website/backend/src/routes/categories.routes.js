import { Router } from "express";
import { getCategories } from "../controllers/category.controller.js";
import { validate } from "../middlewares/validate.js";
import { getCategoriesSchema } from "../validators/category.validator.js";

export const categoryRouter = Router();

categoryRouter.get("/", validate(getCategoriesSchema), getCategories);
