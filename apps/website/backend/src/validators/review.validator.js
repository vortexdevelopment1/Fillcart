import { z } from "zod";

export const getReviewsQuerySchema = z.object({
  params: z.object({
    slugOrId: z.string().trim().min(1, "Product identifier is required"),
  }),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    sort: z.enum(["recent", "rating_desc", "rating_asc"]).default("recent"),
  }),
});

export const createReviewSchema = z.object({
  params: z.object({
    slugOrId: z.string().trim().min(1, "Product identifier is required"),
  }),
  body: z.object({
    rating: z.coerce
      .number({ required_error: "Rating is required" })
      .int("Rating must be an integer")
      .min(1, "Rating must be between 1 and 5")
      .max(5, "Rating must be between 1 and 5"),
    title: z.string().trim().max(100, "Review title cannot exceed 100 characters").optional(),
    comment: z
      .string({ required_error: "Comment is required" })
      .trim()
      .min(3, "Comment must be at least 3 characters")
      .max(2000, "Comment cannot exceed 2000 characters"),
    displayName: z.string().trim().max(100, "Display name cannot exceed 100 characters").optional(),
  }),
});

export const updateReviewSchema = z.object({
  params: z.object({
    slugOrId: z.string().trim().min(1, "Product identifier is required"),
  }),
  body: z
    .object({
      rating: z.coerce
        .number()
        .int()
        .min(1, "Rating must be between 1 and 5")
        .max(5, "Rating must be between 1 and 5")
        .optional(),
      title: z.string().trim().max(100, "Review title cannot exceed 100 characters").optional(),
      comment: z.string().trim().min(3, "Comment must be at least 3 characters").max(2000).optional(),
      displayName: z.string().trim().max(100).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one review field must be provided to update",
    }),
});

export const reviewSlugParamSchema = z.object({
  params: z.object({
    slugOrId: z.string().trim().min(1, "Product identifier is required"),
  }),
});
