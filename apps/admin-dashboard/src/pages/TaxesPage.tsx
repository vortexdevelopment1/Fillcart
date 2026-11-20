import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { HatchBar } from '../components/common/HatchBar';
import { CustomSelect } from '../components/common/CustomSelect';
import { SearchInput } from '../components/common/SearchInput';
import {
  Receipt,
  FileSpreadsheet,
  Download,
  Building2,
  CheckCircle2,
  AlertCircle,
  Search,
  ShieldCheck,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface CategoryTaxMapping {
  id: string;
  category: string;
  hsnCode: string;
  slab: 0 | 5 | 12 | 18;
  cess: number;
  lastUpdated: string;
}

interface MonthlyGstRecord {
  month: string;
  grossValue: number;
  taxableValue: number;
  cgst: number;
  sgst: number;
  totalGst: number;
  status: 'Filed' | 'Pending';
}

interface VendorGstin {
  id: string;
  vendorName: string;
  tradeName: string;
  gstin: string; // or 'Not registered'
  status: 'Verified' | 'Pending Verification' | 'Unregistered';
  state: string;
}

const INITIAL_CATEGORY_TAX: CategoryTaxMapping[] = [
  { id: 'tax-01', category: 'Fresh Fruits & Vegetables', hsnCode: '0709', slab: 0, cess: 0, lastUpdated: '01 Nov 2026' },
  { id: 'tax-02', category: 'Dairy & Milk Products', hsnCode: '0401', slab: 5, cess: 0, lastUpdated: '01 Nov 2026' },
  { id: 'tax-03', category: 'Packaged Staples & Grains', hsnCode: '1006', slab: 5, cess: 0, lastUpdated: '01 Nov 2026' },
  { id: 'tax-04', category: 'Processed Foods & Juices', hsnCode: '2009', slab: 12, cess: 0, lastUpdated: '01 Nov 2026' },
  { id: 'tax-05', category: 'Snacks & Confectionery', hsnCode: '1905', slab: 18, cess: 0, lastUpdated: '01 Nov 2026' },
  { id: 'tax-06', category: 'Personal Care & Cosmetics', hsnCode: '3304', slab: 18, cess: 0, lastUpdated: '01 Nov 2026' },
  { id: 'tax-07', category: 'Household Cleaners', hsnCode: '3402', slab: 18, cess: 0, lastUpdated: '01 Nov 2026' },
];

const MONTHLY_GST_REPORTS: MonthlyGstRecord[] = [
  { month: 'Nov 2026 (MTD)', grossValue: 1245800, taxableValue: 1191666, cgst: 107250, sgst: 107250, totalGst: 214500, status: 'Pending' },
  { month: 'Oct 2026', grossValue: 1180000, taxableValue: 1128000, cgst: 101520, sgst: 101520, totalGst: 203040, status: 'Filed' },
  { month: 'Sep 2026', grossValue: 1050000, taxableValue: 1003500, cgst: 90315, sgst: 90315, totalGst: 180630, status: 'Filed' },
  { month: 'Aug 2026', grossValue: 910000, taxableValue: 869700, cgst: 78273, sgst: 78273, totalGst: 156546, status: 'Filed' },
];

const VENDOR_GSTIN_LIST: VendorGstin[] = [
  { id: 'vg-01', vendorName: 'Fresh Mart Hub', tradeName: 'Fresh Mart Hub Retail LLP', gstin: '27AABCF1234F1Z8', status: 'Verified', state: 'Maharashtra' },
  { id: 'vg-02', vendorName: 'Royal Kirana Stores', tradeName: 'Royal Kirana General Stores', gstin: '27BCDFG5678G2Z1', status: 'Verified', state: 'Maharashtra' },
  { id: 'vg-03', vendorName: 'Green Valley Organics', tradeName: 'Green Valley Agro Pvt Ltd', gstin: '27CDEFG9012H3Z4', status: 'Verified', state: 'Maharashtra' },
  { id: 'vg-04', vendorName: 'Baker\'s Delight', tradeName: 'Baker\'s Delight Confectioneries', gstin: '27DEFGHI3456I4Z7', status: 'Pending Verification', state: 'Maharashtra' },
  { id: 'vg-05', vendorName: 'Sharma Dairy & Provisions', tradeName: 'Sharma Milk Center', gstin: 'Not registered', status: 'Unregistered', state: 'Maharashtra' },
  { id: 'vg-06', vendorName: 'Spice Route Kitchen', tradeName: 'Spice Route Foods', gstin: '27EFGHIJ7890J5Z2', status: 'Verified', state: 'Maharashtra' },
  { id: 'vg-07', vendorName: 'Local Corner Stall', tradeName: 'Local Corner General', gstin: 'Not registered', status: 'Unregistered', state: 'Maharashtra' },
  { id: 'vg-08', vendorName: 'Pooja Daily Needs', tradeName: 'Pooja Daily Mart', gstin: 'Not registered', status: 'Unregistered', state: 'Maharashtra' },
];

export const TaxesPage: React.FC = () => {
  const { logAudit } = useApp();

  const [categoryTax, setCategoryTax] = useState<CategoryTaxMapping[]>(INITIAL_CATEGORY_TAX);
  const [vendorSearch, setVendorSearch] = useState('');
  const [vendorRegFilter, setVendorRegFilter] = useState<'All' | 'Registered' | 'Unregistered'>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered vendor GSTINs
  const filteredVendors = useMemo(() => {
    return VENDOR_GSTIN_LIST.filter((v) => {
      const isRegistered = v.gstin !== 'Not registered';
      if (vendorRegFilter === 'Registered' && !isRegistered) return false;
      if (vendorRegFilter === 'Unregistered' && isRegistered) return false;
      if (vendorSearch.trim()) {
        const q = vendorSearch.toLowerCase().trim();
        const matchesName = v.vendorName.toLowerCase().includes(q);
        const matchesTrade = v.tradeName.toLowerCase().includes(q);
        const matchesGstin = v.gstin.toLowerCase().includes(q);
        if (!matchesName && !matchesTrade && !matchesGstin) return false;
      }
      return true;
    });
  }, [vendorSearch, vendorRegFilter]);

  const handleUpdateSlab = (id: string, newSlab: 0 | 5 | 12 | 18) => {
    const item = categoryTax.find((c) => c.id === id);
    if (!item) return;

    setCategoryTax((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              slab: newSlab,
              lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            }
          : c
      )
    );

    logAudit(
      'Update',
      'Payments',
      `GST Slab: ${item.category}`,
      `Mapped ${item.category} (HSN ${item.hsnCode}) from ${item.slab}% to ${newSlab}% GST slab`,
      'Payment',
      [{ field: `${item.category} GST`, before: `${item.slab}%`, after: `${newSlab}%` }]
    );

    showToast(`Updated ${item.category} to ${newSlab}% GST slab`);
  };

  const handleExportGstr = (month: string) => {
    const headers = ['Month', 'Gross Value', 'Taxable Value', 'CGST', 'SGST', 'Total GST', 'Status'];
    const rows = MONTHLY_GST_REPORTS.map((r) => [
      `"${r.month}"`,
      r.grossValue,
      r.taxableValue,
      r.cgst,
      r.sgst,
      r.totalGst,
      r.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fillkart_gstr1_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logAudit(
      'Approve',
      'Payments',
      `GSTR-1 Export (${month})`,
      `Generated and exported statutory CBIC GSTR-1 return filing ledger for ${month}`,
      'Payment'
    );

    showToast(`Exported GSTR-1 summary for ${month}`);
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
          <h1 className="font-heading text-2xl font-normal text-ink">Taxes & GST Management</h1>
          <p className="font-sans text-xs text-ink/60 mt-0.5">
            GST slabs (0%, 5%, 12%, 18%), HSN category mapping, monthly GSTR ledger and vendor GSTIN compliance
          </p>
        </div>

        <button
          onClick={() => handleExportGstr('Nov 2026 MTD')}
          className="px-4 py-2 rounded-full bg-primary text-white font-sans text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-secondary"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export GSTR-1 Summary (CSV)</span>
        </button>
      </div>

      {/* 1. 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 min-[1280px]:grid-cols-4 gap-3">
        {/* Card 1: Total GST Collected (Primary Dark) */}
        <div className="p-4 rounded-[22px] bg-primary text-white flex flex-col justify-between h-[124px] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-medium text-white/80">Total GST Collected MTD</span>
            <Receipt className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <span className="font-heading text-2xl font-normal text-white leading-none block">
              ₹2,14,500
            </span>
            <span className="font-sans text-[11px] text-white/60 mt-0.5 block">
              Accrued platform tax liability
            </span>
          </div>
          <HatchBar progress={76} colorScheme="secondary" height={8} />
        </div>

        {/* Card 2: CGST Portion (Secondary) */}
        <div className="p-4 rounded-[22px] bg-secondary text-white flex flex-col justify-between h-[124px] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-medium text-white/80">Central GST (CGST)</span>
            <Building2 className="w-4 h-4 text-white/80" />
          </div>
          <div>
            <span className="font-heading text-2xl font-normal text-white leading-none block">
              ₹1,07,250
            </span>
            <span className="font-sans text-[11px] text-white/70 mt-0.5 block">
              50% statutory central share
            </span>
          </div>
          <HatchBar progress={50} colorScheme="white" height={8} />
        </div>

        {/* Card 3: SGST Portion (Neutral) */}
        <div className="p-4 rounded-[22px] bg-neutral border border-primary/10 flex flex-col justify-between h-[124px]">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-medium text-ink/75">State GST (SGST)</span>
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="font-heading text-2xl font-normal text-primary leading-none block">
              ₹1,07,250
            </span>
            <span className="font-sans text-[11px] text-ink/60 mt-0.5 block">
              Maharashtra state treasury credit
            </span>
          </div>
          <HatchBar progress={50} colorScheme="primary" height={8} />
        </div>

        {/* Card 4: Registered Vendors (White) */}
        <div className="p-4 rounded-[22px] bg-white border border-primary/15 shadow-sm flex flex-col justify-between h-[124px]">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-medium text-ink/75">Registered Merchants</span>
            <ShieldCheck className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="font-heading text-2xl font-normal text-primary leading-none block">
              248 / 315
            </span>
            <span className="font-sans text-[11px] text-ink/60 mt-0.5 block">
              78.7% verified GSTIN onboarding
            </span>
          </div>
          <HatchBar progress={78} colorScheme="neutral" height={8} />
        </div>
      </div>

      {/* 2. 4 GST Slabs Cards Grid */}
      <div className="space-y-2.5">
        <h2 className="font-heading text-base font-normal text-ink">Active GST Slabs (0%, 5%, 12%, 18%)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 min-[1280px]:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-primary/10 shadow-2xs space-y-1">
            <span className="px-2 py-0.5 rounded-full bg-neutral text-primary font-mono text-[11px] font-bold">0% Slab (Nil)</span>
            <h4 className="font-heading text-xl font-normal text-ink pt-1">₹3,42,000</h4>
            <p className="font-sans text-[11px] text-ink/60">Tax Exempt GMV (Fresh veggies, fruits, whole grains)</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-primary/10 shadow-2xs space-y-1">
            <span className="px-2 py-0.5 rounded-full bg-secondary/15 text-primary border border-secondary/30 font-mono text-[11px] font-bold">5% Slab</span>
            <h4 className="font-heading text-xl font-normal text-ink pt-1">₹4,12,000</h4>
            <p className="font-sans text-[11px] text-ink/60">₹20,600 Tax (Packaged milk, paneer, flours, tea)</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-primary/10 shadow-2xs space-y-1">
            <span className="px-2 py-0.5 rounded-full bg-secondary text-white font-mono text-[11px] font-bold">12% Slab</span>
            <h4 className="font-heading text-xl font-normal text-ink pt-1">₹2,84,000</h4>
            <p className="font-sans text-[11px] text-ink/60">₹34,080 Tax (Butter, cheese, ghee, fruit juices)</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-primary/10 shadow-2xs space-y-1">
            <span className="px-2 py-0.5 rounded-full bg-primary text-white font-mono text-[11px] font-bold">18% Slab</span>
            <h4 className="font-heading text-xl font-normal text-ink pt-1">₹8,88,000</h4>
            <p className="font-sans text-[11px] text-ink/60">₹1,59,840 Tax (Personal care, snacks, cleansers, platform fee)</p>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Per-Category Tax Mapping + Monthly GST Report */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1.2fr)] gap-5">
        {/* 3A: Per-Category Tax Mapping */}
        <div className="p-5 rounded-[24px] bg-white border border-primary/10 shadow-sm space-y-4">
          <div>
            <h2 className="font-heading text-base font-normal text-ink">Per-Category Tax Mapping</h2>
            <p className="font-sans text-xs text-ink/60">
              Harmonized System of Nomenclature (HSN) and assigned statutory GST slabs
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-primary/10 text-ink/60 text-[11px]">
                  <th className="py-2.5 px-3 font-medium">Category Name</th>
                  <th className="py-2.5 px-3 font-medium">HSN Code</th>
                  <th className="py-2.5 px-3 font-medium">GST Slab</th>
                  <th className="py-2.5 px-3 font-medium">Cess</th>
                  <th className="py-2.5 px-3 font-medium text-right">Last Verified</th>
                </tr>
              </thead>
              <tbody>
                {categoryTax.map((cat) => (
                  <tr key={cat.id} className="border-b border-primary/5 hover:bg-neutral/40 transition-colors">
                    <td className="py-3 px-3 font-medium text-primary">
                      <div className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                        <span>{cat.category}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-ink/80">{cat.hsnCode}</td>
                    <td className="py-3 px-3">
                      <CustomSelect
                        value={cat.slab}
                        onChange={(e) => handleUpdateSlab(cat.id, Number(e.target.value) as any)}
                        className="px-2 py-1 rounded-lg border border-primary/20 bg-neutral/20 text-primary font-mono font-bold text-xs focus:outline-none focus:border-secondary"
                      >
                        <option value={0}>0% (Nil)</option>
                        <option value={5}>5%</option>
                        <option value={12}>12%</option>
                        <option value={18}>18%</option>
                      </CustomSelect>
                    </td>
                    <td className="py-3 px-3 text-ink/60">{cat.cess}%</td>
                    <td className="py-3 px-3 text-ink/60 text-right">{cat.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3B: GST Collected Report by Month */}
        <div className="p-5 rounded-[24px] bg-white border border-primary/10 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1 border-b border-primary/10">
            <div>
              <h2 className="font-heading text-base font-normal text-ink">Monthly GST Reports</h2>
              <p className="font-sans text-xs text-ink/60">GSTR-1 and GSTR-3B filings</p>
            </div>
            <FileSpreadsheet className="w-4 h-4 text-primary" />
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[360px] pr-1">
            {MONTHLY_GST_REPORTS.map((r, i) => (
              <div key={i} className="p-3 rounded-xl border border-primary/10 bg-neutral/30 space-y-2 font-sans text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-primary text-xs">{r.month}</span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      r.status === 'Filed'
                        ? 'bg-primary text-white'
                        : 'bg-white text-primary border border-primary'
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-ink/75 pt-1 border-t border-primary/5">
                  <div>
                    <span className="text-ink/50 block">Taxable Value:</span>
                    <span className="font-mono font-medium">₹{r.taxableValue.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-ink/50 block">Total Tax (CGST+SGST):</span>
                    <span className="font-mono font-bold text-primary">₹{r.totalGst.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-xl bg-neutral/50 border border-primary/10 text-[11px] font-sans text-ink/60 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
            <span>Reports conform to CBIC GSTN e-filing specifications.</span>
          </div>
        </div>
      </div>

      {/* 4. Vendor GSTIN Registry List */}
      <div className="p-5 rounded-[24px] bg-white border border-primary/10 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-base font-normal text-ink">Vendor GSTIN Registry</h2>
            <p className="font-sans text-xs text-ink/60">
              Tax identification numbers and registration status of all active platform merchants
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter */}
            <CustomSelect
              value={vendorRegFilter}
              onChange={(e) => setVendorRegFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-full border border-primary/15 bg-white font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="All">All Merchants</option>
              <option value="Registered">Registered (GSTIN)</option>
              <option value="Unregistered">Not Registered</option>
            </CustomSelect>

            {/* Search */}
            <SearchInput
              placeholder="Search vendor or GSTIN..."
              value={vendorSearch}
              onChange={setVendorSearch}
              containerClassName="w-48 sm:w-56"
              className="py-1.5 rounded-full border border-primary/15 bg-white focus:ring-2 focus:ring-secondary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-primary/10 text-ink/60 text-[11px]">
                <th className="py-2.5 px-3 font-medium">Merchant Party</th>
                <th className="py-2.5 px-3 font-medium">Trade Name</th>
                <th className="py-2.5 px-3 font-medium">GSTIN Number</th>
                <th className="py-2.5 px-3 font-medium">Tax Status</th>
                <th className="py-2.5 px-3 font-medium text-right">Jurisdiction State</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map((v) => {
                const isNotRegistered = v.gstin === 'Not registered';

                return (
                  <tr key={v.id} className="border-b border-primary/5 hover:bg-neutral/40 transition-colors">
                    <td className="py-3 px-3 font-medium text-primary">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                        <span>{v.vendorName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-ink/70">{v.tradeName}</td>
                    <td className="py-3 px-3">
                      {isNotRegistered ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-neutral text-ink/60 font-sans text-[11px] font-medium border border-primary/10">
                          Not registered
                        </span>
                      ) : (
                        <span className="font-mono text-xs font-semibold text-primary select-all">
                          {v.gstin}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium leading-none ${
                          v.status === 'Verified'
                            ? 'bg-primary text-white'
                            : v.status === 'Pending Verification'
                            ? 'bg-secondary/20 text-primary border border-secondary/30'
                            : 'bg-neutral text-ink/60'
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-ink/60 text-right">{v.state}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
