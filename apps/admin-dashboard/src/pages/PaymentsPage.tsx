import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentTransaction, MonthlyStatement, PaymentMethod, PaymentStatus } from '../data/paymentsData';
import { ReceiptModal } from '../components/payments/ReceiptModal';
import { GenerateStatementModal } from '../components/payments/GenerateStatementModal';
import { ConfirmPayoutModal } from '../components/payments/ConfirmPayoutModal';
import { HatchBar } from '../components/common/HatchBar';
import {
  DollarSign,
  Clock,
  TrendingUp,
  RotateCcw,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  AlertCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
} from 'lucide-react';

type PaymentTab = 'Collections' | 'Refunds' | 'Statements';

export const PaymentsPage: React.FC = () => {
  const { transactions, statements, releasePayout, processSettlement, generateStatement, logAudit } = useApp();

  const [activeTab, setActiveTab] = useState<PaymentTab>('Collections');
  const [search, setSearch] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Modals state
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<PaymentTransaction | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [payoutConfirmTx, setPayoutConfirmTx] = useState<PaymentTransaction | null>(null);
  const [isPayoutConfirmOpen, setIsPayoutConfirmOpen] = useState(false);
  const [isGenerateStatementOpen, setIsGenerateStatementOpen] = useState(false);
  const [isProcessSettlementOpen, setIsProcessSettlementOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Summary Metrics calculations
  const totalCollected = transactions
    .filter((t) => t.type === 'Collection' && t.status === 'Paid')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingPayouts = transactions
    .filter((t) => (t.type === 'Vendor Payout' || t.type === 'Rider Payout') && t.status === 'Pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const commissionEarned = Math.round(totalCollected * 0.12); // ~12% take rate

  const totalRefunds = transactions
    .filter((t) => t.type === 'Refund' && t.status === 'Paid')
    .reduce((sum, t) => sum + t.amount, 0);

  // Pending settlements for vendors
  const pendingSettlementTxs = useMemo(
    () => transactions.filter((t) => t.type === 'Vendor Payout' && t.status === 'Pending'),
    [transactions]
  );
  const totalPendingSettlements = pendingSettlementTxs.reduce((sum, t) => sum + t.amount, 0);
  const uniqueVendorsCount = new Set(pendingSettlementTxs.map((t) => t.party)).size;

  // Filtered transactions for active tab
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Tab filter
      if (activeTab === 'Collections' && tx.type !== 'Collection') return false;
      if (activeTab === 'Refunds' && tx.type !== 'Refund') return false;

      // Method filter
      if (selectedMethod !== 'All' && tx.method !== selectedMethod) return false;

      // Status filter
      if (selectedStatus !== 'All' && tx.status !== selectedStatus) return false;

      // Search
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesTx = tx.txNumber.toLowerCase().includes(q);
        const matchesParty = tx.party.toLowerCase().includes(q);
        const matchesRef = tx.reference.toLowerCase().includes(q);
        const matchesOrder = tx.orderId?.toLowerCase().includes(q);
        if (!matchesTx && !matchesParty && !matchesRef && !matchesOrder) return false;
      }

      return true;
    });
  }, [transactions, activeTab, selectedMethod, selectedStatus, search]);

  // Pagination for transactions
  const totalFiltered = filteredTransactions.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  // Status Badge Class
  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'Paid':
        return 'bg-primary text-white border-transparent';
      case 'Pending':
        return 'bg-secondary/18 text-primary border border-secondary/35';
      case 'Failed':
        return 'bg-white text-primary border border-primary';
      case 'Refunded':
        return 'bg-secondary text-white border-transparent';
      default:
        return 'bg-neutral text-primary';
    }
  };

  // CSV Exporter for Transactions
  const exportTransactionsCSV = () => {
    const headers = ['Tx Number', 'Date', 'Time', 'Party', 'Type', 'Method', 'Amount', 'Status', 'Reference'];
    const rows = filteredTransactions.map((t) => [
      t.txNumber,
      t.date,
      t.time,
      `"${t.party}"`,
      t.type,
      t.method,
      t.amount,
      t.status,
      t.reference,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fillkart_${activeTab.toLowerCase().replace(' ', '_')}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Exporter for Statements
  const exportStatementsCSV = () => {
    const headers = ['Month', 'Year', 'Total Orders', 'Total Sales', 'Commission', 'Vendor Payouts', 'Rider Payouts', 'Refunds', 'Net Revenue', 'Status'];
    const rows = statements.map((s) => [
      s.month,
      s.year,
      s.totalOrders,
      s.totalSales,
      s.commission,
      s.vendorPayouts,
      s.riderPayouts,
      s.refunds,
      s.netRevenue,
      s.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fillkart_monthly_statements_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* 1. Four Horizontal Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 min-[1280px]:grid-cols-4 gap-3.5">
        {/* Card 1: Total Collected (PRIMARY) */}
        <div className="p-4 rounded-[22px] bg-primary text-white shadow-sm flex flex-col justify-between h-[124px]">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-medium text-white/80">Total Collected</span>
            <DollarSign className="w-4 h-4 text-white/70" />
          </div>
          <div>
            <span className="font-heading text-2xl font-normal text-white leading-none block">
              ₹{totalCollected.toLocaleString()}
            </span>
            <span className="font-sans text-[11px] text-white/75 mt-0.5 block">
              Gross gross customer inflow
            </span>
          </div>
          <HatchBar progress={100} colorScheme="primary" height={8} />
        </div>

        {/* Card 2: Pending Payouts (SECONDARY) */}
        <div className="p-4 rounded-[22px] bg-secondary text-white shadow-sm flex flex-col justify-between h-[124px]">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-medium text-white/80">Pending Payouts</span>
            <Clock className="w-4 h-4 text-white/70" />
          </div>
          <div>
            <span className="font-heading text-2xl font-normal text-white leading-none block">
              ₹{pendingPayouts.toLocaleString()}
            </span>
            <span className="font-sans text-[11px] text-white/75 mt-0.5 block">
              Due to vendors & riders
            </span>
          </div>
          <HatchBar progress={65} colorScheme="secondary" height={8} />
        </div>

        {/* Card 3: Commission Earned (NEUTRAL) */}
        <div className="p-4 rounded-[22px] bg-neutral border border-primary/10 shadow-sm flex flex-col justify-between h-[124px]">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-medium text-ink/75">Commission Earned</span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="font-heading text-2xl font-normal text-primary leading-none block">
              ₹{commissionEarned.toLocaleString()}
            </span>
            <span className="font-sans text-[11px] text-ink/60 mt-0.5 block">
              Net platform margin ~12%
            </span>
          </div>
          <HatchBar progress={82} colorScheme="neutral" height={8} />
        </div>

        {/* Card 4: Refunds (White) */}
        <div className="p-4 rounded-[22px] bg-white border border-primary/15 shadow-sm flex flex-col justify-between h-[124px]">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-medium text-ink/75">Refunds Issued</span>
            <RotateCcw className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="font-heading text-2xl font-normal text-primary leading-none block">
              ₹{totalRefunds.toLocaleString()}
            </span>
            <span className="font-sans text-[11px] text-ink/60 mt-0.5 block">
              Reconciled customer returns
            </span>
          </div>
          <HatchBar progress={18} colorScheme="white" height={8} />
        </div>
      </div>

      {/* 2. Top Bar: Pill Tabs + Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Pill Tabs */}
        <div className="p-1 rounded-full bg-neutral border border-primary/10 flex items-center gap-1 overflow-x-auto max-w-full">
          {(['Collections', 'Refunds', 'Statements'] as PaymentTab[]).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 rounded-full font-sans text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-ink/70 hover:text-ink hover:bg-white/60'
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          {activeTab === 'Statements' ? (
            <>
              <button
                onClick={() => setIsGenerateStatementOpen(true)}
                className="px-4 py-2 rounded-full bg-primary text-white font-sans text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Generate Statement</span>
              </button>
              <button
                onClick={exportStatementsCSV}
                className="px-3.5 py-2 rounded-full border border-primary/20 bg-white text-ink hover:bg-neutral font-sans text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-primary" />
                <span>Export CSV</span>
              </button>
            </>
          ) : (
            <button
              onClick={exportTransactionsCSV}
              className="px-4 py-2 rounded-full bg-primary text-white font-sans text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export {activeTab} (CSV)</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Main Content: Statements vs Transactions */}
      {activeTab === 'Statements' ? (
        /* Statements Table View */
        <div className="space-y-4">
          <div className="border border-primary/10 rounded-[22px] bg-white shadow-[0_2px_8px_rgba(18,55,71,0.02)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral/60 border-b border-primary/10 font-sans text-[11px] font-medium text-ink/75">
                    <th className="py-3 px-4">Billing Period</th>
                    <th className="py-3 px-4 text-center">Orders</th>
                    <th className="py-3 px-4 text-right">Gross Sales</th>
                    <th className="py-3 px-4 text-right">Commission (12%)</th>
                    <th className="py-3 px-4 text-right">Vendor Disbursements</th>
                    <th className="py-3 px-4 text-right">Rider Fees</th>
                    <th className="py-3 px-4 text-right">Net Platform Margin</th>
                    <th className="py-3 px-4 text-center">Audit Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5 font-sans text-xs text-ink">
                  {statements.map((stmt) => (
                    <tr key={stmt.id} className="hover:bg-neutral/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-primary">
                        {stmt.month} {stmt.year}
                      </td>
                      <td className="py-3 px-4 text-center">{stmt.totalOrders.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-medium">₹{stmt.totalSales.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-secondary font-medium">
                        ₹{stmt.commission.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">₹{stmt.vendorPayouts.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">₹{stmt.riderPayouts.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-medium text-primary">
                        ₹{stmt.netRevenue.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-secondary/18 text-primary border border-secondary/35">
                          {stmt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              window.print();
                            }}
                            className="p-1.5 rounded-lg border border-primary/15 hover:bg-neutral text-ink"
                            title="Download PDF statement"
                            aria-label="Download PDF statement"
                          >
                            <FileText className="w-3.5 h-3.5 text-primary" />
                          </button>
                          <button
                            onClick={exportStatementsCSV}
                            className="p-1.5 rounded-lg border border-primary/15 hover:bg-neutral text-ink"
                            title="Download CSV statement"
                            aria-label="Download CSV statement"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5 text-secondary" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Transactions View with Toolbar and Rows */
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="p-3.5 rounded-[22px] bg-white border border-primary/10 shadow-[0_2px_8px_rgba(18,55,71,0.02)] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-1 min-w-[240px]">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-ink/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by transaction #, party name, or ref..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-1.5 rounded-full border border-primary/15 bg-neutral/40 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white transition-all"
                />
              </div>

              {/* Method Filter */}
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-ink/50" />
                <select
                  value={selectedMethod}
                  onChange={(e) => {
                    setSelectedMethod(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 rounded-full border border-primary/15 bg-neutral/40 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="All">All Methods</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Bank">Bank Transfer</option>
                  <option value="COD">Cash on Delivery</option>
                </select>
              </div>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 rounded-full border border-primary/15 bg-neutral/40 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="All">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
          </div>

          {/* Transaction Card Rows */}
          <div className="space-y-2.5">
            {paginatedTransactions.length === 0 ? (
              <div className="p-12 text-center rounded-[20px] bg-white border border-primary/10">
                <DollarSign className="w-10 h-10 text-primary/30 mx-auto mb-2" />
                <h4 className="font-heading text-base font-normal text-ink">No transactions found</h4>
                <p className="font-sans text-xs text-ink/50 mt-1">Try modifying your filter selections</p>
              </div>
            ) : (
              paginatedTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="w-full rounded-[20px] bg-white border border-primary/10 shadow-[0_2px_8px_rgba(18,55,71,0.03)] hover:border-secondary hover:bg-neutral/20 transition-all p-[12px_18px] select-none"
                >
                  <div className="grid grid-cols-[1fr_auto] min-[1280px]:grid-cols-[180px_minmax(180px,1.5fr)_130px_110px_130px_160px] gap-3 items-center">
                    {/* Col 1: Transaction ID + Date */}
                    <div>
                      <span className="font-sans font-medium text-[13px] text-primary block leading-tight">
                        {tx.txNumber}
                      </span>
                      <span className="font-sans text-[11px] text-ink/55 block mt-0.5">
                        {tx.date} · {tx.time}
                      </span>
                    </div>

                    {/* Col 2: Party + Type */}
                    <div className="hidden min-[1280px]:block min-w-0">
                      <h4 className="font-sans text-[13px] font-medium text-ink truncate leading-tight">
                        {tx.party}
                      </h4>
                      <span className="font-sans text-[11px] text-ink/60 truncate block mt-0.5">
                        {tx.type} · <strong className="text-primary font-normal">{tx.partyType}</strong>
                      </span>
                    </div>

                    {/* Col 3: Method */}
                    <div className="hidden min-[1280px]:block">
                      <span className="px-2.5 py-0.5 rounded-[6px] bg-neutral text-ink font-sans text-xs font-medium border border-primary/10">
                        {tx.method}
                      </span>
                    </div>

                    {/* Col 4: Amount & Commission % */}
                    <div className="hidden min-[1280px]:block">
                      <span className="font-heading text-[15px] font-normal text-ink block leading-tight">
                        ₹{tx.amount.toLocaleString()}
                      </span>
                      {tx.orderId ? (
                        <span className="font-sans text-[10px] text-primary/70 block mt-0.5">
                          {tx.orderId}
                        </span>
                      ) : null}
                    </div>

                    {/* Col 5: Status Badge */}
                    <div className="flex items-center justify-start">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full font-sans text-[11px] font-medium whitespace-nowrap leading-none ${getStatusBadge(
                          tx.status
                        )}`}
                      >
                        {tx.status}
                      </span>
                    </div>

                    {/* Col 6: Action Buttons */}
                    <div className="flex items-center justify-end gap-2">
                      {/* Release payout button for pending vendor/rider payouts */}
                      {tx.status === 'Pending' &&
                        (tx.type === 'Vendor Payout' || tx.type === 'Rider Payout') && (
                          <button
                            onClick={() => {
                              setPayoutConfirmTx(tx);
                              setIsPayoutConfirmOpen(true);
                            }}
                            className="h-[30px] px-3 rounded-full bg-primary text-white font-sans text-[11px] font-medium hover:bg-primary/90 transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-secondary whitespace-nowrap"
                          >
                            Release Payout
                          </button>
                        )}

                      {/* Receipt button */}
                      <button
                        onClick={() => {
                          setSelectedReceiptTx(tx);
                          setIsReceiptOpen(true);
                        }}
                        className="h-[30px] px-3 rounded-full bg-white border border-primary/20 text-primary hover:bg-neutral font-sans text-[11px] font-medium transition-all shadow-2xs flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-secondary whitespace-nowrap"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Receipt</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalFiltered > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 px-1">
              <span className="font-sans text-xs text-ink/60">
                Showing{' '}
                <strong className="text-ink">
                  {(currentPage - 1) * pageSize + 1} -{' '}
                  {Math.min(currentPage * pageSize, totalFiltered)}
                </strong>{' '}
                of <strong className="text-ink">{totalFiltered}</strong> transactions
              </span>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded-lg bg-white border border-primary/15 disabled:opacity-30 flex items-center justify-center text-ink hover:bg-neutral transition-colors"
                  >
                    <ChevronsLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded-lg bg-white border border-primary/15 disabled:opacity-30 flex items-center justify-center text-ink hover:bg-neutral transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  <span className="px-3 py-1 font-sans text-xs font-medium text-ink">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 rounded-lg bg-white border border-primary/15 disabled:opacity-30 flex items-center justify-center text-ink hover:bg-neutral transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 rounded-lg bg-white border border-primary/15 disabled:opacity-30 flex items-center justify-center text-ink hover:bg-neutral transition-colors"
                  >
                    <ChevronsRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-primary/15 bg-white font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value={8}>8 / page</option>
                  <option value={16}>16 / page</option>
                  <option value={24}>24 / page</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Receipt Modal */}
      <ReceiptModal
        transaction={selectedReceiptTx}
        isOpen={isReceiptOpen}
        onClose={() => {
          setIsReceiptOpen(false);
          setSelectedReceiptTx(null);
        }}
      />

      {/* Confirm Payout Modal */}
      <ConfirmPayoutModal
        transaction={payoutConfirmTx}
        isOpen={isPayoutConfirmOpen}
        onClose={() => {
          setIsPayoutConfirmOpen(false);
          setPayoutConfirmTx(null);
        }}
        onConfirm={() => {
          if (payoutConfirmTx) {
            releasePayout(payoutConfirmTx.id);
            showToast(`Released payout of ₹${payoutConfirmTx.amount.toLocaleString()} to ${payoutConfirmTx.party}`);
          }
        }}
      />

      {/* Generate Statement Modal */}
      <GenerateStatementModal
        isOpen={isGenerateStatementOpen}
        onClose={() => setIsGenerateStatementOpen(false)}
        onGenerate={(month, year, partyName) => {
          generateStatement(month, year, partyName);
          showToast(`Generated monthly statement for ${month} ${year}`);
        }}
      />

      {/* Process Bulk Settlement Modal */}
      {isProcessSettlementOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-xs select-none"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-white rounded-[24px] p-6 shadow-2xl border border-primary/10">
            <h3 className="font-heading text-lg font-normal text-ink mb-2">
              Process Bulk Settlement
            </h3>
            <p className="font-sans text-xs text-ink/70 mb-4">
              Process payout settlement of{' '}
              <strong className="text-primary font-semibold">
                ₹{totalPendingSettlements.toLocaleString()}
              </strong>{' '}
              for <strong className="text-ink font-semibold">{uniqueVendorsCount} vendors</strong> ({pendingSettlementTxs.length} pending batches)?
            </p>
            <div className="p-3 rounded-[14px] bg-neutral border border-primary/10 text-xs font-sans text-ink/75 mb-5 space-y-1">
              <div className="flex justify-between">
                <span>Total Gross Amount:</span>
                <span className="font-medium text-ink">₹{totalPendingSettlements.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Direct Bank Transfer:</span>
                <span className="font-medium text-ink">NEFT / IMPS</span>
              </div>
              <div className="flex justify-between">
                <span>Audit Log:</span>
                <span className="text-secondary font-medium">Auto-recorded</span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsProcessSettlementOpen(false)}
                className="px-4 py-2 rounded-full border border-primary/20 text-xs font-sans text-ink hover:bg-neutral transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const txIds = pendingSettlementTxs.map((t) => t.id);
                  processSettlement(txIds);
                  setIsProcessSettlementOpen(false);
                  showToast(`Successfully processed settlement of ₹${totalPendingSettlements.toLocaleString()}`);
                }}
                className="px-5 py-2 rounded-full bg-secondary text-white text-xs font-sans font-medium hover:opacity-90 transition-colors shadow-xs"
              >
                Confirm Settlement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-primary text-white px-5 py-2.5 rounded-full text-xs font-medium shadow-xl flex items-center gap-2 pointer-events-none animate-fadeIn">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
