import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  showDragHandle?: boolean;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  title,
  subtitle,
  action,
  showDragHandle = true,
  hoverable = true,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-[20px] p-5 border border-black/[0.06]
        shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.05)] relative
        transition-all duration-200 flex flex-col justify-between
        ${hoverable ? 'hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_12px_28px_rgba(0,0,0,0.08)] hover:border-black/[0.12]' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* 2x2 Grid of 4 Dots Drag Handle (top-right at 20px/20px, #000000 at 25% opacity) */}
      {showDragHandle && (
        <div
          className="absolute top-5 right-5 p-0 select-none pointer-events-none"
          aria-hidden="true"
        >
          <div className="grid grid-cols-2 gap-[3px]">
            <div className="w-[3px] h-[3px] rounded-full bg-black/25" />
            <div className="w-[3px] h-[3px] rounded-full bg-black/25" />
            <div className="w-[3px] h-[3px] rounded-full bg-black/25" />
            <div className="w-[3px] h-[3px] rounded-full bg-black/25" />
          </div>
        </div>
      )}

      {(title || action) && (
        <div className="flex items-center justify-between mb-0 pr-6">
          <div>
            {typeof title === 'string' ? (
              <h3 className="text-[16px] font-normal text-black tracking-[0px] leading-tight">
                {title}
              </h3>
            ) : (
              title
            )}
            {subtitle && <p className="text-xs text-black/55 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}

      {children}
    </div>
  );
};
