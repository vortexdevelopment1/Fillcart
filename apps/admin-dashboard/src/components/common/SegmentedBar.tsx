import React from 'react';

interface SegmentedBarProps {
  totalTicks?: number;
  filledRatio?: number; // 0 to 1
  filledCount?: number;
  color?: string;
  unfilledColor?: string;
  height?: number;
  gap?: number;
  className?: string;
}

export const SegmentedBar: React.FC<SegmentedBarProps> = ({
  totalTicks = 40,
  filledRatio = 0.8,
  filledCount,
  color = '#F5B800',
  unfilledColor = '#ECECF0',
  height = 22,
  gap = 3,
  className = '',
}) => {
  const activeCount = filledCount !== undefined ? filledCount : Math.round(totalTicks * filledRatio);

  return (
    <div
      className={`flex items-center w-full select-none ${className}`}
      style={{ gap: `${gap}px` }}
    >
      {Array.from({ length: totalTicks }).map((_, idx) => {
        const isFilled = idx < activeCount;
        return (
          <div
            key={idx}
            className="flex-1 rounded-[1.5px] transition-all duration-300"
            style={{
              height: `${height}px`,
              backgroundColor: isFilled ? color : unfilledColor,
            }}
          />
        );
      })}
    </div>
  );
};
