import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Percent } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const PaymentsCreditsCard: React.FC = () => {
  const navigate = useNavigate();
  const { dashboard } = useAppStore();

  return (
    <div
      onClick={() => navigate('/payments')}
      className="
        bg-white rounded-[24px] p-3.5 sm:p-4 xl:p-[14px_16px] border border-primary/10
        shadow-[0_1px_2px_rgba(18,55,71,0.04),0_8px_24px_rgba(18,55,71,0.05)]
        hover:shadow-[0_2px_4px_rgba(18,55,71,0.06),0_12px_28px_rgba(18,55,71,0.08)]
        hover:border-secondary transition-all duration-200 relative cursor-pointer
        flex flex-col justify-between overflow-hidden w-full max-w-full min-w-0
        h-auto min-h-[96px] xs:min-h-[104px] xl:min-h-0 xl:h-full xl:flex-[16] select-none flex-shrink-0
      "
    >
      {/* 2x2 Grid of 4 Dots */}
      <div className="absolute top-3.5 right-4 p-0 select-none pointer-events-none">
        <div className="grid grid-cols-2 gap-[3px]">
          <div className="w-[3px] h-[3px] rounded-full bg-ink/25" />
          <div className="w-[3px] h-[3px] rounded-full bg-ink/25" />
          <div className="w-[3px] h-[3px] rounded-full bg-ink/25" />
          <div className="w-[3px] h-[3px] rounded-full bg-ink/25" />
        </div>
      </div>

      {/* Row 1: Icon + Title "Commission" */}
      <div className="flex items-center gap-1.5 text-ink/60">
        <Percent className="w-4 h-4 text-ink/60 stroke-[1.8]" />
        <span className="font-sans text-[13px] font-normal text-ink leading-none">
          Commission
        </span>
      </div>

      {/* Row 2: Amount (₹29,400) + Round button on one row, ~12% take rate under amount */}
      <div className="flex items-center justify-between mt-auto pt-2">
        <div>
          <div className="font-heading text-[clamp(20px,5.5vw,24px)] xl:text-[24px] font-normal text-ink leading-none tracking-normal">
            ₹{dashboard.commissionToday.toLocaleString()}
          </div>
          <div className="font-sans text-[10px] text-ink/60 font-normal leading-none mt-1">
            ~12% take rate
          </div>
        </div>

        {/* Round Button (28px) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate('/payments');
          }}
          className="
            w-7 h-7 rounded-full bg-black text-white
            flex items-center justify-center hover:opacity-85 transition-opacity
            shadow-sm flex-shrink-0 cursor-pointer
          "
          title="Open settlements"
          aria-label="Open settlements"
        >
          <ArrowUpRight className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    </div>
  );
};
