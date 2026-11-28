import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(100).optional(),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[0-9\s-]{7,15}$/, "Phone must contain between 7 and 15 digits")
      .optional()
      .or(z.literal("")),
    avatarUrl: z.string().trim().max(1000).optional().or(z.literal("")),
  }),
});
