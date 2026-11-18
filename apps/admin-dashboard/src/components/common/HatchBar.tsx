import React from 'react';

interface HatchBarProps {
  progress: number; // 0 to 100
  colorScheme?: 'primary' | 'secondary' | 'neutral' | 'white';
  height?: number; // e.g. 10 or 12
  className?: string;
}

export const HatchBar: React.FC<HatchBarProps> = ({
  progress,
  colorScheme = 'primary',
  height = 10,
  className = '',
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  // Determine track and fill styling based on colorScheme of card
  let trackBg = 'bg-primary/10';
  let fillBg = 'bg-primary';
  let hatchPattern = 'repeating-linear-gradient(45deg, rgba(255,255,255,0.4) 0 1px, transparent 1px 3px)';

  if (colorScheme === 'primary') {
    trackBg = 'bg-white/15';
    fillBg = 'bg-white';
    hatchPattern = 'repeating-linear-gradient(45deg, rgba(18,55,71,0.25) 0 1px, transparent 1px 3px)';
  } else if (colorScheme === 'secondary') {
    trackBg = 'bg-white/20';
    fillBg = 'bg-white';
    hatchPattern = 'repeating-linear-gradient(45deg, rgba(82,119,129,0.3) 0 1px, transparent 1px 3px)';
  } else if (colorScheme === 'neutral') {
    trackBg = 'bg-primary/10';
    fillBg = 'bg-primary';
    hatchPattern = 'repeating-linear-gradient(45deg, rgba(82,119,129,0.4) 0 1px, transparent 1px 3px)';
  } else {
    // white card
    trackBg = 'bg-neutral';
    fillBg = 'bg-secondary';
    hatchPattern = 'repeating-linear-gradient(45deg, rgba(18,55,71,0.2) 0 1px, transparent 1px 3px)';
  }

  return (
    <div
      className={`w-full rounded-full overflow-hidden relative ${trackBg} ${className}`}
      style={{ height: `${height}px` }}
    >
      <div
        className={`h-full rounded-full transition-all duration-300 relative ${fillBg}`}
        style={{
          width: `${clampedProgress}%`,
          backgroundImage: hatchPattern,
        }}
      />
    </div>
  );
};
