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
} from '../types/adminApi';
import { initialStaff, initialRolePermissions } from '../data/staffData';

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
};
