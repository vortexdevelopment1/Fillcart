import React from 'react';

interface StatCardMiniProps {
  title: string;
  value: string | number;
  badgeText?: string;
  badgeVariant?: 'primary' | 'white' | 'dark' | 'outline';
  variant: 'black' | 'primary' | 'secondary' | 'white';
  sparklineData?: number[];
  pulseDot?: boolean;
  onClick?: () => void;
}

export const StatCardMini: React.FC<StatCardMiniProps> = ({
  title,
  value,
  badgeText,
  badgeVariant = 'white',
  variant,
  sparklineData = [12, 18, 14, 25, 20, 28, 35],
  pulseDot = false,
  onClick,
}) => {
  // Styles based on variant
  const variantStyles = {
    black: {
      card: 'bg-primary text-white border-primary',
      title: 'text-white/80',
      value: 'text-white',
      badge: 'bg-white/15 text-white border-transparent',
      dots: 'text-white/40',
      sparkFill: 'rgba(255, 255, 255, 0.15)',
      sparkStroke: 'rgba(255, 255, 255, 0.7)',
    },
    primary: {
      card: 'bg-primary text-white border-primary',
      title: 'text-white/80',
      value: 'text-white',
      badge: 'bg-white/20 text-white border-transparent shadow-xs',
      dots: 'text-white/40',
      sparkFill: 'rgba(255, 255, 255, 0.15)',
      sparkStroke: 'rgba(255, 255, 255, 0.7)',
    },
    secondary: {
      card: 'bg-secondary text-white border-secondary hover:border-secondary',
      title: 'text-white/80',
      value: 'text-white',
      badge: 'bg-white/20 text-white border-transparent shadow-xs',
      dots: 'text-white/40',
      sparkFill: 'rgba(255, 255, 255, 0.15)',
      sparkStroke: 'rgba(255, 255, 255, 0.7)',
    },
    white: {
      card: 'bg-white text-ink border-primary/10',
      title: 'text-ink/60',
      value: 'text-ink',
      badge: 'bg-neutral text-ink border-transparent',
      dots: 'text-ink/25',
      sparkFill: 'rgba(18, 55, 71, 0.06)',
      sparkStroke: 'rgba(18, 55, 71, 0.55)',
    },
  }[variant];

  // Generate SVG path for sparkline
  const min = Math.min(...sparklineData);
  const max = Math.max(...sparklineData);
  const range = max - min || 1;
  const width = 120;
  const height = 26;

  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <div
      onClick={onClick}
      className={`h-[130px] rounded-[22px] p-[16px_18px] border shadow-xs flex flex-col justify-between transition-all select-none relative overflow-hidden ${
        variantStyles.card
      } ${onClick ? 'cursor-pointer hover:shadow-md active:scale-[0.99]' : ''}`}
    >
      {/* Top row: Title + 4-dot grid icon */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {pulseDot && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
          )}
          <span className={`text-[13px] font-sans font-normal leading-tight ${variantStyles.title}`}>
            {title}
          </span>
        </div>

        {/* 4-dot decorative grid icon */}
        <div className={`grid grid-cols-2 gap-1 w-3.5 h-3.5 ${variantStyles.dots}`}>
          <div className="w-1 h-1 rounded-full bg-current" />
          <div className="w-1 h-1 rounded-full bg-current" />
          <div className="w-1 h-1 rounded-full bg-current" />
          <div className="w-1 h-1 rounded-full bg-current" />
        </div>
      </div>

      {/* Middle row: Big Number (Arbutus Slab 28px) + badge */}
      <div className="flex items-baseline justify-between gap-2 mt-0.5">
        <span className={`font-heading text-[28px] font-normal leading-none ${variantStyles.value}`}>
          {value}
        </span>

        {badgeText && (
          <span
            className={`text-[10px] font-sans px-2 py-0.5 rounded-full font-medium leading-none ${
              badgeVariant === 'primary'
                ? 'bg-primary text-white'
                : variantStyles.badge
            }`}
          >
            {badgeText}
          </span>
        )}
      </div>

      {/* Bottom row: Sparkline mini chart */}
      <div className="w-full h-[26px] mt-auto flex items-end">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <polygon points={areaPoints} fill={variantStyles.sparkFill} />
          <polyline
            fill="none"
            stroke={variantStyles.sparkStroke}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>
    </div>
  );
};
