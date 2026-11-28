import { Router } from "express";
import { createContact } from "../controllers/contact.controller.js";
import { validate } from "../middlewares/validate.js";
import { rateLimit } from "../middlewares/rateLimit.js";
import { createContactSchema } from "../validators/contact.validator.js";

export const contactRouter = Router();

contactRouter.post(
  "/",
  rateLimit({ windowMs: 10 * 60 * 1000, max: 5 }),
  validate(createContactSchema),
  createContact
);
