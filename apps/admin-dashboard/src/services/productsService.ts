import { ApiResponse, mockDelay } from './apiClient';
import { initialProducts, initialCategories, Product, Category } from '../data/products';

export const productsService = {
  // GET /products
  getProducts: async (): Promise<ApiResponse<Product[]>> => {
    await mockDelay(300);
    return {
      success: true,
      data: initialProducts,
    };
  },

  // PATCH /products/{id}/approve
  approveProduct: async (id: string): Promise<ApiResponse<{ id: string; status: string }>> => {
    await mockDelay(300);
    return {
      success: true,
      data: { id, status: 'Active' },
      message: 'Product approved and made live',
    };
  },

  // PATCH /products/{id}/disable
  disableProduct: async (id: string): Promise<ApiResponse<{ id: string; status: string }>> => {
    await mockDelay(300);
    return {
      success: true,
      data: { id, status: 'Inactive' },
      message: 'Product disabled by admin',
    };
  },
};

export const categoriesService = {
  // GET /categories
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    await mockDelay(300);
    return {
      success: true,
      data: initialCategories,
    };
  },

  // POST /categories
  createCategory: async (category: Omit<Category, 'id' | 'productCount'>): Promise<ApiResponse<Category>> => {
    await mockDelay(300);
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      productCount: 0,
      ...category,
    };
    return {
      success: true,
      data: newCat,
      message: 'Category created successfully',
    };
  },

  // PUT /categories/{id}
  updateCategory: async (id: string, updates: Partial<Category>): Promise<ApiResponse<Partial<Category>>> => {
    await mockDelay(300);
    return {
      success: true,
      data: { id, ...updates },
      message: 'Category updated successfully',
    };
  },

  // DELETE /categories/{id}
  deleteCategory: async (id: string): Promise<ApiResponse<{ id: string }>> => {
    await mockDelay(300);
    return {
      success: true,
      data: { id },
      message: 'Category deleted successfully',
    };
  },
};
