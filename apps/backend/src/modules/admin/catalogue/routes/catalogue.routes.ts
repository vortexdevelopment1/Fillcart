import { Router } from "express";
import { validateRequest } from "../../../../middleware/validate-request.js";
import { requirePermission } from "../../middleware/admin-auth.middleware.js";
import type { CategoriesController } from "../controllers/categories.controller.js";
import type { BrandsController } from "../controllers/brands.controller.js";
import type { ProductsController } from "../controllers/products.controller.js";
import type { InventoryController } from "../controllers/inventory.controller.js";
import {
  getCategoriesQuerySchema,
  createCategorySchema,
  updateCategorySchema,
  updateCategoryStatusSchema,
  reorderCategoriesSchema,
  getBrandsQuerySchema,
  createBrandSchema,
  updateBrandSchema,
  updateBrandStatusSchema,
  getProductsQuerySchema,
  createProductSchema,
  updateProductSchema,
  updateProductStatusSchema,
  moderateProductSchema,
  bulkUpdateProductStatusSchema,
  getInventoryQuerySchema,
  adjustInventorySchema,
} from "@fillcart/validations";

export interface CatalogueRouterDependencies {
  categoriesController: CategoriesController;
  brandsController: BrandsController;
  productsController: ProductsController;
  inventoryController: InventoryController;
}

export function createCatalogueRouter(deps: CatalogueRouterDependencies): Router {
  const router = Router();

  // ---------------------------------------------------------------------------
  // Categories
  // ---------------------------------------------------------------------------
  router.get(
    "/categories",
    requirePermission("products", "view"),
    validateRequest({ query: getCategoriesQuerySchema }),
    deps.categoriesController.getTree
  );

  router.post(
    "/categories",
    requirePermission("products", "manage"),
    validateRequest({ body: createCategorySchema }),
    deps.categoriesController.create
  );

  router.put(
    "/categories/reorder",
    requirePermission("products", "manage"),
    validateRequest({ body: reorderCategoriesSchema }),
    deps.categoriesController.reorder
  );

  router.put(
    "/categories/:id",
    requirePermission("products", "manage"),
    validateRequest({ body: updateCategorySchema }),
    deps.categoriesController.update
  );

  router.patch(
    "/categories/:id/status",
    requirePermission("products", "manage"),
    validateRequest({ body: updateCategoryStatusSchema }),
    deps.categoriesController.updateStatus
  );

  router.delete(
    "/categories/:id",
    requirePermission("products", "manage"),
    deps.categoriesController.delete
  );

  // ---------------------------------------------------------------------------
  // Brands
  // ---------------------------------------------------------------------------
  router.get(
    "/brands",
    requirePermission("products", "view"),
    validateRequest({ query: getBrandsQuerySchema }),
    deps.brandsController.list
  );

  router.post(
    "/brands",
    requirePermission("products", "manage"),
    validateRequest({ body: createBrandSchema }),
    deps.brandsController.create
  );

  router.put(
    "/brands/:id",
    requirePermission("products", "manage"),
    validateRequest({ body: updateBrandSchema }),
    deps.brandsController.update
  );

  router.patch(
    "/brands/:id/status",
    requirePermission("products", "manage"),
    validateRequest({ body: updateBrandStatusSchema }),
    deps.brandsController.updateStatus
  );

  // ---------------------------------------------------------------------------
  // Products & Variants
  // ---------------------------------------------------------------------------
  router.get(
    "/products",
    requirePermission("products", "view"),
    validateRequest({ query: getProductsQuerySchema }),
    deps.productsController.list
  );

  router.post(
    "/products",
    requirePermission("products", "manage"),
    validateRequest({ body: createProductSchema }),
    deps.productsController.create
  );

  router.post(
    "/products/bulk-status",
    requirePermission("products", "manage"),
    validateRequest({ body: bulkUpdateProductStatusSchema }),
    deps.productsController.bulkUpdateStatus
  );

  router.get(
    "/products/:id",
    requirePermission("products", "view"),
    deps.productsController.getById
  );

  router.put(
    "/products/:id",
    requirePermission("products", "manage"),
    validateRequest({ body: updateProductSchema }),
    deps.productsController.update
  );

  router.patch(
    "/products/:id/status",
    requirePermission("products", "manage"),
    validateRequest({ body: updateProductStatusSchema }),
    deps.productsController.updateStatus
  );

  router.post(
    "/products/:id/moderate",
    requirePermission("products", "manage"),
    validateRequest({ body: moderateProductSchema }),
    deps.productsController.moderate
  );

  // ---------------------------------------------------------------------------
  // Inventory
  // ---------------------------------------------------------------------------
  router.get(
    "/inventory",
    requirePermission("inventory", "manage"),
    validateRequest({ query: getInventoryQuerySchema }),
    deps.inventoryController.getInventory
  );

  router.post(
    "/inventory/adjust",
    requirePermission("inventory", "manage"),
    validateRequest({ body: adjustInventorySchema }),
    deps.inventoryController.adjustInventory
  );

  return router;
}
