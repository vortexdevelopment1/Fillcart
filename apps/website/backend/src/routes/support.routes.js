import { Router } from "express";
import { createSupportMessage } from "../controllers/support.controller.js";
import { validate } from "../middlewares/validate.js";
import { rateLimit } from "../middlewares/rateLimit.js";
import { createSupportMessageSchema } from "../validators/support.validator.js";

export const supportRouter = Router();

supportRouter.post(
  "/messages",
  rateLimit({ windowMs: 10 * 60 * 1000, max: 5, message: "Too many support messages. Please try again later." }),
  validate(createSupportMessageSchema),
  createSupportMessage
);
