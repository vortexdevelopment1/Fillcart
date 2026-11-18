import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  code?: string;
  message?: string;
}

export interface ApiError {
  success: false;
  code: string;
  message: string;
}

// Single Axios Instance with baseURL /api/v1/admin, JWT Auth Header & 401 Interceptor
export const apiClient: AxiosInstance = axios.create({
  baseURL: '/api/v1/admin',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fillkart_admin_token') || 'mock_jwt_token_admin_sarah';
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: 401 Refresh Token Handler
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Mock token refresh
        const refreshedToken = 'refreshed_mock_jwt_token_' + Date.now();
        localStorage.setItem('fillkart_admin_token', refreshedToken);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${refreshedToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshErr) {
        localStorage.removeItem('fillkart_admin_token');
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

// Mock latency helper (300ms)
export const mockDelay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));
