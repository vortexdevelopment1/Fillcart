import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { SegmentedBar } from '../common/SegmentedBar';

export const VendorsCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate('/vendors')}
      title="Campaigns"
      className="h-[135px] flex flex-col justify-between"
    >
      <div className="flex items-baseline justify-between mt-0.5 mb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold text-[#222026] tracking-tight leading-none">
            25
          </span>
          <Badge variant="soft-amber">
            4 active
          </Badge>
        </div>
      </div>

      <div className="mt-auto w-full">
        <SegmentedBar
          totalTicks={48}
          filledCount={15} // approx 31% filled like reference Campaigns
        />
      </div>
    </Card>
  );
};
