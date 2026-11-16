import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

interface RiderMonthBar {
  label: string;
  heightPercent: number; // relative to ~45% container
  isHatched?: boolean;
}

const riderBars: RiderMonthBar[] = [
  { label: 'J', heightPercent: 88, isHatched: false },
  { label: 'F', heightPercent: 52, isHatched: false },
  { label: 'M', heightPercent: 74, isHatched: false },
  { label: 'A', heightPercent: 38, isHatched: false },
  { label: 'M', heightPercent: 50, isHatched: false },
  { label: 'J', heightPercent: 78, isHatched: false },
  { label: 'J', heightPercent: 62, isHatched: true }, // last bar hatched
];

export const RidersTallCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate('/riders')}
      className="
        rounded-[24px] p-5 text-white relative cursor-pointer
        shadow-card hover:shadow-card-hover transition-all duration-300
        flex flex-col justify-between overflow-hidden
        border border-white/20 flex-[1.4] min-h-[220px]
      "
      style={{
        backgroundImage: 'linear-gradient(135deg, #DE9E00 0%, #F5B800 45%, #F0B300 85%, #E29E00 100%)',
      }}
    >
      {/* Decorative subtle texture wave */}
      <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay">
        <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 300 300">
          <path d="M0,100 C150,200 150,0 300,100 L300,300 L0,300 Z" fill="white" />
        </svg>
      </div>

      {/* 6-dot drag handle in top right */}
      <div className="absolute top-4 right-4 text-white/50 p-1">
        <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor">
          <circle cx="3" cy="2" r="1.2" />
          <circle cx="3" cy="6" r="1.2" />
          <circle cx="3" cy="10" r="1.2" />
          <circle cx="9" cy="2" r="1.2" />
          <circle cx="9" cy="6" r="1.2" />
          <circle cx="9" cy="10" r="1.2" />
        </svg>
      </div>

      {/* Top Header & Stats */}
      <div className="relative z-10">
        <h3 className="text-[15px] font-semibold text-white/90">Contacts</h3>
        <div className="text-3xl font-semibold tracking-tight text-white mt-0.5 mb-1.5 leading-none">
          3,241
        </div>
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-medium text-white border border-white/10">
          <span>192 New in July</span>
          <TrendingUp className="w-3 h-3 text-white inline" />
          <span>12%</span>
        </div>
      </div>

      {/* 7 Pill Bars: Max height ~45% of card, 26px wide, labels directly under */}
      <div className="relative z-10 h-[45%] min-h-[90px] flex flex-col justify-end mt-auto">
        <div className="flex-1 flex items-end justify-between gap-1 sm:gap-2 px-1">
          {riderBars.map((bar, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center h-full min-h-0">
              {/* Bar Area */}
              <div className="w-full flex-1 flex items-end justify-center min-h-0">
                <div
                  className={`w-full max-w-[26px] rounded-full transition-all duration-300 ${
                    bar.isHatched
                      ? 'hatched-pattern-white border border-white/40'
                      : 'bg-white shadow-xs'
                  }`}
                  style={{
                    height: `${bar.heightPercent}%`,
                  }}
                />
              </div>

              {/* Month Label */}
              <span className="text-[11px] font-medium text-white/90 mt-1.5 block leading-none">
                {bar.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
