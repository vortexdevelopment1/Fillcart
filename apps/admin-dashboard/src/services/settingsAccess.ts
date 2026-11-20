/**
 * Settings Section Access Controller
 *
 * TEMPORARY: single mock password. Replace verifyPassword() with the real admin login/re-auth API once backend login is ready.
 */

// 1. Password Configuration
// Fallback default password is "Admin@123", configured via VITE_SETTINGS_PASSWORD
const MOCK_SETTINGS_PASSWORD = import.meta.env.VITE_SETTINGS_PASSWORD || 'Admin@123';

// 2. Constants
export const UNLOCK_DURATION_MS = 10 * 60 * 1000; // 10 minutes
export const BRUTE_FORCE_MAX_ATTEMPTS = 5;
export const BRUTE_FORCE_LOCKOUT_MS = 60 * 1000; // 60 seconds

const STORAGE_KEY_UNLOCKED_UNTIL = 'fillkart_settings_unlocked_until';
const STORAGE_KEY_FAILED_ATTEMPTS = 'fillkart_settings_failed_attempts';
const STORAGE_KEY_LOCKOUT_UNTIL = 'fillkart_settings_lockout_until';

// Event dispatched when settings lock state changes across components
export const SETTINGS_LOCK_EVENT = 'fillkart:settings-lock-changed';

/**
 * Checks whether the Settings section is currently unlocked and the 10-minute
 * session has not expired. Unlock state is stored in sessionStorage so it clears
 * automatically when the browser tab closes.
 */
export const isSettingsUnlocked = (): boolean => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_UNLOCKED_UNTIL);
    if (!raw) return false;

    const expiresAt = parseInt(raw, 10);
    if (isNaN(expiresAt) || Date.now() >= expiresAt) {
      // Session has expired
      sessionStorage.removeItem(STORAGE_KEY_UNLOCKED_UNTIL);
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

/**
 * Unlocks the Settings section for 10 minutes.
 */
export const unlockSettings = (): void => {
  try {
    const expiresAt = Date.now() + UNLOCK_DURATION_MS;
    sessionStorage.setItem(STORAGE_KEY_UNLOCKED_UNTIL, expiresAt.toString());
    resetFailedAttempts();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(SETTINGS_LOCK_EVENT, { detail: { unlocked: true } }));
    }
  } catch {
    // sessionStorage fallback
  }
};

/**
 * Manually locks the Settings section immediately (e.g. on logout or session timeout).
 */
export const lockSettings = (): void => {
  try {
    sessionStorage.removeItem(STORAGE_KEY_UNLOCKED_UNTIL);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(SETTINGS_LOCK_EVENT, { detail: { unlocked: false } }));
    }
  } catch {
    // ignore
  }
};

/**
 * Gets remaining unlock duration in milliseconds (0 if locked).
 */
export const getUnlockTimeRemaining = (): number => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_UNLOCKED_UNTIL);
    if (!raw) return 0;
    const expiresAt = parseInt(raw, 10);
    if (isNaN(expiresAt)) return 0;
    const remaining = expiresAt - Date.now();
    return remaining > 0 ? remaining : 0;
  } catch {
    return 0;
  }
};

/**
 * Gets current brute-force lockout status.
 */
export const getLockoutStatus = (): {
  isLocked: boolean;
  remainingSeconds: number;
  failedAttempts: number;
} => {
  try {
    const lockoutUntilRaw = sessionStorage.getItem(STORAGE_KEY_LOCKOUT_UNTIL);
    const attemptsRaw = sessionStorage.getItem(STORAGE_KEY_FAILED_ATTEMPTS);
    const failedAttempts = attemptsRaw ? parseInt(attemptsRaw, 10) : 0;

    if (lockoutUntilRaw) {
      const lockoutUntil = parseInt(lockoutUntilRaw, 10);
      const diff = lockoutUntil - Date.now();
      if (diff > 0) {
        return {
          isLocked: true,
          remainingSeconds: Math.ceil(diff / 1000),
          failedAttempts,
        };
      } else {
        // Lockout expired, reset attempts and lockout timer
        sessionStorage.removeItem(STORAGE_KEY_LOCKOUT_UNTIL);
        sessionStorage.removeItem(STORAGE_KEY_FAILED_ATTEMPTS);
        return {
          isLocked: false,
          remainingSeconds: 0,
          failedAttempts: 0,
        };
      }
    }

    return {
      isLocked: false,
      remainingSeconds: 0,
      failedAttempts,
    };
  } catch {
    return {
      isLocked: false,
      remainingSeconds: 0,
      failedAttempts: 0,
    };
  }
};

/**
 * Records a failed password attempt and triggers a 60-second lockout if 5 attempts are reached.
 */
export const recordFailedAttempt = (): { isLocked: boolean; remainingSeconds: number } => {
  try {
    const current = getLockoutStatus();
    const newAttempts = current.failedAttempts + 1;
    sessionStorage.setItem(STORAGE_KEY_FAILED_ATTEMPTS, newAttempts.toString());

    if (newAttempts >= BRUTE_FORCE_MAX_ATTEMPTS) {
      const lockoutUntil = Date.now() + BRUTE_FORCE_LOCKOUT_MS;
      sessionStorage.setItem(STORAGE_KEY_LOCKOUT_UNTIL, lockoutUntil.toString());
      return { isLocked: true, remainingSeconds: 60 };
    }

    return { isLocked: false, remainingSeconds: 0 };
  } catch {
    return { isLocked: false, remainingSeconds: 0 };
  }
};

/**
 * Clears failed attempts and lockout timers upon successful authentication.
 */
export const resetFailedAttempts = (): void => {
  try {
    sessionStorage.removeItem(STORAGE_KEY_FAILED_ATTEMPTS);
    sessionStorage.removeItem(STORAGE_KEY_LOCKOUT_UNTIL);
  } catch {
    // ignore
  }
};

/**
 * Verifies the user's password to access Settings.
 *
 * TEMPORARY: single mock password. Replace verifyPassword() with the real admin login/re-auth API once backend login is ready.
 *
 * TODO: Super Admin / "Settings" permission check will go here when backend login is integrated.
 * e.g., const response = await apiClient.post('/api/v1/admin/auth/re-authenticate', { password });
 */
export const verifyPassword = async (password: string): Promise<boolean> => {
  // 1. Check if currently locked out due to brute force
  const lockout = getLockoutStatus();
  if (lockout.isLocked) {
    return false;
  }

  // 2. Simulate network delay (~300ms) for realistic UX and future backend swap
  await new Promise((resolve) => setTimeout(resolve, 300));

  // 3. Mock comparison with environment/config password
  const isValid = password.trim() === MOCK_SETTINGS_PASSWORD;

  if (isValid) {
    unlockSettings();
    return true;
  } else {
    recordFailedAttempt();
    return false;
  }
};
