import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { adminApi } from '../services/adminApi';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect to destination or home
  useEffect(() => {
    if (adminApi.isAuthenticated()) {
      const destination = (location.state as any)?.from?.pathname || '/';
      navigate(destination, { replace: true });
    }
  }, [navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await adminApi.login({
        email: email.trim().toLowerCase(),
        password: password,
      });

      const destination = (location.state as any)?.from?.pathname || '/';
      navigate(destination, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDevAdmin = () => {
    setEmail('admin@fillcart.internal');
    setPassword('AdminPassword123!');
    setError(null);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#f4f5f6] select-none relative overflow-hidden">
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#123747]/[0.05] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-[400px] h-[400px] bg-[#527781]/[0.06] rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative w-full max-w-[440px] bg-white rounded-[28px] border border-primary/10 shadow-[0_16px_48px_rgba(18,55,71,0.08),0_2px_8px_rgba(18,55,71,0.03)] p-6 sm:p-8 flex flex-col items-center text-center overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
        {/* Subtle decorative top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#527781]/40 to-transparent pointer-events-none" />

        {/* Brand Logo */}
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4 shadow-[0_0_0_8px_rgba(82,119,129,0.15)] flex-shrink-0">
          <svg width="34" height="34" viewBox="0 0 28 28" fill="none">
            <ellipse
              cx="9.5"
              cy="10"
              rx="5.2"
              ry="3.8"
              transform="rotate(-38 9.5 10)"
              fill="#FFFFFF"
            />
            <ellipse
              cx="19"
              cy="10.5"
              rx="2.4"
              ry="4.5"
              transform="rotate(8 19 10.5)"
              fill="#FFFFFF"
            />
            <ellipse
              cx="14.5"
              cy="18.5"
              rx="4.8"
              ry="3.2"
              transform="rotate(-3 14.5 18.5)"
              fill="#FFFFFF"
            />
          </svg>
        </div>

        {/* Header Title & Subtitle */}
        <h1 className="font-heading text-[clamp(22px,5vw,26px)] font-normal text-ink leading-tight mb-1 tracking-tight">
          Fillkart Admin Portal
        </h1>
        <p className="font-sans text-xs text-ink/65 leading-relaxed mb-6">
          Sign in to access centralized operations & management console
        </p>

        {/* Inline Error Message */}
        {error && (
          <div
            role="alert"
            className="w-full flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 text-left mb-4 animate-in fade-in"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full text-left space-y-3.5" noValidate>
          {/* Email Address */}
          <div>
            <label className="block font-sans text-xs font-medium text-ink/80 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none flex items-center justify-center">
                <Mail className="w-[18px] h-[18px]" strokeWidth={1.75} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="admin@fillcart.internal"
                autoComplete="email"
                disabled={isLoading}
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-primary/20 text-sm text-ink bg-white transition-all focus:outline-none focus:border-[#527781] focus:ring-4 focus:ring-[#527781]/20 disabled:bg-neutral/50 disabled:opacity-60"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block font-sans text-xs font-medium text-ink/80 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none flex items-center justify-center">
                <Lock className="w-[18px] h-[18px]" strokeWidth={1.75} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="••••••••••••"
                autoComplete="current-password"
                disabled={isLoading}
                className="w-full h-12 pl-11 pr-11 rounded-xl border border-primary/20 text-sm text-ink bg-white transition-all focus:outline-none focus:border-[#527781] focus:ring-4 focus:ring-[#527781]/20 disabled:bg-neutral/50 disabled:opacity-60"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-primary/45 hover:text-ink transition-colors disabled:opacity-40 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-[18px] h-[18px]" />
                ) : (
                  <Eye className="w-[18px] h-[18px]" />
                )}
              </button>
            </div>
          </div>

          {/* Quick Dev Autofill Button */}
          <div className="flex justify-end pt-0.5">
            <button
              type="button"
              onClick={handleFillDevAdmin}
              className="font-sans text-[11px] font-medium text-secondary hover:text-primary transition-colors underline focus:outline-none"
            >
              Autofill Dev Super Admin
            </button>
          </div>

          {/* Sign In Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl text-sm font-semibold bg-[#123747] hover:bg-[#0c242f] text-white flex items-center justify-center gap-2 shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 hover:shadow-[0_4px_16px_rgba(18,55,71,0.22)] active:shadow-none focus:outline-none focus:ring-4 focus:ring-[#527781]/25 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Security Bottom Note */}
        <div className="w-full mt-6 pt-4 border-t border-primary/10 flex items-center justify-center gap-1.5 text-xs text-ink/50 leading-none">
          <ShieldCheck className="w-3.5 h-3.5 text-primary/40 flex-shrink-0" />
          <span>Centralized authentication. Access is strictly audited.</span>
        </div>
      </div>
    </div>
  );
};
