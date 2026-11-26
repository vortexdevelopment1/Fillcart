import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import authClient, {
  getAccessToken,
  setAccessToken as setTokenInMemory,
  clearAccessToken,
  parseJwtPayload,
} from "../../services/authClient.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Synchronize module variable with React state
  const updateSession = useCallback((token) => {
    if (token) {
      setTokenInMemory(token);
      setAccessTokenState(token);
      const payload = parseJwtPayload(token);
      if (payload) {
        setUser({
          id: payload.sub || payload.userId || "user",
          email: payload.email || "",
          fullName: payload.fullName || payload.name || "Customer",
          role: payload.role || "customer",
          accountType: payload.account_type || payload.accountType || "CUSTOMER",
          sessionId: payload.session_id,
        });
      }
    } else {
      clearAccessToken();
      setAccessTokenState(null);
      setUser(null);
    }
  }, []);

  // Guard against double invocation in React StrictMode
  const silentRefreshTriggered = useRef(false);

  useEffect(() => {
    if (silentRefreshTriggered.current) return;
    silentRefreshTriggered.current = true;

    const restoreSession = async () => {
      try {
        const refreshedToken = await Promise.race([
          authClient.refreshAccessToken(),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000)),
        ]);
        if (refreshedToken) {
          updateSession(refreshedToken);
        } else {
          updateSession(null);
        }
      } catch {
        updateSession(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [updateSession]);

  /**
   * Log in using email & password
   */
  const login = useCallback(async ({ email, password }) => {
    const data = await authClient.login({ email, password });
    if (data?.accessToken) {
      updateSession(data.accessToken);
    }
    return data;
  }, [updateSession]);

  /**
   * Register a new account
   */
  const register = useCallback(async ({ email, password, fullName, phone, accountType = "CUSTOMER" }) => {
    const data = await authClient.register({ email, password, fullName, phone, accountType });
    if (data?.accessToken) {
      updateSession(data.accessToken);
    }
    return data;
  }, [updateSession]);

  /**
   * Log out and terminate session
   */
  const logout = useCallback(async () => {
    try {
      await authClient.logout();
    } catch (e) {
      console.warn("Central Auth logout error:", e.message || e);
    } finally {
      updateSession(null);
    }
  }, [updateSession]);

  /**
   * Manually trigger token refresh
   */
  const refreshSession = useCallback(async () => {
    const token = await authClient.refreshAccessToken();
    if (token) {
      updateSession(token);
      return token;
    }
    updateSession(null);
    return null;
  }, [updateSession]);

  const value = {
    user,
    setUser,
    accessToken,
    isAuthenticated: Boolean(accessToken),
    loading,
    login,
    register,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
