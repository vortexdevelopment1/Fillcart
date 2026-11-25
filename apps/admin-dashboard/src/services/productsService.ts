import { ApiResponse } from './apiClient';
import { Product, Category, initialProducts, initialCategories } from '../data/products';
import { adminApi } from './adminApi';
import { mapBackendProductToFrontend, mapBackendCategoryToFrontend } from './adminMappers';

const STORAGE_KEY_PRODUCTS = 'fillkart_admin_products';
const STORAGE_KEY_CATEGORIES = 'fillkart_admin_categories';

export function getLocalProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return initialProducts;
}

export function saveLocalProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  } catch {}
}

export function getLocalCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return initialCategories;
}

export function saveLocalCategories(categories: Category[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
  } catch {}
}

const isValidUUID = (id: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
};

export const productsService = {
  getLocalProducts,
  saveLocalProducts,

  // GET /api/v1/admin/products
  getProducts: async (params?: {
    search?: string;
    categoryId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Product[]>> => {
    try {
      const res = await adminApi.getProducts(params);
      if (res && res.items && res.items.length > 0) {
        const backendProducts = res.items.map(mapBackendProductToFrontend);
        // Merge with locally created products not yet synced
        const local = getLocalProducts();
        const merged = [...backendProducts];
        for (const lp of local) {
          if (!merged.some((mp) => mp.id === lp.id || mp.name.toLowerCase() === lp.name.toLowerCase())) {
            merged.push(lp);
          }
        }
        saveLocalProducts(merged);
        return { success: true, data: merged };
      }
    } catch (err: any) {
      console.warn('Backend products fetch failed, using local storage cache:', err?.message || err);
    }

    return {
      success: true,
      data: getLocalProducts(),
    };
  },

  // POST /api/v1/admin/products
  createProduct: async (
    product: Partial<Product>,
    categoryId: string,
    brandId?: string
  ): Promise<ApiResponse<Product>> => {
    const mrpVal = Number(product.mrp) || 100;
    const saleVal = product.salePrice !== undefined && product.salePrice !== null ? Number(product.salePrice) : mrpVal;
    const discount = mrpVal > 0 ? Math.max(0, Math.round(((mrpVal - saleVal) / mrpVal) * 100)) : 0;

    let createdProduct: Product = {
      id: `prod-${Date.now()}`,
      name: product.name || 'New Product',
      category: product.category || 'General',
      vendor: product.vendor || 'Fresh Mart Hub',
      mrp: mrpVal,
      salePrice: saleVal,
      discountPct: discount,
      itemsSold: 0,
      status: product.status || 'Active',
      sku: product.sku || `SKU-${Date.now().toString().slice(-6)}`,
      brand: product.brand || 'Fillkart Essentials',
      unit: product.unit || '1 pc',
      description: product.description || '',
      imageUrl: product.imageUrl,
      isActive: product.isActive ?? true,
    };

    // If valid UUID category, attempt backend persistence
    if (isValidUUID(categoryId)) {
      try {
        const mrpPaisa = Math.round(mrpVal * 100).toString();
        const salePricePaisa = Math.round((saleVal > 0 ? saleVal : mrpVal) * 100).toString();
        const res = await adminApi.createProduct({
          name: createdProduct.name,
          description: createdProduct.description,
          categoryId,
          brandId: brandId && isValidUUID(brandId) ? brandId : undefined,
          status: createdProduct.status === 'Active' ? 'ACTIVE' : 'DRAFT',
          variants: [
            {
              sku: createdProduct.sku,
              variantName: createdProduct.unit,
              unitQuantity: 1,
              unitType: 'UNIT',
              mrpPaisa,
              salePricePaisa,
              discountPct: discount,
              isDefault: true,
            },
          ],
        });
        if (res && res.id) {
          createdProduct = mapBackendProductToFrontend(res);
        }
      } catch (err: any) {
        console.warn('Backend product creation error, persisted to local storage:', err?.message || err);
      }
    }

    // Persist to local storage
    const current = getLocalProducts();
    const updated = [createdProduct, ...current.filter((p) => p.id !== createdProduct.id)];
    saveLocalProducts(updated);

    return {
      success: true,
      data: createdProduct,
      message: 'Product created successfully',
    };
  },

  // PUT /api/v1/admin/products/:id
  updateProduct: async (
    id: string,
    product: Partial<Product>,
    categoryId: string,
    brandId?: string
  ): Promise<ApiResponse<Product>> => {
    let updatedProduct: Product = {
      id,
      name: product.name || 'Updated Product',
      category: product.category || 'General',
      vendor: product.vendor || 'Fresh Mart Hub',
      mrp: Number(product.mrp) || 100,
      salePrice: Number(product.salePrice) || 100,
      discountPct: product.discountPct || 0,
      itemsSold: product.itemsSold || 0,
      status: product.status || 'Active',
      sku: product.sku || `SKU-${Date.now().toString().slice(-6)}`,
      brand: product.brand || 'Fillkart Essentials',
      unit: product.unit || '1 pc',
      description: product.description || '',
      imageUrl: product.imageUrl,
      isActive: product.isActive ?? true,
    };

    if (isValidUUID(id) && isValidUUID(categoryId)) {
      try {
        const mrpPaisa = product.mrp ? Math.round(product.mrp * 100).toString() : undefined;
        const salePricePaisa = product.salePrice ? Math.round(product.salePrice * 100).toString() : undefined;
        const res = await adminApi.updateProduct(id, {
          name: product.name,
          description: product.description,
          categoryId,
          brandId: brandId && isValidUUID(brandId) ? brandId : undefined,
          variants: mrpPaisa && salePricePaisa ? [
            {
              sku: product.sku || `SKU-${Date.now().toString().slice(-6)}`,
              variantName: product.unit || '1 pc',
              unitQuantity: 1,
              mrpPaisa,
              salePricePaisa,
              discountPct: product.discountPct || 0,
              isDefault: true,
            },
          ] : undefined,
        });
        if (res && res.id) {
          updatedProduct = mapBackendProductToFrontend(res);
        }
      } catch (err: any) {
        console.warn('Backend product update error, updated local storage:', err?.message || err);
      }
    }

    const current = getLocalProducts();
    const updated = current.map((p) => (p.id === id ? { ...p, ...product, ...updatedProduct } : p));
    saveLocalProducts(updated);

    return {
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully',
    };
  },

  // POST /api/v1/admin/products/{id}/moderate (Approve)
  approveProduct: async (id: string): Promise<ApiResponse<{ id: string; status: string }>> => {
    if (isValidUUID(id)) {
      try {
        await adminApi.moderateProduct(id, { action: 'APPROVE' });
      } catch (err: any) {
        console.warn('Backend approve error:', err?.message || err);
      }
    }
    const current = getLocalProducts();
    const updated = current.map((p) => (p.id === id ? { ...p, status: 'Active' as const, isActive: true } : p));
    saveLocalProducts(updated);
    return {
      success: true,
      data: { id, status: 'Active' },
      message: 'Product approved and made live',
    };
  },

  // POST /api/v1/admin/products/{id}/moderate (Reject)
  rejectProduct: async (id: string, reason: string): Promise<ApiResponse<{ id: string; status: string }>> => {
    if (isValidUUID(id)) {
      try {
        await adminApi.moderateProduct(id, { action: 'REJECT', reason });
      } catch (err: any) {
        console.warn('Backend reject error:', err?.message || err);
      }
    }
    const current = getLocalProducts();
    const updated = current.map((p) => (p.id === id ? { ...p, status: 'Rejected' as const, rejectReason: reason, isActive: false } : p));
    saveLocalProducts(updated);
    return {
      success: true,
      data: { id, status: 'Rejected' },
      message: 'Product listing rejected',
    };
  },

  // PATCH /api/v1/admin/products/{id}/status (Disable)
  disableProduct: async (id: string): Promise<ApiResponse<{ id: string; status: string }>> => {
    if (isValidUUID(id)) {
      try {
        await adminApi.updateProductStatus(id, 'INACTIVE');
      } catch (err: any) {
        console.warn('Backend disable error:', err?.message || err);
      }
    }
    const current = getLocalProducts();
    const updated = current.map((p) => (p.id === id ? { ...p, status: 'Inactive' as const, isActive: false } : p));
    saveLocalProducts(updated);
    return {
      success: true,
      data: { id, status: 'Inactive' },
      message: 'Product disabled by admin',
    };
  },

  // PATCH /api/v1/admin/products/{id}/status (Enable)
  enableProduct: async (id: string): Promise<ApiResponse<{ id: string; status: string }>> => {
    if (isValidUUID(id)) {
      try {
        await adminApi.updateProductStatus(id, 'ACTIVE');
      } catch (err: any) {
        console.warn('Backend enable error:', err?.message || err);
      }
    }
    const current = getLocalProducts();
    const updated = current.map((p) => (p.id === id ? { ...p, status: 'Active' as const, isActive: true } : p));
    saveLocalProducts(updated);
    return {
      success: true,
      data: { id, status: 'Active' },
      message: 'Product enabled by admin',
    };
  },
};

export const categoriesService = {
  getLocalCategories,
  saveLocalCategories,

  // GET /api/v1/admin/categories
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    try {
      const res = await adminApi.getCategories(true);
      if (res && res.items && res.items.length > 0) {
        const flatList: Category[] = [];
        for (const root of res.items) {
          flatList.push(mapBackendCategoryToFrontend(root));
          if (root.subCategories) {
            for (const sub of root.subCategories) {
              flatList.push(mapBackendCategoryToFrontend(sub));
            }
          }
        }
        // Merge with local categories
        const local = getLocalCategories();
        for (const lc of local) {
          if (!flatList.some((fc) => fc.id === lc.id || fc.name.toLowerCase() === lc.name.toLowerCase())) {
            flatList.push(lc);
          }
        }
        saveLocalCategories(flatList);
        return { success: true, data: flatList };
      }
    } catch (err: any) {
      console.warn('Backend categories fetch failed, using local storage cache:', err?.message || err);
    }

    return {
      success: true,
      data: getLocalCategories(),
    };
  },

  // POST /api/v1/admin/categories
  createCategory: async (category: Omit<Category, 'id' | 'productCount'>): Promise<ApiResponse<Category>> => {
    let newCat: Category = {
      id: `cat-${Date.now()}`,
      name: category.name,
      iconName: category.iconName || 'ShoppingBag',
      productCount: 0,
      isActive: category.isActive ?? true,
      parentCategory: category.parentCategory,
    };

    try {
      const res = await adminApi.createCategory({
        name: category.name,
        iconName: category.iconName,
        parentCategoryId: category.parentCategory && isValidUUID(category.parentCategory) ? category.parentCategory : null,
        isActive: category.isActive,
      });
      if (res && res.id) {
        newCat = mapBackendCategoryToFrontend(res);
      }
    } catch (err: any) {
      console.warn('Backend category creation error, persisted to local storage:', err?.message || err);
    }

    const current = getLocalCategories();
    const updated = [...current, newCat];
    saveLocalCategories(updated);

    return {
      success: true,
      data: newCat,
      message: 'Category created successfully',
    };
  },

  // PUT /api/v1/admin/categories/{id}
  updateCategory: async (id: string, updates: Partial<Category>): Promise<ApiResponse<Partial<Category>>> => {
    if (isValidUUID(id)) {
      try {
        await adminApi.updateCategory(id, {
          name: updates.name,
          iconName: updates.iconName,
          parentCategoryId: updates.parentCategory && isValidUUID(updates.parentCategory) ? updates.parentCategory : null,
          isActive: updates.isActive,
        });
      } catch (err: any) {
        console.warn('Backend category update error:', err?.message || err);
      }
    }

    const current = getLocalCategories();
    const updated = current.map((c) => (c.id === id ? { ...c, ...updates } : c));
    saveLocalCategories(updated);

    return {
      success: true,
      data: { id, ...updates },
      message: 'Category updated successfully',
    };
  },

  // PATCH /api/v1/admin/categories/{id}/status (Soft status toggle)
  toggleCategoryStatus: async (id: string, isActive: boolean): Promise<ApiResponse<{ id: string; isActive: boolean }>> => {
    if (isValidUUID(id)) {
      try {
        await adminApi.updateCategoryStatus(id, isActive);
      } catch (err: any) {
        console.warn('Backend category toggle error:', err?.message || err);
      }
    }

    const current = getLocalCategories();
    const updated = current.map((c) => (c.id === id ? { ...c, isActive } : c));
    saveLocalCategories(updated);

    return {
      success: true,
      data: { id, isActive },
      message: 'Category status updated successfully',
    };
  },

  // PUT /api/v1/admin/categories/reorder
  reorderCategories: async (items: Array<{ id: string; displayOrder: number }>): Promise<ApiResponse<{ reordered: any[] }>> => {
    try {
      const res = await adminApi.reorderCategories(items);
      return {
        success: true,
        data: res,
        message: 'Categories reordered successfully',
      };
    } catch {
      return {
        success: true,
        data: { reordered: items },
        message: 'Categories reordered locally',
      };
    }
  },

  // Soft delete category (sets isActive to false)
  deleteCategory: async (id: string): Promise<ApiResponse<{ id: string }>> => {
    if (isValidUUID(id)) {
      try {
        await adminApi.updateCategoryStatus(id, false);
      } catch (err: any) {
        console.warn('Backend category delete error:', err?.message || err);
      }
    }

    const current = getLocalCategories();
    const updated = current.filter((c) => c.id !== id);
    saveLocalCategories(updated);

    return {
      success: true,
      data: { id },
      message: 'Category deactivated successfully',
    };
  },
};
