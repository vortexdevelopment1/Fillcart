import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface CategoryBarItem {
  name: string;
  percentage: number;
  heightPct: number; // Scaled so tallest = 100%
  isTallest?: boolean;
}

const TIMEFRAME_BARS: Record<string, CategoryBarItem[]> = {
  Monthly: [
    { name: 'Grocery', percentage: 38, heightPct: 100, isTallest: true },
    { name: 'Produce', percentage: 29, heightPct: 76 },
    { name: 'Dairy', percentage: 20, heightPct: 53 },
    { name: 'Snacks', percentage: 13, heightPct: 34 },
  ],
  Weekly: [
    { name: 'Grocery', percentage: 35, heightPct: 100, isTallest: true },
    { name: 'Produce', percentage: 32, heightPct: 91 },
    { name: 'Dairy', percentage: 19, heightPct: 54 },
    { name: 'Snacks', percentage: 14, heightPct: 40 },
  ],
  'All time': [
    { name: 'Grocery', percentage: 40, heightPct: 100, isTallest: true },
    { name: 'Produce', percentage: 28, heightPct: 70 },
    { name: 'Dairy', percentage: 20, heightPct: 50 },
    { name: 'Snacks', percentage: 12, heightPct: 30 },
  ],
};

export const CategoryBars: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'All time' | 'Weekly' | 'Monthly'>('Monthly');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const bars = TIMEFRAME_BARS[timeframe];

  return (
    <div className="w-full rounded-[22px] bg-white p-[14px_16px] border border-primary/10 shadow-[0_8px_24px_rgba(18,55,71,0.06)] select-none flex flex-col justify-between h-[200px] overflow-hidden">
      {/* 1. Title Row: 24px */}
      <div className="flex items-center justify-between h-[24px] flex-shrink-0">
        <h3 className="font-sans text-[13px] font-normal text-ink leading-tight">
          Sales by Category
        </h3>
        <button
          type="button"
          className="text-ink/60 hover:text-ink transition-colors p-0.5"
          aria-label="View sales breakdown"
        >
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.5]" />
        </button>
      </div>

      {/* 2. Body Area: CSS grid of 4 equal columns */}
      <div className="grid grid-cols-4 gap-2 w-full flex-1 min-h-0 items-end justify-items-center pt-1">
        {bars.map((item, idx) => {
          const isHovered = hoveredIdx === idx;
          const isPrimary = item.isTallest || isHovered;
          const barHeightPx = Math.round((item.heightPct / 100) * 70);

          return (
            <div
              key={item.name}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="flex flex-col items-center justify-end w-full cursor-pointer group"
            >
              {/* Row A: Value label (10px, weight 500) */}
              <span
                className={`font-sans text-[10px] leading-tight mb-1 transition-colors ${
                  isHovered ? 'font-medium text-ink' : 'font-medium text-ink/75'
                }`}
              >
                {item.percentage}%
              </span>

              {/* Row B: Bar area (70px high, width 28px, radius 8px, track behind) */}
              <div className="w-[28px] h-[70px] relative rounded-[8px] bg-neutral flex flex-col justify-end overflow-hidden flex-shrink-0">
                <div
                  className="w-full rounded-[8px] transition-all duration-200 ease-out"
                  style={{
                    height: `${barHeightPx}px`,
                    backgroundImage: 'linear-gradient(180deg, #527781 0%, #123747 100%)',
                  }}
                />
              </div>

              {/* Row C: Category label (10px, black 55%, row height 14px) */}
              <span
                className={`font-sans text-[10px] h-[14px] leading-[14px] mt-1.5 transition-colors truncate max-w-[60px] text-center ${
                  isHovered ? 'font-medium text-ink' : 'text-ink/60 font-normal'
                }`}
              >
                {item.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* 3. Tab Pills at Bottom: 26px, margin-top 8px */}
      <div className="h-[26px] mt-2 p-0.5 rounded-full bg-neutral flex items-center gap-1 w-full justify-between flex-shrink-0">
        {(['All time', 'Weekly', 'Monthly'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTimeframe(t)}
            className={`flex-1 h-[22px] rounded-full text-[10px] font-sans transition-all text-center flex items-center justify-center leading-none ${
              timeframe === t
                ? 'bg-primary text-white font-medium shadow-xs'
                : 'text-ink/80 hover:text-ink font-normal'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
};
