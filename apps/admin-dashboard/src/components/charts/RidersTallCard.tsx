import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { ridersTallStats } from '../../data/mockDashboardData';

export const RidersTallCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate('/riders')}
      className="
        rounded-[26px] p-6 text-white relative cursor-pointer
        shadow-card hover:shadow-card-hover transition-all duration-300
        flex flex-col justify-between overflow-hidden
        bg-gradient-to-br from-[#E5A500] via-[#F5B800] to-[#E09E00]
        border border-white/20
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
      <div className="absolute top-5 right-5 text-white/50 p-1">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <circle cx="3" cy="2" r="1.2" />
          <circle cx="3" cy="6" r="1.2" />
          <circle cx="3" cy="10" r="1.2" />
          <circle cx="9" cy="2" r="1.2" />
          <circle cx="9" cy="6" r="1.2" />
          <circle cx="9" cy="10" r="1.2" />
        </svg>
      </div>

      {/* Top Header & Stats */}
      <div className="relative z-10 mb-6">
        <h3 className="text-sm font-medium text-white/90">Riders</h3>
        <div className="text-3xl font-semibold tracking-tight text-white mt-1 mb-2">
          {ridersTallStats.count}
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium text-white border border-white/10">
          <span>{ridersTallStats.badge}</span>
          <TrendingUp className="w-3 h-3 text-white inline" />
          <span>{ridersTallStats.change}</span>
        </div>
      </div>

      {/* 7 Pill Bars (J F M A M J J) */}
      <div className="relative z-10 pt-4">
        <div className="h-44 flex items-end justify-between gap-2.5 px-2">
          {ridersTallStats.bars.map((bar, idx) => {
            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
                {/* Pill bar */}
                <div
                  className={`w-full rounded-full transition-all duration-300 ${
                    bar.isHatched ? 'hatched-pattern-white border border-white/40' : 'bg-white shadow-sm'
                  }`}
                  style={{
                    height: `${bar.value}%`,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Month Labels */}
        <div className="flex justify-between gap-2.5 px-2 mt-3 text-center text-xs font-medium text-white/80">
          {ridersTallStats.bars.map((bar, idx) => (
            <span key={idx} className="flex-1 text-center">
              {bar.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
