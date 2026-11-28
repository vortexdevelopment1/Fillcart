import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    addressId: z
      .string({ required_error: "Address ID is required" })
      .trim()
      .min(1, "Address ID cannot be empty"),
    paymentMethod: z
      .string()
      .trim()
      .default("COD"),
    notes: z
      .string()
      .trim()
      .max(500, "Notes cannot exceed 500 characters")
      .optional(),
  }),
});

export const getOrdersQuerySchema = z.object({
  query: z.object({
    status: z.string().trim().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
  }),
});

export const orderIdParamSchema = z.object({
  params: z.object({
    orderId: z.string().trim().min(1, "Order ID or order number is required"),
  }),
});

export const cancelOrderSchema = z.object({
  params: z.object({
    orderId: z.string().trim().min(1, "Order ID is required"),
  }),
  body: z
    .object({
      reason: z
        .string()
        .trim()
        .max(300, "Cancellation reason cannot exceed 300 characters")
        .optional(),
    })
    .default({}),
});
