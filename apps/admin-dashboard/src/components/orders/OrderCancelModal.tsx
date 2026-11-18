import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { CANCELLATION_REASONS } from '../../data/ordersData';

interface OrderCancelModalProps {
  isOpen: boolean;
  orderNumber: string;
  onClose: () => void;
  onConfirm: (reason: string, remarks: string) => void;
}

export const OrderCancelModal: React.FC<OrderCancelModalProps> = ({
  isOpen,
  orderNumber,
  onClose,
  onConfirm,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>(CANCELLATION_REASONS[0]);
  const [remarks, setRemarks] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) return;
    onConfirm(selectedReason, remarks);
    onClose();
  };

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
          <div className="w-10 h-10 rounded-full bg-neutral flex items-center justify-center text-primary border border-primary/20">
            <AlertTriangle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-normal text-ink">Cancel Order</h3>
            <p className="font-sans text-xs text-ink/60">{orderNumber}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-sans text-xs font-medium text-ink mb-1.5">
              Reason for Cancellation <span className="text-secondary">*</span>
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-primary/20 bg-neutral/30 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            >
              {CANCELLATION_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-sans text-xs font-medium text-ink mb-1.5">
              Internal Remarks (optional)
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Provide context for audit log trail..."
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-primary/20 bg-neutral/30 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-primary/20 text-ink font-sans text-xs font-medium hover:bg-neutral transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-primary text-white font-sans text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              Confirm Cancellation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
