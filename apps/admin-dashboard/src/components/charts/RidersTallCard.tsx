import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface RiderMonthBar {
  label: string;
  heightPercent: number;
  isHatched?: boolean;
}

const riderBars: RiderMonthBar[] = [
  { label: 'J', heightPercent: 62, isHatched: false },
  { label: 'F', heightPercent: 100, isHatched: false },
  { label: 'M', heightPercent: 84, isHatched: false },
  { label: 'A', heightPercent: 52, isHatched: false },
  { label: 'A', heightPercent: 40, isHatched: false },
  { label: 'M', heightPercent: 92, isHatched: false },
  { label: 'J', heightPercent: 66, isHatched: true },
];

export const RidersTallCard: React.FC = () => {
  const navigate = useNavigate();
  const { dashboard } = useAppStore();

  return (
    <div
      onClick={() => navigate('/riders')}
      className="
        rounded-[24px] p-[16px_16px_14px] text-white relative cursor-pointer
        shadow-[0_1px_2px_rgba(18,55,71,0.04),0_8px_24px_rgba(18,55,71,0.05)]
        hover:shadow-[0_2px_4px_rgba(18,55,71,0.06),0_12px_28px_rgba(18,55,71,0.08)]
        transition-all duration-300 flex flex-col justify-between overflow-hidden
        border border-white/20 bg-primary h-full min-h-0 xl:flex-[52] select-none
      "
    >
      {/* 2 Smooth SVG wave lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 300 240"
        fill="none"
      >
        <path
          d="M-10,85 C60,105 140,70 220,95 C260,105 285,90 310,80"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1"
        />
        <path
          d="M-10,145 C70,165 150,130 230,155 C270,165 290,150 310,140"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1"
        />
      </svg>

      {/* 2x2 Grid of 4 Dots */}
      <div className="absolute top-4 right-4 p-0 select-none pointer-events-none">
        <div className="grid grid-cols-2 gap-[3px]">
          <div className="w-[3px] h-[3px] rounded-full bg-white/60" />
          <div className="w-[3px] h-[3px] rounded-full bg-white/60" />
          <div className="w-[3px] h-[3px] rounded-full bg-white/60" />
          <div className="w-[3px] h-[3px] rounded-full bg-white/60" />
        </div>
      </div>

      {/* Top Header & Stats */}
      <div className="relative z-10 flex-shrink-0">
        <h3 className="font-sans text-[13px] font-normal text-white leading-tight">Riders</h3>
        <div className="font-heading text-[28px] font-normal tracking-normal text-white mt-1 mb-1.5 leading-none">
          {dashboard.riders.toLocaleString()}
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full bg-white/20 font-sans text-[10px] font-normal text-white leading-none">
          <span>{dashboard.activeDeliveries} on delivery</span>
          <TrendingUp className="w-2.5 h-2.5 text-white inline" />
          <span>+18%</span>
        </div>
      </div>

      {/* 7 Bars Area */}
      <div className="relative z-10 h-[62%] w-full flex items-end justify-between gap-1.5 mt-auto">
        {riderBars.map((bar, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center h-full min-h-0 justify-end">
            {bar.isHatched && (
              <div className="w-[5px] h-[5px] rounded-full bg-white mb-1.5 flex-shrink-0 shadow-xs" />
            )}

            <div
              className={`w-full max-w-[30px] min-w-[20px] rounded-full overflow-hidden transition-all duration-300 flex-shrink-0 ${
                bar.isHatched
                  ? 'hatch-white border border-white/70 shadow-xs'
                  : 'bg-white'
              }`}
              style={{
                height: `${bar.heightPercent}%`,
                borderRadius: '9999px',
              }}
            />

            <span className="font-sans text-[10px] font-normal text-white/85 mt-1.5 block leading-none select-none">
              {bar.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
