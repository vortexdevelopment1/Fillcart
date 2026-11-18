import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { coordinateWebLockRefresh } from "./web-lock-refresh.js";

describe("Web Locks Cross-Tab Refresh Coordinator", () => {
  const originalNavigator = global.navigator;

  afterEach(() => {
    Object.defineProperty(global, "navigator", {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
    vi.restoreAllMocks();
  });

  it("acquires fillcart_auth_refresh_lock and runs refreshAction when token is not fresh", async () => {
    let requestedLockName = "";
    const mockLocks = {
      request: vi.fn(async (name: string, callback: () => Promise<any>) => {
        requestedLockName = name;
        return await callback();
      }),
    };

    Object.defineProperty(global, "navigator", {
      value: { locks: mockLocks },
      writable: true,
      configurable: true,
    });

    const refreshAction = vi.fn().mockResolvedValue({ accessToken: "new_token" });
    const isTokenFresh = vi.fn().mockReturnValue(false);

    const result = await coordinateWebLockRefresh(refreshAction, isTokenFresh);

    expect(requestedLockName).toBe("fillcart_auth_refresh_lock");
    expect(isTokenFresh).toHaveBeenCalledOnce();
    expect(refreshAction).toHaveBeenCalledOnce();
    expect(result).toEqual({ accessToken: "new_token" });
  });

  it("skips refreshAction and returns null if token became fresh while waiting for lock", async () => {
    const mockLocks = {
      request: vi.fn(async (_name: string, callback: () => Promise<any>) => {
        return await callback();
      }),
    };

    Object.defineProperty(global, "navigator", {
      value: { locks: mockLocks },
      writable: true,
      configurable: true,
    });

    const refreshAction = vi.fn();
    const isTokenFresh = vi.fn().mockReturnValue(true);

    const result = await coordinateWebLockRefresh(refreshAction, isTokenFresh);

    expect(isTokenFresh).toHaveBeenCalledOnce();
    expect(refreshAction).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it("propagates refresh error on failure and releases lock naturally", async () => {
    const mockLocks = {
      request: vi.fn(async (_name: string, callback: () => Promise<any>) => {
        return await callback();
      }),
    };

    Object.defineProperty(global, "navigator", {
      value: { locks: mockLocks },
      writable: true,
      configurable: true,
    });

    const refreshAction = vi.fn().mockRejectedValue(new Error("Refresh network error"));
    const isTokenFresh = vi.fn().mockReturnValue(false);

    await expect(coordinateWebLockRefresh(refreshAction, isTokenFresh)).rejects.toThrow(
      "Refresh network error"
    );
  });

  it("executes safely in fallback mode when navigator.locks is unavailable", async () => {
    Object.defineProperty(global, "navigator", {
      value: {},
      writable: true,
      configurable: true,
    });

    const refreshAction = vi.fn().mockResolvedValue({ accessToken: "fallback_token" });
    const isTokenFresh = vi.fn().mockReturnValue(false);

    const result = await coordinateWebLockRefresh(refreshAction, isTokenFresh);

    expect(result).toEqual({ accessToken: "fallback_token" });
    expect(refreshAction).toHaveBeenCalledOnce();
  });
});
