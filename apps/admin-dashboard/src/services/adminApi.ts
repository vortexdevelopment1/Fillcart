import axios, { AxiosError, AxiosInstance } from 'axios';
import type {
  BackendApiError,
  VerifySettingsAccessResponse,
  GetRolesResponse,
  GetStaffParams,
  GetStaffResponse,
  InviteStaffPayload,
  InviteStaffResponse,
  UpdateStaffStatusPayload,
  UpdateStaffStatusResponse,
  BackendCategoryItem,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  ReorderCategoryItem,
  BackendBrandItem,
  CreateBrandPayload,
  UpdateBrandPayload,
  BackendProductItem,
  GetProductsParams,
  GetProductsResponse,
  CreateProductPayload,
  UpdateProductPayload,
  ModerateProductPayload,
  BulkUpdateProductStatusPayload,
  BackendInventoryItem,
  GetInventoryParams,
  GetInventoryResponse,
  AdjustInventoryPayload,
  SettingsTabId,
  BackendSettingsGroupResponse,
  BackendAuditLogItem,
  GetAuditLogsParams,
  GetAuditLogsResponse,
  GetNotificationsResponse,
  GetSupportInfoResponse,
  CreateSupportTicketPayload,
  SupportTicketItem,
} from '../types/adminApi';
import { initialStaff, initialRolePermissions } from '../data/staffData';
import { initialCategories, initialProducts } from '../data/products';
import { initialSettings } from '../data/settingsData';
import { initialAuditLogs } from '../data/auditData';

export class AdminApiError extends Error {
  public code: string;
  public statusCode: number;
  public details?: Array<{ field: string; message: string }>;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', statusCode: number = 500, details?: Array<{ field: string; message: string }>) {
    super(message);
    this.name = 'AdminApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Extracts unified backend error format: { error: { code, message, details } }
 */
export function parseApiError(error: unknown): AdminApiError {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<{ error?: BackendApiError; message?: string }>;
    const resData = axiosErr.response?.data;
    const statusCode = axiosErr.response?.status || 500;

    if (resData?.error) {
      return new AdminApiError(
        resData.error.message || 'An error occurred',
        resData.error.code || 'API_ERROR',
        statusCode,
        resData.error.details
      );
    }

    if (typeof resData?.message === 'string') {
      return new AdminApiError(resData.message, 'API_ERROR', statusCode);
    }

    if (statusCode === 401) {
      return new AdminApiError('Authentication required or session expired', 'UNAUTHORIZED', 401);
    }
    if (statusCode === 403) {
      return new AdminApiError('Insufficient permissions', 'FORBIDDEN', 403);
    }

    return new AdminApiError(axiosErr.message || 'Network error', 'NETWORK_ERROR', statusCode);
  }

  if (error instanceof AdminApiError) {
    return error;
  }

  return new AdminApiError((error as Error)?.message || 'Unexpected error occurred');
}

export const isMockMode = (): boolean => {
  return import.meta.env.VITE_USE_MOCK_API === 'true' || import.meta.env.VITE_USE_MOCK_API === true;
};

// Base URL configured via VITE_API_BASE_URL (defaults to /api/v1 for Vite proxy or direct)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const adminClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: Attach access token
adminClient.interceptors.request.use(
  (config) => {
    const token =
      sessionStorage.getItem('fillkart_admin_token') ||
      localStorage.getItem('fillkart_admin_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(parseApiError(error))
);

// Response interceptor: 401 token refresh handler
adminClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Do NOT redirect to login if 401 is from password verification in settings
    if (originalRequest?.url?.includes('/auth/verify-settings-access')) {
      return Promise.reject(parseApiError(error));
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken =
          sessionStorage.getItem('fillkart_admin_refresh_token') ||
          localStorage.getItem('fillkart_admin_refresh_token');

        if (refreshToken) {
          const refreshRes = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          const newAccessToken = refreshRes.data?.accessToken;
          if (newAccessToken) {
            sessionStorage.setItem('fillkart_admin_token', newAccessToken);
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            return adminClient(originalRequest);
          }
        }
      } catch {
        sessionStorage.removeItem('fillkart_admin_token');
        sessionStorage.removeItem('fillkart_admin_refresh_token');
        sessionStorage.removeItem('fillkart_admin_user');
        localStorage.removeItem('fillkart_admin_token');
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(parseApiError(error));
  }
);

// In-memory mock storage for fallback mode
let mockStaffState = [...initialStaff];

export const adminApi = {
  /**
   * POST /api/v1/auth/login
   */
  login: async (payload: { email: string; password: string }): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> => {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 400));
      if (!payload.email || !payload.password) {
        throw new AdminApiError('Email and password are required', 'VALIDATION_ERROR', 400);
      }
      const mockToken = 'mock-admin-access-token';
      sessionStorage.setItem('fillkart_admin_token', mockToken);
      sessionStorage.setItem('fillkart_admin_user', JSON.stringify({
        email: payload.email,
        name: 'Dev Super Admin',
        role: 'Super Admin',
      }));
      return {
        accessToken: mockToken,
        refreshToken: 'mock-refresh-token',
        expiresIn: 900,
      };
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      const data = res.data;
      if (data.accessToken) {
        sessionStorage.setItem('fillkart_admin_token', data.accessToken);
        if (data.refreshToken) {
          sessionStorage.setItem('fillkart_admin_refresh_token', data.refreshToken);
        }
        sessionStorage.setItem('fillkart_admin_user', JSON.stringify({
          email: payload.email,
          name: 'Dev Super Admin',
          role: 'Super Admin',
        }));
      }
      return data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  /**
   * POST /api/v1/auth/logout
   */
  logout: async (): Promise<void> => {
    try {
      const refreshToken = sessionStorage.getItem('fillkart_admin_refresh_token');
      if (refreshToken && !isMockMode()) {
        await axios.post(`${API_BASE_URL}/auth/logout`, { refreshToken }).catch(() => {});
      }
    } finally {
      sessionStorage.removeItem('fillkart_admin_token');
      sessionStorage.removeItem('fillkart_admin_refresh_token');
      sessionStorage.removeItem('fillkart_admin_user');
      sessionStorage.removeItem('fillkart_settings_grant_token');
      sessionStorage.removeItem('fillkart_settings_unlocked_until');
      localStorage.removeItem('fillkart_admin_token');
    }
  },

  /**
   * Checks if an admin token exists in session
   */
  isAuthenticated: (): boolean => {
    try {
      return Boolean(
        sessionStorage.getItem('fillkart_admin_token') ||
        localStorage.getItem('fillkart_admin_token')
      );
    } catch {
      return false;
    }
  },

  /**
   * POST /api/v1/admin/auth/verify-settings-access
   */
  verifySettingsAccess: async (password: string): Promise<VerifySettingsAccessResponse> => {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 400));
      // In mock mode, accept non-empty password
      if (!password.trim()) {
        throw new AdminApiError('Password is required', 'VALIDATION_ERROR', 400);
      }
      return {
        verified: true,
        token: 'mock-settings-grant-token',
        expiresIn: 900,
      };
    }

    try {
      const res = await adminClient.post<VerifySettingsAccessResponse>('/auth/verify-settings-access', {
        password,
      });
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  /**
   * GET /api/v1/admin/roles
   */
  getRoles: async (): Promise<GetRolesResponse> => {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 300));
      const formattedRoles = Object.keys(initialRolePermissions).map((name, idx) => ({
        id: `mock-role-${idx}`,
        name,
        description: `${name} operational template`,
        isSystem: true,
        permissions: ['staff:view'],
      }));
      return { roles: formattedRoles };
    }

    try {
      const res = await adminClient.get<GetRolesResponse>('/roles');
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  /**
   * GET /api/v1/admin/staff
   */
  getStaff: async (params: GetStaffParams = {}): Promise<GetStaffResponse> => {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 350));
      let filtered = [...mockStaffState];

      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
        );
      }
      if (params.status) {
        if (params.status === 'ACTIVE') {
          filtered = filtered.filter((s) => s.isActive);
        } else if (params.status === 'DEACTIVATED' || params.status === 'SUSPENDED') {
          filtered = filtered.filter((s) => !s.isActive);
        }
      }
      if (params.profile) {
        filtered = filtered.filter((s) => s.role.toLowerCase() === params.profile?.toLowerCase());
      }

      const page = params.page || 1;
      const limit = params.limit || 10;
      const start = (page - 1) * limit;
      const paginated = filtered.slice(start, start + limit);

      const items = paginated.map((s) => ({
        id: s.id,
        fullName: s.name,
        email: s.email,
        phone: s.phone,
        status: (s.isActive ? 'ACTIVE' : 'DEACTIVATED') as 'ACTIVE' | 'DEACTIVATED',
        role: s.role,
        profile: s.role,
        lastLogin: s.lastLogin,
        createdAt: s.createdDate,
      }));

      return {
        items,
        pagination: {
          page,
          limit,
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / limit) || 1,
        },
      };
    }

    try {
      const res = await adminClient.get<GetStaffResponse>('/staff', { params });
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  /**
   * POST /api/v1/admin/staff/invite
   */
  inviteStaff: async (payload: InviteStaffPayload): Promise<InviteStaffResponse> => {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 400));
      const newId = `st-mock-${Date.now().toString().slice(-4)}`;
      mockStaffState.unshift({
        id: newId,
        name: payload.fullName,
        email: payload.email,
        phone: '',
        role: 'Operations Admin',
        lastLogin: 'Never',
        isActive: true,
        initials: payload.fullName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase(),
        createdDate: new Date().toLocaleDateString(),
      });

      return {
        id: newId,
        email: payload.email,
        fullName: payload.fullName,
        roleId: payload.roleId,
        profileId: payload.profileId || null,
        expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
        createdAt: new Date().toISOString(),
      };
    }

    try {
      const res = await adminClient.post<InviteStaffResponse>('/staff/invite', payload);
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  /**
   * PATCH /api/v1/admin/staff/:id/status
   */
  updateStaffStatus: async (
    id: string,
    payload: UpdateStaffStatusPayload
  ): Promise<UpdateStaffStatusResponse> => {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 300));
      const target = mockStaffState.find((s) => s.id === id);
      if (!target) {
        throw new AdminApiError('Staff member not found', 'NOT_FOUND', 404);
      }
      if (target.role === 'Super Admin' && payload.status !== 'ACTIVE') {
        const activeAdmins = mockStaffState.filter((s) => s.role === 'Super Admin' && s.isActive);
        if (activeAdmins.length <= 1) {
          throw new AdminApiError(
            'Administrative safety violation: Cannot deactivate the last remaining active Super Admin.',
            'FORBIDDEN',
            403
          );
        }
      }

      target.isActive = payload.status === 'ACTIVE';
      return {
        id,
        status: payload.status,
        suspensionReason: payload.reason || null,
      };
    }

    try {
      const res = await adminClient.patch<UpdateStaffStatusResponse>(`/staff/${id}/status`, payload);
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  // ---------------------------------------------------------------------------
  // Categories Module
  // ---------------------------------------------------------------------------

  /**
   * GET /api/v1/admin/categories
   */
  getCategories: async (includeInactive = true): Promise<{ items: BackendCategoryItem[] }> => {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 200));
      const items: BackendCategoryItem[] = initialCategories.map((c, idx) => ({
        id: c.id,
        name: c.name,
        slug: c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: `${c.name} category`,
        iconName: c.iconName,
        parentCategoryId: null,
        displayOrder: idx + 1,
        isActive: c.isActive,
        subCategories: [],
        _count: { products: c.productCount },
      }));
      return { items };
    }

    try {
      const res = await adminClient.get<{ items: BackendCategoryItem[] }>('/categories', {
        params: { includeInactive },
      });
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  /**
   * POST /api/v1/admin/categories
   */
  createCategory: async (payload: CreateCategoryPayload): Promise<BackendCategoryItem> => {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 300));
      return {
        id: `cat-${Date.now()}`,
        name: payload.name,
        slug: payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: payload.description || null,
        iconName: payload.iconName || 'Package',
        parentCategoryId: payload.parentCategoryId || null,
        displayOrder: payload.displayOrder || 1,
        isActive: payload.isActive ?? true,
        subCategories: [],
        _count: { products: 0 },
      };
    }

    try {
      const res = await adminClient.post<BackendCategoryItem>('/categories', payload);
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  /**
   * PUT /api/v1/admin/categories/:id
   */
  updateCategory: async (id: string, payload: UpdateCategoryPayload): Promise<BackendCategoryItem> => {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 200));
      return {
        id,
        name: payload.name || 'Updated Category',
        slug: (payload.name || 'category').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: payload.description || null,
        iconName: payload.iconName || 'Package',
        parentCategoryId: payload.parentCategoryId || null,
        displayOrder: payload.displayOrder || 1,
        isActive: payload.isActive ?? true,
        subCategories: [],
        _count: { products: 0 },
      };
    }

    try {
      const res = await adminClient.put<BackendCategoryItem>(`/categories/${id}`, payload);
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  /**
   * PATCH /api/v1/admin/categories/:id/status
   */
  updateCategoryStatus: async (id: string, isActive: boolean): Promise<BackendCategoryItem> => {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 150));
      return {
        id,
        name: 'Toggled Category',
        slug: 'toggled-category',
        displayOrder: 1,
        isActive,
        subCategories: [],
      };
    }

    try {
      const res = await adminClient.patch<BackendCategoryItem>(`/categories/${id}/status`, { isActive });
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  /**
   * PUT /api/v1/admin/categories/reorder
   */
  reorderCategories: async (items: ReorderCategoryItem[]): Promise<{ reordered: ReorderCategoryItem[] }> => {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 200));
      return { reordered: items };
    }

    try {
      const res = await adminClient.put<{ reordered: ReorderCategoryItem[] }>('/categories/reorder', { items });
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  // ---------------------------------------------------------------------------
  // Brands Module
  // ---------------------------------------------------------------------------

  /**
   * GET /api/v1/admin/brands
   */
  getBrands: async (params?: { page?: number; limit?: number; search?: string; isActive?: boolean }): Promise<{ items: BackendBrandItem[]; pagination: any }> => {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 200));
      return {
        items: [
          { id: 'b-1', name: 'Aashirvaad', slug: 'aashirvaad', logoUrl: null, isActive: true },
          { id: 'b-2', name: 'Amul', slug: 'amul', logoUrl: null, isActive: true },
          { id: 'b-3', name: 'Fortune', slug: 'fortune', logoUrl: null, isActive: true },
          { id: 'b-4', name: 'Tata', slug: 'tata', logoUrl: null, isActive: true },
          { id: 'b-5', name: 'Nestle', slug: 'nestle', logoUrl: null, isActive: true },
        ],
        pagination: { page: 1, limit: 10, total: 5, totalPages: 1 },
      };
    }

    try {
      const res = await adminClient.get<{ items: BackendBrandItem[]; pagination: any }>('/brands', { params });
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  /**
   * POST /api/v1/admin/brands
   */
  createBrand: async (payload: CreateBrandPayload): Promise<BackendBrandItem> => {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 200));
      return {
        id: `brand-${Date.now()}`,
        name: payload.name,
        slug: payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        logoUrl: payload.logoUrl || null,
        isActive: payload.isActive ?? true,
      };
    }

    try {
      const res = await adminClient.post<BackendBrandItem>('/brands', payload);
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  /**
   * PUT /api/v1/admin/brands/:id
   */
  updateBrand: async (id: string, payload: UpdateBrandPayload): Promise<BackendBrandItem> => {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 200));
      return {
        id,
        name: payload.name || 'Brand',
        slug: 'brand',
        logoUrl: payload.logoUrl || null,
        isActive: payload.isActive ?? true,
      };
    }

    try {
      const res = await adminClient.put<BackendBrandItem>(`/brands/${id}`, payload);
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  /**
   * PATCH /api/v1/admin/brands/:id/status
   */
  updateBrandStatus: async (id: string, isActive: boolean): Promise<BackendBrandItem> => {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 150));
      return { id, name: 'Brand', slug: 'brand', isActive };
    }

    try {
      const res = await adminClient.patch<BackendBrandItem>(`/brands/${id}/status`, { isActive });
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  // ---------------------------------------------------------------------------
  // Products Module
  // ---------------------------------------------------------------------------

  /**
   * GET /api/v1/admin/products
   */
  getProducts: async (params?: GetProductsParams): Promise<GetProductsResponse> => {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 300));
      const items: BackendProductItem[] = initialProducts.map((p, idx) => ({
        id: p.id,
        name: p.name,
        slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: p.description || null,
        categoryId: `cat-${idx + 1}`,
        brandId: null,
        hsnCode: null,
        status: p.isActive ? 'ACTIVE' : 'INACTIVE',
        moderationStatus: p.status === 'Pending approval' ? 'PENDING' : p.status === 'Rejected' ? 'REJECTED' : 'APPROVED',
        rejectionReason: p.rejectReason || null,
        isActive: p.isActive,
        category: { id: `cat-${idx + 1}`, name: p.category },
        brand: { id: `brand-${idx + 1}`, name: p.brand },
        variants: [
          {
            id: `var-${p.id}`,
            productId: p.id,
            sku: p.sku,
            variantName: p.unit,
            unitQuantity: 1,
            unitType: 'UNIT',
            mrpPaisa: Math.round(p.mrp * 100).toString(),
            salePricePaisa: Math.round(p.salePrice * 100).toString(),
            discountPct: p.discountPct,
            isDefault: true,
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      return {
        items,
        pagination: { page: 1, limit: 50, total: items.length, totalPages: 1 },
      };
    }

    try {
      const res = await adminClient.get<GetProductsResponse>('/products', { params });
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  /**
   * GET /api/v1/admin/products/:id
   */
  getProductById: async (id: string): Promise<BackendProductItem> => {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 200));
      const p = initialProducts.find((i) => i.id === id) || initialProducts[0];
      return {
        id: p.id,
        name: p.name,
        slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: p.description || null,
        categoryId: 'cat-1',
        brandId: null,
        hsnCode: null,
        status: p.isActive ? 'ACTIVE' : 'INACTIVE',
        moderationStatus: 'APPROVED',
        rejectionReason: null,
        isActive: p.isActive,
        category: { id: 'cat-1', name: p.category },
        brand: { id: 'brand-1', name: p.brand },
        variants: [
          {
            id: `var-${p.id}`,
            productId: p.id,
            sku: p.sku,
            variantName: p.unit,
            unitQuantity: 1,
            unitType: 'UNIT',
            mrpPaisa: Math.round(p.mrp * 100).toString(),
            salePricePaisa: Math.round(p.salePrice * 100).toString(),
            discountPct: p.discountPct,
            isDefault: true,
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    try {
      const res = await adminClient.get<BackendProductItem>(`/products/${id}`);
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  /**
   * POST /api/v1/admin/products
   */
  createProduct: async (payload: CreateProductPayload): Promise<BackendProductItem> => {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 300));
      const newId = `prod-${Date.now()}`;
      return {
        id: newId,
        name: payload.name,
        slug: payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: payload.description || null,
        categoryId: payload.categoryId,
        brandId: payload.brandId || null,
        hsnCode: payload.hsnCode || null,
        status: payload.status || 'ACTIVE',
        moderationStatus: 'APPROVED',
        rejectionReason: null,
        isActive: true,
        variants: payload.variants.map((v, i) => ({
          id: `var-${newId}-${i}`,
          productId: newId,
          sku: v.sku,
          variantName: v.variantName,
          unitQuantity: v.unitQuantity,
          unitType: v.unitType || 'UNIT',
          mrpPaisa: v.mrpPaisa,
          salePricePaisa: v.salePricePaisa,
          discountPct: v.discountPct || 0,
          isDefault: v.isDefault ?? true,
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    try {
      const res = await adminClient.post<BackendProductItem>('/products', payload);
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  /**
   * PUT /api/v1/admin/products/:id
   */
  updateProduct: async (id: string, payload: UpdateProductPayload): Promise<BackendProductItem> => {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 300));
      return {
        id,
        name: payload.name || 'Updated Product',
        slug: 'updated-product',
        description: payload.description || null,
        categoryId: payload.categoryId || 'cat-1',
        brandId: payload.brandId || null,
        hsnCode: payload.hsnCode || null,
        status: payload.status || 'ACTIVE',
        moderationStatus: 'APPROVED',
        rejectionReason: null,
        isActive: true,
        variants: (payload.variants || []).map((v, i) => ({
          id: `var-${id}-${i}`,
          productId: id,
          sku: v.sku,
          variantName: v.variantName,
          unitQuantity: v.unitQuantity,
          unitType: v.unitType || 'UNIT',
          mrpPaisa: v.mrpPaisa,
          salePricePaisa: v.salePricePaisa,
          discountPct: v.discountPct || 0,
          isDefault: v.isDefault ?? true,
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    try {
      const res = await adminClient.put<BackendProductItem>(`/products/${id}`, payload);
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  /**
   * PATCH /api/v1/admin/products/:id/status
   */
  updateProductStatus: async (id: string, status: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'ARCHIVED'): Promise<BackendProductItem> => {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 200));
      return {
        id,
        name: 'Product',
        slug: 'product',
        categoryId: 'cat-1',
        status,
        moderationStatus: 'APPROVED',
        isActive: status === 'ACTIVE',
        variants: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    try {
      const res = await adminClient.patch<BackendProductItem>(`/products/${id}/status`, { status });
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  /**
   * POST /api/v1/admin/products/:id/moderate
   */
  moderateProduct: async (id: string, payload: ModerateProductPayload): Promise<BackendProductItem> => {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 250));
      const modStatus = payload.action === 'APPROVE' ? 'APPROVED' : payload.action === 'REJECT' ? 'REJECTED' : 'CHANGES_REQUESTED';
      return {
        id,
        name: 'Moderated Product',
        slug: 'moderated-product',
        categoryId: 'cat-1',
        status: payload.action === 'APPROVE' ? 'ACTIVE' : 'INACTIVE',
        moderationStatus: modStatus,
        rejectionReason: payload.reason || null,
        isActive: payload.action === 'APPROVE',
        variants: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    try {
      const res = await adminClient.post<BackendProductItem>(`/products/${id}/moderate`, payload);
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  /**
   * POST /api/v1/admin/products/bulk-status
   */
  bulkUpdateProductStatus: async (payload: BulkUpdateProductStatusPayload): Promise<{ affectedCount: number; status: string }> => {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 300));
      return { affectedCount: payload.productIds.length, status: payload.status };
    }

    try {
      const res = await adminClient.post<{ affectedCount: number; status: string }>('/products/bulk-status', payload);
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  // ---------------------------------------------------------------------------
  // Inventory Module
  // ---------------------------------------------------------------------------

  /**
   * GET /api/v1/admin/inventory
   */
  getInventory: async (params?: GetInventoryParams): Promise<GetInventoryResponse> => {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 200));
      return {
        items: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
    }

    try {
      const res = await adminClient.get<GetInventoryResponse>('/inventory', { params });
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  /**
   * POST /api/v1/admin/inventory/adjust
   */
  adjustInventory: async (payload: AdjustInventoryPayload): Promise<BackendInventoryItem> => {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 250));
      return {
        id: `inv-${Date.now()}`,
        storeId: payload.storeId,
        variantId: payload.variantId,
        quantityOnHand: payload.adjustmentQuantity,
        reservedQuantity: 0,
        updatedAt: new Date().toISOString(),
      };
    }

    try {
      const res = await adminClient.post<BackendInventoryItem>('/inventory/adjust', payload);
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  // ---------------------------------------------------------------------------
  // Settings Module
  // ---------------------------------------------------------------------------

  /**
   * GET /api/v1/admin/settings/:group
   */
  getSettingsGroup: async (group: SettingsTabId): Promise<BackendSettingsGroupResponse> => {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 200));
      const groupKey = group.toLowerCase() as keyof typeof initialSettings;
      return {
        group,
        settings: (initialSettings as any)[groupKey] || {},
      };
    }

    try {
      const grantToken = sessionStorage.getItem('fillkart_settings_grant_token');
      const res = await adminClient.get<BackendSettingsGroupResponse>(`/settings/${group}`, {
        headers: grantToken ? { 'x-settings-grant': grantToken } : {},
      });
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  /**
   * PUT /api/v1/admin/settings/:group
   */
  updateSettingsGroup: async (group: SettingsTabId, settings: Record<string, any>): Promise<BackendSettingsGroupResponse> => {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 300));
      return { group, settings };
    }

    try {
      const grantToken = sessionStorage.getItem('fillkart_settings_grant_token');
      const res = await adminClient.put<BackendSettingsGroupResponse>(
        `/settings/${group}`,
        { settings },
        {
          headers: grantToken ? { 'x-settings-grant': grantToken } : {},
        }
      );
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  // ---------------------------------------------------------------------------
  // Audit Logs Module
  // ---------------------------------------------------------------------------

  /**
   * GET /api/v1/admin/audit-logs
   */
  getAuditLogs: async (params?: GetAuditLogsParams): Promise<GetAuditLogsResponse> => {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 250));
      const items: BackendAuditLogItem[] = initialAuditLogs.map((l) => ({
        id: l.id,
        adminUserId: 'mock-admin-1',
        action: l.action,
        targetType: l.module,
        targetId: l.target,
        changesSummary: l.diff ? { before: {}, after: {} } : null,
        ipAddress: l.ip,
        userAgent: l.browser,
        createdAt: new Date().toISOString(),
        adminUser: {
          id: 'mock-admin-1',
          email: l.admin.email,
          fullName: l.admin.name,
        },
      }));

      return {
        items,
        pagination: { page: 1, limit: 50, total: items.length, totalPages: 1 },
      };
    }

    try {
      const res = await adminClient.get<GetAuditLogsResponse>('/audit-logs', { params });
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  /**
   * ==========================================
   * B.13 ADMIN NOTIFICATIONS & ALERTS
   * ==========================================
   */
  getNotifications: async (): Promise<GetNotificationsResponse> => {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 200));
      return {
        notifications: [
          {
            id: 'mock-notif-1',
            title: 'KYC Verification Required',
            message: '3 vendor verification documents are awaiting review.',
            category: 'KYC',
            severity: 'WARNING',
            isRead: false,
            actionUrl: '/document-verification',
            actionLabel: 'Review Documents',
            createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          },
          {
            id: 'mock-notif-2',
            title: 'Catalog Moderation Pending',
            message: '2 new merchant products are pending admin approval.',
            category: 'SYSTEM',
            severity: 'INFO',
            isRead: false,
            actionUrl: '/products',
            actionLabel: 'Review Products',
            createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          },
          {
            id: 'mock-notif-3',
            title: 'Fleet Operations Status',
            message: 'All delivery partner fleets are operating normally.',
            category: 'ORDERS',
            severity: 'SUCCESS',
            isRead: true,
            actionUrl: '/riders',
            actionLabel: 'View Riders',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
        ],
        unreadCount: 2,
      };
    }

    try {
      const res = await adminClient.get<GetNotificationsResponse>('/notifications');
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  markNotificationRead: async (id: string): Promise<{ success: boolean }> => {
    if (isMockMode()) {
      return { success: true };
    }

    try {
      const res = await adminClient.patch<{ success: boolean }>(`/notifications/${id}/read`);
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  markAllNotificationsRead: async (): Promise<{ success: boolean }> => {
    if (isMockMode()) {
      return { success: true };
    }

    try {
      const res = await adminClient.post<{ success: boolean }>('/notifications/mark-all-read');
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  /**
   * ==========================================
   * B.14 ADMIN OPS DESK & HELP RUNBOOKS
   * ==========================================
   */
  getSupportInfo: async (): Promise<GetSupportInfoResponse> => {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 200));
      return {
        contacts: [
          {
            id: 'c-1',
            role: 'DevOps & Infrastructure On-Call',
            name: 'Vikram Seth',
            email: 'devops-lead@fillkart.in',
            phone: '+91 98765 43210',
            availability: '24x7 Emergency Escalation',
            category: 'ENGINEERING',
          },
          {
            id: 'c-2',
            role: 'Database & DB Administrator (DBA)',
            name: 'Pooja Nair',
            email: 'dba-team@fillkart.in',
            phone: '+91 98765 43211',
            availability: '08:00 - 22:00 IST',
            category: 'DATABASE',
          },
          {
            id: 'c-3',
            role: 'Payment Gateway Nodal Desk',
            name: 'Razorpay / Cashfree Desk',
            email: 'nodal-support@fillkart.in',
            phone: '+91 98765 43212',
            availability: '24x7 Banking Gateway Operations',
            category: 'PAYMENT_GATEWAY',
          },
        ],
        runbooks: [
          {
            id: 'sop-kyc-reject',
            category: 'KYC',
            title: 'SOP: High-Risk Vendor Document Rejection',
            summary: 'Steps to take when a document appears forged or mismatched.',
            steps: [
              'Navigate to Document Verification (/document-verification).',
              'Examine the GSTIN / PAN using the verify button.',
              'If forged, select Reject and enter a clear audit note reason.',
              'Submit a high-priority incident ticket if fraud is suspected.',
            ],
          },
          {
            id: 'sop-refund-dispute',
            category: 'FINANCE',
            title: 'SOP: Gateway Double-Debit & Auto-Refund Resolution',
            summary: 'Handling customer claims for disputed or stuck transactions.',
            steps: [
              'Cross-check payment ID in Payments (/payments).',
              'Check gateway webhook logs in Audit Logs.',
              'If gateway captured but order failed, initiate refund from Finance portal.',
            ],
          },
        ],
        recentTickets: [
          {
            id: 't-1',
            ticketNumber: 'TKT-100234',
            subject: 'Gateway Webhook Latency Check',
            category: 'PAYMENT_GATEWAY',
            priority: 'MEDIUM',
            description: 'Webhook latency elevated on HDFC netbanking callbacks.',
            status: 'RESOLVED',
            createdByName: 'Sarah Mitchell',
            createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
          },
        ],
      };
    }

    try {
      const res = await adminClient.get<GetSupportInfoResponse>('/support/info');
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  createSupportTicket: async (payload: CreateSupportTicketPayload): Promise<SupportTicketItem> => {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 300));
      const rand = Math.floor(100000 + Math.random() * 900000);
      return {
        id: `t-${rand}`,
        ticketNumber: `TKT-${rand}`,
        subject: payload.subject,
        category: payload.category,
        priority: payload.priority || 'MEDIUM',
        description: payload.description,
        status: 'OPEN',
        createdByName: 'Sarah Mitchell',
        createdAt: new Date().toISOString(),
      };
    }

    try {
      const res = await adminClient.post<SupportTicketItem>('/support/tickets', payload);
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },
};
