import React from 'react';

interface SegmentedBarProps {
  totalTicks?: number;
  filledRatio?: number; // 0 to 1
  filledCount?: number;
  color?: string;
  unfilledColor?: string;
  height?: number;
  className?: string;
}

export const SegmentedBar: React.FC<SegmentedBarProps> = ({
  totalTicks = 48,
  filledRatio = 0.8,
  filledCount,
  color = '#F5B800',
  unfilledColor = '#ECECF0',
  height = 24,
  className = '',
}) => {
  const activeCount = filledCount !== undefined ? filledCount : Math.round(totalTicks * filledRatio);

  return (
    <div className={`flex items-center gap-[2.5px] w-full select-none ${className}`}>
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
