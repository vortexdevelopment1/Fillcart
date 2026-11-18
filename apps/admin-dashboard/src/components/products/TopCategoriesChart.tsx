import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface DonutSegment {
  name: string;
  shortName: string;
  value: number;
  color: string;
  strokeOutline?: string;
  legendSwatch: React.ReactNode;
}

const TIMEFRAME_DATA: Record<string, DonutSegment[]> = {
  Monthly: [
    {
      name: 'Grocery & Staples',
      shortName: 'Grocery',
      value: 40,
      color: '#123747',
      legendSwatch: <span className="w-[10px] h-[10px] rounded-full bg-primary inline-block flex-shrink-0" />,
    },
    {
      name: 'Fresh Produce',
      shortName: 'Produce',
      value: 28,
      color: '#527781',
      legendSwatch: <span className="w-[10px] h-[10px] rounded-full bg-secondary inline-block flex-shrink-0" />,
    },
    {
      name: 'Dairy & Eggs',
      shortName: 'Dairy',
      value: 20,
      color: 'rgba(82, 119, 129, 0.55)',
      strokeOutline: 'rgba(18,55,71,0.12)',
      legendSwatch: (
        <span className="w-[10px] h-[10px] rounded-full inline-block flex-shrink-0" style={{ backgroundColor: 'rgba(82, 119, 129, 0.55)' }} />
      ),
    },
    {
      name: 'Snacks & Drinks',
      shortName: 'Snacks',
      value: 12,
      color: '#F2F3F4',
      strokeOutline: 'rgba(18,55,71,0.12)',
      legendSwatch: (
        <span className="w-[10px] h-[10px] rounded-full bg-neutral border border-primary/20 inline-block flex-shrink-0" />
      ),
    },
  ],
  Weekly: [
    {
      name: 'Grocery & Staples',
      shortName: 'Grocery',
      value: 36,
      color: '#123747',
      legendSwatch: <span className="w-[10px] h-[10px] rounded-full bg-primary inline-block flex-shrink-0" />,
    },
    {
      name: 'Fresh Produce',
      shortName: 'Produce',
      value: 32,
      color: '#527781',
      legendSwatch: <span className="w-[10px] h-[10px] rounded-full bg-secondary inline-block flex-shrink-0" />,
    },
    {
      name: 'Dairy & Eggs',
      shortName: 'Dairy',
      value: 18,
      color: 'rgba(82, 119, 129, 0.55)',
      strokeOutline: 'rgba(18,55,71,0.12)',
      legendSwatch: (
        <span className="w-[10px] h-[10px] rounded-full inline-block flex-shrink-0" style={{ backgroundColor: 'rgba(82, 119, 129, 0.55)' }} />
      ),
    },
    {
      name: 'Snacks & Drinks',
      shortName: 'Snacks',
      value: 14,
      color: '#F2F3F4',
      strokeOutline: 'rgba(18,55,71,0.12)',
      legendSwatch: (
        <span className="w-[10px] h-[10px] rounded-full bg-neutral border border-primary/20 inline-block flex-shrink-0" />
      ),
    },
  ],
  'All time': [
    {
      name: 'Grocery & Staples',
      shortName: 'Grocery',
      value: 42,
      color: '#123747',
      legendSwatch: <span className="w-[10px] h-[10px] rounded-full bg-primary inline-block flex-shrink-0" />,
    },
    {
      name: 'Fresh Produce',
      shortName: 'Produce',
      value: 26,
      color: '#527781',
      legendSwatch: <span className="w-[10px] h-[10px] rounded-full bg-secondary inline-block flex-shrink-0" />,
    },
    {
      name: 'Dairy & Eggs',
      shortName: 'Dairy',
      value: 20,
      color: 'rgba(82, 119, 129, 0.55)',
      strokeOutline: 'rgba(18,55,71,0.12)',
      legendSwatch: (
        <span className="w-[10px] h-[10px] rounded-full inline-block flex-shrink-0" style={{ backgroundColor: 'rgba(82, 119, 129, 0.55)' }} />
      ),
    },
    {
      name: 'Snacks & Drinks',
      shortName: 'Snacks',
      value: 12,
      color: '#F2F3F4',
      strokeOutline: 'rgba(18,55,71,0.12)',
      legendSwatch: (
        <span className="w-[10px] h-[10px] rounded-full bg-neutral border border-primary/20 inline-block flex-shrink-0" />
      ),
    },
  ],
};

export const TopCategoriesChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'All time' | 'Weekly' | 'Monthly'>('Monthly');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const segments = TIMEFRAME_DATA[timeframe];
  const largestSegment = segments.reduce(
    (max, seg) => (seg.value > max.value ? seg : max),
    segments[0]
  );
  const activeSegment =
    hoveredIndex !== null && segments[hoveredIndex]
      ? segments[hoveredIndex]
      : largestSegment;

  // Donut geometry: r = 38, C = 2 * PI * 38 ≈ 238.761
  const r = 38;
  const C = 2 * Math.PI * r;
  const gapDeg = 5; // ~5-degree visible gap between segments

  // Calculate cumulative angles for 4 segments starting at 12 o'clock
  let cumulativeAngle = 0;
  const renderedSegments = segments.map((seg, idx) => {
    const rawSweepDeg = (seg.value / 100) * 360;
    const sweepDeg = Math.max(1, rawSweepDeg - gapDeg);
    const startAngleDeg = cumulativeAngle + gapDeg / 2;
    cumulativeAngle += rawSweepDeg;

    const arcLength = (sweepDeg / 360) * C;
    const offset = -((startAngleDeg / 360) * C);

    return {
      ...seg,
      arcLength,
      offset,
      idx,
    };
  });

  return (
    <div
      onMouseLeave={() => setHoveredIndex(null)}
      className="w-full rounded-[22px] bg-white p-[14px_16px] border border-primary/10 shadow-[0_8px_24px_rgba(18, 55, 71, 0.06)] select-none flex flex-col justify-between h-[200px] overflow-hidden"
    >
      {/* 1. Title Row: 24px */}
      <div className="flex items-center justify-between h-[24px] flex-shrink-0">
        <h3 className="font-sans text-[13px] font-normal text-ink leading-tight">
          Top Categories
        </h3>
        <button
          type="button"
          className="text-ink/55 hover:text-ink transition-colors p-0.5"
          aria-label="View category report"
        >
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.5]" />
        </button>
      </div>

      {/* 2. Body Area: flex row, align-items center, gap 18px */}
      <div className="flex items-center gap-[18px] flex-1 min-h-0">
        {/* LEFT: SVG 100x100 Donut Chart */}
        <div className="relative flex items-center justify-center flex-shrink-0 w-[100px] h-[100px]">
          <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            className="w-[100px] h-[100px] overflow-visible"
          >
            <g transform="rotate(-90 50 50)">
              {renderedSegments.map((seg) => {
                const isHovered = hoveredIndex === seg.idx;
                const strokeWidth = isHovered ? 14 : 12;

                return (
                  <circle
                    key={seg.name}
                    cx="50"
                    cy="50"
                    r={r}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${seg.arcLength} ${C - seg.arcLength}`}
                    strokeDashoffset={seg.offset}
                    strokeLinecap="round"
                    onMouseEnter={() => setHoveredIndex(seg.idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="cursor-pointer transition-all duration-250 ease-out"
                    style={{
                      stroke: seg.strokeOutline && !isHovered ? seg.color : undefined,
                      filter: seg.strokeOutline ? 'drop-shadow(0 0 0.5px rgba(18, 55, 71, 0.25))' : undefined,
                    }}
                  />
                );
              })}
            </g>
          </svg>

          {/* Center text: "40%" (Arbutus Slab 18px), "Grocery" (9px, black 55%) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center select-none">
            <span className="font-heading text-[18px] text-ink font-normal leading-none tracking-tight">
              {activeSegment.value}%
            </span>
            <span className="text-[9px] font-sans text-ink/55 mt-0.5 leading-none font-normal">
              {activeSegment.shortName}
            </span>
          </div>
        </div>

        {/* RIGHT: Legend (4 rows, row height 20px, gap 4px) */}
        <div className="flex flex-col gap-1 flex-1 min-w-0 justify-center">
          {segments.map((seg, idx) => {
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={seg.name}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`flex items-center justify-between h-[20px] text-[11px] font-sans cursor-pointer rounded-[6px] px-1 transition-colors ${
                  isHovered ? 'bg-primary/[0.04]' : ''
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1 pr-1">
                  {seg.legendSwatch}
                  <span className="truncate text-ink/80 font-normal leading-tight">
                    {seg.name}
                  </span>
                </div>
                <span className="font-medium text-ink text-right flex-shrink-0 leading-none">
                  {seg.value}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Tab Pills at Bottom: 26px, margin-top 8px */}
      <div className="h-[26px] mt-2 p-0.5 rounded-full bg-neutral flex items-center gap-1 w-full justify-between flex-shrink-0">
        {(['All time', 'Weekly', 'Monthly'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setTimeframe(t);
              setHoveredIndex(null);
            }}
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
