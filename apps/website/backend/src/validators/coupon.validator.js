import { z } from "zod";

export const applyCouponSchema = z.object({
  body: z.object({
    code: z
      .string({ required_error: "Coupon code is required" })
      .trim()
      .min(1, "Coupon code cannot be empty")
      .max(50, "Coupon code is too long"),
  }),
});
