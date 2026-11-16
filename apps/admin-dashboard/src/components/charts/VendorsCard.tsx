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
      {/* Number Row */}
      <div className="flex items-baseline justify-between mt-3 mb-0">
        <div className="flex items-baseline gap-2">
          {/* Arbutus Slab 28px, weight 400, line-height 1.1 */}
          <span className="font-heading text-[28px] font-normal text-black leading-[1.1] tracking-normal">
            25
          </span>
          {/* Badge: Poppins 10px, weight 400, background SECONDARY #FCE8A3, text #000000 */}
          <span className="inline-flex items-center font-sans text-[10px] font-normal px-2 py-[2px] rounded-[8px] bg-secondary text-black leading-none">
            4 active
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3.5 w-full">
        <SegmentedBar
          totalTicks={72}
          filledCount={18}
          darkMarkerCount={5}
        />
      </div>
    </Card>
  );
};
