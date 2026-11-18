import React, { useState } from 'react';
import { X, FileSpreadsheet } from 'lucide-react';

interface GenerateStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (month: string, year: number, partyName?: string) => void;
}

export const GenerateStatementModal: React.FC<GenerateStatementModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
}) => {
  const [month, setMonth] = useState('November');
  const [year, setYear] = useState(2026);
  const [partyType, setPartyType] = useState<'All' | 'Vendor' | 'Rider'>('All');
  const [partyName, setPartyName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(month, year, partyName || undefined);
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
            <FileSpreadsheet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-normal text-ink">Generate Statement</h3>
            <p className="font-sans text-xs text-ink/60">Automated payout reconciliation statement</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-sans text-xs font-medium text-ink mb-1.5">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-primary/20 bg-neutral/30 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(
                  (m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="block font-sans text-xs font-medium text-ink mb-1.5">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-primary/20 bg-neutral/30 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-sans text-xs font-medium text-ink mb-1.5">Entity Scope</label>
            <div className="flex items-center gap-2">
              {(['All', 'Vendor', 'Rider'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPartyType(type)}
                  className={`flex-1 py-1.5 rounded-lg font-sans text-xs font-medium transition-colors ${
                    partyType === type
                      ? 'bg-primary text-white'
                      : 'bg-neutral text-ink/75 hover:bg-neutral/80'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {partyType !== 'All' && (
            <div>
              <label className="block font-sans text-xs font-medium text-ink mb-1.5">
                Specific {partyType} Name (Optional)
              </label>
              <input
                type="text"
                placeholder={partyType === 'Vendor' ? 'e.g. Fresh Mart Hub' : 'e.g. Vikram Singh'}
                value={partyName}
                onChange={(e) => setPartyName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-primary/20 bg-neutral/30 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-primary/20 text-ink font-sans text-xs font-medium hover:bg-neutral transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-primary text-white font-sans text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              Generate Statement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
