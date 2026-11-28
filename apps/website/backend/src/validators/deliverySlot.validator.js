import { z } from "zod";

export const getDeliverySlotsQuerySchema = z.object({
  query: z
    .object({
      days: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 2))
        .pipe(z.number().int().min(1).max(3)),
    })
    .optional(),
});
