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
  darkMarkerCount = 5,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center w-full select-none ${className}`}
      style={{ gap: '2px', height: '22px' }}
    >
      {Array.from({ length: totalTicks }).map((_, idx) => {
        const isFilled = idx < filledCount;
        let bg = 'rgba(0, 0, 0, 0.06)'; // #000000 at 6% opacity

        if (isFilled) {
          // Last 5 filled ticks = PRIMARY #F5B800 at 100%
          // Earlier filled ticks = PRIMARY #F5B800 at 55% opacity
          const isMarker = idx >= filledCount - darkMarkerCount;
          bg = isMarker ? '#F5B800' : 'rgba(245, 184, 0, 0.55)';
        }

        return (
          <div
            key={idx}
            className="flex-1 transition-colors duration-150"
            style={{
              height: '22px',
              backgroundColor: bg,
              borderRadius: '1px',
            }}
          />
        );
      })}
    </div>
  );
};
