import { z } from "zod";

export const getProductsSchema = z.object({
  query: z
    .object({
      category: z.string().trim().optional(),
      store: z.string().trim().optional(),
      q: z.string().trim().optional(),
      sort: z.enum(["popular", "price_asc", "price_desc"]).default("popular"),
      page: z.coerce.number().int().min(1, "Page must be at least 1").default(1),
      limit: z.coerce.number().int().min(1, "Limit must be at least 1").max(50, "Limit cannot exceed 50").default(20),
    })
    .passthrough(),
});

export const getProductParamsSchema = z.object({
  params: z.object({
    slug: z.string().trim().min(1, "Product slug is required"),
  }),
});
