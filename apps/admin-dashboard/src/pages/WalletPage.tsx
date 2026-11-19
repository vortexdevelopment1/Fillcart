import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import { HatchBar } from '../components/common/HatchBar';
import {
  Wallet,
  PlusCircle,
  MinusCircle,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  History,
  ShieldCheck,
  User,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';

interface CustomerWallet {
  id: string;
  name: string;
  phone: string;
  email: string;
  balance: number;
  totalSpent: number;
  lastTransactionDate: string;
  status: 'Active' | 'Frozen';
}

interface WalletTxRecord {
  id: string;
  customerName: string;
  type: 'Credit' | 'Debit' | 'Refund';
  amount: number;
  reason: string;
  timestamp: string;
  admin: string;
}

const INITIAL_WALLETS: CustomerWallet[] = [
  { id: 'wal-01', name: 'Ananya Sharma', phone: '+91 98765 43210', email: 'ananya.s@gmail.com', balance: 1450, totalSpent: 18400, lastTransactionDate: '18 Nov 2026, 10:24 AM', status: 'Active' },
  { id: 'wal-02', name: 'Rajesh Gupta', phone: '+91 98112 34567', email: 'rajesh.g@yahoo.com', balance: 820, totalSpent: 12200, lastTransactionDate: '17 Nov 2026, 04:15 PM', status: 'Active' },
  { id: 'wal-03', name: 'Pooja Iyer', phone: '+91 97234 56789', email: 'pooja.iyer@outlook.com', balance: 2600, totalSpent: 34100, lastTransactionDate: '16 Nov 2026, 01:40 PM', status: 'Active' },
  { id: 'wal-04', name: 'Sunil Mehta', phone: '+91 99887 65432', email: 'sunil.mehta@gmail.com', balance: 0, totalSpent: 6400, lastTransactionDate: '15 Nov 2026, 09:20 AM', status: 'Active' },
  { id: 'wal-05', name: 'Meera Nambiar', phone: '+91 98334 11223', email: 'meera.n@gmail.com', balance: 540, totalSpent: 8900, lastTransactionDate: '14 Nov 2026, 06:10 PM', status: 'Active' },
  { id: 'wal-06', name: 'Vikram Malhotra', phone: '+91 98450 99881', email: 'vikram.m@corp.in', balance: 3100, totalSpent: 42000, lastTransactionDate: '13 Nov 2026, 11:30 AM', status: 'Frozen' },
  { id: 'wal-07', name: 'Kavita Chawla', phone: '+91 97110 55443', email: 'kavita.c@gmail.com', balance: 750, totalSpent: 15300, lastTransactionDate: '12 Nov 2026, 02:45 PM', status: 'Active' },
];

const INITIAL_TX_HISTORY: WalletTxRecord[] = [
  { id: 'wtx-01', customerName: 'Ananya Sharma', type: 'Refund', amount: 628, reason: 'Cancellation refund for order #FK-8917', timestamp: '18 Nov 2026, 11:42 AM', admin: 'Alok Nambiar' },
  { id: 'wtx-02', customerName: 'Pooja Iyer', type: 'Credit', amount: 500, reason: 'App outage service SLA goodwill compensation credit', timestamp: '17 Nov 2026, 03:10 PM', admin: 'Alok Nambiar' },
  { id: 'wtx-03', customerName: 'Rajesh Gupta', type: 'Debit', amount: 200, reason: 'Chargeback reversal per bank dispute resolution', timestamp: '16 Nov 2026, 05:30 PM', admin: 'Alok Nambiar' },
];

export const WalletPage: React.FC = () => {
  const { logAudit } = useApp();

  const [wallets, setWallets] = useState<CustomerWallet[]>(INITIAL_WALLETS);
  const [txHistory, setTxHistory] = useState<WalletTxRecord[]>(INITIAL_TX_HISTORY);
  const [search, setSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [selectedWallet, setSelectedWallet] = useState<CustomerWallet | null>(null);
  const [modalMode, setModalMode] = useState<'Add' | 'Deduct'>('Add');
  const [amount, setAmount] = useState<number | ''>('');
  const [reason, setReason] = useState<string>('');
  const [reasonError, setReasonError] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredWallets = useMemo(() => {
    if (!search.trim()) return wallets;
    const q = search.toLowerCase().trim();
    return wallets.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.phone.includes(q) ||
        w.email.toLowerCase().includes(q)
    );
  }, [wallets, search]);

  const totalBalanceHeld = wallets.reduce((sum, w) => sum + w.balance, 0);

  const handleOpenModal = (wallet: CustomerWallet, mode: 'Add' | 'Deduct') => {
    setSelectedWallet(wallet);
    setModalMode(mode);
    setAmount('');
    setReason('');
    setReasonError(null);
  };

  const handleCloseModal = () => {
    setSelectedWallet(null);
    setAmount('');
    setReason('');
    setReasonError(null);
  };

  const handleWalletMutation = () => {
    if (!selectedWallet) return;
    const amtNum = Number(amount);
    if (!amtNum || amtNum <= 0) {
      setReasonError('Please specify a positive amount.');
      return;
    }
    if (!reason.trim()) {
      setReasonError('A valid operational justification reason is strictly required.');
      return;
    }

    if (modalMode === 'Deduct' && amtNum > selectedWallet.balance) {
      setReasonError(`Cannot deduct ₹${amtNum}. Customer wallet only has ₹${selectedWallet.balance}.`);
      return;
    }

    const newBalance =
      modalMode === 'Add'
        ? selectedWallet.balance + amtNum
        : selectedWallet.balance - amtNum;

    // Mutate wallet
    setWallets((prev) =>
      prev.map((w) =>
        w.id === selectedWallet.id
          ? {
              ...w,
              balance: newBalance,
              lastTransactionDate: new Date().toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }),
            }
          : w
      )
    );

    // Record ledger history
    const record: WalletTxRecord = {
      id: `wtx-${Date.now().toString().slice(-4)}`,
      customerName: selectedWallet.name,
      type: modalMode === 'Add' ? 'Credit' : 'Debit',
      amount: amtNum,
      reason: reason.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      admin: 'Alok Nambiar',
    };
    setTxHistory((prev) => [record, ...prev]);

    // Audit log to Payment tab
    logAudit(
      'Update',
      'Payments',
      `Wallet: ${selectedWallet.name}`,
      `${modalMode === 'Add' ? 'Manual Credit' : 'Manual Deduction'} of ₹${amtNum} to wallet. Reason: "${reason.trim()}"`,
      'Payment',
      [
        {
          field: 'walletBalance',
          before: `₹${selectedWallet.balance}`,
          after: `₹${newBalance}`,
        },
      ]
    );

    showToast(`${modalMode === 'Add' ? 'Credited' : 'Deducted'} ₹${amtNum} for ${selectedWallet.name}`);
    handleCloseModal();
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
          <h1 className="font-heading text-2xl font-normal text-ink">Customer Wallet Ledger</h1>
          <p className="font-sans text-xs text-ink/60 mt-0.5">
            Store credits, instant refund balances, escrow deposits and administrative manual adjustments
          </p>
        </div>
      </div>

      {/* 1. 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 min-[1280px]:grid-cols-4 gap-3">
        {/* Card 1: Total Escrow (Primary Dark) */}
        <div className="p-4 rounded-[22px] bg-primary text-white flex flex-col justify-between h-[124px] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-medium text-white/80">Wallet Escrow Float</span>
            <Wallet className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <span className="font-heading text-2xl font-normal text-white leading-none block">
              ₹{totalBalanceHeld.toLocaleString()}
            </span>
            <span className="font-sans text-[11px] text-white/60 mt-0.5 block">
              Held in ICICI consumer nodal float
            </span>
          </div>
          <HatchBar progress={72} colorScheme="secondary" height={8} />
        </div>

        {/* Card 2: Active Wallets (Secondary) */}
        <div className="p-4 rounded-[22px] bg-secondary text-white flex flex-col justify-between h-[124px] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-medium text-white/80">Active Wallets</span>
            <User className="w-4 h-4 text-white/80" />
          </div>
          <div>
            <span className="font-heading text-2xl font-normal text-white leading-none block">
              3,420
            </span>
            <span className="font-sans text-[11px] text-white/70 mt-0.5 block">
              Registered customers with balance &gt; ₹0
            </span>
          </div>
          <HatchBar progress={84} colorScheme="white" height={8} />
        </div>

        {/* Card 3: Credits Issued (Neutral) */}
        <div className="p-4 rounded-[22px] bg-neutral border border-primary/10 flex flex-col justify-between h-[124px]">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-medium text-ink/75">Credits Issued MTD</span>
            <ArrowDownLeft className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="font-heading text-2xl font-normal text-primary leading-none block">
              ₹84,500
            </span>
            <span className="font-sans text-[11px] text-ink/60 mt-0.5 block">
              Promotional and goodwill credits
            </span>
          </div>
          <HatchBar progress={46} colorScheme="primary" height={8} />
        </div>

        {/* Card 4: Refunds Processed (White) */}
        <div className="p-4 rounded-[22px] bg-white border border-primary/15 shadow-sm flex flex-col justify-between h-[124px]">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-medium text-ink/75">Wallet Refunds</span>
            <ArrowUpRight className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="font-heading text-2xl font-normal text-primary leading-none block">
              ₹32,100
            </span>
            <span className="font-sans text-[11px] text-ink/60 mt-0.5 block">
              Instant refund settlements
            </span>
          </div>
          <HatchBar progress={24} colorScheme="neutral" height={8} />
        </div>
      </div>

      {/* 2. Main Content Grid: Wallets Table + Recent Ledger Adjustments */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1.15fr)] gap-5">
        {/* 2A: Customer Wallets Table */}
        <div className="p-5 rounded-[24px] bg-white border border-primary/10 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-base font-normal text-ink">Customer Wallet Accounts</h2>
              <p className="font-sans text-xs text-ink/60">
                View balances, lifetime spends and execute verified debit or credit adjustments
              </p>
            </div>

            {/* Search */}
            <div className="relative w-48 sm:w-56">
              <Search className="w-3.5 h-3.5 text-ink/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-full border border-primary/15 bg-neutral/30 text-ink font-sans text-xs focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-primary/10 text-ink/60 text-[11px]">
                  <th className="py-2.5 px-3 font-medium">Customer Identity</th>
                  <th className="py-2.5 px-3 font-medium">Wallet Balance</th>
                  <th className="py-2.5 px-3 font-medium">Total Spend</th>
                  <th className="py-2.5 px-3 font-medium">Last Activity</th>
                  <th className="py-2.5 px-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWallets.map((w) => (
                  <tr key={w.id} className="border-b border-primary/5 hover:bg-neutral/40 transition-colors">
                    <td className="py-3 px-3">
                      <div>
                        <span className="font-medium text-primary block leading-tight">{w.name}</span>
                        <span className="text-[11px] text-ink/60 block mt-0.5">{w.phone} • {w.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-xs font-bold text-primary">₹{w.balance.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-3 text-ink/70">₹{w.totalSpent.toLocaleString()}</td>
                    <td className="py-3 px-3 text-ink/60 text-[11px]">{w.lastTransactionDate}</td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenModal(w, 'Add')}
                          className="px-2.5 py-1 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors text-[11px] font-medium flex items-center gap-1"
                        >
                          <PlusCircle className="w-3 h-3" />
                          <span>Credit</span>
                        </button>
                        <button
                          onClick={() => handleOpenModal(w, 'Deduct')}
                          className="px-2.5 py-1 rounded-full bg-neutral text-primary border border-primary/20 hover:bg-white transition-colors text-[11px] font-medium flex items-center gap-1"
                        >
                          <MinusCircle className="w-3 h-3 text-primary" />
                          <span>Deduct</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2B: Recent Wallet Transactions Ledger */}
        <div className="p-5 rounded-[24px] bg-white border border-primary/10 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1 border-b border-primary/10">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-primary" />
              <h2 className="font-heading text-base font-normal text-ink">Recent Wallet Adjustments</h2>
            </div>
            <span className="font-sans text-[11px] text-ink/50">Append-only</span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[360px] pr-1">
            {txHistory.map((tx) => (
              <div key={tx.id} className="p-3 rounded-xl border border-primary/10 bg-neutral/30 space-y-1 font-sans text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-primary text-xs">{tx.customerName}</span>
                  <span className={`font-mono font-bold text-xs ${tx.type === 'Debit' ? 'text-ink/80' : 'text-primary'}`}>
                    {tx.type === 'Debit' ? '-' : '+'}₹{tx.amount.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-ink/75 leading-tight">{tx.reason}</p>
                <div className="flex items-center justify-between text-[10px] text-ink/50 pt-1">
                  <span>Authorized by {tx.admin}</span>
                  <span>{tx.timestamp}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-xl bg-neutral/50 border border-primary/10 text-[11px] font-sans text-ink/60 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
            <span>All wallet adjustments require reason validation and are audited.</span>
          </div>
        </div>
      </div>

      {/* 3. Add Credit / Deduct Modal (Portaled to body to cover full screen) */}
      {selectedWallet &&
        createPortal(
          <div className="fixed inset-0 z-[100] bg-primary/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-[24px] bg-white border border-primary/15 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-primary/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary/15 flex items-center justify-center text-primary">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <h3 className="font-heading text-lg font-normal text-ink">
                    {modalMode === 'Add' ? 'Add Wallet Credit' : 'Deduct Wallet Balance'}
                  </h3>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="w-7 h-7 rounded-full hover:bg-neutral flex items-center justify-center text-ink/50 hover:text-ink"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-neutral/60 border border-primary/10 font-sans text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-ink/60">Customer:</span>
                  <span className="font-medium text-ink">{selectedWallet.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/60">Current Wallet Balance:</span>
                  <span className="font-mono font-bold text-primary">₹{selectedWallet.balance.toLocaleString()}</span>
                </div>
              </div>

              {reasonError && (
                <div className="p-2.5 rounded-xl bg-white border border-primary/40 text-primary text-xs font-sans flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{reasonError}</span>
                </div>
              )}

              <div className="space-y-3 font-sans text-xs">
                <div>
                  <label className="block text-ink/75 font-medium mb-1">Amount to {modalMode} (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-primary/20 text-ink font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>

                <div>
                  <label className="block text-ink/75 font-medium mb-1">
                    Reason for Adjustment * <span className="text-primary font-normal">(Mandatory for audit ledger)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Compensation for delayed order #FK-8921 or customer refund reconciliation..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-primary/20 text-ink font-sans text-xs focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-full border border-primary/20 text-ink/70 font-sans text-xs font-medium hover:bg-neutral"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWalletMutation}
                  className="px-4 py-2 rounded-full bg-primary text-white font-sans text-xs font-medium hover:bg-primary/90 shadow-sm"
                >
                  Confirm {modalMode === 'Add' ? 'Credit' : 'Deduction'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
