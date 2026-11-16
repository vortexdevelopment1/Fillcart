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
        bg-black text-white rounded-[20px] p-5
        shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.05)]
        hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_12px_28px_rgba(0,0,0,0.08)]
        transition-all duration-300 relative cursor-pointer border border-white/10
        flex flex-col justify-between overflow-hidden flex-1 min-h-[160px]
      "
    >
      {/* 2x2 Grid of 4 Dots (top-right at 20px/20px, white at 40% opacity) */}
      <div className="absolute top-5 right-5 p-0 select-none pointer-events-none">
        <div className="grid grid-cols-2 gap-[3px]">
          <div className="w-[3px] h-[3px] rounded-full bg-white/40" />
          <div className="w-[3px] h-[3px] rounded-full bg-white/40" />
          <div className="w-[3px] h-[3px] rounded-full bg-white/40" />
          <div className="w-[3px] h-[3px] rounded-full bg-white/40" />
        </div>
      </div>

      {/* Top Header */}
      <div className="flex items-center justify-between pr-5">
        <h3 className="text-[16px] font-normal text-white leading-tight">Texts Sent</h3>
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-[11px] text-white/70 bg-white/10 px-2.5 py-0.5 rounded-full hover:text-white"
        >
          <span>All time</span>
          <ChevronDown className="w-3 h-3 text-white/70" />
        </div>
      </div>

      {/* Numbers */}
      <div className="mt-3 mb-1">
        <div className="text-[34px] font-normal text-white tracking-normal leading-none">
          95,215
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[12px] text-white/60">1,243 today</span>
          <div className="inline-flex items-center gap-0.5 px-1.5 py-[2px] rounded-[6px] bg-white/15 text-[10px] font-normal text-white leading-none">
            <TrendingUp className="w-2.5 h-2.5 inline text-white" />
            <span>51%</span>
          </div>
        </div>
      </div>

      {/* Line Chart: line = PRIMARY #F5B800, area fill = PRIMARY to transparent */}
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
