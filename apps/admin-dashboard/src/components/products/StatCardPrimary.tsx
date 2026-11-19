import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

interface StatCardPrimaryProps {
  categoryCount: number;
  activeCount: number;
}

export const StatCardPrimary: React.FC<StatCardPrimaryProps> = ({
  categoryCount,
  activeCount,
}) => {
  const activePct = categoryCount > 0 ? Math.round((activeCount / categoryCount) * 100) : 75;
  const inactivePct = 100 - activePct;

  return (
    <div className="bg-primary text-white rounded-[22px] p-[14px_16px] relative shadow-[0_8px_24px_rgba(18,55,71,0.06)] h-[200px] flex flex-col justify-between overflow-hidden select-none">
      {/* Top Header (~60px) */}
      <div className="flex items-start justify-between flex-shrink-0">
        <div>
          <span className="font-sans text-[13px] text-white/75 block leading-tight">
            Total Categories
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-heading text-[24px] text-white font-normal leading-none tracking-tight">
              {categoryCount}
            </span>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-sans px-1.5 py-0.5 rounded-full bg-white/40 text-white font-normal leading-none">
              ↗ +79%
            </span>
          </div>
          <span className="text-[10px] font-sans text-white/70 block mt-1 leading-none">
            {activeCount} active categories
          </span>
        </div>

        <button
          type="button"
          className="text-white/70 hover:text-white transition-colors p-0.5"
          aria-label="Filter categories"
        >
          <SlidersHorizontal className="w-3 h-3 stroke-[1.5]" />
        </button>
      </div>

      {/* Split bar: 38px high, radius 10px, legend 10px */}
      <div className="flex flex-col justify-end pb-[6px] w-full flex-shrink-0">
        <div className="w-full h-[38px] flex gap-[4px] select-none">
          {/* Left Block: White with INK text, 12px */}
          <div
            className="h-full bg-white text-primary font-sans text-[12px] font-medium flex items-center justify-center rounded-[10px] shadow-xs transition-all"
            style={{ width: `${inactivePct}%` }}
          >
            {inactivePct}%
          </div>

          {/* Right Block: SECONDARY with white text, 12px */}
          <div
            className="h-full bg-secondary text-white font-sans text-[12px] font-medium flex items-center justify-center rounded-[10px] shadow-xs transition-all"
            style={{ width: `${activePct}%` }}
          >
            {activePct}%
          </div>
        </div>

        {/* Legend under the bar: dot + Inactive / dot + Active (10px) */}
        <div className="flex items-center gap-3 text-[10px] font-sans text-white mt-[8px] leading-none">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white inline-block shadow-xs" />
            <span>Inactive</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
            <span>Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
