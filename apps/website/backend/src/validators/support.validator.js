import { z } from "zod";

export const createSupportMessageSchema = z.object({
  body: z.object({
    subject: z
      .string({ required_error: "Subject is required" })
      .trim()
      .min(2, "Subject must be at least 2 characters")
      .max(150, "Subject cannot exceed 150 characters"),
    category: z
      .string({ required_error: "Issue category is required" })
      .trim()
      .min(2, "Category must be at least 2 characters")
      .max(100),
    orderId: z.string().trim().max(100).optional(),
    description: z
      .string({ required_error: "Description is required" })
      .trim()
      .min(5, "Description must be at least 5 characters")
      .max(2000, "Description cannot exceed 2000 characters"),
    fullName: z.string().trim().max(100).optional(),
    email: z.string().trim().email("Invalid email address").optional().or(z.literal("")),
    phone: z.string().trim().regex(/^\+?[0-9\s-]{7,15}$/, "Phone must contain between 7 and 15 digits").optional().or(z.literal("")),
    honeypot: z.string().optional(),
    _hp: z.string().optional(),
  }),
});
