import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldAlert, AlertTriangle, ArrowRight, Check } from 'lucide-react';

export interface ChangedFieldDiff {
  key: string;
  label: string;
  tab: string;
  before: string;
  after: string;
  isCritical: boolean;
}

interface SaveConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  diffs: ChangedFieldDiff[];
  onConfirm: (reason: string) => void;
  isSaving?: boolean;
}

export const SaveConfirmModal: React.FC<SaveConfirmModalProps> = ({
  isOpen,
  onClose,
  diffs,
  onConfirm,
  isSaving = false,
}) => {
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  const hasCriticalChanges = diffs.some((d) => d.isCritical);

  useEffect(() => {
    if (isOpen) {
      setReason('');
      setReasonError('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSaving) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isSaving]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (hasCriticalChanges && !reason.trim()) {
      setReasonError('A valid audit reason is mandatory for critical security & platform changes.');
      return;
    }
    onConfirm(reason.trim());
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="save-confirm-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/60 backdrop-blur-xs animate-fadeIn"
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-primary/10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-primary/10 flex items-center justify-between bg-neutral/30">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                hasCriticalChanges
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-secondary/15 text-secondary'
              }`}
            >
              {hasCriticalChanges ? (
                <ShieldAlert className="w-4 h-4" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 id="save-confirm-title" className="font-heading text-lg font-normal text-ink">
                Review & Confirm Settings Changes
              </h3>
              <p className="text-[11px] text-primary/60 mt-0.5">
                {diffs.length} parameter{diffs.length !== 1 ? 's' : ''} modified across system configuration
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="w-8 h-8 rounded-full hover:bg-neutral flex items-center justify-center text-primary/60 hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-secondary disabled:opacity-50"
            aria-label="Close confirm modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Critical notice alert */}
          {hasCriticalChanges && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Critical Configuration Change Detected</p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Modifications to maintenance mode, token expiries, log retention, IP allowlist, or
                  dispatch assignment directly alter platform behavior. A mandatory justification
                  will be permanently recorded in the Admin Audit Trail.
                </p>
              </div>
            </div>
          )}

          {/* Diffs Table */}
          <div className="rounded-xl border border-primary/15 overflow-hidden">
            <div className="bg-neutral/60 px-4 py-2 border-b border-primary/10 grid grid-cols-12 text-[11px] font-semibold text-primary/70 uppercase tracking-wider">
              <span className="col-span-5">Setting / Field</span>
              <span className="col-span-3 text-right">Previous Value</span>
              <span className="col-span-1 text-center"></span>
              <span className="col-span-3 text-right">New Value</span>
            </div>
            <div className="divide-y divide-primary/10 max-h-56 overflow-y-auto bg-white">
              {diffs.map((diff) => (
                <div
                  key={diff.key}
                  className="px-4 py-2.5 grid grid-cols-12 items-center text-xs hover:bg-neutral/30 transition-colors"
                >
                  <div className="col-span-5 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-ink">{diff.label}</span>
                      {diff.isCritical && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                          CRITICAL
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-primary/50 block capitalize">
                      {diff.tab}
                    </span>
                  </div>

                  <div className="col-span-3 text-right">
                    <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 font-mono text-[11px] border border-red-200">
                      {diff.before}
                    </span>
                  </div>

                  <div className="col-span-1 flex justify-center text-primary/40">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>

                  <div className="col-span-3 text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono text-[11px] font-medium border border-emerald-200">
                      {diff.after}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reason Textarea */}
          <div>
            <label
              htmlFor="auditReason"
              className="text-xs font-semibold text-ink flex items-center gap-1 mb-1.5"
            >
              <span>Reason for Changes</span>
              {hasCriticalChanges ? (
                <span className="text-red-600 font-bold">* (Mandatory)</span>
              ) : (
                <span className="text-primary/50 font-normal">(Optional)</span>
              )}
            </label>
            <textarea
              id="auditReason"
              rows={2}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (reasonError) setReasonError('');
              }}
              placeholder={
                hasCriticalChanges
                  ? 'E.g., Scheduled infrastructure upgrade per Ticket #INFRA-482...'
                  : 'Brief note for the system audit log...'
              }
              className={`w-full p-2.5 rounded-xl border text-xs text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary ${
                reasonError ? 'border-red-500' : 'border-primary/20'
              }`}
            />
            {reasonError && <p className="text-[10px] text-red-500 mt-1">{reasonError}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-primary/10 flex items-center justify-end gap-2.5 bg-neutral/20">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl text-xs font-medium text-ink hover:bg-neutral transition-colors focus:outline-none focus:ring-2 focus:ring-secondary disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#123747] hover:bg-[#0c242f] text-white flex items-center gap-2 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-secondary disabled:opacity-60"
          >
            {isSaving ? (
              <span className="inline-block animate-spin mr-1">&bull;</span>
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span>{isSaving ? 'Applying Changes...' : 'Confirm & Apply Changes'}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
