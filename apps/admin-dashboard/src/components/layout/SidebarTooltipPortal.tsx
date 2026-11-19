import React from 'react';
import { createPortal } from 'react-dom';

interface SidebarTooltipPortalProps {
  visible: boolean;
  text: string;
  badge?: number | string;
  targetRect: DOMRect | null;
}

export const SidebarTooltipPortal: React.FC<SidebarTooltipPortalProps> = ({
  visible,
  text,
  badge,
  targetRect,
}) => {
  if (!visible || !targetRect) return null;

  // Position: vertically centered with the target, 8px to the right of the sidebar
  const top = targetRect.top + targetRect.height / 2;
  const left = targetRect.right + 8;

  return createPortal(
    <div
      style={{
        top: `${top}px`,
        left: `${left}px`,
        transform: 'translateY(-50%)',
      }}
      className="fixed z-[100] flex items-center pointer-events-none select-none animate-in fade-in slide-in-from-left-1 duration-120"
      role="tooltip"
    >
      {/* Small Left Caret pointing to icon */}
      <div
        className="w-0 h-0 border-y-[5px] border-y-transparent border-r-[6px] border-r-primary mr-[-1px] flex-shrink-0"
        aria-hidden="true"
      />

      {/* Primary Pill Tooltip Container */}
      <div className="bg-primary text-white text-[12px] font-sans font-normal px-3 py-1.5 rounded-[10px] shadow-[0_8px_20px_rgba(18,55,71,0.25)] border border-white/10 whitespace-nowrap flex items-center gap-1.5 leading-tight">
        <span>{text}</span>
        {badge !== undefined && (
          <span className="text-secondary font-medium">({badge})</span>
        )}
      </div>
    </div>,
    document.body
  );
};
