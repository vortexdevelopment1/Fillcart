import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, X } from 'lucide-react';

interface UnsavedPromptModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirmDiscard: () => void;
  targetTabName?: string;
}

export const UnsavedPromptModal: React.FC<UnsavedPromptModalProps> = ({
  isOpen,
  onCancel,
  onConfirmDiscard,
  targetTabName,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="unsaved-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/60 backdrop-blur-xs animate-fadeIn"
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-primary/10 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-primary/10 flex items-center justify-between bg-neutral/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 id="unsaved-modal-title" className="font-heading text-base font-normal text-ink">
                Unsaved Changes
              </h3>
              <p className="text-[11px] text-primary/60">Switching will discard modifications</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="w-8 h-8 rounded-full hover:bg-neutral flex items-center justify-center text-primary/60 hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-secondary"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 text-xs text-ink/80 space-y-2">
          <p>
            You have unsaved changes in your current configuration. If you proceed to{' '}
            <strong>{targetTabName || 'another section'}</strong>, all uncommitted changes will be discarded.
          </p>
          <p className="text-primary/60 text-[11px]">
            To keep your changes, click &quot;Keep Editing&quot; and save via the bottom bar.
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-primary/10 flex items-center justify-end gap-2.5 bg-neutral/20">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral hover:bg-neutral/80 text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            Keep Editing
          </button>
          <button
            type="button"
            onClick={onConfirmDiscard}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Discard &amp; Leave
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
