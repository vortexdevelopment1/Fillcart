import { z } from "zod";

export const addCartItemSchema = z.object({
  body: z
    .object({
      productId: z.string().trim().optional(),
      slug: z.string().trim().optional(),
      quantity: z.coerce.number().int().min(1, "Quantity must be at least 1").max(20, "Max limit per item is 20").default(1),
    })
    .refine((data) => Boolean(data.productId || data.slug), {
      message: "Either productId or slug must be provided",
      path: ["productId"],
    }),
});

export const updateCartItemSchema = z.object({
  params: z.object({
    itemId: z.string().trim().min(1, "Item ID is required"),
  }),
  body: z.object({
    quantity: z.coerce.number().int().min(0, "Quantity cannot be negative").max(20, "Max limit per item is 20"),
  }),
});

export const deleteCartItemSchema = z.object({
  params: z.object({
    itemId: z.string().trim().min(1, "Item ID is required"),
  }),
});

export const mergeCartSchema = z.object({
  body: z.object({
    items: z
      .array(
        z
          .object({
            productId: z.string().trim().optional(),
            slug: z.string().trim().optional(),
            quantity: z.coerce.number().int().min(1).max(20).default(1),
          })
          .refine((item) => Boolean(item.productId || item.slug), {
            message: "Each merge item must have either productId or slug",
          })
      )
      .min(1, "Items array must contain at least one product"),
  }),
});
