import { z } from "zod";

export const getFaqsQuerySchema = z.object({
  query: z.object({
    category: z.string().trim().optional(),
    q: z.string().trim().optional(),
  }).optional(),
});
