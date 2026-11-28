import { z } from "zod";

export const searchQuerySchema = z.object({
  query: z.object({
    q: z
      .string({ required_error: "Search query 'q' is required" })
      .trim()
      .min(2, "Search query must be at least 2 characters")
      .max(100, "Search query cannot exceed 100 characters"),
    limit: z
      .coerce
      .number()
      .int()
      .min(1, "Limit must be at least 1")
      .max(20, "Limit cannot exceed 20")
      .default(8),
  }),
});

export const searchSuggestionsQuerySchema = z.object({
  query: z.object({
    q: z
      .string({ required_error: "Search query 'q' is required" })
      .trim()
      .min(1, "Search query must be at least 1 character")
      .max(100, "Search query cannot exceed 100 characters"),
  }),
});
