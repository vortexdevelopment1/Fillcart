import React from 'react';

interface SummaryPieCardProps {
  total: number;
  pending: number;
  approved: number;
  rejected: number; // Includes Re-upload asked
}

export const SummaryPieCard: React.FC<SummaryPieCardProps> = ({
  total,
  pending,
  approved,
  rejected,
}) => {
  // Slices data in order: Pending (NEUTRAL), Approved (SECONDARY), Rejected (PRIMARY)
  const slicesData = [
    {
      name: 'Pending',
      count: pending,
      color: '#F2F3F4',
      swatchClass: 'bg-neutral border border-primary/[0.12]',
      barClass: 'bg-neutral border border-primary/[0.12]',
      outlineStroke: 'rgba(18, 55, 71, 0.12)',
    },
    {
      name: 'Approved',
      count: approved,
      color: '#527781',
      swatchClass: 'bg-secondary',
      barClass: 'bg-secondary',
    },
    {
      name: 'Rejected',
      count: rejected,
      color: '#123747',
      swatchClass: 'bg-primary',
      barClass: 'bg-primary',
    },
  ];

  // Calculate percentages (summing to 100)
  const pendingPct = total > 0 ? Math.round((pending / total) * 100) : 0;
  const approvedPct = total > 0 ? Math.round((approved / total) * 100) : 0;
  const rejectedPct = total > 0 ? Math.max(0, 100 - pendingPct - approvedPct) : 0;
  const percentages = [pendingPct, approvedPct, rejectedPct];

  // Build SVG Paths for the pie slices starting at 12 o'clock (0 rad) clockwise
  const renderPieSlices = () => {
    if (total === 0) {
      return <circle cx="0" cy="0" r="1" fill="rgba(18,55,71,0.06)" />;
    }

    // Check if one slice is 100%
    const fullSlice = slicesData.find((s) => s.count === total);
    if (fullSlice) {
      return <circle cx="0" cy="0" r="1" fill={fullSlice.color} />;
    }

    let currentAngle = 0; // 0 is 12 o'clock: x = sin(theta), y = -cos(theta)
    const paths: React.ReactNode[] = [];

    slicesData.forEach((slice) => {
      if (slice.count <= 0) return;

      const fraction = slice.count / total;
      const angleDelta = fraction * 2 * Math.PI;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angleDelta;
      currentAngle = endAngle;

      const x1 = Math.sin(startAngle);
      const y1 = -Math.cos(startAngle);
      const x2 = Math.sin(endAngle);
      const y2 = -Math.cos(endAngle);

      const largeArc = angleDelta > Math.PI ? 1 : 0;

      // SVG path: Move to center, Line to start point on circumference, Arc to end point, Close
      const d = `M 0 0 L ${x1.toFixed(4)} ${y1.toFixed(4)} A 1 1 0 ${largeArc} 1 ${x2.toFixed(4)} ${y2.toFixed(4)} Z`;

      paths.push(
        <path
          key={slice.name}
          d={d}
          fill={slice.color}
          stroke="#FFFFFF"
          strokeWidth="0.03"
          strokeLinejoin="round"
        />
      );
    });

    return paths;
  };

  return (
    <div className="relative w-full rounded-[24px] bg-white p-[18px_28px] border border-black/[0.08] shadow-[0_8px_24px_rgba(18,55,71,0.05)] select-none">
      {/* 4-dot drag icon top-right (black at 25% opacity) */}
      <div
        className="absolute top-4 right-4 p-0 select-none pointer-events-none"
        aria-hidden="true"
      >
        <div className="grid grid-cols-2 gap-[3px]">
          <div className="w-[3px] h-[3px] rounded-full bg-ink/25" />
          <div className="w-[3px] h-[3px] rounded-full bg-ink/25" />
          <div className="w-[3px] h-[3px] rounded-full bg-ink/25" />
          <div className="w-[3px] h-[3px] rounded-full bg-ink/25" />
        </div>
      </div>

      {/* Main Grid:
          Desktop (>=900px): grid-template-columns: auto auto 1fr; column-gap: 32px; align-items: center;
          Mobile (<900px): stacked (total + pie in row 1, legend below in row 2)
      */}
      <div className="grid grid-cols-[auto_auto] min-[900px]:grid-cols-[auto_auto_1fr] gap-y-6 gap-x-6 min-[900px]:gap-x-[32px] items-center w-full">
        {/* Column 1 - Total block:
            "Total Submissions" 15px, count 48px (Arbutus Slab), "applications received" 12px muted.
            Vertical divider after it: border-right 1px solid primary 10%, padding-right 32px.
        */}
        <div className="flex flex-col items-start border-r border-primary/10 pr-6 min-[900px]:pr-[32px] flex-shrink-0">
          <span className="font-sans text-[15px] font-normal text-ink leading-tight">
            Total Submissions
          </span>
          <span className="font-heading text-[48px] text-ink font-normal leading-none my-1 tracking-tight">
            {total}
          </span>
          <span className="font-sans text-[12px] text-ink/55 leading-none">
            applications received
          </span>
        </div>

        {/* Column 2 - Pie: SVG 128x128 (same pie, same colors, white separators) */}
        <div className="flex items-center justify-center flex-shrink-0">
          <svg
            width="128"
            height="128"
            viewBox="-1.02 -1.02 2.04 2.04"
            className="w-[128px] h-[128px] drop-shadow-sm select-none"
            aria-label={`Pie chart of submissions: ${pendingPct}% pending, ${approvedPct}% approved, ${rejectedPct}% rejected`}
          >
            {renderPieSlices()}
          </svg>
        </div>

        {/* Column 3 - Legend (fills the rest of the width, width 100%):
            3 rows, row gap 14px. Each row is a grid:
            grid-template-columns: 14px 80px 1fr 44px 64px; column-gap: 12px; align-items: center;
        */}
        <div className="col-span-2 min-[900px]:col-span-1 min-[900px]:col-start-3 w-full flex flex-col gap-[14px]">
          {slicesData.map((slice, i) => {
            const pct = percentages[i];

            return (
              <div
                key={slice.name}
                className="grid grid-cols-[14px_80px_1fr_44px_64px] gap-x-3 items-center w-full text-xs font-sans"
              >
                {/* 1) Swatch 14px (radius 4px, inset 1px border black 12%) */}
                <div
                  className={`w-[14px] h-[14px] rounded-[4px] flex-shrink-0 ${slice.swatchClass}`}
                />

                {/* 2) Status name (13px) */}
                <span className="text-[13px] text-ink font-normal leading-none truncate">
                  {slice.name}
                </span>

                {/* 3) Horizontal progress bar: height 8px, radius 999px, track NEUTRAL,
                       fill = that status color, fill width = percentage (animate width 250ms)
                */}
                <div className="w-full h-[8px] rounded-full bg-neutral overflow-hidden min-w-0">
                  <div
                    className={`h-full rounded-full transition-all duration-[250ms] ease-out ${slice.barClass}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* 4) Percentage, 13px, weight 500, right-aligned */}
                <span className="text-[13px] font-medium text-ink text-right tabular-nums">
                  {pct}%
                </span>

                {/* 5) "x of N", 11px, black 55%, right-aligned */}
                <span className="text-[11px] text-ink/55 text-right tabular-nums whitespace-nowrap">
                  {slice.count} of {total}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
