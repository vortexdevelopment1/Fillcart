import { z } from "zod";

export const subscribeStockNotificationSchema = z.object({
  params: z.object({
    slugOrId: z.string().trim().min(1, "Product slug or ID is required"),
  }),
  body: z
    .object({
      email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email address")
        .optional()
        .or(z.literal("")),
      phone: z
        .string()
        .trim()
        .regex(/^[+]?[0-9]{10,13}$/, "Invalid phone number format")
        .optional()
        .or(z.literal("")),
    })
    .optional(),
});

export const unsubscribeStockNotificationSchema = z.object({
  params: z.object({
    slugOrId: z.string().trim().min(1, "Product slug or ID is required"),
  }),
});
