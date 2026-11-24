import { z } from "zod";

// ============================================================================
// Enums matching Core Schema Module 1
// ============================================================================
export const productStatusSchema = z.enum(["ACTIVE", "INACTIVE", "DRAFT", "ARCHIVED"]);
export const productModerationStatusSchema = z.enum([
  "PENDING_APPROVAL",
  "APPROVED",
  "REJECTED",
  "CHANGES_REQUESTED",
]);
export const unitTypeSchema = z.enum([
  "GRAM",
  "KG",
  "MILLILITER",
  "LITER",
  "PIECE",
  "PACK",
  "METER",
]);

// ============================================================================
// Categories
// ============================================================================
export const getCategoriesQuerySchema = z.object({
  includeInactive: z
    .preprocess((val) => val === "true" || val === true, z.boolean())
    .optional()
    .default(false),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens")
    .optional(),
  description: z.string().max(500).optional(),
  iconName: z.string().min(1, "Icon name is required").default("tag"),
  parentCategoryId: z.string().uuid("Invalid parent category ID").nullable().optional(),
  displayOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens")
    .optional(),
  description: z.string().max(500).nullable().optional(),
  iconName: z.string().min(1).optional(),
  parentCategoryId: z.string().uuid().nullable().optional(),
  displayOrder: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const updateCategoryStatusSchema = z.object({
  isActive: z.boolean(),
});

export const reorderCategoriesSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().uuid("Invalid category ID"),
        displayOrder: z.coerce.number().int().min(0),
      })
    )
    .min(1, "At least one category must be provided for reordering"),
});

// ============================================================================
// Brands
// ============================================================================
export const getBrandsQuerySchema = z.object({
  search: z.string().optional(),
  isActive: z
    .preprocess((val) => {
      if (val === "true" || val === true) return true;
      if (val === "false" || val === false) return false;
      return undefined;
    }, z.boolean())
    .optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const createBrandSchema = z.object({
  name: z.string().min(1, "Brand name is required").max(100),
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens")
    .optional(),
  logoUrl: z.string().url("Invalid logo URL").nullable().optional(),
  isActive: z.boolean().default(true),
});

export const updateBrandSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens")
    .optional(),
  logoUrl: z.string().url("Invalid logo URL").nullable().optional(),
  isActive: z.boolean().optional(),
});

export const updateBrandStatusSchema = z.object({
  isActive: z.boolean(),
});

// ============================================================================
// Products & Variants
// ============================================================================
export const createVariantInputSchema = z.object({
  sku: z.string().min(1, "SKU is required").max(100),
  barcode: z.string().max(100).nullable().optional(),
  variantName: z.string().min(1, "Variant name is required").max(100),
  unitQuantity: z.coerce.number().positive("Unit quantity must be positive"),
  unitType: unitTypeSchema,
  mrpPaisa: z
    .union([z.string().regex(/^\d+$/, "mrpPaisa must be positive integer string"), z.number().int().nonnegative()])
    .transform((val) => String(val)),
  salePricePaisa: z
    .union([z.string().regex(/^\d+$/, "salePricePaisa must be positive integer string"), z.number().int().nonnegative()])
    .transform((val) => String(val)),
  discountPct: z.coerce.number().int().min(0).max(100).default(0),
  isDefault: z.boolean().default(false),
});

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200),
  slug: z
    .string()
    .min(1)
    .max(220)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens")
    .optional(),
  description: z.string().max(2000).nullable().optional(),
  categoryId: z.string().uuid("Invalid category ID"),
  brandId: z.string().uuid("Invalid brand ID").nullable().optional(),
  hsnCode: z.string().max(20).nullable().optional(),
  status: productStatusSchema.default("DRAFT"),
  variants: z
    .array(createVariantInputSchema)
    .min(1, "At least one product variant is required"),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z
    .string()
    .min(1)
    .max(220)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens")
    .optional(),
  description: z.string().max(2000).nullable().optional(),
  categoryId: z.string().uuid().optional(),
  brandId: z.string().uuid().nullable().optional(),
  hsnCode: z.string().max(20).nullable().optional(),
  status: productStatusSchema.optional(),
  variants: z.array(createVariantInputSchema).optional(),
});

export const getProductsQuerySchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  brandId: z.string().uuid().optional(),
  status: productStatusSchema.optional(),
  moderationStatus: productModerationStatusSchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const updateProductStatusSchema = z.object({
  status: productStatusSchema,
});

export const moderateProductSchema = z.object({
  action: z.enum(["APPROVE", "REJECT", "REQUEST_CHANGES"]),
  reason: z.string().max(500).optional(),
}).refine(
  (data) => {
    if ((data.action === "REJECT" || data.action === "REQUEST_CHANGES") && (!data.reason || data.reason.trim().length === 0)) {
      return false;
    }
    return true;
  },
  {
    message: "A descriptive reason is required when rejecting or requesting changes",
    path: ["reason"],
  }
);

export const bulkUpdateProductStatusSchema = z.object({
  productIds: z.array(z.string().uuid("Invalid product ID")).min(1, "At least one product ID must be provided"),
  status: productStatusSchema,
});

// ============================================================================
// Inventory
// ============================================================================
export const getInventoryQuerySchema = z.object({
  storeId: z.string().uuid().optional(),
  variantId: z.string().uuid().optional(),
  productId: z.string().uuid().optional(),
  lowStock: z
    .preprocess((val) => val === "true" || val === true, z.boolean())
    .optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const adjustInventorySchema = z.object({
  storeId: z.string().uuid("Invalid store ID"),
  variantId: z.string().uuid("Invalid variant ID"),
  adjustmentQuantity: z.coerce.number().int("Adjustment quantity must be an integer"),
  reason: z.string().min(1, "Adjustment reason is required").max(255),
});

// Infer types
export type ProductStatus = z.infer<typeof productStatusSchema>;
export type ProductModerationStatus = z.infer<typeof productModerationStatusSchema>;
export type UnitType = z.infer<typeof unitTypeSchema>;
export type GetCategoriesQuery = z.infer<typeof getCategoriesQuerySchema>;
export type CreateCategoryRequest = z.infer<typeof createCategorySchema>;
export type UpdateCategoryRequest = z.infer<typeof updateCategorySchema>;
export type UpdateCategoryStatusRequest = z.infer<typeof updateCategoryStatusSchema>;
export type ReorderCategoriesRequest = z.infer<typeof reorderCategoriesSchema>;
export type GetBrandsQuery = z.infer<typeof getBrandsQuerySchema>;
export type CreateBrandRequest = z.infer<typeof createBrandSchema>;
export type UpdateBrandRequest = z.infer<typeof updateBrandSchema>;
export type UpdateBrandStatusRequest = z.infer<typeof updateBrandStatusSchema>;
export type CreateVariantInput = z.infer<typeof createVariantInputSchema>;
export type CreateProductRequest = z.infer<typeof createProductSchema>;
export type UpdateProductRequest = z.infer<typeof updateProductSchema>;
export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>;
export type UpdateProductStatusRequest = z.infer<typeof updateProductStatusSchema>;
export type ModerateProductRequest = z.infer<typeof moderateProductSchema>;
export type BulkUpdateProductStatusRequest = z.infer<typeof bulkUpdateProductStatusSchema>;
export type GetInventoryQuery = z.infer<typeof getInventoryQuerySchema>;
export type AdjustInventoryRequest = z.infer<typeof adjustInventorySchema>;
