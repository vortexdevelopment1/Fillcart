import { z } from "zod";

/**
 * Reusable pagination query schema for collection endpoints.
 * Demonstrates schema definition, boundary validation, and defaults.
 */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
