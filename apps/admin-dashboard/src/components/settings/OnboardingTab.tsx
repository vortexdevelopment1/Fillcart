import React from 'react';
import { OnboardingSettings } from '../../types/settings';
import { ToggleSwitch } from './ToggleSwitch';
import { Info } from 'lucide-react';

interface OnboardingTabProps {
  data: OnboardingSettings;
  onChange: (updates: Partial<OnboardingSettings>) => void;
  readOnly?: boolean;
  errors?: Record<string, string>;
}

export const OnboardingTab: React.FC<OnboardingTabProps> = ({
  data,
  onChange,
  readOnly = false,
  errors = {},
}) => {
  return (
    <div className="space-y-7">
      {/* ──────────────── GROUP 1: VENDOR ONBOARDING POLICY ──────────────── */}
      <section>
        <h3 className="text-[13px] font-semibold text-primary/80 uppercase tracking-wider mb-3">
          Vendor Onboarding Policy
        </h3>
        <div className="divide-y divide-primary/10">
          {/* Allow pharmacy vendors */}
          <div className="py-3.5 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0 pr-2">
              <span className="text-[13px] font-medium text-ink block">
                Allow Pharmacy Vendors & Medicine Sales
              </span>
              <p className="text-[11px] text-primary/60 mt-0.5 max-w-xl">
                When enabled, vendors with Drug Licenses (Form 20/21) can register and the Pharmacy
                category is active. Turning this OFF hides the Pharmacy category and prescription items.
              </p>
            </div>
            <div className="flex-shrink-0 mt-0.5">
              <ToggleSwitch
                id="allowPharmacy"
                checked={data.allowPharmacy}
                onChange={(checked) => onChange({ allowPharmacy: checked })}
                disabled={readOnly}
                aria-label="Allow Pharmacy Vendors"
              />
            </div>
          </div>

          {/* GST optional for vendors */}
          <div className="py-3.5 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[13px] font-medium text-ink">
                  GST Optional for Micro-Vendors
                </span>
                {data.gstOptional && (
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-100 text-emerald-800">
                    OPTIONAL
                  </span>
                )}
              </div>
              <p className="text-[11px] text-primary/60 mt-0.5 max-w-xl">
                Allows unregistered hyper-local farmers, street vendors, and small dairies to onboard
                without GSTIN under state composite limits.
              </p>
            </div>
            <div className="flex-shrink-0 mt-0.5">
              <ToggleSwitch
                id="gstOptional"
                checked={data.gstOptional}
                onChange={(checked) => onChange({ gstOptional: checked })}
                disabled={readOnly}
                aria-label="GST Optional for Vendors"
              />
            </div>
          </div>
        </div>

        {/* Info Note for GST Optional */}
        {data.gstOptional && (
          <div className="mt-3 p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-[11px] text-blue-900 flex items-start gap-2.5 animate-fadeIn">
            <Info className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Compliance Notice:</strong> Micro-vendors without GSTIN will be subject to 1%
              TDS under Section 194-O on gross sales, and PAN verification becomes mandatory before payout disbursement.
            </p>
          </div>
        )}
      </section>

      {/* ──────────────── GROUP 2: DOCUMENT VERIFICATION & ACTIVATION ──────────────── */}
      <section>
        <h3 className="text-[13px] font-semibold text-primary/80 uppercase tracking-wider mb-3">
          Document Verification & Lifecycle
        </h3>
        <div className="divide-y divide-primary/10">
          {/* Document expiry reminder (days before) */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label htmlFor="docExpiryReminderDays" className="text-[13px] font-medium text-ink block">
                Document Expiry Advance Reminder
              </label>
              <p className="text-[11px] text-primary/60 mt-0.5">
                Days in advance automated SMS and Push notices are sent to partners before FSSAI,
                Driving License, or RC expires (1 - 90 days).
              </p>
            </div>
            <div className="w-full sm:w-48">
              <div className="relative">
                <input
                  id="docExpiryReminderDays"
                  type="number"
                  min={1}
                  max={90}
                  disabled={readOnly}
                  value={data.docExpiryReminderDays}
                  onChange={(e) => onChange({ docExpiryReminderDays: Number(e.target.value) })}
                  className="w-full h-9 pl-3 pr-12 rounded-xl border border-primary/20 text-xs font-medium text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-neutral"
                />
                <span className="absolute right-3 top-2 text-xs font-medium text-primary/50 select-none">
                  days
                </span>
              </div>
              {errors.docExpiryReminderDays && (
                <p className="text-[10px] text-red-500 mt-1">{errors.docExpiryReminderDays}</p>
              )}
            </div>
          </div>

          {/* Auto-activate after verification (toggle, default OFF) */}
          <div className="py-3.5 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[13px] font-medium text-ink">
                  Auto-Activate Partner Account After Verification
                </span>
                {!data.autoActivateAfterVerification && (
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-neutral text-primary/70 border border-primary/10">
                    MANUAL GATE
                  </span>
                )}
              </div>
              <p className="text-[11px] text-primary/60 mt-0.5 max-w-xl">
                When turned OFF (Recommended), admin approves documents and must manually review store
                readiness before flipping partner to Active. When turned ON, account goes live automatically.
              </p>
            </div>
            <div className="flex-shrink-0 mt-0.5">
              <ToggleSwitch
                id="autoActivateAfterVerification"
                checked={data.autoActivateAfterVerification}
                onChange={(checked) => onChange({ autoActivateAfterVerification: checked })}
                disabled={readOnly}
                aria-label="Auto-Activate Partner After Verification"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
