import { z } from "zod";

export const createContactSchema = z.object({
  body: z.object({
    fullName: z
      .string({ required_error: "Full name is required" })
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name cannot exceed 100 characters"),
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .email("Invalid email address"),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[0-9\s-]{7,15}$/, "Phone must contain between 7 and 15 digits")
      .optional()
      .or(z.literal("")),
    subject: z
      .string()
      .trim()
      .max(150, "Subject cannot exceed 150 characters")
      .optional()
      .or(z.literal("")),
    message: z
      .string({ required_error: "Message is required" })
      .trim()
      .min(10, "Message must be at least 10 characters")
      .max(2000, "Message cannot exceed 2000 characters"),
  }),
});
