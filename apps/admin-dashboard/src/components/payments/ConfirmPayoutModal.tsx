import React from 'react';
import { PaymentTransaction } from '../../data/paymentsData';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface ConfirmPayoutModalProps {
  isOpen: boolean;
  transaction: PaymentTransaction | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmPayoutModal: React.FC<ConfirmPayoutModalProps> = ({
  isOpen,
  transaction,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl border border-primary/10 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral hover:bg-neutral/80 flex items-center justify-center text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-secondary"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center text-secondary">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-normal text-ink">Release Payout</h3>
            <p className="font-sans text-xs text-ink/60">{transaction.txNumber}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral/60 border border-primary/10 space-y-2 mb-4 text-xs font-sans">
          <div className="flex justify-between">
            <span className="text-ink/60">Recipient:</span>
            <span className="font-medium text-ink">
              {transaction.party} ({transaction.partyType})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/60">Disbursement Amount:</span>
            <span className="font-heading text-base font-normal text-primary">
              ₹{transaction.amount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/60">Payment Method:</span>
            <span className="font-medium text-ink">{transaction.method}</span>
          </div>
          {transaction.bankDetails && (
            <div className="flex justify-between">
              <span className="text-ink/60">Target Account:</span>
              <span className="font-medium text-ink">
                {transaction.bankDetails.bankName} ({transaction.bankDetails.accountMasked})
              </span>
            </div>
          )}
        </div>

        <p className="font-sans text-xs text-ink/65 mb-4">
          Releasing this payout will mark the status as <strong>Paid</strong>, disburse funds via
          banking gateway, and record an immutable entry in the system audit logs.
        </p>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-primary/20 text-ink font-sans text-xs font-medium hover:bg-neutral transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2 rounded-full bg-primary text-white font-sans text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            Confirm & Release Payout
          </button>
        </div>
      </div>
    </div>
  );
};
