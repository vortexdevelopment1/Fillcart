import React, { useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#123747]/35 backdrop-blur-[6px] animate-fadeIn"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-[420px] bg-white rounded-[24px] shadow-[0_24px_60px_rgba(18, 55, 71, 0.25)] border border-primary/10 overflow-hidden p-6 flex flex-col gap-5 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white border border-primary/10">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-[18px] font-normal text-ink leading-tight">
                {title}
              </h3>
              <p className="font-sans text-[12px] text-ink/55 mt-0.5">Please confirm</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-full bg-black/[0.04] hover:bg-black/[0.08] flex items-center justify-center text-ink/70 hover:text-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="font-sans text-[13px] text-ink/70 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="h-10 px-5 rounded-full border border-primary/25 text-[13px] font-medium text-primary hover:bg-neutral transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="h-10 px-6 rounded-full bg-primary text-white text-[13px] font-medium hover:opacity-90 transition-colors shadow-xs"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
