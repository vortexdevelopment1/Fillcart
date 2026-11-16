import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { SegmentedBar } from '../common/SegmentedBar';

export const VendorsCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate('/vendors')}
      title="Campaigns"
      className="h-[135px] flex flex-col justify-between"
    >
      {/* Number Row: 12px from title */}
      <div className="flex items-baseline justify-between mt-3 mb-0">
        <div className="flex items-baseline gap-2">
          {/* 34px, weight 400, line-height 1 */}
          <span className="text-[34px] font-normal text-[#222026] leading-none tracking-normal">
            25
          </span>
          {/* Small Badge: 11px, weight 400, pad 2px 8px, rad 8px, bg #FCE8A3, text #8A6500 */}
          <span className="inline-flex items-center text-[11px] font-normal px-2 py-[2px] rounded-[8px] bg-[#FCE8A3] text-[#8A6500] leading-none">
            4 active
          </span>
        </div>
      </div>

      {/* Progress Bar: 14px from number row */}
      <div className="mt-3.5 w-full">
        <SegmentedBar
          totalTicks={72}
          filledCount={18} // ~25% of 72 = 18 ticks (tiny filled portion like reference)
          darkMarkerCount={4}
        />
      </div>
    </Card>
  );
};
