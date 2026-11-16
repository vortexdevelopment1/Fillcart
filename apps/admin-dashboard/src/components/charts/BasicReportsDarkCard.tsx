import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, TrendingUp } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis } from 'recharts';
import { basicReportsData } from '../../data/mockDashboardData';

export const BasicReportsDarkCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate('/reports')}
      className="
        bg-[#222026] text-white rounded-[24px] p-5 shadow-card hover:shadow-card-hover
        transition-all duration-300 relative cursor-pointer border border-white/5
        flex flex-col justify-between overflow-hidden flex-1 min-h-[160px]
      "
    >
      {/* 6-dot drag handle in top right */}
      <div className="absolute top-4 right-4 text-white/40 p-1">
        <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor">
          <circle cx="3" cy="2" r="1.2" />
          <circle cx="3" cy="6" r="1.2" />
          <circle cx="3" cy="10" r="1.2" />
          <circle cx="9" cy="2" r="1.2" />
          <circle cx="9" cy="6" r="1.2" />
          <circle cx="9" cy="10" r="1.2" />
        </svg>
      </div>

      {/* Top Header */}
      <div className="flex items-center justify-between pr-5">
        <h3 className="text-[15px] font-semibold text-white/90">Texts Sent</h3>
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-[11px] text-white/60 bg-white/10 px-2 py-0.5 rounded-full hover:text-white"
        >
          <span>All time</span>
          <ChevronDown className="w-3 h-3" />
        </div>
      </div>

      {/* Numbers */}
      <div className="mt-1 mb-1">
        <div className="text-3xl font-semibold text-white tracking-tight leading-none">
          95,215
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-white/60">1,243 today</span>
          <div className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-white/15 text-[10px] font-medium text-white">
            <TrendingUp className="w-2.5 h-2.5 inline" />
            <span>58%</span>
          </div>
        </div>
      </div>

      {/* Smooth Yellow Area Curve */}
      <div className="h-16 -mx-5 -mb-5 relative mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={basicReportsData.chartPoints}
            margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="yellowAreaGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F5B800" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#F5B800" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }}
              dy={-6}
            />
            <Area
              type="natural"
              dataKey="value"
              stroke="#F5B800"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#yellowAreaGlow)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
