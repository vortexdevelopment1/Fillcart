import React from 'react';

interface SegmentedBarProps {
  totalTicks?: number; // 48
  filledRatio?: number; // 0 to 1
  filledCount?: number;
  className?: string;
}

export const SegmentedBar: React.FC<SegmentedBarProps> = ({
  totalTicks = 48,
  filledRatio = 0.917,
  filledCount,
  className = '',
}) => {
  const activeCount = filledCount !== undefined ? filledCount : Math.round(totalTicks * filledRatio);

  // Color generator for filled ticks
  const getTickStyle = (idx: number) => {
    const isFilled = idx < activeCount;
    if (!isFilled) {
      return {
        backgroundColor: '#EDEDF2',
        height: '24px',
      };
    }

    // The last 2 filled ticks act as the highlighted current-value marker (like dark blue ticks in reference)
    if (idx >= activeCount - 2) {
      return {
        backgroundColor: '#C98A00', // Darker accent marker
        height: '26px', // Slightly taller
      };
    }

    if (activeCount <= 3) {
      return {
        backgroundColor: '#F5B800',
        height: '24px',
      };
    }

    // Gradient progression from #E0A800 (darker) -> #F5B800 (middle) -> #FFD43B (bright)
    const progress = idx / (activeCount - 3);
    let bg = '#F5B800';
    if (progress < 0.5) {
      // interpolate #E0A800 to #F5B800
      bg = '#E5AC05';
    } else if (progress < 0.85) {
      bg = '#F5B800';
    } else {
      bg = '#F8C51E';
    }

    return {
      backgroundColor: bg,
      height: '24px',
    };
  };

  return (
    <div
      className={`flex items-end w-full select-none ${className}`}
      style={{ gap: '2px', height: '26px' }}
    >
      {Array.from({ length: totalTicks }).map((_, idx) => {
        const style = getTickStyle(idx);
        return (
          <div
            key={idx}
            className="flex-1 transition-all duration-200"
            style={{
              height: style.height,
              backgroundColor: style.backgroundColor,
              borderRadius: '1px', // almost square, NOT pill
            }}
          />
        );
      })}
    </div>
  );
};
