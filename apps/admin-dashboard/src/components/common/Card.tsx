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
        bg-white rounded-[24px] p-5 border border-[#ECECF0] shadow-card relative
        transition-all duration-200 flex flex-col justify-between
        ${hoverable ? 'hover:shadow-card-hover hover:border-[#E2E2E8]' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* 6-dot drag handle in top right (exact match to reference) */}
      {showDragHandle && (
        <div
          className="absolute top-4 right-4 text-[#C4C4CC] hover:text-[#8A8A93] transition-colors p-1"
          aria-hidden="true"
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor">
            <circle cx="3" cy="2" r="1.2" />
            <circle cx="3" cy="6" r="1.2" />
            <circle cx="3" cy="10" r="1.2" />
            <circle cx="9" cy="2" r="1.2" />
            <circle cx="9" cy="6" r="1.2" />
            <circle cx="9" cy="10" r="1.2" />
          </svg>
        </div>
      )}

      {(title || action) && (
        <div className="flex items-center justify-between mb-2 pr-6">
          <div>
            {typeof title === 'string' ? (
              <h3 className="text-[15px] font-semibold text-[#222026] tracking-tight">{title}</h3>
            ) : (
              title
            )}
            {subtitle && <p className="text-xs text-[#8A8A93] mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}

      {children}
    </div>
  );
};
