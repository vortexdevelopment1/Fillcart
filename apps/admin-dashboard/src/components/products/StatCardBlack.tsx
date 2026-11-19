import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

interface StatCardBlackProps {
  totalCount: number;
}

export const StatCardBlack: React.FC<StatCardBlackProps> = ({ totalCount }) => {
  // Hairlines every ~14px across the right half of the chart
  const hairlines = Array.from({ length: 9 }, (_, i) => 130 + i * 14);
  const addedCount = totalCount > 0 ? Math.min(3, totalCount) : 0;

  return (
    <div className="bg-primary text-white rounded-[22px] p-[14px_16px] relative border border-white/10 shadow-[0_8px_24px_rgba(18,55,71,0.06)] h-[200px] flex flex-col justify-between overflow-hidden select-none">
      {/* Top Header (~60px) */}
      <div className="flex items-start justify-between flex-shrink-0">
        <div>
          <span className="font-sans text-[13px] text-white/70 block leading-tight">
            Total Products
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-heading text-[24px] text-white font-normal leading-none tracking-tight">
              {totalCount.toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-sans px-1.5 py-0.5 rounded-full bg-white/20 text-white font-normal leading-none">
              ↗ +4.2%
            </span>
          </div>
          <span className="text-[10px] font-sans text-white/55 block mt-1 leading-none">
            {addedCount} added last month
          </span>
        </div>

        <button
          type="button"
          className="text-white/60 hover:text-white transition-colors p-0.5"
          aria-label="Filter products"
        >
          <SlidersHorizontal className="w-3 h-3 stroke-[1.5]" />
        </button>
      </div>

      {/* Chart Area: 70px high bleeding to edges (margin 0 -16px -14px) */}
      <div className="mx-[-16px] mb-[-14px] h-[70px] flex flex-col justify-end relative overflow-hidden flex-shrink-0">
        {/* Floating Tooltip Chip */}
        <div className="absolute right-[24px] top-[6px] z-10 bg-white text-ink text-[9px] font-sans font-medium px-1.5 py-0.5 rounded-[6px] shadow-sm pointer-events-none leading-none">
          ₹1,210
        </div>

        {/* Line Chart SVG */}
        <div className="w-full h-[52px] relative overflow-hidden">
          <svg
            viewBox="0 0 260 52"
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="whiteCurveGradRow1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.20" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Hairlines behind right half */}
            {hairlines.map((x) => (
              <line
                key={x}
                x1={x}
                y1="4"
                x2={x}
                y2="52"
                stroke="#FFFFFF"
                strokeOpacity="0.12"
                strokeWidth="1"
              />
            ))}

            {/* Area Fill */}
            <path
              d="M 0 38 C 30 38, 55 48, 85 44 C 115 40, 140 26, 170 30 C 195 34, 215 14, 230 14 L 230 52 L 0 52 Z"
              fill="url(#whiteCurveGradRow1)"
            />

            {/* Smooth Line (2px) */}
            <path
              d="M 0 38 C 30 38, 55 48, 85 44 C 115 40, 140 26, 170 30 C 195 34, 215 14, 230 14"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* End Point Dot */}
            <circle cx="230" cy="14" r="3.5" fill="#FFFFFF" />
          </svg>
        </div>

        {/* X labels: 9-10px */}
        <div className="flex items-center justify-between text-[9px] font-sans text-white/60 px-4 pb-[5px] leading-none">
          <span>1 Feb</span>
          <span>8 Feb</span>
          <span>16 Feb</span>
          <span>25 Feb</span>
        </div>
      </div>
    </div>
  );
};
