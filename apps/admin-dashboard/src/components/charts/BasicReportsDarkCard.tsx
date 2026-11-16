import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, TrendingUp } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis } from 'recharts';

const textsSentPoints = [
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

  return (
    <div
      onClick={() => navigate('/reports')}
      className="
        bg-black text-white rounded-[24px] p-4
        shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.05)]
        hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_12px_28px_rgba(0,0,0,0.08)]
        transition-all duration-300 relative cursor-pointer border border-white/10
        flex flex-col justify-between overflow-hidden h-full min-h-0 xl:flex-[32] select-none
      "
    >
      {/* 2x2 Grid of 4 Dots (top-right, white at 40% opacity) */}
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
        <h3 className="font-sans text-[13px] font-normal text-white leading-tight">Texts Sent</h3>
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 font-sans text-[10px] text-white/80 bg-white/[0.12] px-2.5 py-0.5 rounded-full hover:text-white"
        >
          <span>All time</span>
          <ChevronDown className="w-3 h-3 text-white/70" />
        </div>
      </div>

      {/* Numbers */}
      <div className="mt-2 mb-1 flex-shrink-0">
        <div className="font-sans text-[28px] font-normal text-white tracking-normal leading-none">
          95,215
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-sans text-[10px] text-white/60">1,243 today</span>
          <div className="inline-flex items-center gap-0.5 px-1.5 py-[2px] rounded-[6px] bg-white/15 font-sans text-[10px] font-normal text-white leading-none">
            <TrendingUp className="w-2.5 h-2.5 inline text-white" />
            <span>51%</span>
          </div>
        </div>
      </div>

      {/* Line Chart: smooth white wave, stroke WHITE 1.5px, soft white-to-transparent area */}
      <div className="flex-1 min-h-[60px] -mx-2 -mb-2 relative mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={textsSentPoints}
            margin={{ top: 8, right: 8, left: 8, bottom: 2 }}
          >
            <defs>
              <linearGradient id="whiteWaveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              ticks={['1 Jul', '8 Jul', '16 Jul', '25 Jul']}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255, 255, 255, 0.60)', fontSize: 9, fontFamily: 'Poppins, sans-serif' }}
              dy={-2}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#FFFFFF"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#whiteWaveGradient)"
              dot={(props: any) => {
                if (props.index === textsSentPoints.length - 1) {
                  return (
                    <circle
                      key="endpoint-dot"
                      cx={props.cx}
                      cy={props.cy}
                      r={3}
                      fill="#FFFFFF"
                    />
                  );
                }
                return <React.Fragment key={props.index} />;
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
