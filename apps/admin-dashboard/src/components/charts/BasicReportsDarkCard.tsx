import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, TrendingUp } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis } from 'recharts';
import { useAppStore } from '../../store/useAppStore';

const revenuePoints = [
  { label: '1 Jul', value: 48 },
  { label: '5 Jul', value: 62 },
  { label: '8 Jul', value: 38 },
  { label: '12 Jul', value: 16 },
  { label: '16 Jul', value: 12 },
  { label: '20 Jul', value: 42 },
  { label: '25 Jul', value: 80 },
];

export const BasicReportsDarkCard: React.FC = () => {
  const navigate = useNavigate();
  const { dashboard } = useAppStore();

  return (
    <div
      onClick={() => navigate('/reports')}
      className="
        bg-ink text-white rounded-[24px] p-4
        shadow-[0_1px_2px_rgba(18,55,71,0.04),0_8px_24px_rgba(18,55,71,0.05)]
        hover:shadow-[0_2px_4px_rgba(18,55,71,0.06),0_12px_28px_rgba(18,55,71,0.08)]
        transition-all duration-300 relative cursor-pointer border border-white/10
        flex flex-col justify-between overflow-hidden h-full min-h-0 xl:flex-[32] select-none
      "
    >
      {/* 2x2 Grid of 4 Dots */}
      <div className="absolute top-4 right-4 p-0 select-none pointer-events-none">
        <div className="grid grid-cols-2 gap-[3px]">
          <div className="w-[3px] h-[3px] rounded-full bg-white/40" />
          <div className="w-[3px] h-[3px] rounded-full bg-white/40" />
          <div className="w-[3px] h-[3px] rounded-full bg-white/40" />
          <div className="w-[3px] h-[3px] rounded-full bg-white/40" />
        </div>
      </div>

      {/* Top Header */}
      <div className="flex items-center justify-between pr-5 flex-shrink-0">
        <h3 className="font-sans text-[13px] font-normal text-white leading-tight">Revenue</h3>
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 font-sans text-[10px] text-white/80 bg-white/[0.12] px-2.5 py-0.5 rounded-full hover:text-white"
        >
          <span>Today</span>
          <ChevronDown className="w-3 h-3 text-white/70" />
        </div>
      </div>

      {/* Numbers */}
      <div className="mt-2 mb-1 flex-shrink-0">
        <div className="font-heading text-[28px] font-normal text-white tracking-normal leading-none">
          ₹{dashboard.revenueToday.toLocaleString()}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-sans text-[10px] text-white/60">
            {dashboard.activeUsers.toLocaleString()} active users
          </span>
          <div className="inline-flex items-center gap-0.5 px-1.5 py-[2px] rounded-[6px] bg-white/15 font-sans text-[10px] font-normal text-white leading-none">
            <TrendingUp className="w-2.5 h-2.5 inline text-white" />
            <span>+59%</span>
          </div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-[75px] w-[calc(100%+32px)] -mx-4 -mb-4 flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenuePoints} margin={{ top: 12, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueFillGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              stroke="rgba(255,255,255,0.45)"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              interval={2}
              padding={{ left: 16, right: 16 }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#FFFFFF"
              strokeWidth={1.5}
              fill="url(#revenueFillGrad)"
              dot={false}
              activeDot={{
                r: 3,
                fill: '#FFFFFF',
                stroke: '#123747',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
