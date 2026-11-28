import { z } from "zod";

export const getCategoriesSchema = z.object({
  query: z
    .object({
      featured: z
        .enum(["true", "false"])
        .optional()
        .transform((val) => (val !== undefined ? val === "true" : undefined)),
    })
    .passthrough(),
});
