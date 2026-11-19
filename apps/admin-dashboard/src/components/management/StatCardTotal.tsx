import React, { useState, useEffect } from 'react';

interface StatCardTotalProps {
  title: string; // "Total Vendors" or "Total Riders"
  total: number;
  verified: number;
  pending: number;
  rejected: number;
  inactive?: number;
}

export const StatCardTotal: React.FC<StatCardTotalProps> = ({
  title,
  total,
  verified,
  pending,
  rejected,
  inactive = 0,
}) => {
  const [mounted, setMounted] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<{
    label: string;
    count: number;
  } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Donut geometry: r = 30 -> circumference C = 2 * pi * 30 = 188.4955
  const C = 2 * Math.PI * 30;
  const safeTotal = total || 1;

  // Active slices with > 0: Verified white, Pending SECONDARY, Rejected white 40%
  const slices = [
    { label: 'Verified', count: verified, color: '#FFFFFF' },
    { label: 'Pending', count: pending, color: '#527781' },
    { label: 'Rejected', count: rejected, color: 'rgba(255, 255, 255, 0.40)' },
  ];

  const activeSlicesCount = slices.filter((s) => s.count > 0).length;
  const gapPx = activeSlicesCount > 1 ? 3 : 0;

  // Compute dasharray & dashoffset for each slice
  let currentOffset = 0;
  const segments = slices.map((slice) => {
    if (slice.count === 0 || !total) {
      return { ...slice, dashArray: `0 ${C}`, dashOffset: 0 };
    }
    const rawLen = (slice.count / safeTotal) * C;
    const strokeLen = Math.max(0, rawLen - gapPx);
    const dashArray = mounted ? `${strokeLen} ${C - strokeLen}` : `0 ${C}`;
    const dashOffset = -currentOffset;
    currentOffset += rawLen;
    return { ...slice, dashArray, dashOffset };
  });

  return (
    <div className="h-[130px] rounded-[22px] p-[14px_16px] bg-primary text-white flex flex-col justify-between overflow-hidden select-none relative shadow-sm border border-primary">
      {/* Top Title */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-sans text-white font-normal leading-tight">
          {title}
        </span>
      </div>

      {/* Row: Big count + Donut chart */}
      <div className="flex items-center justify-between gap-2 -mt-1">
        <span className="font-heading text-[36px] font-normal text-white leading-none">
          {total}
        </span>

        {/* Donut SVG 76x76, viewBox 0 0 80 80 */}
        <div className="relative w-[76px] h-[76px] flex-shrink-0 flex items-center justify-center">
          <svg
            width="76"
            height="76"
            viewBox="0 0 80 80"
            className="transform -rotate-90 origin-center"
          >
            {/* Background Track */}
            <circle
              cx="40"
              cy="40"
              r="30"
              stroke="rgba(255, 255, 255, 0.10)"
              strokeWidth="10"
              fill="none"
            />

            {/* Colored Segments */}
            {segments.map((seg) => (
              <circle
                key={seg.label}
                cx="40"
                cy="40"
                r="30"
                stroke={seg.color}
                strokeWidth="10"
                fill="none"
                strokeDasharray={seg.dashArray}
                strokeDashoffset={seg.dashOffset}
                className="transition-all duration-500 ease-out cursor-pointer hover:opacity-90"
                style={{
                  transitionProperty: 'stroke-dasharray, stroke-dashoffset',
                }}
                onMouseEnter={() => setHoveredSegment({ label: seg.label, count: seg.count })}
                onMouseLeave={() => setHoveredSegment(null)}
              />
            ))}
          </svg>

          {/* Hover Tooltip chip centered or overlaid */}
          {hoveredSegment && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <span className="px-1.5 py-0.5 rounded-[6px] bg-primary text-[9px] font-sans text-white border border-white/20 whitespace-nowrap shadow-md">
                {hoveredSegment.count} {hoveredSegment.label.toLowerCase()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom legend (10px, one row) */}
      <div className="flex items-center justify-between text-[10px] font-sans text-white/80 leading-none pt-0.5">
        <div className="flex items-center gap-1.5">
          <span className="w-[7px] h-[7px] rounded-full bg-white flex-shrink-0" />
          <span>{verified} verified</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-[7px] h-[7px] rounded-full bg-secondary flex-shrink-0" />
          <span>{pending} pending</span>
        </div>
        <div className="flex items-center gap-1.5" title={`${inactive} inactive in accounts`}>
          <span className="w-[7px] h-[7px] rounded-full bg-white/40 flex-shrink-0" />
          <span>{rejected} rejected</span>
        </div>
      </div>
    </div>
  );
};
