import React, { useRef } from 'react';
import { GeneralSettings } from '../../types/settings';
import { ToggleSwitch } from './ToggleSwitch';
import { Image, Upload, AlertCircle } from 'lucide-react';

interface GeneralTabProps {
  data: GeneralSettings;
  onChange: (updates: Partial<GeneralSettings>) => void;
  readOnly?: boolean;
  errors?: Record<string, string>;
}

export const GeneralTab: React.FC<GeneralTabProps> = ({
  data,
  onChange,
  readOnly = false,
  errors = {},
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      onChange({ logoUrl: previewUrl });
    }
  };

  return (
    <div className="space-y-7">
      {/* ──────────────── GROUP 1: BRANDING & IDENTITY ──────────────── */}
      <section>
        <h3 className="text-[13px] font-semibold text-primary/80 uppercase tracking-wider mb-3">
          Branding & Identity
        </h3>
        <div className="divide-y divide-primary/10">
          {/* Platform Name */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label htmlFor="platformName" className="text-[13px] font-medium text-ink block">
                Platform Name
              </label>
              <p className="text-[11px] text-primary/60 mt-0.5">
                Public marketplace name visible to customers, vendors, and riders.
              </p>
            </div>
            <div className="w-full sm:w-72">
              <input
                id="platformName"
                type="text"
                disabled={readOnly}
                value={data.platformName}
                onChange={(e) => onChange({ platformName: e.target.value })}
                className="w-full h-9 px-3 rounded-xl border border-primary/20 text-xs font-medium text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-neutral disabled:cursor-not-allowed"
                placeholder="Fillkart Hyperlocal"
              />
              {errors.platformName && (
                <p className="text-[10px] text-red-500 mt-1">{errors.platformName}</p>
              )}
            </div>
          </div>

          {/* Logo Upload Preview Tile */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[13px] font-medium text-ink block">Platform Logo</span>
              <p className="text-[11px] text-primary/60 mt-0.5">
                Square or rounded SVG/PNG branding tile (min 128x128px recommended).
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/5 border border-primary/15 flex items-center justify-center overflow-hidden flex-shrink-0">
                {data.logoUrl ? (
                  <img
                    src={data.logoUrl}
                    alt="Platform Logo"
                    className="w-full h-full object-contain p-1"
                    onError={(e) => {
                      // Fallback icon if image fails
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <Image className="w-5 h-5 text-primary/40" />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                disabled={readOnly}
                onChange={handleLogoUpload}
              />
              <button
                type="button"
                disabled={readOnly}
                onClick={() => fileInputRef.current?.click()}
                className="h-8 px-3 rounded-lg border border-primary/20 bg-white hover:bg-neutral text-xs font-medium text-ink flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5 text-primary/60" />
                <span>Replace Logo</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── GROUP 2: CONTACT & SUPPORT ──────────────── */}
      <section>
        <h3 className="text-[13px] font-semibold text-primary/80 uppercase tracking-wider mb-3">
          Contact & Helpdesk
        </h3>
        <div className="divide-y divide-primary/10">
          {/* Support Email */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label htmlFor="supportEmail" className="text-[13px] font-medium text-ink block">
                Support Email
              </label>
              <p className="text-[11px] text-primary/60 mt-0.5">
                Official grievance and customer escalation dispatch address.
              </p>
            </div>
            <div className="w-full sm:w-72">
              <input
                id="supportEmail"
                type="email"
                disabled={readOnly}
                value={data.supportEmail}
                onChange={(e) => onChange({ supportEmail: e.target.value })}
                className="w-full h-9 px-3 rounded-xl border border-primary/20 text-xs font-medium text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-neutral disabled:cursor-not-allowed"
                placeholder="support@fillkart.in"
              />
              {errors.supportEmail && (
                <p className="text-[10px] text-red-500 mt-1">{errors.supportEmail}</p>
              )}
            </div>
          </div>

          {/* Support Phone */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label htmlFor="supportPhone" className="text-[13px] font-medium text-ink block">
                Toll-free / Support Helpline
              </label>
              <p className="text-[11px] text-primary/60 mt-0.5">
                Direct phone number displayed on customer order receipts and app footer.
              </p>
            </div>
            <div className="w-full sm:w-72">
              <input
                id="supportPhone"
                type="tel"
                disabled={readOnly}
                value={data.supportPhone}
                onChange={(e) => onChange({ supportPhone: e.target.value })}
                className="w-full h-9 px-3 rounded-xl border border-primary/20 text-xs font-medium text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-neutral disabled:cursor-not-allowed"
                placeholder="+91 1800 202 8899"
              />
              {errors.supportPhone && (
                <p className="text-[10px] text-red-500 mt-1">{errors.supportPhone}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── GROUP 3: REGIONAL & LOCALIZATION ──────────────── */}
      <section>
        <h3 className="text-[13px] font-semibold text-primary/80 uppercase tracking-wider mb-3">
          Regional & Localization
        </h3>
        <div className="divide-y divide-primary/10">
          {/* Timezone */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label htmlFor="timezone" className="text-[13px] font-medium text-ink block">
                System Timezone
              </label>
              <p className="text-[11px] text-primary/60 mt-0.5">
                Timestamp basis for SLA delivery timers, order cutoffs, and audit logs.
              </p>
            </div>
            <div className="w-full sm:w-72">
              <select
                id="timezone"
                disabled={readOnly}
                value={data.timezone}
                onChange={(e) => onChange({ timezone: e.target.value })}
                className="w-full h-9 px-3 rounded-xl border border-primary/20 text-xs font-medium text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-neutral disabled:cursor-not-allowed"
              >
                <option value="Asia/Kolkata (IST +05:30)">Asia/Kolkata (IST +05:30)</option>
                <option value="Asia/Dubai (GST +04:00)">Asia/Dubai (GST +04:00)</option>
                <option value="Asia/Singapore (SGT +08:00)">Asia/Singapore (SGT +08:00)</option>
                <option value="UTC (Coordinated Universal Time)">UTC (+00:00)</option>
              </select>
            </div>
          </div>

          {/* Currency */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label htmlFor="currency" className="text-[13px] font-medium text-ink block">
                Primary Currency
              </label>
              <p className="text-[11px] text-primary/60 mt-0.5">
                Fixed billing currency across platform invoices, cart pricing, and payouts.
              </p>
            </div>
            <div className="w-full sm:w-72">
              <input
                id="currency"
                type="text"
                disabled
                value={data.currency}
                className="w-full h-9 px-3 rounded-xl border border-primary/20 text-xs font-medium text-ink/70 bg-neutral/80 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Language */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label htmlFor="language" className="text-[13px] font-medium text-ink block">
                Default Portal Language
              </label>
              <p className="text-[11px] text-primary/60 mt-0.5">
                Localization for admin navigation, email receipts, and system alerts.
              </p>
            </div>
            <div className="w-full sm:w-72">
              <select
                id="language"
                disabled={readOnly}
                value={data.language}
                onChange={(e) => onChange({ language: e.target.value })}
                className="w-full h-9 px-3 rounded-xl border border-primary/20 text-xs font-medium text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-neutral disabled:cursor-not-allowed"
              >
                <option value="English (India)">English (India)</option>
                <option value="Hindi (हिंदी)">Hindi (हिंदी)</option>
                <option value="Hinglish">Hinglish</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── GROUP 4: PLATFORM MAINTENANCE ──────────────── */}
      <section>
        <h3 className="text-[13px] font-semibold text-primary/80 uppercase tracking-wider mb-3">
          Platform Maintenance & Availability
        </h3>
        <div className="p-4 rounded-2xl bg-neutral/50 border border-primary/10 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-ink">Maintenance Mode</span>
                {data.maintenanceMode && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-[11px] text-primary/60 mt-0.5 max-w-xl">
                When enabled, platform is closed for customer ordering. Displays a persistent notice
                and primary warning banner on the dashboard.
              </p>
            </div>
            <ToggleSwitch
              id="maintenanceMode"
              checked={data.maintenanceMode}
              onChange={(checked) => onChange({ maintenanceMode: checked })}
              disabled={readOnly}
              aria-label="Toggle Maintenance Mode"
            />
          </div>

          {/* Conditional Maintenance Message Textarea */}
          {data.maintenanceMode && (
            <div className="pt-3 border-t border-primary/10 animate-fadeIn">
              <label htmlFor="maintenanceMessage" className="text-[12px] font-medium text-ink flex items-center gap-1.5 mb-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Message Shown to Customers & Store Apps *</span>
              </label>
              <textarea
                id="maintenanceMessage"
                rows={2}
                disabled={readOnly}
                value={data.maintenanceMessage}
                onChange={(e) => onChange({ maintenanceMessage: e.target.value })}
                placeholder="We are upgrading Fillkart systems. We will be back shortly with lightning-fast delivery!"
                className="w-full p-2.5 rounded-xl border border-primary/20 text-xs text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-neutral"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
