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
      title="Pending Verifications"
      className="flex flex-col justify-between"
    >
      <div className="flex items-baseline justify-between mt-2 mb-4">
        <div className="flex items-baseline gap-2.5">
          <span className="text-3xl font-semibold text-[#222026] tracking-tight">
            {verifiedRate}%
          </span>
          <Badge variant="soft-amber" icon="up">
            +0.3%
          </Badge>
        </div>
        <span className="text-xs text-[#8A8A93] font-medium">
          {pendingPercentage}% pending ({stats.pending} awaiting)
        </span>
      </div>

      <div className="mt-2">
        <SegmentedBar
          totalTicks={46}
          filledRatio={stats.approved / total || 0.78}
          color="#F5B800"
          unfilledColor="#ECECF0"
          height={22}
        />
      </div>
    </Card>
  );
};
