import React from 'react';
import { FinanceSettings } from '../../types/settings';
import { ToggleSwitch } from './ToggleSwitch';

interface FinanceTabProps {
  data: FinanceSettings;
  onChange: (updates: Partial<FinanceSettings>) => void;
  readOnly?: boolean;
  errors?: Record<string, string>;
}

export const FinanceTab: React.FC<FinanceTabProps> = ({
  data,
  onChange,
  readOnly = false,
  errors = {},
}) => {
  const handlePaymentMethodToggle = (method: keyof FinanceSettings['paymentMethods']) => {
    onChange({
      paymentMethods: {
        ...data.paymentMethods,
        [method]: !data.paymentMethods[method],
      },
    });
  };

  return (
    <div className="space-y-7">
      {/* ──────────────── GROUP 1: COMMISSION & SETTLEMENT CYCLE ──────────────── */}
      <section>
        <h3 className="text-[13px] font-semibold text-primary/80 uppercase tracking-wider mb-3">
          Commission & Settlement Cycle
        </h3>
        <div className="divide-y divide-primary/10">
          {/* Default commission % */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label htmlFor="defaultCommissionPct" className="text-[13px] font-medium text-ink block">
                Standard Platform Commission
              </label>
              <p className="text-[11px] text-primary/60 mt-0.5">
                Default marketplace take rate applied to new merchant catalogs (0 - 50%).
              </p>
            </div>
            <div className="w-full sm:w-48">
              <div className="relative">
                <input
                  id="defaultCommissionPct"
                  type="number"
                  min={0}
                  max={50}
                  step={0.5}
                  disabled={readOnly}
                  value={data.defaultCommissionPct}
                  onChange={(e) => onChange({ defaultCommissionPct: Number(e.target.value) })}
                  className="w-full h-9 pl-3 pr-8 rounded-xl border border-primary/20 text-xs font-medium text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-neutral"
                />
                <span className="absolute right-3 top-2 text-xs font-medium text-primary/50 select-none">
                  %
                </span>
              </div>
              {errors.defaultCommissionPct && (
                <p className="text-[10px] text-red-500 mt-1">{errors.defaultCommissionPct}</p>
              )}
            </div>
          </div>

          {/* Settlement cycle (Weekly / Monthly) */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[13px] font-medium text-ink block">
                Merchant Settlement Cadence
              </span>
              <p className="text-[11px] text-primary/60 mt-0.5">
                Automated schedule for escrow batch reconciliation and NEFT payout release.
              </p>
            </div>
            <div className="inline-flex rounded-full p-1 bg-neutral border border-primary/10">
              <button
                type="button"
                disabled={readOnly}
                onClick={() => onChange({ settlementCycle: 'Weekly' })}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-secondary ${
                  data.settlementCycle === 'Weekly'
                    ? 'bg-[#527781] text-white shadow-xs'
                    : 'text-primary/70 hover:text-primary'
                }`}
              >
                Weekly (Monday 10 AM)
              </button>
              <button
                type="button"
                disabled={readOnly}
                onClick={() => onChange({ settlementCycle: 'Monthly' })}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-secondary ${
                  data.settlementCycle === 'Monthly'
                    ? 'bg-[#527781] text-white shadow-xs'
                    : 'text-primary/70 hover:text-primary'
                }`}
              >
                Monthly (1st of month)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── GROUP 2: PAYMENT GATEWAYS & CUSTOMER METHODS ──────────────── */}
      <section>
        <h3 className="text-[13px] font-semibold text-primary/80 uppercase tracking-wider mb-3">
          Enabled Checkout Payment Methods
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* UPI */}
          <div className="p-3.5 rounded-xl border border-primary/15 bg-white flex items-center justify-between shadow-xs">
            <div>
              <p className="text-xs font-semibold text-ink">UPI & QR Instant Pay</p>
              <p className="text-[11px] text-primary/60">GPay, PhonePe, Paytm, BHIM</p>
            </div>
            <ToggleSwitch
              id="pay-upi"
              checked={data.paymentMethods.upi}
              onChange={() => handlePaymentMethodToggle('upi')}
              disabled={readOnly}
              aria-label="Toggle UPI payment method"
            />
          </div>

          {/* Credit/Debit Cards */}
          <div className="p-3.5 rounded-xl border border-primary/15 bg-white flex items-center justify-between shadow-xs">
            <div>
              <p className="text-xs font-semibold text-ink">Credit & Debit Cards</p>
              <p className="text-[11px] text-primary/60">Visa, Mastercard, RuPay</p>
            </div>
            <ToggleSwitch
              id="pay-card"
              checked={data.paymentMethods.card}
              onChange={() => handlePaymentMethodToggle('card')}
              disabled={readOnly}
              aria-label="Toggle Card payment method"
            />
          </div>

          {/* Cash on Delivery (COD) */}
          <div className="p-3.5 rounded-xl border border-primary/15 bg-white flex items-center justify-between shadow-xs">
            <div>
              <p className="text-xs font-semibold text-ink">Cash on Delivery (COD)</p>
              <p className="text-[11px] text-primary/60">Cash collection by delivery rider</p>
            </div>
            <ToggleSwitch
              id="pay-cod"
              checked={data.paymentMethods.cod}
              onChange={() => handlePaymentMethodToggle('cod')}
              disabled={readOnly}
              aria-label="Toggle COD payment method"
            />
          </div>

          {/* Fillkart Wallet */}
          <div className="p-3.5 rounded-xl border border-primary/15 bg-white flex items-center justify-between shadow-xs">
            <div>
              <p className="text-xs font-semibold text-ink">Fillkart Wallet & Credits</p>
              <p className="text-[11px] text-primary/60">Instant checkout via customer wallet</p>
            </div>
            <ToggleSwitch
              id="pay-wallet"
              checked={data.paymentMethods.wallet}
              onChange={() => handlePaymentMethodToggle('wallet')}
              disabled={readOnly}
              aria-label="Toggle Wallet payment method"
            />
          </div>
        </div>
      </section>

      {/* ──────────────── GROUP 3: REFUNDS & PAYOUT CONSTRAINTS ──────────────── */}
      <section>
        <h3 className="text-[13px] font-semibold text-primary/80 uppercase tracking-wider mb-3">
          Refunds & Payout Constraints
        </h3>
        <div className="divide-y divide-primary/10">
          {/* Refund window (days) */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label htmlFor="refundWindowDays" className="text-[13px] font-medium text-ink block">
                Post-Delivery Dispute & Refund Window
              </label>
              <p className="text-[11px] text-primary/60 mt-0.5">
                Maximum days after delivery for a customer to file refund ticket (1 - 30 days).
              </p>
            </div>
            <div className="w-full sm:w-48">
              <div className="relative">
                <input
                  id="refundWindowDays"
                  type="number"
                  min={1}
                  max={30}
                  disabled={readOnly}
                  value={data.refundWindowDays}
                  onChange={(e) => onChange({ refundWindowDays: Number(e.target.value) })}
                  className="w-full h-9 pl-3 pr-12 rounded-xl border border-primary/20 text-xs font-medium text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-neutral"
                />
                <span className="absolute right-3 top-2 text-xs font-medium text-primary/50 select-none">
                  days
                </span>
              </div>
              {errors.refundWindowDays && (
                <p className="text-[10px] text-red-500 mt-1">{errors.refundWindowDays}</p>
              )}
            </div>
          </div>

          {/* Minimum payout (INR) */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label htmlFor="minPayoutInr" className="text-[13px] font-medium text-ink block">
                Minimum Merchant Payout Threshold
              </label>
              <p className="text-[11px] text-primary/60 mt-0.5">
                Accrued earnings required to generate an automated bank transfer (₹100 - ₹10,000).
              </p>
            </div>
            <div className="w-full sm:w-48">
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-medium text-primary/50 select-none">
                  ₹
                </span>
                <input
                  id="minPayoutInr"
                  type="number"
                  min={100}
                  max={10000}
                  step={50}
                  disabled={readOnly}
                  value={data.minPayoutInr}
                  onChange={(e) => onChange({ minPayoutInr: Number(e.target.value) })}
                  className="w-full h-9 pl-7 pr-3 rounded-xl border border-primary/20 text-xs font-medium text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-neutral"
                />
              </div>
              {errors.minPayoutInr && (
                <p className="text-[10px] text-red-500 mt-1">{errors.minPayoutInr}</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
