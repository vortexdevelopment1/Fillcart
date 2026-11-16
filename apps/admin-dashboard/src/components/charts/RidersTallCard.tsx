import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

interface RiderMonthBar {
  label: string;
  heightPercent: number;
  isHatched?: boolean;
}

const riderBars: RiderMonthBar[] = [
  { label: 'J', heightPercent: 76, isHatched: false },
  { label: 'F', heightPercent: 100, isHatched: false },
  { label: 'M', heightPercent: 90, isHatched: false },
  { label: 'A', heightPercent: 52, isHatched: false },
  { label: 'A', heightPercent: 36, isHatched: false },
  { label: 'M', heightPercent: 86, isHatched: false },
  { label: 'J', heightPercent: 48, isHatched: true },
];

export const RidersTallCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate('/riders')}
      className="
        rounded-[24px] p-[16px_16px_14px] text-white relative cursor-pointer
        shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.05)]
        hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_12px_28px_rgba(0,0,0,0.08)]
        transition-all duration-300 flex flex-col justify-between overflow-hidden
        border border-white/20 bg-primary h-full min-h-0 xl:flex-[52] select-none
      "
    >
      {/* 2 Smooth SVG wave lines spanning full card width, at ~35% and ~60% height */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 300 240"
        fill="none"
      >
        <path
          d="M-10,85 C60,105 140,70 220,95 C260,105 285,90 310,80"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1"
        />
        <path
          d="M-10,145 C70,165 150,130 230,155 C270,165 290,150 310,140"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1"
        />
      </svg>

      {/* 2x2 Grid of 4 Dots (top-right, white at 60% opacity) */}
      <div className="absolute top-4 right-4 p-0 select-none pointer-events-none">
        <div className="grid grid-cols-2 gap-[3px]">
          <div className="w-[3px] h-[3px] rounded-full bg-white/60" />
          <div className="w-[3px] h-[3px] rounded-full bg-white/60" />
          <div className="w-[3px] h-[3px] rounded-full bg-white/60" />
          <div className="w-[3px] h-[3px] rounded-full bg-white/60" />
        </div>
      </div>

      {/* Top Header & Stats (compact, no extra empty space) */}
      <div className="relative z-10 flex-shrink-0">
        <h3 className="font-sans text-[13px] font-normal text-white leading-tight">Riders</h3>
        <div className="font-sans text-[28px] font-normal tracking-normal text-white mt-1 mb-1.5 leading-none">
          3,241
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full bg-white/[0.28] font-sans text-[10px] font-normal text-white leading-none">
          <span>192 New in July</span>
          <TrendingUp className="w-2.5 h-2.5 text-white inline" />
          <span>12%</span>
        </div>
      </div>

      {/* 7 Bars Area: fills the bottom ~62% of the card */}
      <div className="relative z-10 h-[62%] w-full flex items-end justify-between gap-1.5 mt-auto">
        {riderBars.map((bar, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center h-full min-h-0 justify-end">
            {/* Tiny 4px white dot 6px above the hatched bar */}
            {bar.isHatched && (
              <div className="w-1 h-1 rounded-full bg-white mb-1.5 flex-shrink-0" />
            )}

            {/* Bar: flex:1, max-width 30px, min-width 20px, rounded-full */}
            <div
              className={`w-full max-w-[30px] min-w-[20px] rounded-full transition-all duration-300 flex-shrink-0 ${
                bar.isHatched ? 'hatch-white' : 'bg-white'
              }`}
              style={{
                height: `${bar.heightPercent}%`,
              }}
            />

            {/* Month Label: Poppins 10px, white 85%, 6px below */}
            <span className="font-sans text-[10px] font-normal text-white/85 mt-1.5 block leading-none select-none">
              {bar.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
