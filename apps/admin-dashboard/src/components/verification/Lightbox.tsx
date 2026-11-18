import React, { useEffect } from 'react';
import { X, FileText } from 'lucide-react';

interface LightboxProps {
  isOpen: boolean;
  docName: string;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ isOpen, docName, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[90] bg-primary/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={`${docName} preview`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[420px] h-[520px] max-w-full rounded-[24px] bg-white relative p-6 flex flex-col items-center justify-between shadow-[0_20px_50px_rgba(18, 55, 71, 0.35)]"
      >
        {/* Header with Title & Close button */}
        <div className="w-full flex items-center justify-between">
          <h4 className="font-sans text-[15px] font-normal text-ink truncate pr-4">
            {docName} <span className="text-ink/55">(preview)</span>
          </h4>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-neutral flex items-center justify-center text-ink/55 hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-secondary"
            aria-label="Close preview"
          >
            <X className="w-5 h-5 text-ink" />
          </button>
        </div>

        {/* Clean Theme Preview Container */}
        <div className="w-full flex-1 rounded-[16px] bg-neutral/70 border border-primary/10 flex flex-col items-center justify-center text-center p-6 my-4 select-none">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-primary/10 flex items-center justify-center mb-3">
            <FileText className="w-7 h-7 text-secondary stroke-[1.5]" />
          </div>
          <p className="font-sans text-xs text-ink/70 max-w-[240px]">
            Regulatory document sample on file
          </p>
          <span className="font-sans text-[11px] text-ink/45 mt-1">
            Verified official copy
          </span>
        </div>

        {/* Footer info */}
        <div className="w-full flex items-center justify-between text-[11px] text-ink/55">
          <span>Official Verification Document</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-primary text-white hover:opacity-90 font-sans text-xs focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
