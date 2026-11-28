import { Router } from "express";
import {
  createVendorApplication,
  createRiderApplication,
} from "../controllers/partner.controller.js";
import { validate } from "../middlewares/validate.js";
import { rateLimit } from "../middlewares/rateLimit.js";
import {
  createVendorApplicationSchema,
  createRiderApplicationSchema,
} from "../validators/partner.validator.js";

export const partnersRouter = Router();

partnersRouter.post(
  "/vendor-applications",
  rateLimit({ windowMs: 10 * 60 * 1000, max: 5, message: "Too many vendor applications. Please try again later." }),
  validate(createVendorApplicationSchema),
  createVendorApplication
);

partnersRouter.post(
  "/rider-applications",
  rateLimit({ windowMs: 10 * 60 * 1000, max: 5, message: "Too many rider applications. Please try again later." }),
  validate(createRiderApplicationSchema),
  createRiderApplication
);
