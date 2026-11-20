import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import { CustomSelect } from '../components/common/CustomSelect';
import {
  Percent,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  Calendar,
  Building2,
  Layers,
  History,
  Plus,
  X,
  ShieldCheck,
  Edit2,
} from 'lucide-react';

interface CategoryRate {
  id: string;
  category: string;
  currentRate: number;
  newRate: number;
  effectiveFrom: string;
}

interface VendorOverride {
  id: string;
  vendorName: string;
  customRate: number;
  category: string;
  reason: string;
  effectiveFrom: string;
}

interface RateChangeRecord {
  id: string;
  date: string;
  admin: string;
  target: string;
  oldRate: string;
  newRate: string;
  reason: string;
}

const INITIAL_CATEGORY_RATES: CategoryRate[] = [
  { id: 'cat-01', category: 'Groceries & Staples', currentRate: 8, newRate: 8, effectiveFrom: '2026-11-01' },
  { id: 'cat-02', category: 'Fresh Fruits & Vegetables', currentRate: 5, newRate: 5, effectiveFrom: '2026-11-01' },
  { id: 'cat-03', category: 'Dairy, Bread & Eggs', currentRate: 10, newRate: 10, effectiveFrom: '2026-11-01' },
  { id: 'cat-04', category: 'Snacks & Munchies', currentRate: 15, newRate: 15, effectiveFrom: '2026-11-01' },
  { id: 'cat-05', category: 'Beverages & Juices', currentRate: 14, newRate: 14, effectiveFrom: '2026-11-01' },
  { id: 'cat-06', category: 'Personal Care & Hygiene', currentRate: 18, newRate: 18, effectiveFrom: '2026-11-01' },
  { id: 'cat-07', category: 'Household Essentials', currentRate: 12, newRate: 12, effectiveFrom: '2026-11-01' },
];

const INITIAL_OVERRIDES: VendorOverride[] = [
  { id: 'ov-01', vendorName: 'Fresh Mart Hub', customRate: 10, category: 'All Categories', reason: 'High-volume tier 1 anchor partner', effectiveFrom: '2026-10-01' },
  { id: 'ov-02', vendorName: 'Green Valley Organics', customRate: 8, category: 'Fresh Produce', reason: 'Strategic organic farm exclusive', effectiveFrom: '2026-10-15' },
];

const INITIAL_HISTORY: RateChangeRecord[] = [
  { id: 'hist-01', date: '01 Nov 2026', admin: 'Alok Nambiar', target: 'Personal Care & Hygiene', oldRate: '15%', newRate: '18%', reason: 'Market FMCG take-rate revision' },
  { id: 'hist-02', date: '15 Oct 2026', admin: 'Alok Nambiar', target: 'Fresh Mart Hub Override', oldRate: '12%', newRate: '10%', reason: 'Annual GMV milestone volume incentive' },
  { id: 'hist-03', date: '01 Oct 2026', admin: 'Sarah Mitchell', target: 'Default Platform Commission', oldRate: '10%', newRate: '12%', reason: 'Nodal escrow cost adjustment' },
];

export const CommissionPage: React.FC = () => {
  const { logAudit } = useApp();

  const [defaultRate, setDefaultRate] = useState<number>(12);
  const [editingDefault, setEditingDefault] = useState<boolean>(false);
  const [tempDefaultRate, setTempDefaultRate] = useState<number>(12);

  const [categoryRates, setCategoryRates] = useState<CategoryRate[]>(INITIAL_CATEGORY_RATES);
  const [vendorOverrides, setVendorOverrides] = useState<VendorOverride[]>(INITIAL_OVERRIDES);
  const [history, setHistory] = useState<RateChangeRecord[]>(INITIAL_HISTORY);

  // Modals & confirmation
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isAddOverrideOpen, setIsAddOverrideOpen] = useState(false);
  const [newOverride, setNewOverride] = useState({ vendorName: '', customRate: 10, category: 'All Categories', reason: '', effectiveFrom: '2026-11-20' });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const hasCategoryChanges = categoryRates.some((c) => c.currentRate !== c.newRate);

  const handleRateChange = (id: string, val: number) => {
    setValidationError(null);
    if (val < 0 || val > 30) {
      setValidationError(`Commission rate must be between 0% and 30%. You entered ${val}%.`);
    }
    setCategoryRates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, newRate: val } : c))
    );
  };

  const handleEffectiveDateChange = (id: string, date: string) => {
    setCategoryRates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, effectiveFrom: date } : c))
    );
  };

  const handleSaveCategories = () => {
    // Validate
    const invalid = categoryRates.some((c) => c.newRate < 0 || c.newRate > 30);
    if (invalid) {
      setValidationError('Cannot save: All category commission rates must strictly be between 0% and 30%.');
      return;
    }

    const changed = categoryRates.filter((c) => c.currentRate !== c.newRate);
    if (changed.length === 0) return;

    // Apply
    setCategoryRates((prev) =>
      prev.map((c) => ({ ...c, currentRate: c.newRate }))
    );

    // Add to history
    const newRecords: RateChangeRecord[] = changed.map((c) => ({
      id: `hist-${Date.now()}-${c.id}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      admin: 'Alok Nambiar',
      target: c.category,
      oldRate: `${c.currentRate}%`,
      newRate: `${c.newRate}%`,
      reason: `Effective from ${c.effectiveFrom}`,
    }));
    setHistory((prev) => [...newRecords, ...prev]);

    setIsConfirmModalOpen(false);

    // Audit log
    const changeSummary = changed.map((c) => `${c.category}: ${c.currentRate}% → ${c.newRate}%`).join('; ');
    logAudit(
      'Update',
      'Payments',
      'Category Commission Rates',
      `Updated commission rates: ${changeSummary}`,
      'Payment',
      changed.map((c) => ({ field: c.category, before: `${c.currentRate}%`, after: `${c.newRate}%` }))
    );

    showToast(`Updated ${changed.length} category commission rates successfully`);
  };

  const handleSaveDefaultRate = () => {
    if (tempDefaultRate < 0 || tempDefaultRate > 30) {
      alert('Default commission rate must be between 0% and 30%.');
      return;
    }
    const old = defaultRate;
    setDefaultRate(tempDefaultRate);
    setEditingDefault(false);

    logAudit(
      'Update',
      'Payments',
      'Default Commission Rate',
      `Changed default platform commission rate from ${old}% to ${tempDefaultRate}%`,
      'Payment',
      [{ field: 'defaultRate', before: `${old}%`, after: `${tempDefaultRate}%` }]
    );

    showToast(`Default platform rate updated to ${tempDefaultRate}%`);
  };

  const handleAddOverride = () => {
    if (!newOverride.vendorName.trim()) {
      alert('Please enter a vendor name');
      return;
    }
    if (newOverride.customRate < 0 || newOverride.customRate > 30) {
      alert('Override rate must be between 0% and 30%');
      return;
    }

    const item: VendorOverride = {
      id: `ov-${Date.now().toString().slice(-4)}`,
      vendorName: newOverride.vendorName,
      customRate: newOverride.customRate,
      category: newOverride.category,
      reason: newOverride.reason || 'Contractual override agreement',
      effectiveFrom: newOverride.effectiveFrom,
    };

    setVendorOverrides((prev) => [item, ...prev]);
    setIsAddOverrideOpen(false);
    setNewOverride({ vendorName: '', customRate: 10, category: 'All Categories', reason: '', effectiveFrom: '2026-11-20' });

    logAudit(
      'Create',
      'Payments',
      `Vendor Override: ${item.vendorName}`,
      `Created custom rate override ${item.customRate}% for ${item.vendorName} (${item.reason})`,
      'Payment'
    );

    showToast(`Added custom commission override for ${item.vendorName}`);
  };

  return (
    <div className="space-y-6 pb-12 relative">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-primary text-white shadow-xl flex items-center gap-2 font-sans text-xs animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 0. Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-normal text-ink">Commission Management</h1>
          <p className="font-sans text-xs text-ink/60 mt-0.5">
            Default take-rates, per-category fee structures (0-30%) and contractual merchant overrides
          </p>
        </div>

        {hasCategoryChanges && (
          <button
            onClick={() => setIsConfirmModalOpen(true)}
            className="px-4 py-2 rounded-full bg-primary text-white font-sans text-xs font-medium hover:bg-primary/90 transition-all shadow-sm flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-secondary animate-in fade-in"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Category Rates</span>
          </button>
        )}
      </div>

      {validationError && (
        <div className="p-3.5 rounded-2xl bg-white border border-primary/40 flex items-center gap-2.5 text-xs font-sans text-primary shadow-xs">
          <AlertCircle className="w-4 h-4 text-primary flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* 1. Default Platform Rate Card */}
      <div className="p-5 rounded-[24px] bg-primary text-white shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-secondary" />
            <span className="font-sans text-xs uppercase tracking-wider text-white/70">Platform Baseline Take Rate</span>
          </div>
          <h2 className="font-heading text-3xl font-normal text-white">
            {defaultRate}% <span className="text-sm font-sans font-normal text-white/70">Default Commission</span>
          </h2>
          <p className="font-sans text-xs text-white/70">
            Applied automatically across standard catalog items unless a specific category or vendor override exists.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {editingDefault ? (
            <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-full border border-white/20">
              <input
                type="number"
                min="0"
                max="30"
                value={tempDefaultRate}
                onChange={(e) => setTempDefaultRate(Number(e.target.value))}
                className="w-16 px-2 py-1 rounded-full bg-white text-primary text-center font-bold text-xs focus:outline-none"
              />
              <span className="text-xs text-white font-medium pr-1">%</span>
              <button
                onClick={handleSaveDefaultRate}
                className="px-3 py-1 rounded-full bg-secondary text-white text-xs font-medium hover:opacity-90"
              >
                Apply
              </button>
              <button
                onClick={() => setEditingDefault(false)}
                className="px-2 py-1 text-xs text-white/70 hover:text-white"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setTempDefaultRate(defaultRate);
                setEditingDefault(true);
              }}
              className="px-4 py-2 rounded-full bg-white text-primary font-sans text-xs font-medium hover:bg-neutral transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5 text-primary" />
              <span>Modify Baseline</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Middle Grid: Category Rates (Editable Table) & Change History Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1.2fr)] gap-5">
        {/* 2A: Category Rates Table */}
        <div className="p-5 rounded-[24px] bg-white border border-primary/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-base font-normal text-ink">Per-Category Commission Rates</h2>
              <p className="font-sans text-xs text-ink/60">
                Configured take rates by catalog vertical (editable, range 0% - 30%)
              </p>
            </div>
            {hasCategoryChanges && (
              <button
                onClick={() => setCategoryRates(INITIAL_CATEGORY_RATES)}
                className="text-xs text-ink/60 hover:text-ink flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-primary/10 text-ink/60 text-[11px]">
                  <th className="py-2.5 px-3 font-medium">Category Vertical</th>
                  <th className="py-2.5 px-3 font-medium">Current</th>
                  <th className="py-2.5 px-3 font-medium">New Rate (%)</th>
                  <th className="py-2.5 px-3 font-medium">Effective From</th>
                </tr>
              </thead>
              <tbody>
                {categoryRates.map((cat) => {
                  const isModified = cat.currentRate !== cat.newRate;

                  return (
                    <tr key={cat.id} className="border-b border-primary/5 hover:bg-neutral/40 transition-colors">
                      <td className="py-3 px-3 font-medium text-primary">
                        <div className="flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                          <span>{cat.category}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-ink/70 font-mono">
                        {cat.currentRate}%
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            max="30"
                            value={cat.newRate}
                            onChange={(e) => handleRateChange(cat.id, Number(e.target.value))}
                            className={`w-16 px-2.5 py-1 rounded-lg border font-mono text-xs font-bold transition-all ${
                              isModified
                                ? 'border-primary bg-secondary/10 text-primary'
                                : 'border-primary/15 bg-neutral/30 text-ink focus:bg-white focus:border-secondary'
                            }`}
                          />
                          <span className="text-ink/60 font-medium">%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="date"
                          value={cat.effectiveFrom}
                          onChange={(e) => handleEffectiveDateChange(cat.id, e.target.value)}
                          className="px-2 py-1 rounded-lg border border-primary/15 bg-neutral/20 text-ink font-sans text-[11px] focus:outline-none focus:border-secondary"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2B: Change History Timeline */}
        <div className="p-5 rounded-[24px] bg-white border border-primary/10 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1 border-b border-primary/10">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-primary" />
              <h2 className="font-heading text-base font-normal text-ink">Rate Change Timeline</h2>
            </div>
            <span className="font-sans text-[11px] text-ink/50">Audit tracked</span>
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[360px] pr-1">
            {history.map((h, i) => (
              <div key={h.id} className="relative pl-5 pb-3 border-l-2 border-primary/20 last:border-l-transparent">
                <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-secondary border-2 border-white" />
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs text-primary">{h.target}</span>
                    <span className="text-[10px] text-ink/50">{h.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs text-ink/80">
                    <span className="line-through text-ink/50">{h.oldRate}</span>
                    <span className="text-primary font-bold">→ {h.newRate}</span>
                  </div>
                  <p className="font-sans text-[11px] text-ink/60">{h.reason} • by {h.admin}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-xl bg-neutral/50 border border-primary/10 text-[11px] font-sans text-ink/60 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
            <span>Every adjustment requires verification and writes immutable audit entry.</span>
          </div>
        </div>
      </div>

      {/* 3. Per-Vendor Overrides */}
      <div className="p-5 rounded-[24px] bg-white border border-primary/10 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-base font-normal text-ink">Contractual Merchant Overrides</h2>
            <p className="font-sans text-xs text-ink/60">
              Custom negotiated take rates overriding default and category rules for high-volume partners
            </p>
          </div>

          <button
            onClick={() => setIsAddOverrideOpen(true)}
            className="px-4 py-2 rounded-full bg-primary text-white font-sans text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Vendor Override</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-primary/10 text-ink/60 text-[11px]">
                <th className="py-2.5 px-3 font-medium">Vendor Partner</th>
                <th className="py-2.5 px-3 font-medium">Scope / Category</th>
                <th className="py-2.5 px-3 font-medium">Custom Rate</th>
                <th className="py-2.5 px-3 font-medium">Effective Since</th>
                <th className="py-2.5 px-3 font-medium">Contractual Justification</th>
              </tr>
            </thead>
            <tbody>
              {vendorOverrides.map((ov) => (
                <tr key={ov.id} className="border-b border-primary/5 hover:bg-neutral/40 transition-colors">
                  <td className="py-3 px-3 font-medium text-primary">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                      <span>{ov.vendorName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-ink/70">{ov.category}</td>
                  <td className="py-3 px-3 font-mono font-bold text-primary">{ov.customRate}%</td>
                  <td className="py-3 px-3 text-ink/60">{ov.effectiveFrom}</td>
                  <td className="py-3 px-3 text-ink/80">{ov.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Confirmation Modal (Portaled to body) */}
      {isConfirmModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] bg-primary/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-[24px] bg-white border border-primary/15 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-primary/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary/15 flex items-center justify-center text-primary">
                    <Percent className="w-4 h-4" />
                  </div>
                  <h3 className="font-heading text-lg font-normal text-ink">Confirm Rate Updates</h3>
                </div>
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="w-7 h-7 rounded-full hover:bg-neutral flex items-center justify-center text-ink/50 hover:text-ink"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="font-sans text-xs text-ink/70">
                You are modifying commission take rates for the following categories:
              </p>

              <div className="p-3.5 rounded-2xl bg-neutral/60 border border-primary/10 space-y-2 text-xs font-sans">
                {categoryRates
                  .filter((c) => c.currentRate !== c.newRate)
                  .map((c) => (
                    <div key={c.id} className="flex justify-between items-center text-ink">
                      <span className="font-medium">{c.category}:</span>
                      <span className="font-mono">
                        <span className="line-through text-ink/50 mr-1.5">{c.currentRate}%</span>
                        <strong className="text-primary font-bold">{c.newRate}%</strong>
                      </span>
                    </div>
                  ))}
              </div>

              <p className="font-sans text-[11px] text-ink/60">
                Changes will take effect immediately for upcoming order settlement cycles.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-primary/20 text-ink/70 font-sans text-xs font-medium hover:bg-neutral"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCategories}
                  className="px-4 py-2 rounded-full bg-primary text-white font-sans text-xs font-medium hover:bg-primary/90 shadow-sm"
                >
                  Confirm & Apply Rates
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* 5. Add Override Modal (Portaled to body) */}
      {isAddOverrideOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] bg-primary/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-[24px] bg-white border border-primary/15 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-primary/10">
                <h3 className="font-heading text-lg font-normal text-ink">Add Vendor Commission Override</h3>
                <button
                  onClick={() => setIsAddOverrideOpen(false)}
                  className="w-7 h-7 rounded-full hover:bg-neutral flex items-center justify-center text-ink/50 hover:text-ink"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 font-sans text-xs">
                <div>
                  <label className="block text-ink/75 font-medium mb-1">Vendor Merchant Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Fresh Mart"
                    value={newOverride.vendorName}
                    onChange={(e) => setNewOverride({ ...newOverride, vendorName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border border-primary/20 text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>

                <div>
                  <label className="block text-ink/75 font-medium mb-1">Custom Rate (0 - 30%) *</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={newOverride.customRate}
                      onChange={(e) => setNewOverride({ ...newOverride, customRate: Number(e.target.value) })}
                      className="w-24 px-3 py-1.5 rounded-xl border border-primary/20 text-ink font-mono font-bold focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                    <span className="text-ink/60 font-medium">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-ink/75 font-medium mb-1">Scope</label>
                  <CustomSelect
                    value={newOverride.category}
                    onChange={(e) => setNewOverride({ ...newOverride, category: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border border-primary/20 text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    <option value="All Categories">All Categories</option>
                    {categoryRates.map((c) => (
                      <option key={c.id} value={c.category}>
                        {c.category}
                      </option>
                    ))}
                  </CustomSelect>
                </div>

                <div>
                  <label className="block text-ink/75 font-medium mb-1">Justification / Agreement Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Volume Tier 1 Master Agreement"
                    value={newOverride.reason}
                    onChange={(e) => setNewOverride({ ...newOverride, reason: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border border-primary/20 text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>

                <div>
                  <label className="block text-ink/75 font-medium mb-1">Effective Date</label>
                  <input
                    type="date"
                    value={newOverride.effectiveFrom}
                    onChange={(e) => setNewOverride({ ...newOverride, effectiveFrom: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border border-primary/20 text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsAddOverrideOpen(false)}
                  className="px-4 py-2 rounded-full border border-primary/20 text-ink/70 font-sans text-xs font-medium hover:bg-neutral"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddOverride}
                  className="px-4 py-2 rounded-full bg-primary text-white font-sans text-xs font-medium hover:bg-primary/90 shadow-sm"
                >
                  Save Override
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
