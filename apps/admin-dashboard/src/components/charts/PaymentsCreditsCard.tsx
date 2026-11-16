import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { Plus, CreditCard } from 'lucide-react';

export const PaymentsCreditsCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate('/payments')}
      className="h-[110px] flex-shrink-0 flex flex-col justify-between"
    >
      <div className="flex items-center gap-1.5 text-black/55">
        <CreditCard className="w-3.5 h-3.5 text-black/55" />
        <span className="text-[16px] font-normal text-black">Credits</span>
      </div>

      <div className="flex items-baseline justify-between mt-auto">
        <div className="flex items-baseline gap-2">
          {/* 34px, weight 400 */}
          <div className="text-[34px] font-normal text-black leading-none tracking-normal">
            $2,450
          </div>
          <div className="text-[13px] text-black/55 font-normal">
            $350 Used
          </div>
        </div>

        {/* Round Black Plus Button (BLACK bg, WHITE icon) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate('/payments');
          }}
          className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-black/80 transition-all hover:scale-105 shadow-sm flex-shrink-0"
          title="Add Funds"
          aria-label="Add transaction"
        >
          <Plus className="w-4 h-4 stroke-[2.5] text-white" />
        </button>
      </div>
    </Card>
  );
};
