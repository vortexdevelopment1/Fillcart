import React from 'react';

interface SegmentedBarProps {
  totalTicks?: number; // 72 ticks
  filledCount: number; // e.g. 66 for Delivery Rate (~92%), 18 for Campaigns (~25%)
  darkMarkerCount?: number; // 5 or 4
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
        let bg = '#EDEDF2';

        if (isFilled) {
          // Majority of filled ticks = #F5B800; last darkMarkerCount ticks = #D99A00
          const isMarker = idx >= filledCount - darkMarkerCount;
          bg = isMarker ? '#D99A00' : '#F5B800';
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
