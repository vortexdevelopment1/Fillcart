import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { SegmentedBar } from '../common/SegmentedBar';
import { vendorsStats } from '../../data/mockDashboardData';

export const VendorsCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate('/vendors')}
      title="Vendors"
      className="flex flex-col justify-between"
    >
      <div className="flex items-baseline justify-between mt-2 mb-4">
        <div className="flex items-baseline gap-2.5">
          <span className="text-3xl font-semibold text-[#222026] tracking-tight">
            {vendorsStats.count}
          </span>
          <Badge variant="soft-amber">
            {vendorsStats.badge}
          </Badge>
        </div>
      </div>

      <div className="mt-2">
        <SegmentedBar
          totalTicks={46}
          filledRatio={0.35}
          color="#F5B800"
          unfilledColor="#ECECF0"
          height={22}
        />
      </div>
    </Card>
  );
};
