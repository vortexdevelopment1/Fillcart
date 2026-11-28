import { Router } from "express";
import { subscribeNewsletter } from "../controllers/newsletter.controller.js";
import { validate } from "../middlewares/validate.js";
import { rateLimit } from "../middlewares/rateLimit.js";
import { createNewsletterSubscriptionSchema } from "../validators/newsletter.validator.js";

export const newsletterRouter = Router();

newsletterRouter.post(
  "/subscribe",
  rateLimit({ windowMs: 10 * 60 * 1000, max: 5, message: "Too many newsletter subscriptions. Please try again later." }),
  validate(createNewsletterSubscriptionSchema),
  subscribeNewsletter
);
