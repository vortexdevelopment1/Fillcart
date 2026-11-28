import { z } from "zod";

export const addWishlistItemSchema = z.object({
  body: z
    .object({
      productId: z.string().trim().optional(),
      slug: z.string().trim().optional(),
    })
    .refine((data) => Boolean(data.productId || data.slug), {
      message: "Either productId or slug must be provided",
      path: ["productId"],
    }),
});

export const deleteWishlistItemSchema = z.object({
  params: z.object({
    productId: z.string().trim().min(1, "Product identifier is required"),
  }),
});
