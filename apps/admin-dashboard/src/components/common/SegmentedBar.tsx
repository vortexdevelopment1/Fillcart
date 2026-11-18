import React from 'react';

interface SegmentedBarProps {
  totalTicks?: number; // 72 ticks
  filledCount: number; // e.g. 66 for Delivery Rate (~92%), 18 for Campaigns (~25%)
  darkMarkerCount?: number; // 5
  className?: string;
}

export const SegmentedBar: React.FC<SegmentedBarProps> = ({
  totalTicks = 72,
  filledCount,
  darkMarkerCount = 4,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center w-full select-none ${className}`}
      style={{ gap: '2px', height: '22px' }}
    >
      {Array.from({ length: totalTicks }).map((_, idx) => {
        const isFilled = idx < filledCount;
        const isLastFour = idx >= filledCount - 4 && isFilled;

        let bg = '#F2F3F4'; // NEUTRAL for unfilled
        let bgImage: string | undefined = undefined;

        if (isFilled) {
          if (isLastFour) {
            bg = '#123747'; // Solid PRIMARY
          } else {
            bg = '#123747'; // PRIMARY with vertical hatch texture
            bgImage = 'repeating-linear-gradient(90deg, rgba(82, 119, 129, 0.35) 0 1px, transparent 1px 2.5px)';
          }
        }

        return (
          <div
            key={idx}
            className="flex-1 transition-colors duration-150"
            style={{
              height: '22px',
              backgroundColor: bg,
              backgroundImage: bgImage,
              borderRadius: '1px',
            }}
          />
        );
      })}
    </div>
  );
};
