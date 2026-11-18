/**
 * Cross-tab token refresh coordinator for Web Browsers using W3C Web Locks API.
 *
 * Guarantees:
 * 1. Only one browser tab executes the HTTP refresh endpoint.
 * 2. Concurrent tabs wait for the lock, then inspect whether fresh tokens were already acquired.
 * 3. Never stores secrets in localStorage or broadcasts tokens across tabs.
 * 4. Fallback for legacy browsers without Web Locks: single-tab foreground mutex.
 */
export async function coordinateWebLockRefresh<T>(
  refreshAction: () => Promise<T>,
  isTokenFresh: () => boolean
): Promise<T | null> {
  if (typeof navigator !== "undefined" && "locks" in navigator) {
    return await navigator.locks.request("fillcart_auth_refresh_lock", async () => {
      // Upon acquiring lock, check if another tab has already refreshed the token
      if (isTokenFresh()) {
        return null;
      }
      return await refreshAction();
    });
  }

  // Fallback for browsers without Web Locks API:
  // Restrict execution to single in-memory promise mutex in foreground tab
  if (isTokenFresh()) {
    return null;
  }
  return await refreshAction();
}
