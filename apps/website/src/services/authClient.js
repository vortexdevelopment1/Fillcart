import axios from "axios";
import { coordinateWebLockRefresh } from "@fillcart/ui-web";

// Resolve Central Auth base URL from Vite environment variables with fallback
const rawAuthUrl =
  import.meta.env.VITE_AUTH_API_URL ||
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://fillcarts-backend.onrender.com"
    : "http://localhost:3000");

const AUTH_BASE_URL = rawAuthUrl.trim().replace(/\/+$/, "");

/**
 * Pure dependency-free JWT payload decoder
 */
export function parseJwtPayload(token) {
  if (!token || typeof token !== "string") return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// In-memory access token storage (never written to localStorage or sessionStorage)
let inMemoryAccessToken = null;

export const getAccessToken = () => inMemoryAccessToken;

export const setAccessToken = (token) => {
  inMemoryAccessToken = token || null;
};

export const clearAccessToken = () => {
  inMemoryAccessToken = null;
};

export const isTokenFresh = () => {
  if (!inMemoryAccessToken) return false;
  const payload = parseJwtPayload(inMemoryAccessToken);
  if (!payload?.exp) return false;
  // Consider fresh if expiration is at least 30 seconds into the future
  return payload.exp * 1000 > Date.now() + 30000;
};

// Dedicated axios instance for Central Auth operations with credentials included
const authHttp = axios.create({
  baseURL: AUTH_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Central Auth Client Services
 */
const authClient = {
  /**
   * Register a new Customer account
   * POST /api/v1/auth/register
   */
  async register({ email, password, fullName, phone, accountType = "CUSTOMER" }) {
    const response = await authHttp.post("/api/v1/auth/register", {
      email: email.trim(),
      password,
      fullName: fullName.trim(),
      phone: phone ? phone.trim() : undefined,
      accountType,
    });
    if (response.data?.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    return response.data;
  },

  /**
   * Authenticate with email & password
   * POST /api/v1/auth/login
   */
  async login({ email, password }) {
    const response = await authHttp.post("/api/v1/auth/login", {
      email: email.trim(),
      password,
    });
    if (response.data?.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    return response.data;
  },

  /**
   * Execute single-use rolling refresh token rotation via HttpOnly cookie
   * POST /api/v1/auth/refresh
   */
  async refresh() {
    const response = await authHttp.post("/api/v1/auth/refresh");
    if (response.data?.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    return response.data;
  },

  /**
   * Terminate authenticated session family
   * POST /api/v1/auth/logout
   */
  async logout() {
    try {
      const token = getAccessToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await authHttp.post("/api/v1/auth/logout", {}, { headers });
    } finally {
      clearAccessToken();
    }
  },

  /**
   * Request phone verification OTP (MSG91 gateway)
   * POST /api/v1/auth/otp/send
   */
  async sendOtp({ phone, accountType = "CUSTOMER", purpose = "PHONE_VERIFICATION" }) {
    const response = await authHttp.post("/api/v1/auth/otp/send", {
      phone: phone.trim(),
      accountType,
      purpose,
    });
    return response.data;
  },

  /**
   * Verify phone OTP challenge (phone verification only, returns no tokens)
   * POST /api/v1/auth/otp/verify
   */
  async verifyOtp({ challengeId, otp, phone, accountType = "CUSTOMER", purpose = "PHONE_VERIFICATION" }) {
    const response = await authHttp.post("/api/v1/auth/otp/verify", {
      challengeId,
      otp: otp.trim(),
      phone: phone.trim(),
      accountType,
      purpose,
    });
    return response.data;
  },

  /**
   * Cross-tab coordinated token refresh using @fillcart/ui-web Web Locks API
   */
  async refreshAccessToken() {
    return await coordinateWebLockRefresh(
      async () => {
        try {
          const res = await authHttp.post("/api/v1/auth/refresh");
          if (res.data?.accessToken) {
            setAccessToken(res.data.accessToken);
            return res.data.accessToken;
          }
          return null;
        } catch (err) {
          clearAccessToken();
          throw err;
        }
      },
      () => isTokenFresh()
    );
  },
};

export { AUTH_BASE_URL };
export default authClient;
