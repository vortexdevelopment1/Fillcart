import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { Plus, CreditCard } from 'lucide-react';
import { paymentsSummary } from '../../data/mockDashboardData';

export const PaymentsCreditsCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate('/payments')}
      className="flex flex-col justify-between"
    >
      <div className="flex items-center gap-2 text-[#8A8A93] mb-3">
        <CreditCard className="w-4 h-4 text-[#8A8A93]" />
        <span className="text-xs font-medium">Payments & Statements</span>
      </div>

      <div className="flex items-center justify-between mt-1">
        <div>
          <div className="text-2xl lg:text-3xl font-semibold text-[#222026] tracking-tight">
            {paymentsSummary.total}
          </div>
          <div className="text-xs text-[#8A8A93] mt-1 font-medium">
            {paymentsSummary.subtext}
          </div>
        </div>

        {/* Round Black Plus Button (exact replica of reference) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate('/payments');
          }}
          className="w-10 h-10 rounded-full bg-[#222026] text-white flex items-center justify-center hover:bg-[#36343C] transition-all hover:scale-105 shadow-md flex-shrink-0"
          title="Create Payout / Add Funds"
          aria-label="Add transaction"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </Card>
  );
};
