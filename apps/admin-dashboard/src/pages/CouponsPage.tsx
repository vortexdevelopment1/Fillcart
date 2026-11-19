import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import { HatchBar } from '../components/common/HatchBar';
import {
  Ticket,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Power,
  Trash2,
  X,
  Calendar,
  Sparkles,
  ShieldCheck,
  Tag,
} from 'lucide-react';

export interface Coupon {
  id: string;
  code: string;
  type: 'Percentage' | 'Flat';
  value: number; // e.g. 20 for 20% or 100 for ₹100
  minOrder: number;
  maxDiscount?: number; // e.g. up to ₹150 (for Percentage)
  usageCount: number;
  usageLimit: number;
  perUserLimit: number; // e.g. 1 use per customer
  applicableFor: 'All Customers' | 'New Customers Only' | 'VIP Customers';
  validFrom: string;
  validTo: string;
  status: 'Active' | 'Expired' | 'Disabled';
}

const INITIAL_COUPONS: Coupon[] = [
  { id: 'cp-01', code: 'WELCOME50', type: 'Flat', value: 50, minOrder: 199, usageCount: 842, usageLimit: 2000, perUserLimit: 1, applicableFor: 'New Customers Only', validFrom: '01 Nov 2026', validTo: '30 Nov 2026', status: 'Active' },
  { id: 'cp-02', code: 'FRESH20', type: 'Percentage', value: 20, maxDiscount: 150, minOrder: 399, usageCount: 1420, usageLimit: 2500, perUserLimit: 2, applicableFor: 'All Customers', validFrom: '05 Nov 2026', validTo: '25 Nov 2026', status: 'Active' },
  { id: 'cp-03', code: 'DIWALI100', type: 'Flat', value: 100, minOrder: 599, usageCount: 2000, usageLimit: 2000, perUserLimit: 1, applicableFor: 'All Customers', validFrom: '01 Nov 2026', validTo: '15 Nov 2026', status: 'Expired' },
  { id: 'cp-04', code: 'FREEDEL', type: 'Flat', value: 40, minOrder: 249, usageCount: 620, usageLimit: 1500, perUserLimit: 1, applicableFor: 'All Customers', validFrom: '10 Nov 2026', validTo: '30 Nov 2026', status: 'Active' },
  { id: 'cp-05', code: 'ORGANIC15', type: 'Percentage', value: 15, maxDiscount: 100, minOrder: 499, usageCount: 310, usageLimit: 800, perUserLimit: 1, applicableFor: 'All Customers', validFrom: '12 Nov 2026', validTo: '28 Nov 2026', status: 'Active' },
  { id: 'cp-06', code: 'VIPDEAL', type: 'Percentage', value: 25, maxDiscount: 300, minOrder: 999, usageCount: 145, usageLimit: 500, perUserLimit: 1, applicableFor: 'VIP Customers', validFrom: '01 Nov 2026', validTo: '30 Nov 2026', status: 'Disabled' },
];

export const CouponsPage: React.FC = () => {
  const { logAudit } = useApp();

  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Expired' | 'Disabled'>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formCode, setFormCode] = useState('');
  const [formType, setFormType] = useState<'Percentage' | 'Flat'>('Percentage');
  const [formValue, setFormValue] = useState<number | ''>(20);
  const [formMaxDiscount, setFormMaxDiscount] = useState<number | ''>(150);
  const [formMinOrder, setFormMinOrder] = useState<number | ''>(299);
  const [formUsageLimit, setFormUsageLimit] = useState<number | ''>(1000);
  const [formPerUserLimit, setFormPerUserLimit] = useState<number>(1);
  const [formApplicableFor, setFormApplicableFor] = useState<'All Customers' | 'New Customers Only' | 'VIP Customers'>('All Customers');
  const [formValidFrom, setFormValidFrom] = useState('2026-11-18');
  const [formValidTo, setFormValidTo] = useState('2026-12-18');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      if (statusFilter !== 'All' && c.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        if (!c.code.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [coupons, statusFilter, search]);

  const activeCount = coupons.filter((c) => c.status === 'Active').length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + c.usageCount, 0);

  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setFormCode('');
    setFormType('Percentage');
    setFormValue(20);
    setFormMaxDiscount(150);
    setFormMinOrder(299);
    setFormUsageLimit(1000);
    setFormPerUserLimit(1);
    setFormApplicableFor('All Customers');
    setFormValidFrom('2026-11-18');
    setFormValidTo('2026-12-18');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Coupon) => {
    setEditingCoupon(c);
    setFormCode(c.code);
    setFormType(c.type);
    setFormValue(c.value);
    setFormMaxDiscount(c.maxDiscount !== undefined ? c.maxDiscount : '');
    setFormMinOrder(c.minOrder);
    setFormUsageLimit(c.usageLimit);
    setFormPerUserLimit(c.perUserLimit || 1);
    setFormApplicableFor(c.applicableFor || 'All Customers');
    setFormValidFrom('2026-11-01');
    setFormValidTo('2026-11-30');
    setIsModalOpen(true);
  };

  const handleToggleStatus = (id: string) => {
    const coupon = coupons.find((c) => c.id === id);
    if (!coupon) return;
    const nextStatus = coupon.status === 'Active' ? 'Disabled' : 'Active';

    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: nextStatus } : c))
    );

    logAudit(
      'Update',
      'Payments',
      `Coupon: ${coupon.code}`,
      `Changed promotion coupon status to ${nextStatus}`,
      'Payment',
      [{ field: 'status', before: coupon.status, after: nextStatus }]
    );

    showToast(`Coupon ${coupon.code} is now ${nextStatus}`);
  };

  const handleDelete = (id: string) => {
    const coupon = coupons.find((c) => c.id === id);
    if (!coupon) return;
    if (!window.confirm(`Delete coupon code ${coupon.code}?`)) return;

    setCoupons((prev) => prev.filter((c) => c.id !== id));

    logAudit(
      'Delete',
      'Payments',
      `Coupon: ${coupon.code}`,
      `Deleted promotional coupon campaign code ${coupon.code}`,
      'Payment'
    );

    showToast(`Deleted coupon ${coupon.code}`);
  };

  const handleSaveModal = () => {
    if (!formCode.trim()) {
      alert('Please enter a coupon code');
      return;
    }
    const val = Number(formValue);
    if (!val || val <= 0) {
      alert('Please enter a valid discount value');
      return;
    }

    const maxDisc =
      formType === 'Percentage' && formMaxDiscount !== ''
        ? Number(formMaxDiscount)
        : undefined;

    if (editingCoupon) {
      // Edit
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === editingCoupon.id
            ? {
                ...c,
                code: formCode.trim().toUpperCase(),
                type: formType,
                value: val,
                maxDiscount: maxDisc,
                minOrder: Number(formMinOrder) || 0,
                usageLimit: Number(formUsageLimit) || 1000,
                perUserLimit: formPerUserLimit,
                applicableFor: formApplicableFor,
              }
            : c
        )
      );

      logAudit(
        'Update',
        'Payments',
        `Coupon: ${formCode.toUpperCase()}`,
        `Updated promotional parameters (${formType === 'Percentage' ? `${val}%` : `₹${val}`}, audience: ${formApplicableFor}, per user: ${formPerUserLimit}x, min order ₹${formMinOrder})`,
        'Payment'
      );

      showToast(`Updated coupon ${formCode.toUpperCase()}`);
    } else {
      // Create
      const newCoupon: Coupon = {
        id: `cp-${Date.now().toString().slice(-4)}`,
        code: formCode.trim().toUpperCase(),
        type: formType,
        value: val,
        maxDiscount: maxDisc,
        minOrder: Number(formMinOrder) || 0,
        usageCount: 0,
        usageLimit: Number(formUsageLimit) || 1000,
        perUserLimit: formPerUserLimit,
        applicableFor: formApplicableFor,
        validFrom: '18 Nov 2026',
        validTo: '18 Dec 2026',
        status: 'Active',
      };

      setCoupons((prev) => [newCoupon, ...prev]);

      logAudit(
        'Create',
        'Payments',
        `Coupon: ${newCoupon.code}`,
        `Created new promotional coupon campaign ${newCoupon.code} (${newCoupon.type === 'Percentage' ? `${newCoupon.value}%` : `₹${newCoupon.value}`} off, audience: ${formApplicableFor}, per user: ${formPerUserLimit}x, min order ₹${newCoupon.minOrder})`,
        'Payment'
      );

      showToast(`Created new coupon ${newCoupon.code}`);
    }

    setIsModalOpen(false);
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
          <h1 className="font-heading text-2xl font-normal text-ink">Coupons & Promo Codes</h1>
          <p className="font-sans text-xs text-ink/60 mt-0.5">
            Doc 1.8 Marketing promo codes, cart discounts, limits and redemption telemetry
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 rounded-full bg-primary text-white font-sans text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-secondary"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* 1. 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Card 1: Active Coupons (Primary Dark) */}
        <div className="p-4 rounded-[22px] bg-primary text-white flex flex-col justify-between h-[124px] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-medium text-white/80">Active Campaigns</span>
            <Ticket className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <span className="font-heading text-2xl font-normal text-white leading-none block">
              {activeCount} Active
            </span>
            <span className="font-sans text-[11px] text-white/60 mt-0.5 block">
              Live codes currently redeemable in cart
            </span>
          </div>
          <HatchBar progress={75} colorScheme="secondary" height={8} />
        </div>

        {/* Card 2: Redemptions (Secondary) */}
        <div className="p-4 rounded-[22px] bg-secondary text-white flex flex-col justify-between h-[124px] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-medium text-white/80">Total Redemptions</span>
            <Sparkles className="w-4 h-4 text-white/80" />
          </div>
          <div>
            <span className="font-heading text-2xl font-normal text-white leading-none block">
              {totalRedemptions.toLocaleString()}
            </span>
            <span className="font-sans text-[11px] text-white/70 mt-0.5 block">
              Orders placed with active coupon code
            </span>
          </div>
          <HatchBar progress={62} colorScheme="white" height={8} />
        </div>

        {/* Card 3: Discount Subsidized (White) */}
        <div className="p-4 rounded-[22px] bg-white border border-primary/15 shadow-sm flex flex-col justify-between h-[124px]">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-medium text-ink/75">Discount Subsidized</span>
            <Tag className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="font-heading text-2xl font-normal text-primary leading-none block">
              ₹2,45,600
            </span>
            <span className="font-sans text-[11px] text-ink/60 mt-0.5 block">
              Funded via platform growth budget
            </span>
          </div>
          <HatchBar progress={35} colorScheme="neutral" height={8} />
        </div>
      </div>

      {/* 2. Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Status Filters */}
        <div className="p-1 rounded-full bg-neutral border border-primary/10 flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full min-w-0">
          {(['All', 'Active', 'Expired', 'Disabled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-[clamp(10px,2.5vw,14px)] py-[clamp(5px,1.5vw,6px)] rounded-full font-sans text-[clamp(11px,2.8vw,12px)] sm:text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                statusFilter === tab
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-ink/70 hover:text-ink hover:bg-white/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-48 sm:w-60">
          <Search className="w-3.5 h-3.5 text-ink/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search coupon code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-full border border-primary/15 bg-white font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
      </div>

      {/* 3. Coupons Table */}
      <div className="rounded-[24px] bg-white border border-primary/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-primary/10 bg-neutral/40 text-ink/70 text-[11px]">
                <th className="py-3 px-4 font-medium">Coupon Code</th>
                <th className="py-3 px-3 font-medium">Discount Type</th>
                <th className="py-3 px-3 font-medium">Value</th>
                <th className="py-3 px-3 font-medium">Min Order</th>
                <th className="py-3 px-3 font-medium">Usage Progress</th>
                <th className="py-3 px-3 font-medium">Validity Period</th>
                <th className="py-3 px-3 font-medium">Status</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.map((c) => {
                const usagePercent = Math.min(100, Math.round((c.usageCount / c.usageLimit) * 100));

                return (
                  <tr key={c.id} className="border-b border-primary/5 hover:bg-neutral/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-secondary/15 text-primary border border-secondary/30 select-all">
                          {c.code}
                        </span>
                        <span className="text-[10px] font-sans text-ink/50">
                          {c.applicableFor || 'All Customers'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-ink/70">{c.type}</td>
                    <td className="py-3 px-3 font-mono font-bold text-primary">
                      <div>{c.type === 'Percentage' ? `${c.value}%` : `₹${c.value}`}</div>
                      {c.type === 'Percentage' && c.maxDiscount && (
                        <div className="text-[10px] font-sans font-normal text-ink/50">
                          Up to ₹{c.maxDiscount}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-ink/70">₹{c.minOrder}</td>
                    <td className="py-3 px-3 min-w-[140px]">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-ink/60">
                          <span>{c.usageCount} / {c.usageLimit} total</span>
                          <span>{c.perUserLimit || 1}x/user</span>
                        </div>
                        <div className="h-1.5 w-full bg-neutral rounded-full overflow-hidden">
                          <div
                            style={{ width: `${usagePercent}%` }}
                            className="h-full bg-primary rounded-full"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-ink/60 text-[11px]">
                      {c.validFrom} - {c.validTo}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium leading-none ${
                          c.status === 'Active'
                            ? 'bg-primary text-white'
                            : c.status === 'Disabled'
                            ? 'bg-neutral text-ink/60 border border-primary/10'
                            : 'bg-white text-primary border border-primary'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleStatus(c.id)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            c.status === 'Active'
                              ? 'border-primary/20 text-ink/60 hover:text-primary hover:bg-neutral'
                              : 'border-secondary bg-secondary/15 text-primary'
                          }`}
                          title={c.status === 'Active' ? 'Disable coupon' : 'Enable coupon'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 rounded-lg border border-primary/20 text-ink/60 hover:text-primary hover:bg-neutral transition-colors"
                          title="Edit coupon parameters"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 rounded-lg border border-primary/20 text-ink/60 hover:text-primary hover:bg-neutral transition-colors"
                          title="Delete coupon"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Create / Edit Coupon Modal (Portaled to document.body so backdrop covers 100% of viewport without white strip) */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] bg-primary/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-[24px] bg-white border border-primary/15 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex items-center justify-between pb-2 border-b border-primary/10">
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-primary" />
                  <h3 className="font-heading text-lg font-normal text-ink">
                    {editingCoupon ? 'Edit Promo Coupon' : 'Create New Coupon'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-7 h-7 rounded-full hover:bg-neutral flex items-center justify-center text-ink/50 hover:text-ink transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 font-sans text-xs">
                {/* Coupon Code */}
                <div>
                  <label className="block text-ink/75 font-medium mb-1">Coupon Code (Uppercase) *</label>
                  <input
                    type="text"
                    placeholder="e.g. FESTIVE30"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-1.5 rounded-xl border border-primary/20 text-ink font-mono font-bold focus:outline-none focus:ring-2 focus:ring-secondary uppercase"
                  />
                </div>

                {/* Discount Type & Value */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-ink/75 font-medium mb-1">Discount Type</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as any)}
                      className="w-full px-3 py-1.5 rounded-xl border border-primary/20 text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                      <option value="Percentage">Percentage (%)</option>
                      <option value="Flat">Flat Cash (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-ink/75 font-medium mb-1">
                      Discount Value ({formType === 'Percentage' ? '%' : '₹'}) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formValue}
                      onChange={(e) => setFormValue(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl border border-primary/20 text-ink font-mono font-bold focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                </div>

                {/* Max Cap (for Percentage) & Min Order Value */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-ink/75 font-medium mb-1">Min Order Value (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={formMinOrder}
                      onChange={(e) => setFormMinOrder(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl border border-primary/20 text-ink font-mono focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>

                  <div>
                    {formType === 'Percentage' ? (
                      <>
                        <label className="block text-ink/75 font-medium mb-1">
                          Max Discount Cap (₹) <span className="text-ink/40 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          placeholder="e.g. 150"
                          value={formMaxDiscount}
                          onChange={(e) => setFormMaxDiscount(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-xl border border-primary/20 text-ink font-mono focus:outline-none focus:ring-2 focus:ring-secondary"
                        />
                      </>
                    ) : (
                      <>
                        <label className="block text-ink/75 font-medium mb-1">Discount Mode</label>
                        <div className="h-[32px] px-3 rounded-xl bg-neutral/60 border border-primary/10 flex items-center text-ink/60 font-sans text-xs">
                          Fixed cash deduction
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Applicable Audience & Per-User Limit */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-ink/75 font-medium mb-1">Target Audience</label>
                    <select
                      value={formApplicableFor}
                      onChange={(e) => setFormApplicableFor(e.target.value as any)}
                      className="w-full px-3 py-1.5 rounded-xl border border-primary/20 text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                      <option value="All Customers">All Customers</option>
                      <option value="New Customers Only">New Customers Only (1st Order)</option>
                      <option value="VIP Customers">VIP / Repeat Customers</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-ink/75 font-medium mb-1">Uses Per Customer</label>
                    <select
                      value={formPerUserLimit}
                      onChange={(e) => setFormPerUserLimit(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl border border-primary/20 text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                      <option value={1}>1 Time Per Customer (Recommended)</option>
                      <option value={2}>2 Times Per Customer</option>
                      <option value={3}>3 Times Per Customer</option>
                      <option value={5}>5 Times Per Customer</option>
                      <option value={999}>Unlimited Times</option>
                    </select>
                  </div>
                </div>

                {/* Overall Platform Usage Limit */}
                <div>
                  <label className="block text-ink/75 font-medium mb-1">Total Platform Usage Limit (All Users combined)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 1000"
                    value={formUsageLimit}
                    onChange={(e) => setFormUsageLimit(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-primary/20 text-ink font-mono focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>

                {/* Start Date & Expiry Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-ink/75 font-medium mb-1">Start Date</label>
                    <input
                      type="date"
                      value={formValidFrom}
                      onChange={(e) => setFormValidFrom(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-xl border border-primary/20 text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>

                  <div>
                    <label className="block text-ink/75 font-medium mb-1">Expiry Date</label>
                    <input
                      type="date"
                      value={formValidTo}
                      onChange={(e) => setFormValidTo(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-xl border border-primary/20 text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-primary/10">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-primary/20 text-ink/70 font-sans text-xs font-medium hover:bg-neutral transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveModal}
                  className="px-4 py-2 rounded-full bg-primary text-white font-sans text-xs font-medium hover:bg-primary/90 shadow-sm transition-colors"
                >
                  {editingCoupon ? 'Save Changes' : 'Create Promo Code'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
