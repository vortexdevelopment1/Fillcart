import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { SegmentedBar } from '../common/SegmentedBar';

export const PendingVerificationsCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate('/document-verification')}
      title="Delivery Rate"
      className="h-[135px] flex flex-col justify-between"
    >
      <div className="flex items-baseline justify-between mt-0.5 mb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold text-[#222026] tracking-tight leading-none">
            91.7%
          </span>
          <Badge variant="soft-amber" icon="up">
            +0.3%
          </Badge>
        </div>
        <span className="text-xs text-[#8A8A93] font-medium">
          8.3% pending
        </span>
      </div>

      <div className="mt-auto w-full">
        <SegmentedBar
          totalTicks={48}
          filledCount={44} // 44 out of 48 = 91.7%
        />
      </div>
    </Card>
  );
};
