import React, { useState, useEffect } from 'react';

interface StatCardActiveProps {
  title: string; // "Active Vendors" or "Online Now"
  activeCount: number;
  total: number;
  isRider?: boolean;
  itemLabel?: string; // "vendors" or "riders"
}

export const StatCardActive: React.FC<StatCardActiveProps> = ({
  title,
  activeCount,
  total,
  isRider = false,
  itemLabel = 'vendors',
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Arc length of semicircle radius 50 = pi * 50 = 157.0796
  const arcLength = Math.PI * 50;
  const safeTotal = total || 1;
  const percent = Math.round((activeCount / safeTotal) * 100);
  const strokeLength = (percent / 100) * arcLength;

  return (
    <div className="h-[130px] rounded-[22px] p-[14px_16px] bg-secondary text-white flex flex-col justify-between overflow-hidden select-none relative shadow-sm border border-secondary">
      {/* Top Title: Vendors = "Active Vendors", Riders = "Online Now" + pulsing dot */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isRider && (
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
          )}
          <span className="text-[13px] font-sans text-white/90 font-normal leading-tight">
            {title}
          </span>
        </div>
      </div>

      {/* Row: Left count + "of N" and Right Gauge */}
      <div className="flex items-center justify-between gap-1 -mt-1">
        <div className="flex flex-col justify-center">
          <span className="font-heading text-[36px] font-normal text-white leading-none">
            {activeCount}
          </span>
          <span className="text-[11px] font-sans text-white/75 mt-1 leading-none">
            of {total} {itemLabel}
          </span>
        </div>

        {/* Half-circle Gauge: SVG 110x62, viewBox 0 0 120 66 */}
        <div className="relative w-[110px] h-[62px] flex-shrink-0 flex items-center justify-center">
          <svg width="110" height="62" viewBox="0 0 120 66" className="overflow-visible">
            {/* Background Track */}
            <path
              d="M10 60 A50 50 0 0 1 110 60"
              stroke="rgba(255, 255, 255, 0.20)"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />

            {/* White Fill Arc with 500ms animation */}
            <path
              d="M10 60 A50 50 0 0 1 110 60"
              stroke="#FFFFFF"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={
                mounted ? `${strokeLength} ${arcLength}` : `0 ${arcLength}`
              }
              className="transition-all duration-500 ease-out"
              style={{ transitionProperty: 'stroke-dasharray' }}
            />

            {/* Center Percent in Arbutus Slab 22px */}
            <text
              x="60"
              y="56"
              textAnchor="middle"
              className="font-heading text-[22px] font-normal fill-white"
            >
              {percent}%
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};
