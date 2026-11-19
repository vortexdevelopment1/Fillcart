import React from 'react';
import { OrdersDispatchSettings } from '../../types/settings';

interface OrdersDispatchTabProps {
  data: OrdersDispatchSettings;
  onChange: (updates: Partial<OrdersDispatchSettings>) => void;
  readOnly?: boolean;
  errors?: Record<string, string>;
}

export const OrdersDispatchTab: React.FC<OrdersDispatchTabProps> = ({
  data,
  onChange,
  readOnly = false,
  errors = {},
}) => {
  return (
    <div className="space-y-7">
      {/* ──────────────── GROUP 1: DISPATCH & ASSIGNMENT ──────────────── */}
      <section>
        <h3 className="text-[13px] font-semibold text-primary/80 uppercase tracking-wider mb-3">
          Dispatch & Rider Assignment
        </h3>
        <div className="divide-y divide-primary/10">
          {/* Assignment Mode (Manual | Auto pill switch) */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[13px] font-medium text-ink block">
                Order Assignment Mode
              </span>
              <p className="text-[11px] text-primary/60 mt-0.5">
                Switch between automated proximity dispatch algorithm or manual dispatcher allocation.
              </p>
            </div>
            <div className="inline-flex rounded-full p-1 bg-neutral border border-primary/10">
              <button
                type="button"
                disabled={readOnly}
                onClick={() => onChange({ assignmentMode: 'Manual' })}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-secondary ${
                  data.assignmentMode === 'Manual'
                    ? 'bg-[#527781] text-white shadow-xs'
                    : 'text-primary/70 hover:text-primary'
                }`}
              >
                Manual
              </button>
              <button
                type="button"
                disabled={readOnly}
                onClick={() => onChange({ assignmentMode: 'Auto' })}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-secondary ${
                  data.assignmentMode === 'Auto'
                    ? 'bg-[#527781] text-white shadow-xs'
                    : 'text-primary/70 hover:text-primary'
                }`}
              >
                Auto (Smart)
              </button>
            </div>
          </div>

          {/* Auto-assign radius (km) */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label htmlFor="autoAssignRadiusKm" className="text-[13px] font-medium text-ink block">
                Auto-Assign Search Radius
              </label>
              <p className="text-[11px] text-primary/60 mt-0.5">
                Maximum distance from store to search for available online riders (1 - 25 km).
              </p>
            </div>
            <div className="w-full sm:w-48">
              <div className="relative">
                <input
                  id="autoAssignRadiusKm"
                  type="number"
                  min={1}
                  max={25}
                  disabled={readOnly}
                  value={data.autoAssignRadiusKm}
                  onChange={(e) => onChange({ autoAssignRadiusKm: Number(e.target.value) })}
                  className="w-full h-9 pl-3 pr-10 rounded-xl border border-primary/20 text-xs font-medium text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-neutral"
                />
                <span className="absolute right-3 top-2 text-xs font-medium text-primary/50 select-none">
                  km
                </span>
              </div>
              {errors.autoAssignRadiusKm && (
                <p className="text-[10px] text-red-500 mt-1">{errors.autoAssignRadiusKm}</p>
              )}
            </div>
          </div>

          {/* Rider accept timeout (sec) */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label htmlFor="riderAcceptTimeoutSec" className="text-[13px] font-medium text-ink block">
                Rider Accept Timeout
              </label>
              <p className="text-[11px] text-primary/60 mt-0.5">
                Time allocated for a rider to accept dispatch before re-routing to next partner (15 - 180 sec).
              </p>
            </div>
            <div className="w-full sm:w-48">
              <div className="relative">
                <input
                  id="riderAcceptTimeoutSec"
                  type="number"
                  min={15}
                  max={180}
                  disabled={readOnly}
                  value={data.riderAcceptTimeoutSec}
                  onChange={(e) => onChange({ riderAcceptTimeoutSec: Number(e.target.value) })}
                  className="w-full h-9 pl-3 pr-10 rounded-xl border border-primary/20 text-xs font-medium text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-neutral"
                />
                <span className="absolute right-3 top-2 text-xs font-medium text-primary/50 select-none">
                  sec
                </span>
              </div>
              {errors.riderAcceptTimeoutSec && (
                <p className="text-[10px] text-red-500 mt-1">{errors.riderAcceptTimeoutSec}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── GROUP 2: ORDER LIFECYCLE & THRESHOLDS ──────────────── */}
      <section>
        <h3 className="text-[13px] font-semibold text-primary/80 uppercase tracking-wider mb-3">
          Order Lifecycle & Thresholds
        </h3>
        <div className="divide-y divide-primary/10">
          {/* Cancellation window (min) */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label htmlFor="cancellationWindowMin" className="text-[13px] font-medium text-ink block">
                Customer Cancellation Window
              </label>
              <p className="text-[11px] text-primary/60 mt-0.5">
                Grace period after order placement where customer can cancel with 100% instant refund (1 - 30 min).
              </p>
            </div>
            <div className="w-full sm:w-48">
              <div className="relative">
                <input
                  id="cancellationWindowMin"
                  type="number"
                  min={1}
                  max={30}
                  disabled={readOnly}
                  value={data.cancellationWindowMin}
                  onChange={(e) => onChange({ cancellationWindowMin: Number(e.target.value) })}
                  className="w-full h-9 pl-3 pr-10 rounded-xl border border-primary/20 text-xs font-medium text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-neutral"
                />
                <span className="absolute right-3 top-2 text-xs font-medium text-primary/50 select-none">
                  min
                </span>
              </div>
              {errors.cancellationWindowMin && (
                <p className="text-[10px] text-red-500 mt-1">{errors.cancellationWindowMin}</p>
              )}
            </div>
          </div>

          {/* Delivery radius (km) */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label htmlFor="deliveryRadiusKm" className="text-[13px] font-medium text-ink block">
                Hyperlocal Delivery Radius
              </label>
              <p className="text-[11px] text-primary/60 mt-0.5">
                Maximum customer-to-merchant ordering perimeter across platform dark stores (1 - 50 km).
              </p>
            </div>
            <div className="w-full sm:w-48">
              <div className="relative">
                <input
                  id="deliveryRadiusKm"
                  type="number"
                  min={1}
                  max={50}
                  disabled={readOnly}
                  value={data.deliveryRadiusKm}
                  onChange={(e) => onChange({ deliveryRadiusKm: Number(e.target.value) })}
                  className="w-full h-9 pl-3 pr-10 rounded-xl border border-primary/20 text-xs font-medium text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-neutral"
                />
                <span className="absolute right-3 top-2 text-xs font-medium text-primary/50 select-none">
                  km
                </span>
              </div>
              {errors.deliveryRadiusKm && (
                <p className="text-[10px] text-red-500 mt-1">{errors.deliveryRadiusKm}</p>
              )}
            </div>
          </div>

          {/* Minimum order value (INR) */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label htmlFor="minOrderValueInr" className="text-[13px] font-medium text-ink block">
                Minimum Order Value (MOV)
              </label>
              <p className="text-[11px] text-primary/60 mt-0.5">
                Cart threshold required to proceed to checkout (₹0 - ₹2000).
              </p>
            </div>
            <div className="w-full sm:w-48">
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-medium text-primary/50 select-none">
                  ₹
                </span>
                <input
                  id="minOrderValueInr"
                  type="number"
                  min={0}
                  max={2000}
                  disabled={readOnly}
                  value={data.minOrderValueInr}
                  onChange={(e) => onChange({ minOrderValueInr: Number(e.target.value) })}
                  className="w-full h-9 pl-7 pr-3 rounded-xl border border-primary/20 text-xs font-medium text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-neutral"
                />
              </div>
              {errors.minOrderValueInr && (
                <p className="text-[10px] text-red-500 mt-1">{errors.minOrderValueInr}</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
