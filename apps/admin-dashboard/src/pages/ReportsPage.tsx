import React, { useState } from 'react';
import { HatchBar } from '../components/common/HatchBar';
import {
  Download,
  Printer,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Users,
  Store,
  Bike,
  Star,
  Clock,
  CheckCircle2,
} from 'lucide-react';

type PeriodType = '7d' | '30d' | '1y';
export type ReportTab =
  | 'Sales'
  | 'Orders'
  | 'Customer'
  | 'Vendor'
  | 'Rider'
  | 'Tax'
  | 'GST'
  | 'Inventory';

export const REPORT_TABS_CONFIG: { id: ReportTab; label: string }[] = [
  { id: 'Sales', label: 'Sales' },
  { id: 'Orders', label: 'Orders' },
  { id: 'Customer', label: 'Customer' },
  { id: 'Vendor', label: 'Vendor' },
  { id: 'Rider', label: 'Rider' },
  { id: 'Tax', label: 'Tax' },
  { id: 'GST', label: 'GST' },
  { id: 'Inventory', label: 'Product Availability' },
];

interface MonthlyBarData {
  month: string;
  orders: number;
  heightPct: number; // 35 to 100
  isPeak?: boolean;
}

const MONTHLY_ORDERS: MonthlyBarData[] = [
  { month: 'Jan', orders: 1240, heightPct: 45 },
  { month: 'Feb', orders: 980, heightPct: 35 },
  { month: 'Mar', orders: 1850, heightPct: 70 },
  { month: 'Apr', orders: 1720, heightPct: 65 },
  { month: 'May', orders: 2100, heightPct: 80 },
  { month: 'Jun', orders: 1450, heightPct: 55 },
  { month: 'Jul', orders: 2650, heightPct: 100, isPeak: true },
  { month: 'Aug', orders: 1980, heightPct: 75 },
  { month: 'Sep', orders: 1320, heightPct: 48 },
  { month: 'Oct', orders: 1890, heightPct: 72 },
  { month: 'Nov', orders: 2420, heightPct: 92 },
  { month: 'Dec', orders: 2280, heightPct: 86 },
];

export const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ReportTab>('Sales');
  const [period, setPeriod] = useState<PeriodType>('30d');
  const [hoveredBar, setHoveredBar] = useState<MonthlyBarData | null>(null);

  // Period multipliers for realistic smooth transitions
  const multiplier = period === '7d' ? 0.25 : period === '30d' ? 1.0 : 12.0;

  // KPIs for Sales
  const salesKPIs = {
    totalOrders: Math.round(3420 * multiplier),
    revenue: Math.round(2854000 * multiplier),
    aov: 834,
    newPartners: Math.round(18 * multiplier),
  };

  // KPIs for Vendors
  const vendorKPIs = {
    activeStores: Math.round(142 * (period === '7d' ? 0.95 : 1)),
    vendorSales: Math.round(2410000 * multiplier),
    avgFulfillment: '14.2 min',
    vendorRating: '4.82 / 5.0',
  };

  // KPIs for Riders
  const riderKPIs = {
    activeRiders: Math.round(98 * (period === '7d' ? 0.9 : 1)),
    deliveredOrders: Math.round(3210 * multiplier),
    avgSLA: '22.4 min',
    riderRating: '4.88 / 5.0',
  };

  // KPIs for Orders
  const orderKPIs = {
    totalPlaced: Math.round(3650 * multiplier),
    delivered: Math.round(3580 * multiplier),
    successRate: '98.1%',
    avgDeliveryTime: '21.4 min',
  };

  // KPIs for Customer
  const customerKPIs = {
    activeCustomers: Math.round(12540 * (period === '7d' ? 0.35 : period === '30d' ? 1.0 : 4.5)),
    repeatRate: '64.2%',
    cac: '₹145',
    avgOrdersPerCustomer: '4.2',
  };

  // KPIs for Tax
  const taxKPIs = {
    totalTax: Math.round(412000 * multiplier),
    cgst: Math.round(206000 * multiplier),
    sgst: Math.round(206000 * multiplier),
    tcsRate: '1.0% (₹' + Math.round(28540 * multiplier).toLocaleString() + ')',
  };

  // Tax Slabs
  const taxSlabs = [
    { slab: '5% GST (Essentials)', gross: Math.round(1450000 * multiplier), tax: Math.round(72500 * multiplier), share: '51%' },
    { slab: '12% GST (Processed)', gross: Math.round(920000 * multiplier), tax: Math.round(110400 * multiplier), share: '32%' },
    { slab: '18% GST (Packaged/Personal)', gross: Math.round(484000 * multiplier), tax: Math.round(87120 * multiplier), share: '17%' },
  ];

  // KPIs for GST
  const gstKPIs = {
    registeredRate: '86% (271 Vendors)',
    enrolmentRate: '14% (44 Vendors)',
    gstr8Status: 'Filed on 10 Nov',
    ecoTurnover: '₹' + Math.round(2854000 * multiplier).toLocaleString(),
  };

  // GST State Distribution
  const gstStates = [
    { state: 'Delhi NCR', gstinCount: 112, turnover: Math.round(1120000 * multiplier), gstPaid: Math.round(134400 * multiplier) },
    { state: 'Madhya Pradesh', gstinCount: 84, turnover: Math.round(840000 * multiplier), gstPaid: Math.round(100800 * multiplier) },
    { state: 'Maharashtra', gstinCount: 52, turnover: Math.round(520000 * multiplier), gstPaid: Math.round(62400 * multiplier) },
    { state: 'Uttar Pradesh', gstinCount: 42, turnover: Math.round(420000 * multiplier), gstPaid: Math.round(50400 * multiplier) },
    { state: 'Karnataka', gstinCount: 25, turnover: Math.round(250000 * multiplier), gstPaid: Math.round(30000 * multiplier) },
  ];

  // KPIs for Inventory (Product Availability)
  const inventoryKPIs = {
    totalCatalogSkus: 2450,
    inStockRate: '94.2%',
    lowAvailabilityAlerts: 14,
    outOfStockRate: '5.8%',
  };

  // Top In-Demand Items for Inventory
  const inDemandItems = [
    { name: 'Aashirvaad Sharbati Atta 5kg', brand: 'Aashirvaad', category: 'Grocery & Staples', activeStores: 124, availability: '98.5%' },
    { name: 'Amul Butter 500g', brand: 'Amul', category: 'Dairy & Eggs', activeStores: 118, availability: '96.2%' },
    { name: 'Fortune Sunflower Oil 1L', brand: 'Fortune', category: 'Grocery & Staples', activeStores: 96, availability: '94.0%' },
    { name: 'Tata Salt 1kg', brand: 'Tata', category: 'Grocery & Staples', activeStores: 130, availability: '99.1%' },
    { name: 'Parle-G Biscuits Family Pack', brand: 'Parle', category: 'Beverages & Snacks', activeStores: 112, availability: '97.4%' },
  ];

  // Top Vendors Mock
  const topVendors = [
    { name: 'Fresh Mart Hub', category: 'Grocery & Staples', city: 'Delhi', orders: Math.round(840 * multiplier), sales: Math.round(710000 * multiplier), score: 95 },
    { name: 'Royal Kirana', category: 'Grocery & Dairy', city: 'Indore', orders: Math.round(620 * multiplier), sales: Math.round(520000 * multiplier), score: 82 },
    { name: 'Sharma Dairy', category: 'Dairy & Eggs', city: 'Jabalpur', orders: Math.round(510 * multiplier), sales: Math.round(410000 * multiplier), score: 74 },
    { name: 'Daily Needs Store', category: 'Supermarket', city: 'Indore', orders: Math.round(480 * multiplier), sales: Math.round(390000 * multiplier), score: 68 },
    { name: 'Baker Street', category: 'Bakery & Snacks', city: 'Bhopal', orders: Math.round(390 * multiplier), sales: Math.round(310000 * multiplier), score: 58 },
  ];

  // Top Riders Mock
  const topRiders = [
    { name: 'Vikram Singh', vehicle: 'Motorcycle', city: 'Delhi', deliveries: Math.round(340 * multiplier), onTime: '98.5%', rating: 4.95, earning: Math.round(28500 * multiplier) },
    { name: 'Amit Kumar', vehicle: 'Scooter', city: 'Indore', deliveries: Math.round(290 * multiplier), onTime: '96.8%', rating: 4.88, earning: Math.round(24200 * multiplier) },
    { name: 'Deepak Sharma', vehicle: 'Electric', city: 'Bhopal', deliveries: Math.round(270 * multiplier), onTime: '95.4%', rating: 4.82, earning: Math.round(22800 * multiplier) },
    { name: 'Suresh Patil', vehicle: 'Motorcycle', city: 'Pune', deliveries: Math.round(250 * multiplier), onTime: '97.1%', rating: 4.90, earning: Math.round(21000 * multiplier) },
    { name: 'Manoj Tiwari', vehicle: 'Scooter', city: 'Lucknow', deliveries: Math.round(230 * multiplier), onTime: '94.8%', rating: 4.79, earning: Math.round(19500 * multiplier) },
  ];

  // Donut slices for Status: Delivered 68%, Out for delivery 14%, Preparing 10%, Placed 5%, Cancelled 3%
  // Circumference = 2 * PI * 38 ≈ 238.76
  const c = 238.76;
  const donutSlices = [
    { label: 'Delivered', count: Math.round(2325 * multiplier), pct: 68, strokeDash: `${c * 0.68 - 3} ${c * 0.32 + 3}`, offset: 0, color: '#123747' }, // PRIMARY
    { label: 'Out for Delivery', count: Math.round(478 * multiplier), pct: 14, strokeDash: `${c * 0.14 - 3} ${c * 0.86 + 3}`, offset: -(c * 0.68), color: '#527781' }, // SECONDARY
    { label: 'Preparing', count: Math.round(342 * multiplier), pct: 10, strokeDash: `${c * 0.10 - 3} ${c * 0.90 + 3}`, offset: -(c * 0.82), color: '#527781', opacity: 0.6 },
    { label: 'Placed', count: Math.round(171 * multiplier), pct: 5, strokeDash: `${c * 0.05 - 3} ${c * 0.95 + 3}`, offset: -(c * 0.92), color: '#F2F3F4' },
    { label: 'Cancelled', count: Math.round(104 * multiplier), pct: 3, strokeDash: `${c * 0.03 - 3} ${c * 0.97 + 3}`, offset: -(c * 0.97), color: '#000000' }, // INK
  ];

  const handleExportCSV = () => {
    let rows: (string | number)[][] = [];
    let headers: string[] = [];

    if (activeTab === 'Sales') {
      headers = ['Month', 'Orders Projected'];
      rows = MONTHLY_ORDERS.map((m) => [m.month, Math.round(m.orders * multiplier)]);
    } else if (activeTab === 'Orders') {
      headers = ['Status', 'Count', 'Percentage'];
      rows = donutSlices.map((s) => [s.label, s.count, `${s.pct}%`]);
    } else if (activeTab === 'Customer') {
      headers = ['Metric', 'Value'];
      rows = [
        ['Active Customers', customerKPIs.activeCustomers],
        ['Repeat Purchase Rate', customerKPIs.repeatRate],
        ['Customer Acquisition Cost', customerKPIs.cac],
        ['Average Orders Per Customer', customerKPIs.avgOrdersPerCustomer],
      ];
    } else if (activeTab === 'Vendor') {
      headers = ['Vendor Store', 'Category', 'City', 'Orders', 'Revenue (INR)'];
      rows = topVendors.map((v) => [v.name, v.category, v.city, v.orders, v.sales]);
    } else if (activeTab === 'Rider') {
      headers = ['Rider Name', 'Vehicle', 'City', 'Deliveries Completed', 'On-time Rate', 'Earnings (INR)'];
      rows = topRiders.map((r) => [r.name, r.vehicle, r.city, r.deliveries, r.onTime, r.earning]);
    } else if (activeTab === 'Tax') {
      headers = ['Tax Slab', 'Gross Turnover', 'Tax Collected', 'Turnover Share'];
      rows = taxSlabs.map((t) => [t.slab, t.gross, t.tax, t.share]);
    } else if (activeTab === 'GST') {
      headers = ['State / Region', 'GSTIN Vendors', 'Turnover', 'GST Remitted'];
      rows = gstStates.map((s) => [s.state, s.gstinCount, s.turnover, s.gstPaid]);
    } else if (activeTab === 'Inventory') {
      headers = ['Product Name', 'Brand', 'Category', 'Active Stores', 'Availability %'];
      rows = inDemandItems.map((item) => [item.name, item.brand, item.category, item.activeStores, item.availability]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fillkart_report_${activeTab.toLowerCase()}_${period}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* 1. Header Toolbar: Tabs + Period Pills + Exports */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Report Sub-Tabs: 8 tabs from doc 1.9 */}
        <div className="p-1 rounded-full bg-neutral border border-primary/10 flex items-center gap-1 overflow-x-auto max-w-full">
          {REPORT_TABS_CONFIG.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-1.5 rounded-full font-sans text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-ink/70 hover:text-ink hover:bg-white/60'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Right: Period Switcher + Export Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Period Pills with 250ms transition */}
          <div className="p-1 rounded-full bg-white border border-primary/15 flex items-center gap-1 shadow-2xs">
            {(
              [
                { id: '7d', label: '7 days' },
                { id: '30d', label: '30 days' },
                { id: '1y', label: 'This year' },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-3 py-1 rounded-full font-sans text-xs font-medium transition-all duration-250 ${
                  period === p.id
                    ? 'bg-secondary text-white'
                    : 'text-ink/70 hover:text-ink hover:bg-neutral'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 rounded-full border border-primary/20 bg-white text-ink hover:bg-neutral font-sans text-xs font-medium transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-primary" />
            <span>CSV</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 rounded-full bg-primary text-white font-sans text-xs font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {/* 2. Four KPI Cards (Dynamic values change smoothly based on Period) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 min-[1280px]:grid-cols-4 gap-3.5">
        {activeTab === 'Sales' && (
          <>
            <div className="p-4 rounded-[22px] bg-primary text-white shadow-sm flex flex-col justify-between h-[120px] transition-all duration-250">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-white/80">Total Orders</span>
                <ShoppingBag className="w-4 h-4 text-white/70" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-white block">
                  {salesKPIs.totalOrders.toLocaleString()}
                </span>
                <span className="font-sans text-[11px] text-white/75 mt-0.5 block">
                  +12.4% vs previous period
                </span>
              </div>
              <HatchBar progress={88} colorScheme="primary" height={6} />
            </div>

            <div className="p-4 rounded-[22px] bg-secondary text-white shadow-sm flex flex-col justify-between h-[120px] transition-all duration-250">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-white/80">Gross Sales</span>
                <DollarSign className="w-4 h-4 text-white/70" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-white block">
                  ₹{salesKPIs.revenue.toLocaleString()}
                </span>
                <span className="font-sans text-[11px] text-white/75 mt-0.5 block">
                  Network marketplace GMV
                </span>
              </div>
              <HatchBar progress={76} colorScheme="secondary" height={6} />
            </div>

            <div className="p-4 rounded-[22px] bg-neutral border border-primary/10 shadow-sm flex flex-col justify-between h-[120px] transition-all duration-250">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-ink/75">Average Order Value</span>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-primary block">
                  ₹{salesKPIs.aov}
                </span>
                <span className="font-sans text-[11px] text-ink/60 mt-0.5 block">
                  Per completed basket
                </span>
              </div>
              <HatchBar progress={64} colorScheme="neutral" height={6} />
            </div>

            <div className="p-4 rounded-[22px] bg-white border border-primary/15 shadow-sm flex flex-col justify-between h-[120px] transition-all duration-250">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-ink/75">New Partners Onboarded</span>
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-primary block">
                  {salesKPIs.newPartners}
                </span>
                <span className="font-sans text-[11px] text-ink/60 mt-0.5 block">
                  Verified merchants & riders
                </span>
              </div>
              <HatchBar progress={42} colorScheme="white" height={6} />
            </div>
          </>
        )}

        {activeTab === 'Orders' && (
          <>
            <div className="p-4 rounded-[22px] bg-primary text-white shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-white/80">Total Placed</span>
                <ShoppingBag className="w-4 h-4 text-white/70" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-white block">
                  {orderKPIs.totalPlaced.toLocaleString()}
                </span>
                <span className="font-sans text-[11px] text-white/75 mt-0.5 block">Total order requests</span>
              </div>
              <HatchBar progress={95} colorScheme="primary" height={6} />
            </div>

            <div className="p-4 rounded-[22px] bg-secondary text-white shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-white/80">Delivered</span>
                <CheckCircle2 className="w-4 h-4 text-white/70" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-white block">
                  {orderKPIs.delivered.toLocaleString()}
                </span>
                <span className="font-sans text-[11px] text-white/75 mt-0.5 block">Delivered successfully</span>
              </div>
              <HatchBar progress={88} colorScheme="secondary" height={6} />
            </div>

            <div className="p-4 rounded-[22px] bg-neutral border border-primary/10 shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-ink/75">Delivery Success Rate</span>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-primary block">
                  {orderKPIs.successRate}
                </span>
                <span className="font-sans text-[11px] text-ink/60 mt-0.5 block">Completion SLA</span>
              </div>
              <HatchBar progress={98} colorScheme="neutral" height={6} />
            </div>

            <div className="p-4 rounded-[22px] bg-white border border-primary/15 shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-ink/75">Avg Delivery Time</span>
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-primary block">
                  {orderKPIs.avgDeliveryTime}
                </span>
                <span className="font-sans text-[11px] text-ink/60 mt-0.5 block">Doorstep dispatch speed</span>
              </div>
              <HatchBar progress={75} colorScheme="white" height={6} />
            </div>
          </>
        )}

        {activeTab === 'Customer' && (
          <>
            <div className="p-4 rounded-[22px] bg-primary text-white shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-white/80">Active Customers</span>
                <Users className="w-4 h-4 text-white/70" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-white block">
                  {customerKPIs.activeCustomers.toLocaleString()}
                </span>
                <span className="font-sans text-[11px] text-white/75 mt-0.5 block">Registered platform users</span>
              </div>
              <HatchBar progress={92} colorScheme="primary" height={6} />
            </div>

            <div className="p-4 rounded-[22px] bg-secondary text-white shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-white/80">Repeat Rate</span>
                <TrendingUp className="w-4 h-4 text-white/70" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-white block">
                  {customerKPIs.repeatRate}
                </span>
                <span className="font-sans text-[11px] text-white/75 mt-0.5 block">30-day cohort retention</span>
              </div>
              <HatchBar progress={64} colorScheme="secondary" height={6} />
            </div>

            <div className="p-4 rounded-[22px] bg-neutral border border-primary/10 shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-ink/75">CAC (Acquisition Cost)</span>
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-primary block">
                  {customerKPIs.cac}
                </span>
                <span className="font-sans text-[11px] text-ink/60 mt-0.5 block">Blended marketing CAC</span>
              </div>
              <HatchBar progress={45} colorScheme="neutral" height={6} />
            </div>

            <div className="p-4 rounded-[22px] bg-white border border-primary/15 shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-ink/75">Orders Per Customer</span>
                <ShoppingBag className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-primary block">
                  {customerKPIs.avgOrdersPerCustomer}
                </span>
                <span className="font-sans text-[11px] text-ink/60 mt-0.5 block">Average frequency</span>
              </div>
              <HatchBar progress={70} colorScheme="white" height={6} />
            </div>
          </>
        )}

        {activeTab === 'Vendor' && (
          <>
            <div className="p-4 rounded-[22px] bg-primary text-white shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-white/80">Active Stores</span>
                <Store className="w-4 h-4 text-white/70" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-white block">
                  {vendorKPIs.activeStores}
                </span>
                <span className="font-sans text-[11px] text-white/75 mt-0.5 block">Across 6 regional hubs</span>
              </div>
              <HatchBar progress={92} colorScheme="primary" height={6} />
            </div>

            <div className="p-4 rounded-[22px] bg-secondary text-white shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-white/80">Vendor Revenue</span>
                <DollarSign className="w-4 h-4 text-white/70" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-white block">
                  ₹{vendorKPIs.vendorSales.toLocaleString()}
                </span>
                <span className="font-sans text-[11px] text-white/75 mt-0.5 block">Net vendor settlements</span>
              </div>
              <HatchBar progress={84} colorScheme="secondary" height={6} />
            </div>

            <div className="p-4 rounded-[22px] bg-neutral border border-primary/10 shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-ink/75">Avg Prep Time</span>
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-primary block">
                  {vendorKPIs.avgFulfillment}
                </span>
                <span className="font-sans text-[11px] text-ink/60 mt-0.5 block">Store prep SLA</span>
              </div>
              <HatchBar progress={70} colorScheme="neutral" height={6} />
            </div>

            <div className="p-4 rounded-[22px] bg-white border border-primary/15 shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-ink/75">Store CSAT Rating</span>
                <Star className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-primary block">
                  {vendorKPIs.vendorRating}
                </span>
                <span className="font-sans text-[11px] text-ink/60 mt-0.5 block">Overall customer rating</span>
              </div>
              <HatchBar progress={96} colorScheme="white" height={6} />
            </div>
          </>
        )}

        {activeTab === 'Rider' && (
          <>
            <div className="p-4 rounded-[22px] bg-primary text-white shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-white/80">Active Riders</span>
                <Bike className="w-4 h-4 text-white/70" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-white block">
                  {riderKPIs.activeRiders}
                </span>
                <span className="font-sans text-[11px] text-white/75 mt-0.5 block">Online fleet capacity</span>
              </div>
              <HatchBar progress={88} colorScheme="primary" height={6} />
            </div>

            <div className="p-4 rounded-[22px] bg-secondary text-white shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-white/80">Delivered Orders</span>
                <CheckCircle2 className="w-4 h-4 text-white/70" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-white block">
                  {riderKPIs.deliveredOrders.toLocaleString()}
                </span>
                <span className="font-sans text-[11px] text-white/75 mt-0.5 block">Last mile fulfillment</span>
              </div>
              <HatchBar progress={80} colorScheme="secondary" height={6} />
            </div>

            <div className="p-4 rounded-[22px] bg-neutral border border-primary/10 shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-ink/75">Avg Delivery Time</span>
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-primary block">
                  {riderKPIs.avgSLA}
                </span>
                <span className="font-sans text-[11px] text-ink/60 mt-0.5 block">From dispatch to door</span>
              </div>
              <HatchBar progress={65} colorScheme="neutral" height={6} />
            </div>

            <div className="p-4 rounded-[22px] bg-white border border-primary/15 shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-ink/75">Rider CSAT Rating</span>
                <Star className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-primary block">
                  {riderKPIs.riderRating}
                </span>
                <span className="font-sans text-[11px] text-ink/60 mt-0.5 block">Service rating score</span>
              </div>
              <HatchBar progress={97} colorScheme="white" height={6} />
            </div>
          </>
        )}

        {activeTab === 'Tax' && (
          <>
            <div className="p-4 rounded-[22px] bg-primary text-white shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-white/80">Total Tax Collected</span>
                <DollarSign className="w-4 h-4 text-white/70" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-white block">
                  ₹{taxKPIs.totalTax.toLocaleString()}
                </span>
                <span className="font-sans text-[11px] text-white/75 mt-0.5 block">CGST + SGST combined</span>
              </div>
              <HatchBar progress={85} colorScheme="primary" height={6} />
            </div>

            <div className="p-4 rounded-[22px] bg-secondary text-white shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-white/80">CGST (Central)</span>
                <CheckCircle2 className="w-4 h-4 text-white/70" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-white block">
                  ₹{taxKPIs.cgst.toLocaleString()}
                </span>
                <span className="font-sans text-[11px] text-white/75 mt-0.5 block">50% statutory central share</span>
              </div>
              <HatchBar progress={50} colorScheme="secondary" height={6} />
            </div>

            <div className="p-4 rounded-[22px] bg-neutral border border-primary/10 shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-ink/75">SGST (State)</span>
                <CheckCircle2 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-primary block">
                  ₹{taxKPIs.sgst.toLocaleString()}
                </span>
                <span className="font-sans text-[11px] text-ink/60 mt-0.5 block">50% statutory state share</span>
              </div>
              <HatchBar progress={50} colorScheme="neutral" height={6} />
            </div>

            <div className="p-4 rounded-[22px] bg-white border border-primary/15 shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-ink/75">TCS on Marketplace</span>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-primary block">
                  {taxKPIs.tcsRate}
                </span>
                <span className="font-sans text-[11px] text-ink/60 mt-0.5 block">Sec 52 CGST Act 2017</span>
              </div>
              <HatchBar progress={30} colorScheme="white" height={6} />
            </div>
          </>
        )}

        {activeTab === 'GST' && (
          <>
            <div className="p-4 rounded-[22px] bg-primary text-white shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-white/80">GSTIN Registered</span>
                <Store className="w-4 h-4 text-white/70" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-white block">
                  {gstKPIs.registeredRate}
                </span>
                <span className="font-sans text-[11px] text-white/75 mt-0.5 block">Regular GST compliance</span>
              </div>
              <HatchBar progress={86} colorScheme="primary" height={6} />
            </div>

            <div className="p-4 rounded-[22px] bg-secondary text-white shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-white/80">Enrolment Route</span>
                <Users className="w-4 h-4 text-white/70" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-white block">
                  {gstKPIs.enrolmentRate}
                </span>
                <span className="font-sans text-[11px] text-white/75 mt-0.5 block">Eligible unregistered sellers</span>
              </div>
              <HatchBar progress={14} colorScheme="secondary" height={6} />
            </div>

            <div className="p-4 rounded-[22px] bg-neutral border border-primary/10 shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-ink/75">GSTR-8 Monthly Filing</span>
                <CheckCircle2 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-primary block">
                  {gstKPIs.gstr8Status}
                </span>
                <span className="font-sans text-[11px] text-ink/60 mt-0.5 block">Monthly e-commerce return</span>
              </div>
              <HatchBar progress={100} colorScheme="neutral" height={6} />
            </div>

            <div className="p-4 rounded-[22px] bg-white border border-primary/15 shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-ink/75">ECO Gross Turnover</span>
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-primary block">
                  {gstKPIs.ecoTurnover}
                </span>
                <span className="font-sans text-[11px] text-ink/60 mt-0.5 block">Operator platform volume</span>
              </div>
              <HatchBar progress={78} colorScheme="white" height={6} />
            </div>
          </>
        )}

        {activeTab === 'Inventory' && (
          <>
            <div className="p-4 rounded-[22px] bg-primary text-white shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-white/80">Catalog SKUs</span>
                <ShoppingBag className="w-4 h-4 text-white/70" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-white block">
                  {inventoryKPIs.totalCatalogSkus.toLocaleString()}
                </span>
                <span className="font-sans text-[11px] text-white/75 mt-0.5 block">Active products in network</span>
              </div>
              <HatchBar progress={90} colorScheme="primary" height={6} />
            </div>

            <div className="p-4 rounded-[22px] bg-secondary text-white shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-white/80">In-Stock Availability</span>
                <CheckCircle2 className="w-4 h-4 text-white/70" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-white block">
                  {inventoryKPIs.inStockRate}
                </span>
                <span className="font-sans text-[11px] text-white/75 mt-0.5 block">Network vendor fulfillment</span>
              </div>
              <HatchBar progress={94} colorScheme="secondary" height={6} />
            </div>

            <div className="p-4 rounded-[22px] bg-neutral border border-primary/10 shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-ink/75">Low Availability Items</span>
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-primary block">
                  {inventoryKPIs.lowAvailabilityAlerts}
                </span>
                <span className="font-sans text-[11px] text-ink/60 mt-0.5 block">Stocked in &lt; 2 stores</span>
              </div>
              <HatchBar progress={18} colorScheme="neutral" height={6} />
            </div>

            <div className="p-4 rounded-[22px] bg-white border border-primary/15 shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-ink/75">Out-of-Stock Rate</span>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="font-heading text-2xl font-normal text-primary block">
                  {inventoryKPIs.outOfStockRate}
                </span>
                <span className="font-sans text-[11px] text-ink/60 mt-0.5 block">Vendor temporary unavail.</span>
              </div>
              <HatchBar progress={6} colorScheme="white" height={6} />
            </div>
          </>
        )}
      </div>

      {/* 3. Charts & Detailed Section based on Active Tab */}
      {(activeTab === 'Sales' || activeTab === 'Orders') && (
        <div className="grid grid-cols-1 min-[1280px]:grid-cols-[1fr_360px] gap-5 items-start">
          {/* Left: Orders by Month Bar Chart */}
          <div className="p-5 rounded-[24px] bg-white border border-primary/10 shadow-[0_2px_8px_rgba(18,55,71,0.02)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-normal text-ink">Orders by Month</h3>
                <p className="font-sans text-xs text-ink/60">
                  Monthly volume pipeline · Peak in July (2,650 orders)
                </p>
              </div>

              {hoveredBar && (
                <div className="px-3 py-1 rounded-full bg-primary text-white font-sans text-xs font-medium animate-in fade-in">
                  {hoveredBar.month}: {Math.round(hoveredBar.orders * multiplier).toLocaleString()} orders
                </div>
              )}
            </div>

            {/* 12-Column Bar Chart */}
            <div className="pt-8 pb-2">
              <div className="h-[220px] grid grid-cols-12 gap-2 items-end">
                {MONTHLY_ORDERS.map((item) => (
                  <div
                    key={item.month}
                    className="flex flex-col items-center justify-end h-full group cursor-pointer relative"
                    onMouseEnter={() => setHoveredBar(item)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {/* Floating Hatch Block */}
                    <div
                      className="w-[34px] h-[22px] rounded-[10px] flex-shrink-0 transition-transform group-hover:-translate-y-1"
                      style={{
                        backgroundColor: '#FFFFFF',
                        backgroundImage:
                          'repeating-linear-gradient(45deg, var(--primary, #123747) 0 1px, transparent 1px 2.5px)',
                        border: '1px solid rgba(18, 55, 71, 0.25)',
                      }}
                    />

                    {/* 6px Gap */}
                    <div className="h-[6px] w-full flex-shrink-0" />

                    {/* Vertical Gradient Bar */}
                    <div
                      className="w-[34px] rounded-[14px] transition-all duration-300 group-hover:brightness-110"
                      style={{
                        height: `${item.heightPct}%`,
                        background: 'linear-gradient(180deg, #527781 0%, #123747 100%)',
                      }}
                    />

                    {/* Month Label */}
                    <span
                      className={`font-sans text-[11px] mt-2 block transition-colors ${
                        item.isPeak ? 'font-medium text-primary' : 'font-normal text-ink/65'
                      }`}
                    >
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Orders by Status Donut Chart */}
          <div className="p-5 rounded-[24px] bg-white border border-primary/10 shadow-[0_2px_8px_rgba(18,55,71,0.02)] space-y-4">
            <div>
              <h3 className="font-heading text-lg font-normal text-ink">Orders by Status</h3>
              <p className="font-sans text-xs text-ink/60">Fulfillment lifecycle breakdown</p>
            </div>

            <div className="flex items-center justify-center py-2">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {donutSlices.map((slice, i) => (
                    <circle
                      key={i}
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke={slice.color}
                      strokeWidth="14"
                      strokeDasharray={slice.strokeDash}
                      strokeDashoffset={slice.offset}
                      opacity={slice.opacity || 1}
                      strokeLinecap="round"
                    />
                  ))}
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-heading text-3xl font-normal text-primary leading-none">
                    68%
                  </span>
                  <span className="font-sans text-[10px] text-ink/55 mt-0.5">Delivered</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-primary/10">
              {donutSlices.map((slice, i) => (
                <div key={i} className="flex items-center justify-between text-xs font-sans">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: slice.color, opacity: slice.opacity || 1 }}
                    />
                    <span className="text-ink/80">{slice.label}</span>
                  </div>
                  <span className="font-medium text-ink">{slice.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tax Report View */}
      {activeTab === 'Tax' && (
        <div className="p-5 rounded-[24px] bg-white border border-primary/10 shadow-[0_2px_8px_rgba(18,55,71,0.02)] space-y-4">
          <div>
            <h3 className="font-heading text-lg font-normal text-ink">Tax Slabs & GST Remittance Summary</h3>
            <p className="font-sans text-xs text-ink/60">Statutory tax deductions by category GST rate</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral/60 border-b border-primary/10 font-sans text-[11px] font-medium text-ink/75">
                  <th className="py-2.5 px-3">Tax Slab & Category</th>
                  <th className="py-2.5 px-3 text-right">Gross GMV Turnover</th>
                  <th className="py-2.5 px-3 text-right">Tax Collected (CGST + SGST)</th>
                  <th className="py-2.5 px-3 text-right">Turnover Share</th>
                  <th className="py-2.5 px-3 text-center">Remittance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5 font-sans text-xs text-ink">
                {taxSlabs.map((s) => (
                  <tr key={s.slab} className="hover:bg-neutral/30 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-primary">{s.slab}</td>
                    <td className="py-2.5 px-3 text-right font-medium">₹{s.gross.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right text-secondary font-medium">₹{s.tax.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right">{s.share}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-primary text-white">
                        Remitted
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GST Report View */}
      {activeTab === 'GST' && (
        <div className="p-5 rounded-[24px] bg-white border border-primary/10 shadow-[0_2px_8px_rgba(18,55,71,0.02)] space-y-4">
          <div>
            <h3 className="font-heading text-lg font-normal text-ink">State-wise GSTIN & TCS Distribution</h3>
            <p className="font-sans text-xs text-ink/60">GSTR-8 e-commerce marketplace filings across operational states</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral/60 border-b border-primary/10 font-sans text-[11px] font-medium text-ink/75">
                  <th className="py-2.5 px-3">State / Jurisdiction</th>
                  <th className="py-2.5 px-3 text-center">GSTIN Registered Merchants</th>
                  <th className="py-2.5 px-3 text-right">Operator Gross Turnover</th>
                  <th className="py-2.5 px-3 text-right">GST Remitted to State</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5 font-sans text-xs text-ink">
                {gstStates.map((st) => (
                  <tr key={st.state} className="hover:bg-neutral/30 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-primary">{st.state}</td>
                    <td className="py-2.5 px-3 text-center font-medium">{st.gstinCount}</td>
                    <td className="py-2.5 px-3 text-right font-medium">₹{st.turnover.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right text-secondary font-medium">₹{st.gstPaid.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-secondary text-white">
                        Filed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inventory (Product Availability) View */}
      {activeTab === 'Inventory' && (
        <div className="p-5 rounded-[24px] bg-white border border-primary/10 shadow-[0_2px_8px_rgba(18,55,71,0.02)] space-y-4">
          <div>
            <h3 className="font-heading text-lg font-normal text-ink">Product Availability Across Vendor Network</h3>
            <p className="font-sans text-xs text-ink/60">Top high-demand items and merchant stock coverage</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral/60 border-b border-primary/10 font-sans text-[11px] font-medium text-ink/75">
                  <th className="py-2.5 px-3">Item Name</th>
                  <th className="py-2.5 px-3">Brand</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-center">Active Stores Stocking</th>
                  <th className="py-2.5 px-3 text-right">Availability SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5 font-sans text-xs text-ink">
                {inDemandItems.map((item) => (
                  <tr key={item.name} className="hover:bg-neutral/30 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-primary">{item.name}</td>
                    <td className="py-2.5 px-3 text-ink/75">{item.brand}</td>
                    <td className="py-2.5 px-3 text-ink/75">{item.category}</td>
                    <td className="py-2.5 px-3 text-center font-medium">{item.activeStores} stores</td>
                    <td className="py-2.5 px-3 text-right font-medium text-secondary">{item.availability}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top Vendors Card (under Sales or in Vendor tab) */}
      {(activeTab === 'Sales' || activeTab === 'Vendor') && (
        <div className="p-5 rounded-[24px] bg-white border border-primary/10 shadow-[0_2px_8px_rgba(18,55,71,0.02)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-lg font-normal text-ink">Top Performing Vendors</h3>
              <p className="font-sans text-xs text-ink/60">Volume leaders and fulfillment accuracy</p>
            </div>
          </div>

          <div className="space-y-3">
            {topVendors.map((vendor) => (
              <div
                key={vendor.name}
                className="p-3.5 rounded-2xl bg-neutral/30 border border-primary/10 flex flex-wrap items-center justify-between gap-3"
              >
                <div className="min-w-[180px]">
                  <h4 className="font-sans text-xs font-medium text-ink leading-tight">{vendor.name}</h4>
                  <span className="font-sans text-[11px] text-ink/55 mt-0.5 block">
                    {vendor.category} · {vendor.city}
                  </span>
                </div>

                <div className="flex-1 max-w-xs min-w-[160px]">
                  <div className="flex justify-between font-sans text-[11px] text-ink/60 mb-1">
                    <span>Performance index</span>
                    <strong className="text-primary font-medium">{vendor.score}%</strong>
                  </div>
                  <HatchBar progress={vendor.score} colorScheme="neutral" height={8} />
                </div>

                <div className="text-right min-w-[120px]">
                  <span className="font-heading text-sm font-normal text-primary block leading-tight">
                    ₹{vendor.sales.toLocaleString()}
                  </span>
                  <span className="font-sans text-[10px] text-ink/55 block mt-0.5">
                    {vendor.orders} orders fulfilled
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Riders Table (in Rider tab) */}
      {activeTab === 'Rider' && (
        <div className="p-5 rounded-[24px] bg-white border border-primary/10 shadow-[0_2px_8px_rgba(18,55,71,0.02)] space-y-4">
          <div>
            <h3 className="font-heading text-lg font-normal text-ink">Fleet Performance & SLA</h3>
            <p className="font-sans text-xs text-ink/60">Top active riders by delivery efficiency</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral/60 border-b border-primary/10 font-sans text-[11px] font-medium text-ink/75">
                  <th className="py-2.5 px-3">Rider Name</th>
                  <th className="py-2.5 px-3">Vehicle</th>
                  <th className="py-2.5 px-3">City</th>
                  <th className="py-2.5 px-3 text-center">Deliveries</th>
                  <th className="py-2.5 px-3 text-center">On-Time SLA</th>
                  <th className="py-2.5 px-3 text-center">CSAT</th>
                  <th className="py-2.5 px-3 text-right">Payout Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5 font-sans text-xs text-ink">
                {topRiders.map((r) => (
                  <tr key={r.name} className="hover:bg-neutral/30 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-primary">{r.name}</td>
                    <td className="py-2.5 px-3 text-ink/75">{r.vehicle}</td>
                    <td className="py-2.5 px-3 text-ink/75">{r.city}</td>
                    <td className="py-2.5 px-3 text-center font-medium">{r.deliveries}</td>
                    <td className="py-2.5 px-3 text-center text-primary font-medium">{r.onTime}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 font-medium text-secondary">
                        <Star className="w-3 h-3 fill-secondary text-secondary" />
                        {r.rating}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-medium text-primary">
                      ₹{r.earning.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
