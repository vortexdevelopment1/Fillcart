import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CreditCard } from 'lucide-react';

export const PaymentsCreditsCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate('/payments')}
      className="
        bg-white rounded-[24px] p-[14px_16px] border border-black/[0.06]
        shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.05)]
        hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_12px_28px_rgba(0,0,0,0.08)]
        hover:border-black/[0.12] transition-all duration-200 relative cursor-pointer
        flex flex-col justify-between h-full min-h-0 xl:flex-[16] select-none
      "
    >
      {/* 2x2 Grid of 4 Dots (top-right, black at 25% opacity) */}
      <div className="absolute top-3.5 right-4 p-0 select-none pointer-events-none">
        <div className="grid grid-cols-2 gap-[3px]">
          <div className="w-[3px] h-[3px] rounded-full bg-black/25" />
          <div className="w-[3px] h-[3px] rounded-full bg-black/25" />
          <div className="w-[3px] h-[3px] rounded-full bg-black/25" />
          <div className="w-[3px] h-[3px] rounded-full bg-black/25" />
        </div>
      </div>

      {/* Row 1: Icon (16px, black at 60%) + Title "Credits" (Poppins 13px, weight 400) */}
      <div className="flex items-center gap-1.5 text-black/60">
        <CreditCard className="w-4 h-4 text-black/60 stroke-[1.8]" />
        <span className="font-sans text-[13px] font-normal text-black leading-none">
          Credits
        </span>
      </div>

      {/* Row 2: Amount ($2,450 Poppins 26px) + Subtitle ($350 Used Poppins 10px, black 50%) + 28px Plus Button */}
      <div className="flex items-baseline justify-between mt-auto">
        <div className="flex items-baseline gap-2">
          <div className="font-sans text-[26px] font-normal text-black leading-none tracking-normal">
            $2,450
          </div>
          <div className="font-sans text-[10px] text-black/50 font-normal leading-none">
            $350 Used
          </div>
        </div>

        {/* Round Black Plus Button (28px, white plus icon) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate('/payments');
          }}
          className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center hover:bg-black/80 transition-all hover:scale-105 shadow-sm flex-shrink-0"
          title="Add Funds"
          aria-label="Add transaction"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2] text-white" />
        </button>
      </div>
    </div>
  );
};
