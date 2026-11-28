import { Router } from "express";
import { getFaqs } from "../controllers/faq.controller.js";
import { validate } from "../middlewares/validate.js";
import { getFaqsQuerySchema } from "../validators/faq.validator.js";

export const faqsRouter = Router();

faqsRouter.get("/", validate(getFaqsQuerySchema), getFaqs);
