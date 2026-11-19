import React, { useState } from 'react';
import { SecurityLogsSettings } from '../../types/settings';
import { ToggleSwitch } from './ToggleSwitch';
import { Plus, X, ShieldAlert, Lock, AlertTriangle } from 'lucide-react';

interface SecurityLogsTabProps {
  data: SecurityLogsSettings;
  onChange: (updates: Partial<SecurityLogsSettings>) => void;
  readOnly?: boolean;
  errors?: Record<string, string>;
}

export const SecurityLogsTab: React.FC<SecurityLogsTabProps> = ({
  data,
  onChange,
  readOnly = false,
  errors = {},
}) => {
  const [newIpInput, setNewIpInput] = useState('');
  const [ipError, setIpError] = useState('');

  const handleAddIp = () => {
    const trimmed = newIpInput.trim();
    if (!trimmed) return;

    // IPv4 / CIDR simple format validator
    const ipRegex =
      /^(\d{1,3}\.){3}\d{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;
    if (!ipRegex.test(trimmed)) {
      setIpError('Please enter a valid IPv4 address or CIDR range (e.g., 192.168.1.1 or 10.0.0.0/24)');
      return;
    }

    if (data.ipAllowlist.includes(trimmed)) {
      setIpError('IP address already exists in allowlist');
      return;
    }

    onChange({
      ipAllowlist: [...data.ipAllowlist, trimmed],
    });
    setNewIpInput('');
    setIpError('');
  };

  const handleRemoveIp = (ipToRemove: string) => {
    onChange({
      ipAllowlist: data.ipAllowlist.filter((ip) => ip !== ipToRemove),
    });
  };

  const handleRetentionChange = (
    key: keyof SecurityLogsSettings['logRetention'],
    val: number
  ) => {
    onChange({
      logRetention: {
        ...data.logRetention,
        [key]: val,
      },
    });
  };

  return (
    <div className="space-y-7">
      {/* ──────────────── GROUP 1: AUTHENTICATION & ACCESS TOKENS ──────────────── */}
      <section>
        <h3 className="text-[13px] font-semibold text-primary/80 uppercase tracking-wider mb-3">
          Authentication & Session Governance
        </h3>
        <div className="divide-y divide-primary/10">
          {/* Admin Login OTP */}
          <div className="py-3.5 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0 pr-2">
              <span className="text-[13px] font-medium text-ink block">
                Mandatory Two-Factor OTP on Staff Login
              </span>
              <p className="text-[11px] text-primary/60 mt-0.5 max-w-xl">
                Enforces SMS / Authenticator 2FA for all administrative accounts during sign-in.
              </p>
            </div>
            <div className="flex-shrink-0 mt-0.5">
              <ToggleSwitch
                id="adminLoginOtp"
                checked={data.adminLoginOtp}
                onChange={(checked) => onChange({ adminLoginOtp: checked })}
                disabled={readOnly}
                aria-label="Toggle Admin Login OTP"
              />
            </div>
          </div>

          {/* Access Token Expiry (min) */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label htmlFor="accessTokenExpiryMin" className="text-[13px] font-medium text-ink block">
                Access Token Expiry (JWT Lifetime)
              </label>
              <p className="text-[11px] text-primary/60 mt-0.5">
                Lifespan of short-lived bearer tokens before background silent refresh (5 - 1440 min).
              </p>
            </div>
            <div className="w-full sm:w-48">
              <div className="relative">
                <input
                  id="accessTokenExpiryMin"
                  type="number"
                  min={5}
                  max={1440}
                  disabled={readOnly}
                  value={data.accessTokenExpiryMin}
                  onChange={(e) => onChange({ accessTokenExpiryMin: Number(e.target.value) })}
                  className="w-full h-9 pl-3 pr-12 rounded-xl border border-primary/20 text-xs font-medium text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-neutral"
                />
                <span className="absolute right-3 top-2 text-xs font-medium text-primary/50 select-none">
                  min
                </span>
              </div>
              {errors.accessTokenExpiryMin && (
                <p className="text-[10px] text-red-500 mt-1">{errors.accessTokenExpiryMin}</p>
              )}
            </div>
          </div>

          {/* Refresh Token Expiry (days) */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label htmlFor="refreshTokenExpiryDays" className="text-[13px] font-medium text-ink block">
                Refresh Token Persistence
              </label>
              <p className="text-[11px] text-primary/60 mt-0.5">
                Duration admin session remains valid on trusted hardware (1 - 90 days).
              </p>
            </div>
            <div className="w-full sm:w-48">
              <div className="relative">
                <input
                  id="refreshTokenExpiryDays"
                  type="number"
                  min={1}
                  max={90}
                  disabled={readOnly}
                  value={data.refreshTokenExpiryDays}
                  onChange={(e) => onChange({ refreshTokenExpiryDays: Number(e.target.value) })}
                  className="w-full h-9 pl-3 pr-12 rounded-xl border border-primary/20 text-xs font-medium text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-neutral"
                />
                <span className="absolute right-3 top-2 text-xs font-medium text-primary/50 select-none">
                  days
                </span>
              </div>
              {errors.refreshTokenExpiryDays && (
                <p className="text-[10px] text-red-500 mt-1">{errors.refreshTokenExpiryDays}</p>
              )}
            </div>
          </div>

          {/* Session Timeout (min) */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label htmlFor="sessionTimeoutMin" className="text-[13px] font-medium text-ink block">
                Inactivity Screen Lock Timeout
              </label>
              <p className="text-[11px] text-primary/60 mt-0.5">
                Automatically locks dashboard view if no mouse or keyboard activity is detected (5 - 480 min).
              </p>
            </div>
            <div className="w-full sm:w-48">
              <div className="relative">
                <input
                  id="sessionTimeoutMin"
                  type="number"
                  min={5}
                  max={480}
                  disabled={readOnly}
                  value={data.sessionTimeoutMin}
                  onChange={(e) => onChange({ sessionTimeoutMin: Number(e.target.value) })}
                  className="w-full h-9 pl-3 pr-12 rounded-xl border border-primary/20 text-xs font-medium text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-neutral"
                />
                <span className="absolute right-3 top-2 text-xs font-medium text-primary/50 select-none">
                  min
                </span>
              </div>
              {errors.sessionTimeoutMin && (
                <p className="text-[10px] text-red-500 mt-1">{errors.sessionTimeoutMin}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── GROUP 2: PASSWORD RULES & BRUTE-FORCE PROTECTION ──────────────── */}
      <section>
        <h3 className="text-[13px] font-semibold text-primary/80 uppercase tracking-wider mb-3">
          Password Complexity & Brute-Force Limits
        </h3>
        <div className="divide-y divide-primary/10">
          {/* Min Length */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label htmlFor="pwdMinLength" className="text-[13px] font-medium text-ink block">
                Minimum Password Length
              </label>
              <p className="text-[11px] text-primary/60 mt-0.5">
                Minimum character length required for staff passwords (6 - 32 characters).
              </p>
            </div>
            <div className="w-full sm:w-48">
              <div className="relative">
                <input
                  id="pwdMinLength"
                  type="number"
                  min={6}
                  max={32}
                  disabled={readOnly}
                  value={data.passwordRules.minLength}
                  onChange={(e) =>
                    onChange({
                      passwordRules: {
                        ...data.passwordRules,
                        minLength: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full h-9 pl-3 pr-14 rounded-xl border border-primary/20 text-xs font-medium text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-neutral"
                />
                <span className="absolute right-3 top-2 text-xs font-medium text-primary/50 select-none">
                  chars
                </span>
              </div>
            </div>
          </div>

          {/* Require Number & Symbol */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[13px] font-medium text-ink block">
                Require Special Character & Number
              </span>
              <p className="text-[11px] text-primary/60 mt-0.5">
                Enforces at least one numeric digit (0-9) and one special symbol (@, #, $, etc.).
              </p>
            </div>
            <ToggleSwitch
              id="requireNumberSymbol"
              checked={data.passwordRules.requireNumberSymbol}
              onChange={(checked) =>
                onChange({
                  passwordRules: {
                    ...data.passwordRules,
                    requireNumberSymbol: checked,
                  },
                })
              }
              disabled={readOnly}
              aria-label="Require Special Character and Number"
            />
          </div>

          {/* Login Attempt Limit */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label htmlFor="loginAttemptLimit" className="text-[13px] font-medium text-ink block">
                Failed Login Lockout Threshold
              </label>
              <p className="text-[11px] text-primary/60 mt-0.5">
                Consecutive incorrect password attempts before account lockout (3 - 10 attempts).
              </p>
            </div>
            <div className="w-full sm:w-48">
              <div className="relative">
                <input
                  id="loginAttemptLimit"
                  type="number"
                  min={3}
                  max={10}
                  disabled={readOnly}
                  value={data.loginAttemptLimit}
                  onChange={(e) => onChange({ loginAttemptLimit: Number(e.target.value) })}
                  className="w-full h-9 pl-3 pr-16 rounded-xl border border-primary/20 text-xs font-medium text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-neutral"
                />
                <span className="absolute right-3 top-2 text-xs font-medium text-primary/50 select-none">
                  attempts
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── GROUP 3: IP ALLOWLIST (CHIPS) ──────────────── */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-[13px] font-semibold text-primary/80 uppercase tracking-wider">
              Admin Network & IP Allowlist
            </h3>
            <p className="text-[11px] text-primary/60 mt-0.5">
              Restrict staff dashboard access to trusted office VPN subnets or static IP CIDR blocks.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral/40 border border-primary/10 space-y-3">
          {/* Chip list */}
          <div className="flex flex-wrap gap-2">
            {data.ipAllowlist.map((ip) => (
              <span
                key={ip}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-primary/20 text-xs font-mono text-ink shadow-2xs group"
              >
                <span>{ip}</span>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => handleRemoveIp(ip)}
                    className="w-4 h-4 rounded-full hover:bg-red-100 hover:text-red-600 flex items-center justify-center text-primary/40 transition-colors"
                    aria-label={`Remove IP ${ip}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
            {data.ipAllowlist.length === 0 && (
              <p className="text-xs text-primary/50 italic">No IP restrictions active. Accessible from all networks.</p>
            )}
          </div>

          {/* Add IP Input */}
          {!readOnly && (
            <div className="pt-2 border-t border-primary/10">
              <div className="flex flex-col sm:flex-row gap-2 max-w-lg">
                <input
                  type="text"
                  value={newIpInput}
                  onChange={(e) => {
                    setNewIpInput(e.target.value);
                    if (ipError) setIpError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddIp();
                    }
                  }}
                  placeholder="e.g. 192.168.1.50 or 10.0.0.0/24"
                  className="flex-1 h-9 px-3 rounded-xl border border-primary/20 text-xs font-mono text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <button
                  type="button"
                  onClick={handleAddIp}
                  className="h-9 px-4 rounded-xl bg-[#527781] hover:bg-[#43646d] text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary flex-shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add IP</span>
                </button>
              </div>
              {ipError && <p className="text-[10px] text-red-500 mt-1">{ipError}</p>}
            </div>
          )}
        </div>
      </section>

      {/* ──────────────── GROUP 4: LOG RETENTION POLICIES ──────────────── */}
      <section>
        <div className="mb-3">
          <h3 className="text-[13px] font-semibold text-primary/80 uppercase tracking-wider">
            Audit Trail & Log Retention Policy
          </h3>
          <p className="text-[11px] text-primary/60 mt-0.5">
            Configure statutory data archival windows across system audit modules (enforced minimums).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Admin Audit (min 365 days) */}
          <div className="p-3.5 rounded-xl border border-primary/15 bg-white shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-ink">Admin Audit</span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                Min 365d
              </span>
            </div>
            <p className="text-[11px] text-primary/60 mb-2">Staff actions, RBAC & settings diffs</p>
            <div className="relative">
              <input
                type="number"
                min={365}
                disabled={readOnly}
                value={data.logRetention.adminAuditDays}
                onChange={(e) => handleRetentionChange('adminAuditDays', Math.max(365, Number(e.target.value)))}
                className="w-full h-8 pl-3 pr-12 rounded-lg border border-primary/20 text-xs font-medium text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-neutral"
              />
              <span className="absolute right-3 top-1.5 text-xs text-primary/50">days</span>
            </div>
          </div>

          {/* Payment (min 365 days) */}
          <div className="p-3.5 rounded-xl border border-primary/15 bg-white shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-ink">Payment Logs</span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                Min 365d
              </span>
            </div>
            <p className="text-[11px] text-primary/60 mb-2">Escrow, UPI webhooks & payouts</p>
            <div className="relative">
              <input
                type="number"
                min={365}
                disabled={readOnly}
                value={data.logRetention.paymentDays}
                onChange={(e) => handleRetentionChange('paymentDays', Math.max(365, Number(e.target.value)))}
                className="w-full h-8 pl-3 pr-12 rounded-lg border border-primary/20 text-xs font-medium text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-neutral"
              />
              <span className="absolute right-3 top-1.5 text-xs text-primary/50">days</span>
            </div>
          </div>

          {/* Security (min 90 days) */}
          <div className="p-3.5 rounded-xl border border-primary/15 bg-white shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-ink">Security Events</span>
              <span className="text-[10px] font-bold text-primary/70 bg-neutral px-1.5 py-0.5 rounded">
                Min 90d
              </span>
            </div>
            <p className="text-[11px] text-primary/60 mb-2">2FA, failed logins & token revokes</p>
            <div className="relative">
              <input
                type="number"
                min={90}
                disabled={readOnly}
                value={data.logRetention.securityDays}
                onChange={(e) => handleRetentionChange('securityDays', Math.max(90, Number(e.target.value)))}
                className="w-full h-8 pl-3 pr-12 rounded-lg border border-primary/20 text-xs font-medium text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-neutral"
              />
              <span className="absolute right-3 top-1.5 text-xs text-primary/50">days</span>
            </div>
          </div>

          {/* API (min 30 days, default 90) */}
          <div className="p-3.5 rounded-xl border border-primary/15 bg-white shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-ink">API Telemetry</span>
              <span className="text-[10px] font-bold text-primary/70 bg-neutral px-1.5 py-0.5 rounded">
                Min 30d
              </span>
            </div>
            <p className="text-[11px] text-primary/60 mb-2">HTTP requests, latencies & status</p>
            <div className="relative">
              <input
                type="number"
                min={30}
                disabled={readOnly}
                value={data.logRetention.apiDays}
                onChange={(e) => handleRetentionChange('apiDays', Math.max(30, Number(e.target.value)))}
                className="w-full h-8 pl-3 pr-12 rounded-lg border border-primary/20 text-xs font-medium text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-neutral"
              />
              <span className="absolute right-3 top-1.5 text-xs text-primary/50">days</span>
            </div>
          </div>

          {/* User Activity (min 30 days, default 90) */}
          <div className="p-3.5 rounded-xl border border-primary/15 bg-white shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-ink">User Activity</span>
              <span className="text-[10px] font-bold text-primary/70 bg-neutral px-1.5 py-0.5 rounded">
                Min 30d
              </span>
            </div>
            <p className="text-[11px] text-primary/60 mb-2">Vendor portal & rider state events</p>
            <div className="relative">
              <input
                type="number"
                min={30}
                disabled={readOnly}
                value={data.logRetention.userActivityDays}
                onChange={(e) => handleRetentionChange('userActivityDays', Math.max(30, Number(e.target.value)))}
                className="w-full h-8 pl-3 pr-12 rounded-lg border border-primary/20 text-xs font-medium text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-neutral"
              />
              <span className="absolute right-3 top-1.5 text-xs text-primary/50">days</span>
            </div>
          </div>

          {/* Order (min 30 days, default 90) */}
          <div className="p-3.5 rounded-xl border border-primary/15 bg-white shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-ink">Order Logs</span>
              <span className="text-[10px] font-bold text-primary/70 bg-neutral px-1.5 py-0.5 rounded">
                Min 30d
              </span>
            </div>
            <p className="text-[11px] text-primary/60 mb-2">Cart status transitions & milestones</p>
            <div className="relative">
              <input
                type="number"
                min={30}
                disabled={readOnly}
                value={data.logRetention.orderDays}
                onChange={(e) => handleRetentionChange('orderDays', Math.max(30, Number(e.target.value)))}
                className="w-full h-8 pl-3 pr-12 rounded-lg border border-primary/20 text-xs font-medium text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-neutral"
              />
              <span className="absolute right-3 top-1.5 text-xs text-primary/50">days</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
