import React from 'react';
import { PaymentTransaction } from '../../data/paymentsData';
import { X, Download, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ReceiptModalProps {
  transaction: PaymentTransaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ transaction, isOpen, onClose }) => {
  if (!isOpen || !transaction) return null;

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] max-w-lg w-full p-6 shadow-2xl border border-primary/10 relative print:p-0 print:border-none print:shadow-none">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral hover:bg-neutral/80 flex items-center justify-center text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-secondary print:hidden"
          aria-label="Close receipt"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Printable Receipt Card */}
        <div className="p-2 space-y-4">
          {/* Header */}
          <div className="text-center pb-4 border-b border-primary/10">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto mb-2 font-heading text-lg font-bold">
              FK
            </div>
            <h3 className="font-heading text-xl font-normal text-ink">Fillkart Settlement Receipt</h3>
            <p className="font-sans text-xs text-ink/50 mt-0.5">
              Ref: {transaction.reference} · {transaction.date}
            </p>
          </div>

          {/* Amount Callout */}
          <div className="p-4 rounded-2xl bg-neutral/60 border border-primary/10 text-center">
            <span className="font-sans text-xs text-ink/60 block">Transaction Amount</span>
            <span className="font-heading text-3xl font-normal text-primary block mt-1">
              ₹{transaction.amount.toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-xs font-sans font-medium bg-primary text-white">
              <CheckCircle2 className="w-3 h-3" />
              {transaction.status}
            </span>
          </div>

          {/* Details Table */}
          <div className="space-y-2 text-xs font-sans">
            <div className="flex justify-between py-1.5 border-b border-primary/5">
              <span className="text-ink/60">Transaction ID:</span>
              <span className="font-medium text-ink">{transaction.txNumber}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-primary/5">
              <span className="text-ink/60">Party Name:</span>
              <span className="font-medium text-ink">
                {transaction.party} ({transaction.partyType})
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-primary/5">
              <span className="text-ink/60">Payment Type:</span>
              <span className="font-medium text-ink">{transaction.type}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-primary/5">
              <span className="text-ink/60">Payment Method:</span>
              <span className="font-medium text-ink">{transaction.method}</span>
            </div>
            {transaction.orderId && (
              <div className="flex justify-between py-1.5 border-b border-primary/5">
                <span className="text-ink/60">Associated Order:</span>
                <span className="font-medium text-primary">{transaction.orderId}</span>
              </div>
            )}
            {transaction.bankDetails && (
              <div className="flex justify-between py-1.5 border-b border-primary/5">
                <span className="text-ink/60">Bank Account:</span>
                <span className="font-medium text-ink">
                  {transaction.bankDetails.bankName} ({transaction.bankDetails.accountMasked})
                </span>
              </div>
            )}
          </div>

          {/* Footer & Actions */}
          <div className="pt-4 border-t border-primary/10 flex items-center justify-between print:hidden">
            <div className="flex items-center gap-1.5 text-ink/50 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              <span>Verified Audit Trail</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 rounded-full bg-primary text-white font-sans text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
