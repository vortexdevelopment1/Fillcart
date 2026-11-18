import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { HatchBar } from '../components/common/HatchBar';
import {
  DollarSign,
  TrendingUp,
  Clock,
  RotateCcw,
  ArrowRight,
  HandCoins,
  History,
  ShieldCheck,
  CheckCircle2,
  Building2,
  AlertCircle,
} from 'lucide-react';

interface MonthBarData {
  month: string;
  revenue: number; // in thousands
  commission: number; // in thousands
}

export interface FinanceOverviewPageProps {
  onSelectTab?: (tab: string) => void;
}

const MONTHLY_DATA: MonthBarData[] = [
  { month: 'Jun', revenue: 720, commission: 86 },
  { month: 'Jul', revenue: 840, commission: 101 },
  { month: 'Aug', revenue: 910, commission: 109 },
  { month: 'Sep', revenue: 1050, commission: 126 },
  { month: 'Oct', revenue: 1180, commission: 141 },
  { month: 'Nov', revenue: 1245, commission: 149 },
];

export const FinanceOverviewPage: React.FC<FinanceOverviewPageProps> = ({ onSelectTab }) => {
  const navigate = useNavigate();
  const { auditLogs, transactions } = useApp();

  // Metrics
  const totalRevenue = 1245800;
  const commissionEarned = 149496;
  const pendingSettlementTotal = 184320;
  const refundsTotal = 18450;

  // Pending settlements
  const pendingSettlements = [
    {
      id: 'set-001',
      party: 'Fresh Mart Hub',
      type: 'Vendor',
      orders: 142,
      period: '10 Nov - 16 Nov 2026',
      gross: 54200,
      commission: 8130,
      net: 46070,
    },
    {
      id: 'set-002',
      party: 'Royal Kirana Stores',
      type: 'Vendor',
      orders: 98,
      period: '10 Nov - 16 Nov 2026',
      gross: 38400,
      commission: 5760,
      net: 32640,
    },
    {
      id: 'set-003',
      party: 'Green Valley Organics',
      type: 'Vendor',
      orders: 76,
      period: '10 Nov - 16 Nov 2026',
      gross: 32300,
      commission: 4845,
      net: 27455,
    },
    {
      id: 'set-004',
      party: 'Baker\'s Delight',
      type: 'Vendor',
      orders: 64,
      period: '10 Nov - 16 Nov 2026',
      gross: 23200,
      commission: 3480,
      net: 19720,
    },
    {
      id: 'set-005',
      party: 'Spice Route Kitchen',
      type: 'Vendor',
      orders: 52,
      period: '10 Nov - 16 Nov 2026',
      gross: 19300,
      commission: 2895,
      net: 16405,
    },
  ];

  // Recent 5 Payment logs
  const recentPaymentLogs = auditLogs
    .filter((log) => {
      const isPaymentMod = log.module === 'Payments' || log.module === 'Settlements' || log.module === 'Finance';
      const isFinAction =
        log.details.toLowerCase().includes('payout') ||
        log.details.toLowerCase().includes('refund') ||
        log.details.toLowerCase().includes('settlement') ||
        log.details.toLowerCase().includes('commission') ||
        log.details.toLowerCase().includes('gst') ||
        log.details.toLowerCase().includes('wallet') ||
        log.details.toLowerCase().includes('₹') ||
        log.target.startsWith('TXN-') ||
        log.target.startsWith('COMM-') ||
        log.target.startsWith('RDR-PAY') ||
        log.target.startsWith('TAX-');
      return isPaymentMod || isFinAction;
    })
    .slice(0, 5);

  const maxRev = Math.max(...MONTHLY_DATA.map((d) => d.revenue));

  return (
    <div className="space-y-6 pb-12">
      {/* 0. Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-normal text-ink">Finance Overview</h1>
          <p className="font-sans text-xs text-ink/60 mt-0.5">
            Platform revenue, commission earnings, pending settlements, escrow balance and payouts
          </p>
        </div>

        <button
          onClick={() => (onSelectTab ? onSelectTab('settlements') : navigate('/finance?tab=settlements'))}
          className="px-4 py-2 rounded-full bg-primary text-white font-sans text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-secondary"
        >
          <HandCoins className="w-3.5 h-3.5" />
          <span>Manage Settlements</span>
        </button>
      </div>

      {/* 1. 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 min-[1280px]:grid-cols-4 gap-3">
        {/* Card 1: Total Revenue (Primary Dark) */}
        <div className="p-4 rounded-[22px] bg-primary text-white flex flex-col justify-between h-[126px] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-medium text-white/80">Total Revenue MTD</span>
            <DollarSign className="w-4 h-4 text-white/70" />
          </div>
          <div>
            <span className="font-heading text-2xl font-normal text-white leading-none block">
              ₹{totalRevenue.toLocaleString()}
            </span>
            <span className="font-sans text-[11px] text-white/60 mt-0.5 block">
              +14.2% MoM growth rate
            </span>
          </div>
          <HatchBar progress={78} colorScheme="secondary" height={8} />
        </div>

        {/* Card 2: Commission Earned (Secondary) */}
        <div className="p-4 rounded-[22px] bg-secondary text-white flex flex-col justify-between h-[126px] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-medium text-white/80">Commission Earned</span>
            <TrendingUp className="w-4 h-4 text-white/80" />
          </div>
          <div>
            <span className="font-heading text-2xl font-normal text-white leading-none block">
              ₹{commissionEarned.toLocaleString()}
            </span>
            <span className="font-sans text-[11px] text-white/70 mt-0.5 block">
              12.0% weighted take rate
            </span>
          </div>
          <HatchBar progress={65} colorScheme="white" height={8} />
        </div>

        {/* Card 3: Pending Settlements (Neutral) */}
        <div className="p-4 rounded-[22px] bg-neutral border border-primary/10 flex flex-col justify-between h-[126px]">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-medium text-ink/75">Pending Settlements</span>
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="font-heading text-2xl font-normal text-primary leading-none block">
              ₹{pendingSettlementTotal.toLocaleString()}
            </span>
            <span className="font-sans text-[11px] text-ink/60 mt-0.5 block">
              14 vendor batches awaiting release
            </span>
          </div>
          <HatchBar progress={52} colorScheme="primary" height={8} />
        </div>

        {/* Card 4: Refunds (White) */}
        <div className="p-4 rounded-[22px] bg-white border border-primary/15 shadow-sm flex flex-col justify-between h-[126px]">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-medium text-ink/75">Refunds Issued</span>
            <RotateCcw className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="font-heading text-2xl font-normal text-primary leading-none block">
              ₹{refundsTotal.toLocaleString()}
            </span>
            <span className="font-sans text-[11px] text-ink/60 mt-0.5 block">
              1.48% platform refund ratio
            </span>
          </div>
          <HatchBar progress={18} colorScheme="neutral" height={8} />
        </div>
      </div>

      {/* 2. Middle Section: Revenue vs Commission Chart + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1.2fr)] gap-5">
        {/* 2A: Revenue vs Commission Bar Chart */}
        <div className="p-5 rounded-[24px] bg-white border border-primary/10 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-base font-normal text-ink">Revenue vs Commission</h2>
              <p className="font-sans text-xs text-ink/60">
                Monthly gross merchandise volume compared with platform net take
              </p>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 text-xs font-sans">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-primary" />
                <span className="text-ink/75">Gross Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-secondary relative overflow-hidden">
                  <span className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%)] bg-[length:6px_6px]" />
                </span>
                <span className="text-ink/75">Commission</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Graphic */}
          <div className="pt-4 pb-2 border-t border-primary/10">
            <div className="h-[220px] flex items-end justify-between gap-3 px-2">
              {MONTHLY_DATA.map((d) => {
                const revHeight = (d.revenue / maxRev) * 100;
                const commHeight = ((d.commission * 6) / maxRev) * 100; // scaled for visibility

                return (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1.5 h-[175px]">
                      {/* Revenue Bar */}
                      <div
                        style={{ height: `${revHeight}%` }}
                        className="w-1/2 max-w-[28px] rounded-t-md bg-primary transition-all duration-300 group-hover:opacity-90 relative"
                      >
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white text-[10px] font-sans px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                          ₹{d.revenue}k
                        </div>
                      </div>

                      {/* Commission Bar with Hatch Pattern */}
                      <div
                        style={{ height: `${commHeight}%` }}
                        className="w-1/2 max-w-[28px] rounded-t-md bg-secondary transition-all duration-300 group-hover:opacity-90 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.35)_50%,transparent_75%)] bg-[length:6px_6px]" />
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-secondary text-white text-[10px] font-sans px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                          ₹{d.commission}k
                        </div>
                      </div>
                    </div>

                    <span className="font-sans text-xs font-medium text-ink/70">
                      {d.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-neutral/60 border border-primary/10 flex items-center justify-between text-xs font-sans text-ink/75">
            <span>Escrow Settlement Accuracy: <strong className="text-primary font-medium">99.8%</strong></span>
            <span>Avg Payout Settlement Cycle: <strong className="text-primary font-medium">T+2 Days</strong></span>
          </div>
        </div>

        {/* 2B: Recent Finance Activity Card */}
        <div className="p-5 rounded-[24px] bg-white border border-primary/10 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-base font-normal text-ink">Recent Finance Activity</h2>
              <p className="font-sans text-xs text-ink/60">Last 5 ledger mutations recorded</p>
            </div>
            <History className="w-4 h-4 text-secondary" />
          </div>

          <div className="space-y-2.5 flex-1">
            {recentPaymentLogs.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-xl border border-primary/10 bg-neutral/30 hover:bg-neutral/60 transition-colors text-xs font-sans"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-primary text-[11px] truncate max-w-[140px]">
                    {log.target}
                  </span>
                  <span className="text-[10px] text-ink/50">{log.timestamp.split(',')[1] || log.timestamp}</span>
                </div>
                <p className="text-ink/80 text-[11px] mt-1 line-clamp-1">
                  {log.details}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/audit-logs?tab=Payment')}
            className="w-full py-2 rounded-full border border-primary/20 text-primary font-sans text-xs font-medium hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <span>View all in Audit Logs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Bottom Section: Pending Settlements List */}
      <div className="p-5 rounded-[24px] bg-white border border-primary/10 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-base font-normal text-ink">Pending Merchant Settlements</h2>
            <p className="font-sans text-xs text-ink/60">
              Approved bi-weekly payout cycles queued for NEFT/IMPS nodal batch disbursement
            </p>
          </div>

          <button
            onClick={() => (onSelectTab ? onSelectTab('settlements') : navigate('/finance?tab=settlements'))}
            className="px-4 py-2 rounded-full bg-primary text-white font-sans text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <span>Process</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pending Settlements Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-primary/10 text-ink/60 text-[11px]">
                <th className="py-2.5 px-3 font-medium">Merchant Party</th>
                <th className="py-2.5 px-3 font-medium">Settlement Period</th>
                <th className="py-2.5 px-3 font-medium">Delivered Orders</th>
                <th className="py-2.5 px-3 font-medium">Gross GMV</th>
                <th className="py-2.5 px-3 font-medium">Commission (15%)</th>
                <th className="py-2.5 px-3 font-medium">Net Payout</th>
                <th className="py-2.5 px-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingSettlements.map((setl) => (
                <tr key={setl.id} className="border-b border-primary/5 hover:bg-neutral/40 transition-colors">
                  <td className="py-3 px-3 font-medium text-primary">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                      <span>{setl.party}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-ink/70">{setl.period}</td>
                  <td className="py-3 px-3 text-ink/80">{setl.orders} orders</td>
                  <td className="py-3 px-3 text-ink font-medium">₹{setl.gross.toLocaleString()}</td>
                  <td className="py-3 px-3 text-secondary font-medium">-₹{setl.commission.toLocaleString()}</td>
                  <td className="py-3 px-3 font-bold text-primary">₹{setl.net.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => (onSelectTab ? onSelectTab('settlements') : navigate('/finance?tab=settlements'))}
                      className="px-3 py-1 rounded-full bg-neutral text-primary border border-primary/20 hover:bg-primary hover:text-white transition-colors text-[11px] font-medium"
                    >
                      Process
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
