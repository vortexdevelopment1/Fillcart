import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

interface RiderMonthBar {
  label: string;
  heightPercent: number; // percentage of bar area
  isHatched?: boolean;
}

const riderBars: RiderMonthBar[] = [
  { label: 'J', heightPercent: 90, isHatched: false },
  { label: 'F', heightPercent: 48, isHatched: false },
  { label: 'M', heightPercent: 76, isHatched: false },
  { label: 'A', heightPercent: 36, isHatched: false },
  { label: 'M', heightPercent: 50, isHatched: false },
  { label: 'J', heightPercent: 80, isHatched: false },
  { label: 'J', heightPercent: 62, isHatched: true }, // last bar hatched white on yellow
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
        backgroundImage: 'linear-gradient(145deg, #DE9E00 0%, #F5B800 40%, #EA9F00 75%, #D68F00 100%)',
      }}
    >
      {/* Subtle wave contours overlay matching reference */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 320 260">
          <path
            d="M-20,40 C80,60 140,20 240,45 C280,55 310,40 340,30 L340,260 L-20,260 Z"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <path
            d="M-20,90 C70,110 160,80 250,105 C290,115 320,100 340,90"
            fill="none"
            stroke="white"
            strokeWidth="1.2"
            opacity="0.4"
          />
          <path
            d="M-20,150 C90,170 170,140 260,165 C300,175 320,160 340,150"
            fill="none"
            stroke="white"
            strokeWidth="1.2"
            opacity="0.3"
          />
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
        <h3 className="text-[15px] font-semibold text-white/95">Contacts</h3>
        <div className="text-3xl font-semibold tracking-tight text-white mt-0.5 mb-1.5 leading-none">
          3,241
        </div>
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-medium text-white border border-white/10">
          <span>192 New in July</span>
          <TrendingUp className="w-3 h-3 text-white inline" />
          <span>12%</span>
        </div>
      </div>

      {/* 7 Pill Bars: 24px wide, border-radius 999px (full pill), last bar hatched */}
      <div className="relative z-10 h-[48%] min-h-[95px] flex flex-col justify-end mt-auto">
        <div className="flex-1 flex items-end justify-between gap-1 px-1">
          {riderBars.map((bar, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center h-full min-h-0">
              {/* Bar Area */}
              <div className="w-full flex-1 flex items-end justify-center min-h-0">
                <div
                  className="w-[24px] rounded-full transition-all duration-300"
                  style={{
                    height: `${bar.heightPercent}%`,
                    backgroundColor: bar.isHatched ? 'rgba(255, 255, 255, 0.28)' : '#FFFFFF',
                    backgroundImage: bar.isHatched
                      ? 'repeating-linear-gradient(45deg, rgba(255,255,255,0.92) 0, rgba(255,255,255,0.92) 1.5px, transparent 1.5px, transparent 5px)'
                      : 'none',
                    boxShadow: bar.isHatched ? 'none' : '0 2px 6px rgba(0,0,0,0.06)',
                  }}
                />
              </div>

              {/* Month Label directly under each bar */}
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
