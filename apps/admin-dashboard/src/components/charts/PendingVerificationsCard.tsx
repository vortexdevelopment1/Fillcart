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
      className="h-[135px] flex flex-col justify-between cursor-pointer hover:border-secondary transition-all"
    >
      {/* Number Row */}
      <div className="flex items-baseline justify-between mt-3 mb-0">
        <div className="flex items-baseline gap-2">
          {/* Arbutus Slab 28px, weight 400 */}
          <span className="font-heading text-[28px] font-normal text-ink leading-[1.1] tracking-normal">
            {totalUsers.toLocaleString()}
          </span>
          {/* Delta badge: PRIMARY background, white text */}
          <span className="inline-flex items-center gap-1 font-sans text-[10px] font-normal px-2 py-[2px] rounded-[8px] bg-primary text-white leading-none">
            <TrendingUp className="w-2.5 h-2.5 text-white" />
            +14.2% this month
          </span>
        </div>
        {/* Poppins 12px, weight 400 */}
        <span className="font-sans text-[11px] font-normal text-ink/60 leading-none">
          {dashboard.customers.toLocaleString()} cust · {dashboard.vendors} vend · {dashboard.riders} rdr
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mt-3.5 w-full">
        <SegmentedBar totalTicks={72} filledCount={64} darkMarkerCount={5} />
      </div>
    </Card>
  );
};
