import { z } from "zod";

export const getStoresSchema = z.object({
  query: z
    .object({
      q: z.string().trim().optional(),
    })
    .passthrough(),
});

export const getStoreParamsSchema = z.object({
  params: z.object({
    slug: z.string().trim().min(1, "Store slug is required"),
  }),
});
