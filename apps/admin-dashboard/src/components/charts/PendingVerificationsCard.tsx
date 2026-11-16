import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { SegmentedBar } from '../common/SegmentedBar';
import { useVerification } from '../../context/VerificationContext';

export const PendingVerificationsCard: React.FC = () => {
  const navigate = useNavigate();
  const { stats } = useVerification();

  const total = stats.total > 0 ? stats.total : 10;
  const verifiedRate = ((stats.approved / total) * 100).toFixed(1);
  const pendingPercentage = (((stats.pending) / total) * 100).toFixed(1);

  return (
    <Card
      onClick={() => navigate('/document-verification')}
      title="Delivery Rate"
      className="h-[135px] flex flex-col justify-between"
    >
      <div className="flex items-baseline justify-between mt-1 mb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold text-[#222026] tracking-tight leading-none">
            {verifiedRate}%
          </span>
          <Badge variant="soft-amber" icon="up">
            +0.3%
          </Badge>
        </div>
        <span className="text-xs text-[#8A8A93] font-medium">
          {pendingPercentage}% pending
        </span>
      </div>

      <div className="mt-auto">
        <SegmentedBar
          totalTicks={40}
          filledRatio={stats.approved / total || 0.78}
          color="#F5B800"
          unfilledColor="#ECECF0"
          height={22}
          gap={3}
        />
      </div>
    </Card>
  );
};
