import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { SegmentedBar } from '../common/SegmentedBar';
import { TrendingUp } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const PendingVerificationsCard: React.FC = () => {
  const navigate = useNavigate();
  const { dashboard } = useAppStore();
  const totalUsers = dashboard.customers + dashboard.vendors + dashboard.riders;

  return (
    <Card
      onClick={() => navigate('/vendors')}
      title="Total Users"
      className="h-auto min-h-[125px] xs:min-h-[130px] flex flex-col justify-between cursor-pointer hover:border-secondary transition-all w-full max-w-full min-w-0 overflow-hidden"
    >
      {/* Number Row */}
      <div className="flex flex-wrap items-baseline justify-between gap-2 mt-2 mb-0">
        <div className="flex items-baseline gap-2">
          {/* Arbutus Slab 24px on mobile, 28px on larger screens, weight 400 */}
          <span className="font-heading text-[24px] xs:text-[28px] font-normal text-ink leading-[1.1] tracking-normal">
            {totalUsers.toLocaleString()}
          </span>
          {/* Delta badge: PRIMARY background, white text */}
          <span className="inline-flex items-center gap-1 font-sans text-[10px] font-normal px-2 py-[2px] rounded-[8px] bg-primary text-white leading-none whitespace-nowrap">
            <TrendingUp className="w-2.5 h-2.5 text-white" />
            +14.2% this month
          </span>
        </div>
        {/* Poppins 12px, weight 400 */}
        <span className="font-sans text-[11px] font-normal text-ink/60 leading-none whitespace-nowrap">
          {dashboard.customers.toLocaleString()} cust · {dashboard.vendors} vend · {dashboard.riders} rdr
        </span>
      </div>

      {/* Progress Bar (40 ticks on < 480px, 72 ticks on >= 480px, margin-top 12px) */}
      <div className="mt-3 w-full">
        <div className="block xs:hidden">
          <SegmentedBar totalTicks={40} filledCount={35} darkMarkerCount={3} />
        </div>
        <div className="hidden xs:block">
          <SegmentedBar totalTicks={72} filledCount={64} darkMarkerCount={5} />
        </div>
      </div>
    </Card>
  );
};
