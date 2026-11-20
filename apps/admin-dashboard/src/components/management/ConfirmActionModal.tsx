import React, { useState, useEffect } from 'react';
import { CustomSelect } from '../common/CustomSelect';
import { X, AlertTriangle } from 'lucide-react';

export type ActionType = 'suspend' | 'reactivate' | 'set_inactive' | 'set_active';

interface ConfirmActionModalProps {
  isOpen: boolean;
  action: ActionType | null;
  targetName: string;
  isVerified: boolean;
  onClose: () => void;
  onConfirm: (reason?: string, remarks?: string) => void;
  onOpenDocuments?: () => void;
}

const SUSPEND_REASONS = [
  'Customer complaints',
  'Policy violation',
  'Fake or invalid documents',
  'Payment or fraud issue',
  'Other',
];

const INACTIVE_REASONS = [
  'Temporarily closed',
  'Taking a break',
  'Under review',
  'Other',
];

export const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  isOpen,
  action,
  targetName,
  isVerified,
  onClose,
  onConfirm,
  onOpenDocuments,
}) => {
  const [suspendReason, setSuspendReason] = useState(SUSPEND_REASONS[0]);
  const [inactiveReason, setInactiveReason] = useState(INACTIVE_REASONS[0]);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setSuspendReason(SUSPEND_REASONS[0]);
    setInactiveReason(INACTIVE_REASONS[0]);
    setRemarks('');

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !action) return null;

  // Validation for Suspend
  const isSuspendValid =
    action !== 'suspend' ||
    (suspendReason !== 'Other' || remarks.trim().length > 0);

  const handleAction = () => {
    if (action === 'suspend') {
      if (!isSuspendValid) return;
      onConfirm(suspendReason, remarks.trim() || undefined);
    } else if (action === 'set_inactive') {
      onConfirm(inactiveReason, remarks.trim() || undefined);
    } else if (action === 'reactivate') {
      onConfirm(undefined, remarks.trim() || undefined);
    } else if (action === 'set_active') {
      onConfirm();
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 transition-all duration-200"
      style={{
        backgroundColor: 'rgba(18, 55, 71, 0.35)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
      aria-hidden="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[calc(100vw-24px)] min-[500px]:w-[460px] bg-white rounded-[24px] shadow-[0_24px_60px_rgba(18, 55, 71, 0.25)] p-6 flex flex-col relative select-none"
        role="dialog"
        aria-modal="true"
        aria-label="Action Confirmation"
      >
        {/* Header Icon + Title */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-neutral flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-ink" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-[18px] text-ink font-normal leading-tight">
              {action === 'suspend' && `Suspend (Block) ${targetName}`}
              {action === 'reactivate' && `Unblock (Reactivate) ${targetName}`}
              {action === 'set_inactive' && `Set ${targetName} as Inactive`}
              {action === 'set_active' && `Set ${targetName} as Active`}
            </h3>

            <p className="text-xs font-sans text-ink/60 mt-1 leading-normal">
              {action === 'suspend' &&
                'This disciplinary action blocks the user from logging in, accepting orders, and taking dispatches.'}
              {action === 'reactivate' &&
                'Unblocking will restore account access. If documents are verified, status becomes Active; otherwise Inactive.'}
              {action === 'set_inactive' &&
                'Temporarily pauses customer orders and visibility. Reversible anytime.'}
              {action === 'set_active' &&
                'Activates account so orders can be placed and dispatches assigned.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-neutral flex items-center justify-center text-ink/50 hover:text-ink ml-1 flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-ink" />
          </button>
        </div>

        {/* Content based on Action */}
        <div className="mt-4 space-y-3 text-xs font-sans">
          {action === 'suspend' && (
            <>
              <div>
                <label className="text-ink/80 font-medium block mb-1">
                  Reason for Suspension *
                </label>
                <CustomSelect
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-[10px] border border-primary/15 bg-white text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  {SUSPEND_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </CustomSelect>
              </div>

              <div>
                <label className="text-ink/80 font-medium block mb-1">
                  Remarks {suspendReason === 'Other' ? '*' : '(Optional)'}
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder={
                    suspendReason === 'Other'
                      ? 'Please specify detailed suspension reason...'
                      : 'Additional administrative notes...'
                  }
                  className="w-full px-3 py-2 rounded-[10px] border border-primary/15 bg-white text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div className="p-2.5 rounded-[10px] bg-neutral text-[11px] text-ink/75 flex items-center gap-2">
                <span className="font-medium text-ink">Warning:</span>
                <span>This person will no longer receive orders or dispatch shifts.</span>
              </div>
            </>
          )}

          {action === 'set_inactive' && (
            <>
              <div>
                <label className="text-ink/80 font-medium block mb-1">
                  Reason (Optional)
                </label>
                <CustomSelect
                  value={inactiveReason}
                  onChange={(e) => setInactiveReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-[10px] border border-primary/15 bg-white text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  {INACTIVE_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </CustomSelect>
              </div>
              <div>
                <label className="text-ink/80 font-medium block mb-1">
                  Remarks (Optional)
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Optional internal note..."
                  className="w-full px-3 py-2 rounded-[10px] border border-primary/15 bg-white text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
            </>
          )}

          {action === 'reactivate' && (
            <div>
              <label className="text-ink/80 font-medium block mb-1">
                Reactivation Note (Optional)
              </label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Resolution details or admin note..."
                className="w-full px-3 py-2 rounded-[10px] border border-primary/15 bg-white text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
          )}

          {action === 'set_active' && !isVerified && (
            <div className="p-3 rounded-[12px] bg-neutral border border-primary/10 text-xs text-primary space-y-1.5">
              <span className="font-semibold block">Documents must be verified first!</span>
              <p className="text-ink/70">
                Pending or Rejected people cannot be activated until all required onboarding
                documents are approved.
              </p>
              {onOpenDocuments && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenDocuments();
                  }}
                  className="mt-1 text-[11px] underline font-medium text-ink"
                >
                  Go to Document Verification →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-sans bg-white border border-primary/15 text-ink hover:bg-neutral"
          >
            Cancel
          </button>

          {action === 'suspend' && (
            <button
              type="button"
              disabled={!isSuspendValid}
              onClick={handleAction}
              className="px-5 py-2 rounded-full text-xs font-sans bg-primary text-white hover:opacity-90 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed shadow-xs"
            >
              Suspend (Block)
            </button>
          )}

          {action === 'reactivate' && (
            <button
              type="button"
              onClick={handleAction}
              className="px-5 py-2 rounded-full text-xs font-sans bg-primary text-white font-medium hover:opacity-90 active:scale-95 shadow-xs"
            >
              Unblock (Reactivate)
            </button>
          )}

          {action === 'set_inactive' && (
            <button
              type="button"
              onClick={handleAction}
              className="px-5 py-2 rounded-full text-xs font-sans bg-primary text-white hover:opacity-90 active:scale-95 shadow-xs"
            >
              Set Inactive
            </button>
          )}

          {action === 'set_active' && (
            <button
              type="button"
              disabled={!isVerified}
              onClick={handleAction}
              className="px-5 py-2 rounded-full text-xs font-sans bg-primary text-white font-medium hover:opacity-90 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed shadow-xs"
            >
              Set Active
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
