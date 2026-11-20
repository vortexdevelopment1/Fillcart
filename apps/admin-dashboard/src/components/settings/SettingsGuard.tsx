import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Shield } from 'lucide-react';
import {
  isSettingsUnlocked,
  verifyPassword,
  getLockoutStatus,
  SETTINGS_LOCK_EVENT,
  UNLOCK_DURATION_MS,
} from '../../services/settingsAccess';

interface SettingsGuardProps {
  children: React.ReactNode;
}

/**
 * SettingsGuard wraps the /settings route.
 * When locked, it renders a secure verification card inside the main layout.
 * When unlocked, it renders the Settings page (preserving the current tab and query params).
 *
 * TODO: Super Admin / "Settings" role-based permission check will go here once backend login is integrated:
 * e.g., if (!currentUser.hasRole('Super Admin')) return <NoAccessState moduleName="Settings" />;
 */
export const SettingsGuard: React.FC<SettingsGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const [unlocked, setUnlocked] = useState<boolean>(() => isSettingsUnlocked());
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Brute-force lockout state
  const [lockout, setLockout] = useState(() => getLockoutStatus());

  const inputRef = useRef<HTMLInputElement>(null);

  // Calculate session duration in minutes from the constant (dynamic, never hardcoded)
  const sessionMinutes = Math.max(1, Math.round(UNLOCK_DURATION_MS / (60 * 1000)));

  // 1. Listen for global lock/unlock events and monitor expiration
  useEffect(() => {
    const checkState = () => {
      const isCurrentlyUnlocked = isSettingsUnlocked();
      setUnlocked(isCurrentlyUnlocked);
      setLockout(getLockoutStatus());
    };

    // Initial check
    checkState();

    // Check periodically every second (handles expiry and lockout countdown)
    const intervalId = setInterval(checkState, 1000);

    // Also listen for explicit lock/unlock events (e.g. from logout or expired save)
    const handleLockEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ unlocked: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.unlocked === 'boolean') {
        setUnlocked(customEvent.detail.unlocked);
      } else {
        checkState();
      }
    };

    window.addEventListener(SETTINGS_LOCK_EVENT, handleLockEvent);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener(SETTINGS_LOCK_EVENT, handleLockEvent);
    };
  }, []);

  // 2. Keyboard handler: Escape returns to Dashboard
  useEffect(() => {
    if (unlocked) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isVerifying) {
        navigate('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [unlocked, isVerifying, navigate]);

  // 3. Auto-focus password input when locked and not in lockout
  useEffect(() => {
    if (!unlocked && !lockout.isLocked) {
      inputRef.current?.focus();
    }
  }, [unlocked, lockout.isLocked]);

  // 4. Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isVerifying || lockout.isLocked) return;

    if (!password.trim()) {
      setError('Please enter your password');
      inputRef.current?.focus();
      return;
    }

    setError(null);
    setIsVerifying(true);

    try {
      const success = await verifyPassword(password);
      if (success) {
        setUnlocked(true);
        setPassword('');
        setError(null);
      } else {
        const updatedLockout = getLockoutStatus();
        setLockout(updatedLockout);
        if (updatedLockout.isLocked) {
          setError(`Too many failed attempts. Locked for ${updatedLockout.remainingSeconds}s.`);
        } else {
          setError('Incorrect password');
        }
        inputRef.current?.focus();
      }
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // If already unlocked, render the Settings page directly
  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div className="w-full min-h-[calc(100vh-140px)] flex items-center justify-center p-4 sm:p-6 select-none">
      {/* Inline styles for subtle shake animation on error and smooth transitions */}
      <style>{`
        @keyframes settingsShake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        .animate-settings-shake {
          animation: settingsShake 200ms ease-in-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-settings-shake {
            animation: none !important;
          }
        }
      `}</style>

      {/* Verification Card with soft decorative ambient circle & top accent */}
      <div className="relative w-full max-w-[440px] bg-white rounded-[26px] border border-primary/10 shadow-[0_12px_36px_rgba(18,55,71,0.08),0_2px_8px_rgba(18,55,71,0.03)] p-6 sm:p-8 sm:pb-7 flex flex-col items-center text-center overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 motion-reduce:animate-none">
        {/* Subtle decorative top accent line & ambient glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#527781]/30 to-transparent pointer-events-none" />
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-[#527781]/[0.08] blur-2xl pointer-events-none" />

        {/* Lock Icon Badge (64px circle, dark teal background, light icon, soft outer ring) */}
        <div className="relative w-16 h-16 rounded-full bg-[#123747] text-white flex items-center justify-center mb-5 shadow-[0_0_0_8px_rgba(82,119,129,0.15)] flex-shrink-0">
          <Lock className="w-7 h-7 text-white stroke-[1.8]" />
        </div>

        {/* Title & Subtitle with calibrated vertical rhythm */}
        <h2 className="font-heading text-[clamp(22px,5vw,26px)] font-normal text-ink leading-tight mb-1.5 tracking-tight">
          Settings are protected
        </h2>
        <p className="font-sans text-sm text-ink/65 leading-relaxed mb-6">
          Enter your password to continue
        </p>

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="w-full text-left" noValidate>
          {/* Password Input Container */}
          <div className="relative mb-3">
            {/* Leading Lock Icon */}
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none flex items-center justify-center">
              <Lock className="w-[18px] h-[18px]" strokeWidth={1.75} />
            </div>

            {/* Input Field: 48px height, rounded-xl, 1.5px border, soft focus ring, shake on error */}
            <input
              ref={inputRef}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              disabled={isVerifying || lockout.isLocked}
              placeholder="Enter password"
              autoComplete="current-password"
              className={`w-full h-12 pl-11 pr-12 rounded-xl border-[1.5px] text-sm text-ink bg-white transition-all focus:outline-none disabled:bg-neutral/50 disabled:opacity-60 disabled:cursor-not-allowed ${
                error
                  ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100 animate-settings-shake'
                  : 'border-primary/20 focus:border-[#527781] focus:ring-4 focus:ring-[#527781]/20'
              }`}
            />

            {/* Eye Toggle (44px touch area) */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isVerifying || lockout.isLocked}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-primary/45 hover:text-ink transition-colors disabled:opacity-40 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-[18px] h-[18px]" />
              ) : (
                <Eye className="w-[18px] h-[18px]" />
              )}
            </button>
          </div>

          {/* Inline Error Message */}
          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="flex items-center gap-1.5 text-xs text-red-600 mb-3 px-1"
            >
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Brute-force Lockout Active Notice */}
          {lockout.isLocked && !error && (
            <div
              role="alert"
              aria-live="polite"
              className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50/90 border border-amber-200/80 rounded-xl p-2.5 mb-3"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
              <span>Too many failed attempts. Locked for {lockout.remainingSeconds}s.</span>
            </div>
          )}

          {/* Verify Button (48px height, slight lift and soft shadow on hover) */}
          <button
            type="submit"
            disabled={isVerifying || lockout.isLocked}
            className="w-full h-12 rounded-xl text-sm font-semibold bg-[#123747] hover:bg-[#0c242f] text-white flex items-center justify-center gap-2 shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 hover:shadow-[0_4px_16px_rgba(18,55,71,0.22)] active:shadow-none focus:outline-none focus:ring-4 focus:ring-[#527781]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none mt-1"
          >
            {isVerifying ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <span>Verify</span>
            )}
          </button>
        </form>

        {/* Back to Dashboard Link (min 44px touch target, clear secondary action) */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-full min-h-[44px] mt-3 text-sm font-medium text-ink/75 hover:text-ink flex items-center justify-center gap-2 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-secondary/50 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        {/* Small Bottom Security Helper Line */}
        <div className="w-full mt-5 pt-4 border-t border-primary/10 flex items-center justify-center gap-1.5 text-xs text-ink/50 leading-none">
          <Shield className="w-3.5 h-3.5 text-primary/40 flex-shrink-0" />
          <span>Protected area. Session stays unlocked for {sessionMinutes} minutes.</span>
        </div>
      </div>
    </div>
  );
};
