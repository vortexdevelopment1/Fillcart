import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { SegmentedBar } from '../common/SegmentedBar';
import { TrendingUp } from 'lucide-react';

export const PendingVerificationsCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate('/document-verification')}
      title="Delivery Rate"
      className="h-[135px] flex flex-col justify-between"
    >
      {/* Number Row */}
      <div className="flex items-baseline justify-between mt-3 mb-0">
        <div className="flex items-baseline gap-2">
          {/* Arbutus Slab 28px, weight 400, line-height 1.1 */}
          <span className="font-heading text-[28px] font-normal text-black leading-[1.1] tracking-normal">
            91.7%
          </span>
          {/* Badge: Poppins 10px, weight 400, background SECONDARY #FCE8A3, text #000000 */}
          <span className="inline-flex items-center gap-1 font-sans text-[10px] font-normal px-2 py-[2px] rounded-[8px] bg-secondary text-black leading-none">
            <TrendingUp className="w-2.5 h-2.5 text-black" />
            +0.3%
          </span>
        </div>
        {/* Poppins 12px, weight 400 */}
        <span className="font-sans text-[12px] font-normal text-black leading-none">
          8.3% pending
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mt-3.5 w-full">
        <SegmentedBar
          totalTicks={72}
          filledCount={66}
          darkMarkerCount={5}
        />
      </div>
    </Card>
  );
};
