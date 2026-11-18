import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { SegmentedBar } from '../common/SegmentedBar';
import { useAppStore } from '../../store/useAppStore';

export const VendorsCard: React.FC = () => {
  const navigate = useNavigate();
  const { dashboard } = useAppStore();

  return (
    <Card
      onClick={() => navigate('/orders')}
      title="Orders Today"
      className="h-[135px] flex flex-col justify-between cursor-pointer hover:border-secondary transition-all"
    >
      {/* Number Row */}
      <div className="flex items-baseline justify-between mt-3 mb-0">
        <div className="flex items-baseline gap-2">
          {/* Arbutus Slab 28px, weight 400 */}
          <span className="font-heading text-[28px] font-normal text-ink leading-[1.1] tracking-normal">
            {dashboard.ordersToday.toLocaleString()}
          </span>
          {/* Badge: PRIMARY background, white text */}
          <span className="inline-flex items-center font-sans text-[10px] font-normal px-2 py-[2px] rounded-[8px] bg-primary text-white leading-none">
            {dashboard.activeDeliveries} active deliveries
          </span>
        </div>
        <span className="font-sans text-[11px] font-normal text-ink/60 leading-none">
          Live fulfillment
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mt-3.5 w-full">
        <SegmentedBar totalTicks={72} filledCount={52} darkMarkerCount={5} />
      </div>
    </Card>
  );
};
