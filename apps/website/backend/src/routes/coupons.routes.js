import { Router } from "express";
import { applyCoupon, removeCoupon } from "../controllers/coupon.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { validate } from "../middlewares/validate.js";
import { applyCouponSchema } from "../validators/coupon.validator.js";

export const couponRouter = Router();

// All coupon endpoints require customer authentication
couponRouter.use(requireAuth);

couponRouter.post("/apply", validate(applyCouponSchema), applyCoupon);
couponRouter.delete("/remove", removeCoupon);
