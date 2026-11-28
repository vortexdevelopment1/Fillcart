import { Router } from "express";
import { getCareerOpenings, createCareerApplication } from "../controllers/career.controller.js";
import { validate } from "../middlewares/validate.js";
import { rateLimit } from "../middlewares/rateLimit.js";
import {
  createCareerApplicationSchema,
  getCareerOpeningsQuerySchema,
} from "../validators/career.validator.js";

export const careersRouter = Router();

careersRouter.get("/openings", validate(getCareerOpeningsQuerySchema), getCareerOpenings);
careersRouter.post(
  "/applications",
  rateLimit({ windowMs: 10 * 60 * 1000, max: 5, message: "Too many career applications. Please try again later." }),
  validate(createCareerApplicationSchema),
  createCareerApplication
);
