import { Router } from "express";
import { getOffers } from "../controllers/offer.controller.js";
import { validate } from "../middlewares/validate.js";
import { getOffersSchema } from "../validators/offer.validator.js";

export const offerRouter = Router();

offerRouter.get("/", validate(getOffersSchema), getOffers);
