import { z } from "zod";

export const createNewsletterSubscriptionSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .email("Invalid email address")
      .max(150, "Email cannot exceed 150 characters"),
    honeypot: z.string().optional(),
    _hp: z.string().optional(),
  }),
});
