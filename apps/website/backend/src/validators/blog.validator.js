import { z } from "zod";

export const getBlogsQuerySchema = z.object({
  query: z
    .object({
      category: z.string().trim().optional(),
      page: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 1))
        .pipe(z.number().int().min(1)),
      limit: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 10))
        .pipe(z.number().int().min(1).max(50)),
    })
    .optional(),
});

export const getBlogBySlugParamsSchema = z.object({
  params: z.object({
    slug: z.string().trim().min(1, "Blog slug is required"),
  }),
});
