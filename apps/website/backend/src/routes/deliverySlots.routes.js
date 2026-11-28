import { Router } from "express";
import { getDeliverySlots } from "../controllers/deliverySlot.controller.js";
import { validate } from "../middlewares/validate.js";
import { getDeliverySlotsQuerySchema } from "../validators/deliverySlot.validator.js";

export const deliverySlotsRouter = Router();

// Public delivery slots endpoint
deliverySlotsRouter.get("/", validate(getDeliverySlotsQuerySchema), getDeliverySlots);
