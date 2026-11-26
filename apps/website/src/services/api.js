import axios from "axios";
import authClient, { getAccessToken, clearAccessToken } from "./authClient.js";

// Resolve backend base URL from Vite environment variables with production fallback
const rawBaseUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? "https://fillcarts-backend.onrender.com"
    : "http://localhost:3000");

// Normalize baseURL so it always targets the /api prefix correctly
const cleanedBaseUrl = rawBaseUrl.trim().replace(/\/+$/, "");
const API_BASE_URL = cleanedBaseUrl.endsWith("/api")
  ? cleanedBaseUrl
  : `${cleanedBaseUrl}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Attach Authorization header from in-memory token (no localStorage/sessionStorage)
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let onUnauthorizedCallback = null;

export const setOnUnauthorized = (cb) => {
  onUnauthorizedCallback = cb;
};

// Handle 401: perform one coordinated refresh via Web Locks and retry once; else clear session and redirect to /login
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/")
    ) {
      originalRequest._retry = true;
      try {
        const refreshedToken = await authClient.refreshAccessToken();
        if (refreshedToken) {
          originalRequest.headers.Authorization = `Bearer ${refreshedToken}`;
          return api(originalRequest);
        }
      } catch (refreshErr) {
        clearAccessToken();
        if (typeof onUnauthorizedCallback === "function") {
          onUnauthorizedCallback(refreshErr);
        }
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshErr);
      }
    }

    if (error.response && error.response.status === 401) {
      if (typeof onUnauthorizedCallback === "function") {
        onUnauthorizedCallback(error);
      }
    }
    return Promise.reject(error);
  }
);

export { API_BASE_URL };
export default api;
