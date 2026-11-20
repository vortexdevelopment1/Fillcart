import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import { CustomSelect } from '../components/common/CustomSelect';
import { SearchInput } from '../components/common/SearchInput';
import {
  HandCoins,
  CheckCircle2,
  Clock,
  RotateCcw,
  Search,
  Filter,
  Download,
  Building2,
  Bike,
  AlertCircle,
  X,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

export interface SettlementRow {
  id: string;
  type: 'Vendor' | 'Rider';
  party: string;
  period: string;
  grossAmount: number;
  commissionPercent: number;
  commission: number;
  gst: number; // 18% GST on commission
  netPayout: number;
  status: 'Pending' | 'Processed' | 'Failed';
  utr?: string;
}

const INITIAL_SETTLEMENTS: SettlementRow[] = [
  // Vendors (Pending)
  {
    id: 'set-v01',
    type: 'Vendor',
    party: 'Fresh Mart Hub',
    period: '10 Nov - 16 Nov 2026',
    grossAmount: 54200,
    commissionPercent: 15,
    commission: 8130,
    gst: 1463,
    netPayout: 44607,
    status: 'Pending',
  },
  {
    id: 'set-v02',
    type: 'Vendor',
    party: 'Royal Kirana Stores',
    period: '10 Nov - 16 Nov 2026',
    grossAmount: 38400,
    commissionPercent: 15,
    commission: 5760,
    gst: 1037,
    netPayout: 31603,
    status: 'Pending',
  },
  {
    id: 'set-v03',
    type: 'Vendor',
    party: 'Green Valley Organics',
    period: '10 Nov - 16 Nov 2026',
    grossAmount: 32300,
    commissionPercent: 12,
    commission: 3876,
    gst: 698,
    netPayout: 27726,
    status: 'Pending',
  },
  {
    id: 'set-v04',
    type: 'Vendor',
    party: "Baker's Delight",
    period: '10 Nov - 16 Nov 2026',
    grossAmount: 23200,
    commissionPercent: 15,
    commission: 3480,
    gst: 626,
    netPayout: 19094,
    status: 'Pending',
  },
  {
    id: 'set-v05',
    type: 'Vendor',
    party: 'Spice Route Kitchen',
    period: '10 Nov - 16 Nov 2026',
    grossAmount: 19300,
    commissionPercent: 18,
    commission: 3474,
    gst: 625,
    netPayout: 15201,
    status: 'Pending',
  },
  // Vendors (Past Processed)
  {
    id: 'set-v06',
    type: 'Vendor',
    party: 'Fresh Mart Hub',
    period: '03 Nov - 09 Nov 2026',
    grossAmount: 48200,
    commissionPercent: 15,
    commission: 7230,
    gst: 1301,
    netPayout: 39669,
    status: 'Processed',
    utr: 'HDFCN2632298104',
  },
  {
    id: 'set-v07',
    type: 'Vendor',
    party: 'Sharma Dairy & Provisions',
    period: '03 Nov - 09 Nov 2026',
    grossAmount: 26800,
    commissionPercent: 10,
    commission: 2680,
    gst: 482,
    netPayout: 23638,
    status: 'Processed',
    utr: 'ICICR2632219082',
  },
  {
    id: 'set-v08',
    type: 'Vendor',
    party: 'Organic Roots Farm',
    period: '03 Nov - 09 Nov 2026',
    grossAmount: 14500,
    commissionPercent: 12,
    commission: 1740,
    gst: 313,
    netPayout: 12447,
    status: 'Failed',
  },

  // Riders (Pending)
  {
    id: 'set-r01',
    type: 'Rider',
    party: 'Vikram Singh (r-001)',
    period: '11 Nov - 17 Nov 2026',
    grossAmount: 8900,
    commissionPercent: 0,
    commission: 0,
    gst: 0,
    netPayout: 8900,
    status: 'Pending',
  },
  {
    id: 'set-r02',
    type: 'Rider',
    party: 'Amit Sharma (r-002)',
    period: '11 Nov - 17 Nov 2026',
    grossAmount: 7650,
    commissionPercent: 0,
    commission: 0,
    gst: 0,
    netPayout: 7650,
    status: 'Pending',
  },
  {
    id: 'set-r03',
    type: 'Rider',
    party: 'Rahul Verma (r-003)',
    period: '11 Nov - 17 Nov 2026',
    grossAmount: 6800,
    commissionPercent: 0,
    commission: 0,
    gst: 0,
    netPayout: 6800,
    status: 'Pending',
  },
  {
    id: 'set-r04',
    type: 'Rider',
    party: 'Ravi Kumar (r-004)',
    period: '11 Nov - 17 Nov 2026',
    grossAmount: 5900,
    commissionPercent: 0,
    commission: 0,
    gst: 0,
    netPayout: 5900,
    status: 'Pending',
  },
  // Riders (Processed)
  {
    id: 'set-r05',
    type: 'Rider',
    party: 'Vikram Singh (r-001)',
    period: '04 Nov - 10 Nov 2026',
    grossAmount: 8450,
    commissionPercent: 0,
    commission: 0,
    gst: 0,
    netPayout: 8450,
    status: 'Processed',
    utr: 'IMPS2632298711',
  },
];

export const SettlementsPage: React.FC = () => {
  const { logAudit } = useApp();

  const [activeTab, setActiveTab] = useState<'Vendors' | 'Riders'>('Vendors');
  const [settlements, setSettlements] = useState<SettlementRow[]>(INITIAL_SETTLEMENTS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Processed' | 'Failed'>('All');
  const [search, setSearch] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered rows
  const filteredRows = useMemo(() => {
    return settlements.filter((row) => {
      if (row.type !== (activeTab === 'Vendors' ? 'Vendor' : 'Rider')) return false;
      if (statusFilter !== 'All' && row.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesParty = row.party.toLowerCase().includes(q);
        const matchesPeriod = row.period.toLowerCase().includes(q);
        const matchesUtr = (row.utr || '').toLowerCase().includes(q);
        if (!matchesParty && !matchesPeriod && !matchesUtr) return false;
      }
      return true;
    });
  }, [settlements, activeTab, statusFilter, search]);

  // Selected pending rows
  const selectedRows = useMemo(() => {
    return settlements.filter((r) => selectedIds.includes(r.id));
  }, [settlements, selectedIds]);

  const selectedPendingRows = useMemo(() => {
    return selectedRows.filter((r) => r.status === 'Pending');
  }, [selectedRows]);

  const totalSelectedNet = selectedPendingRows.reduce((sum, r) => sum + r.netPayout, 0);
  const totalSelectedGross = selectedPendingRows.reduce((sum, r) => sum + r.grossAmount, 0);
  const totalSelectedCommission = selectedPendingRows.reduce((sum, r) => sum + r.commission, 0);
  const totalSelectedGst = selectedPendingRows.reduce((sum, r) => sum + r.gst, 0);

  const toggleSelectAll = () => {
    const pendingInView = filteredRows.filter((r) => r.status === 'Pending').map((r) => r.id);
    const allSelected = pendingInView.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pendingInView.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pendingInView])));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleProcessSettlements = () => {
    if (selectedPendingRows.length === 0) return;

    const count = selectedPendingRows.length;
    const parties = selectedPendingRows.map((r) => r.party).join(', ');
    const totalAmount = totalSelectedNet;

    // Mutate status to Processed
    setSettlements((prev) =>
      prev.map((r) =>
        selectedIds.includes(r.id) && r.status === 'Pending'
          ? {
              ...r,
              status: 'Processed',
              utr: `HDFCN${Date.now().toString().slice(-10)}`,
            }
          : r
      )
    );

    setSelectedIds([]);
    setIsConfirmModalOpen(false);

    // Audit Log to Payment tab
    logAudit(
      'Approve',
      'Settlements',
      `BATCH-SETL-${Date.now().toString().slice(-4)}`,
      `Processed ${count} payout settlements totaling ₹${totalAmount.toLocaleString()} to ${parties}`,
      'Payment',
      [
        {
          field: 'settlementStatus',
          before: 'Pending Batch Release',
          after: 'Disbursed & Settled',
        },
      ]
    );

    showToast(`Successfully processed settlements for ${count} ${activeTab.toLowerCase()} (₹${totalAmount.toLocaleString()})`);
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
          <h1 className="font-heading text-2xl font-normal text-ink">Settlements & Payouts</h1>
          <p className="font-sans text-xs text-ink/60 mt-0.5">
            Bi-weekly vendor commission reconciliations and daily rider earnings disbursements
          </p>
        </div>

        {selectedPendingRows.length > 0 && (
          <button
            onClick={() => setIsConfirmModalOpen(true)}
            className="px-4 py-2 rounded-full bg-secondary text-white font-sans text-xs font-medium hover:opacity-95 transition-all shadow-sm flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-primary animate-in fade-in"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Process {selectedPendingRows.length} settlements (₹{totalSelectedNet.toLocaleString()})</span>
          </button>
        )}
      </div>

      {/* 1. Tabs & Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Tabs: Vendors | Riders */}
        <div className="p-1 rounded-full bg-neutral border border-primary/10 flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full min-w-0">
          {(['Vendors', 'Riders'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedIds([]);
              }}
              className={`px-[clamp(10px,2.5vw,16px)] py-[clamp(5px,1.5vw,6px)] rounded-full font-sans text-[clamp(11px,2.8vw,12px)] sm:text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 ${
                activeTab === tab
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-ink/70 hover:text-ink hover:bg-white/60'
              }`}
            >
              {tab === 'Vendors' ? <Building2 className="w-3.5 h-3.5" /> : <Bike className="w-3.5 h-3.5" />}
              <span>{tab} Settlements</span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Search */}
          <SearchInput
            placeholder={`Search ${activeTab.toLowerCase()}...`}
            value={search}
            onChange={setSearch}
            containerClassName="w-48 sm:w-60"
            className="py-1.5 rounded-full border border-primary/15 bg-white focus:ring-2 focus:ring-secondary"
          />

          {/* Status Filter */}
          <CustomSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-full border border-primary/15 bg-white font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processed">Processed</option>
            <option value="Failed">Failed</option>
          </CustomSelect>
        </div>
      </div>

      {/* 2. Settlements Table */}
      <div className="rounded-[24px] bg-white border border-primary/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-primary/10 bg-neutral/40 text-ink/70 text-[11px]">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredRows.filter((r) => r.status === 'Pending').length > 0 &&
                      filteredRows
                        .filter((r) => r.status === 'Pending')
                        .every((r) => selectedIds.includes(r.id))
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-primary/30 text-primary focus:ring-secondary cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3 font-medium">{activeTab === 'Vendors' ? 'Vendor Party' : 'Rider Partner'}</th>
                <th className="py-3 px-3 font-medium">Cycle Period</th>
                <th className="py-3 px-3 font-medium">Gross GMV</th>
                {activeTab === 'Vendors' && (
                  <>
                    <th className="py-3 px-3 font-medium">Comm %</th>
                    <th className="py-3 px-3 font-medium">Commission</th>
                    <th className="py-3 px-3 font-medium">GST (18%)</th>
                  </>
                )}
                <th className="py-3 px-3 font-medium">Net Payout</th>
                <th className="py-3 px-3 font-medium">Status</th>
                <th className="py-3 px-4 font-medium text-right">Reference / Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-ink/50">
                    No settlement records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => {
                  const isSelected = selectedIds.includes(row.id);

                  return (
                    <tr
                      key={row.id}
                      className={`border-b border-primary/5 transition-colors ${
                        isSelected ? 'bg-secondary/8' : 'hover:bg-neutral/30'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          disabled={row.status !== 'Pending'}
                          checked={isSelected}
                          onChange={() => toggleSelectOne(row.id)}
                          className="rounded border-primary/30 text-primary focus:ring-secondary cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        />
                      </td>
                      <td className="py-3 px-3 font-medium text-primary">
                        <div className="flex items-center gap-2">
                          {row.type === 'Vendor' ? (
                            <Building2 className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                          ) : (
                            <Bike className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                          )}
                          <span>{row.party}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-ink/70">{row.period}</td>
                      <td className="py-3 px-3 text-ink font-medium">₹{row.grossAmount.toLocaleString()}</td>
                      {activeTab === 'Vendors' && (
                        <>
                          <td className="py-3 px-3 text-ink/70">{row.commissionPercent}%</td>
                          <td className="py-3 px-3 text-secondary font-medium">-₹{row.commission.toLocaleString()}</td>
                          <td className="py-3 px-3 text-ink/60">-₹{row.gst.toLocaleString()}</td>
                        </>
                      )}
                      <td className="py-3 px-3 font-bold text-primary">₹{row.netPayout.toLocaleString()}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium leading-none ${
                            row.status === 'Processed'
                              ? 'bg-primary text-white'
                              : row.status === 'Pending'
                              ? 'bg-secondary/20 text-primary border border-secondary/30'
                              : 'bg-white text-primary border border-primary'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {row.status === 'Processed' ? (
                          <span className="font-mono text-[10px] text-ink/60">
                            {row.utr || 'HDFC-NEFT'}
                          </span>
                        ) : row.status === 'Pending' ? (
                          <button
                            onClick={() => {
                              setSelectedIds([row.id]);
                              setIsConfirmModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-full bg-neutral text-primary border border-primary/20 hover:bg-primary hover:text-white transition-colors text-[11px] font-medium"
                          >
                            Process
                          </button>
                        ) : (
                          <span className="text-[11px] text-primary font-medium">Bank Reject</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Confirm Settlement Modal (Portaled to body) */}
      {isConfirmModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] bg-primary/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-[24px] bg-white border border-primary/15 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-primary/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary/15 flex items-center justify-center text-primary">
                    <HandCoins className="w-4 h-4" />
                  </div>
                  <h3 className="font-heading text-lg font-normal text-ink">Confirm Settlement Release</h3>
                </div>
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="w-7 h-7 rounded-full hover:bg-neutral flex items-center justify-center text-ink/50 hover:text-ink"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="font-sans text-xs text-ink/70">
                You are authorizing batch bank transfer via nodal escrow account for the selected {selectedPendingRows.length} {activeTab.toLowerCase()}:
              </p>

              {/* Breakdown Card */}
              <div className="p-3.5 rounded-2xl bg-neutral/60 border border-primary/10 space-y-2 text-xs font-sans">
                <div className="flex justify-between text-ink/75">
                  <span>Selected Parties:</span>
                  <span className="font-medium text-ink">{selectedPendingRows.length} accounts</span>
                </div>
                <div className="flex justify-between text-ink/75">
                  <span>Total Gross Merchandise Value:</span>
                  <span className="font-medium text-ink">₹{totalSelectedGross.toLocaleString()}</span>
                </div>
                {activeTab === 'Vendors' && (
                  <>
                    <div className="flex justify-between text-secondary">
                      <span>Platform Commission Retained:</span>
                      <span className="font-medium">-₹{totalSelectedCommission.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-ink/60">
                      <span>GST (18% on commission):</span>
                      <span className="font-medium">-₹{totalSelectedGst.toLocaleString()}</span>
                    </div>
                  </>
                )}
                <div className="pt-2 border-t border-primary/15 flex justify-between text-primary font-bold text-sm">
                  <span>Net Disbursement Payout:</span>
                  <span className="text-primary">₹{totalSelectedNet.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-sans text-ink/60">
                <ShieldCheck className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                <span>Action will generate bank UTR references and record immutable Payment audit trail.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-primary/20 text-ink/70 font-sans text-xs font-medium hover:bg-neutral"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProcessSettlements}
                  className="px-4 py-2 rounded-full bg-primary text-white font-sans text-xs font-medium hover:bg-primary/90 shadow-sm"
                >
                  Confirm & Disburse ₹{totalSelectedNet.toLocaleString()}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
