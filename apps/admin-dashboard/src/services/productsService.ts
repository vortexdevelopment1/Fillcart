import { ApiResponse } from './apiClient';
import { Product, Category } from '../data/products';
import { adminApi } from './adminApi';
import { mapBackendProductToFrontend, mapBackendCategoryToFrontend } from './adminMappers';

export const productsService = {
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
      const data = res.items.map(mapBackendProductToFrontend);
      return {
        success: true,
        data,
      };
    } catch (err: any) {
      return {
        success: false,
        data: [],
        message: err.message || 'Failed to fetch products',
      };
    }
  },

  // POST /api/v1/admin/products
  createProduct: async (
    product: Partial<Product>,
    categoryId: string,
    brandId?: string
  ): Promise<ApiResponse<Product>> => {
    try {
      const mrpPaisa = Math.round((product.mrp || 100) * 100).toString();
      const salePricePaisa = Math.round((product.salePrice || product.mrp || 100) * 100).toString();
      const res = await adminApi.createProduct({
        name: product.name || 'New Product',
        description: product.description,
        categoryId,
        brandId,
        status: product.status === 'Active' ? 'ACTIVE' : 'DRAFT',
        variants: [
          {
            sku: product.sku || `SKU-${Date.now().toString().slice(-6)}`,
            variantName: product.unit || '1 pc',
            unitQuantity: 1,
            unitType: 'UNIT',
            mrpPaisa,
            salePricePaisa,
            discountPct: product.discountPct || 0,
            isDefault: true,
          },
        ],
      });
      return {
        success: true,
        data: mapBackendProductToFrontend(res),
        message: 'Product created successfully',
      };
    } catch (err: any) {
      throw err;
    }
  },

  // PUT /api/v1/admin/products/:id
  updateProduct: async (
    id: string,
    product: Partial<Product>,
    categoryId: string,
    brandId?: string
  ): Promise<ApiResponse<Product>> => {
    try {
      const mrpPaisa = product.mrp ? Math.round(product.mrp * 100).toString() : undefined;
      const salePricePaisa = product.salePrice ? Math.round(product.salePrice * 100).toString() : undefined;
      const res = await adminApi.updateProduct(id, {
        name: product.name,
        description: product.description,
        categoryId,
        brandId,
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
      return {
        success: true,
        data: mapBackendProductToFrontend(res),
        message: 'Product updated successfully',
      };
    } catch (err: any) {
      throw err;
    }
  },

  // POST /api/v1/admin/products/{id}/moderate (Approve)
  approveProduct: async (id: string): Promise<ApiResponse<{ id: string; status: string }>> => {
    try {
      const res = await adminApi.moderateProduct(id, { action: 'APPROVE' });
      return {
        success: true,
        data: { id: res.id, status: 'Active' },
        message: 'Product approved and made live',
      };
    } catch (err: any) {
      throw err;
    }
  },

  // POST /api/v1/admin/products/{id}/moderate (Reject)
  rejectProduct: async (id: string, reason: string): Promise<ApiResponse<{ id: string; status: string }>> => {
    try {
      const res = await adminApi.moderateProduct(id, { action: 'REJECT', reason });
      return {
        success: true,
        data: { id: res.id, status: 'Rejected' },
        message: 'Product listing rejected',
      };
    } catch (err: any) {
      throw err;
    }
  },

  // PATCH /api/v1/admin/products/{id}/status (Disable)
  disableProduct: async (id: string): Promise<ApiResponse<{ id: string; status: string }>> => {
    try {
      const res = await adminApi.updateProductStatus(id, 'INACTIVE');
      return {
        success: true,
        data: { id: res.id, status: 'Inactive' },
        message: 'Product disabled by admin',
      };
    } catch (err: any) {
      throw err;
    }
  },

  // PATCH /api/v1/admin/products/{id}/status (Enable)
  enableProduct: async (id: string): Promise<ApiResponse<{ id: string; status: string }>> => {
    try {
      const res = await adminApi.updateProductStatus(id, 'ACTIVE');
      return {
        success: true,
        data: { id: res.id, status: 'Active' },
        message: 'Product enabled by admin',
      };
    } catch (err: any) {
      throw err;
    }
  },
};

export const categoriesService = {
  // GET /api/v1/admin/categories
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    try {
      const res = await adminApi.getCategories(true);
      const flatList: Category[] = [];
      for (const root of res.items) {
        flatList.push(mapBackendCategoryToFrontend(root));
        if (root.subCategories) {
          for (const sub of root.subCategories) {
            flatList.push(mapBackendCategoryToFrontend(sub));
          }
        }
      }
      return {
        success: true,
        data: flatList,
      };
    } catch (err: any) {
      return {
        success: false,
        data: [],
        message: err.message || 'Failed to fetch categories',
      };
    }
  },

  // POST /api/v1/admin/categories
  createCategory: async (category: Omit<Category, 'id' | 'productCount'>): Promise<ApiResponse<Category>> => {
    try {
      const res = await adminApi.createCategory({
        name: category.name,
        iconName: category.iconName,
        parentCategoryId: category.parentCategory || null,
        isActive: category.isActive,
      });
      return {
        success: true,
        data: mapBackendCategoryToFrontend(res),
        message: 'Category created successfully',
      };
    } catch (err: any) {
      throw err;
    }
  },

  // PUT /api/v1/admin/categories/{id}
  updateCategory: async (id: string, updates: Partial<Category>): Promise<ApiResponse<Partial<Category>>> => {
    try {
      const res = await adminApi.updateCategory(id, {
        name: updates.name,
        iconName: updates.iconName,
        parentCategoryId: updates.parentCategory || null,
        isActive: updates.isActive,
      });
      return {
        success: true,
        data: mapBackendCategoryToFrontend(res),
        message: 'Category updated successfully',
      };
    } catch (err: any) {
      throw err;
    }
  },

  // PATCH /api/v1/admin/categories/{id}/status (Soft status toggle)
  toggleCategoryStatus: async (id: string, isActive: boolean): Promise<ApiResponse<{ id: string; isActive: boolean }>> => {
    try {
      const res = await adminApi.updateCategoryStatus(id, isActive);
      return {
        success: true,
        data: { id: res.id, isActive: res.isActive },
        message: 'Category status updated successfully',
      };
    } catch (err: any) {
      throw err;
    }
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
    } catch (err: any) {
      throw err;
    }
  },

  // Soft delete category (sets isActive to false)
  deleteCategory: async (id: string): Promise<ApiResponse<{ id: string }>> => {
    try {
      const res = await adminApi.updateCategoryStatus(id, false);
      return {
        success: true,
        data: { id: res.id },
        message: 'Category deactivated successfully',
      };
    } catch (err: any) {
      throw err;
    }
  },
};
