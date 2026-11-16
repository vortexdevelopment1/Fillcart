import React, { useState } from 'react';
import { Card } from '../common/Card';
import { ChevronDown } from 'lucide-react';

interface MonthBarData {
  month: string;
  totalHeight: number; // percentage of chart area (40 to 100)
  hatchedRatio: number; // percentage of totalHeight that is hatched (25 to 45)
  open: number;
  closed: number;
  total: number;
  isHighlighted?: boolean;
}

const monthlyData: MonthBarData[] = [
  { month: 'Jan', totalHeight: 74, hatchedRatio: 35, open: 340, closed: 850, total: 1190 },
  { month: 'Feb', totalHeight: 52, hatchedRatio: 40, open: 220, closed: 420, total: 640 },
  { month: 'Mar', totalHeight: 84, hatchedRatio: 30, open: 410, closed: 980, total: 1390 },
  { month: 'Apr', totalHeight: 76, hatchedRatio: 28, open: 390, closed: 870, total: 1260 },
  { month: 'May', totalHeight: 94, hatchedRatio: 24, open: 480, closed: 1140, total: 1620 },
  { month: 'Jun', totalHeight: 64, hatchedRatio: 36, open: 510, closed: 1280, total: 1790 },
  {
    month: 'Jul',
    totalHeight: 100,
    hatchedRatio: 22,
    open: 38,
    closed: 1196,
    total: 1234,
    isHighlighted: true,
  },
  { month: 'Aug', totalHeight: 82, hatchedRatio: 30, open: 380, closed: 890, total: 1270 },
  { month: 'Sep', totalHeight: 62, hatchedRatio: 34, open: 290, closed: 780, total: 1070 },
  { month: 'Oct', totalHeight: 72, hatchedRatio: 28, open: 440, closed: 1020, total: 1460 },
  { month: 'Nov', totalHeight: 96, hatchedRatio: 24, open: 520, closed: 1310, total: 1830 },
  { month: 'Dec', totalHeight: 82, hatchedRatio: 28, open: 460, closed: 1180, total: 1640 },
];

export const PlatformActivityCard: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('Jul');
  const [filter, setFilter] = useState('This Year');

  return (
    <Card
      title={
        <div className="flex items-center gap-4">
          <h3 className="text-[16px] font-normal text-black tracking-[0px]">
            Messages By Month
          </h3>
          <div className="flex items-center gap-[14px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full border-[1.5px] border-primary bg-transparent inline-block flex-shrink-0" />
              <span className="font-sans text-[11px] text-black/55 leading-none">Open conversations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary inline-block flex-shrink-0" />
              <span className="font-sans text-[11px] text-black/55 leading-none">Closed</span>
            </div>
          </div>
        </div>
      }
      action={
        <div
          className="flex items-center gap-1.5 text-[12px] text-black bg-white px-3 py-1 rounded-full cursor-pointer hover:bg-black/[0.03] border border-black/[0.08]"
        >
          <span>{filter}</span>
          <ChevronDown className="w-3.5 h-3.5 text-black/55" />
        </div>
      }
      className="h-full flex-1 min-h-[220px] flex flex-col justify-between"
    >
      {/* Chart Canvas: pt-7 gives plenty of height for bars while letting tooltip float cleanly */}
      <div className="flex-1 min-h-0 w-full pt-7 pb-0 flex flex-col justify-end">
        {/* 12 Columns aligned to bottom axis */}
        <div className="flex-1 min-h-0 w-full grid grid-cols-12 gap-1 md:gap-2 items-end">
          {monthlyData.map((item) => {
            const isSelected = item.month === selectedMonth;
            const hatchedHeightPercent = item.hatchedRatio;

            return (
              <div
                key={item.month}
                onClick={() => setSelectedMonth(item.month)}
                className="flex flex-col items-center justify-end h-full min-h-0 cursor-pointer relative"
              >
                {/* Floating Dark Tooltip above Jul (BLACK #000000, 3 separate lines) */}
                {isSelected && (
                  <div className="absolute -top-[76px] left-1/2 -translate-x-1/2 z-30 bg-black text-white text-[11px] font-sans p-[10px_12px] rounded-[12px] shadow-xl whitespace-nowrap border border-white/10 pointer-events-none flex flex-col gap-1 leading-[1.5]">
                    {/* Line 1: 1,234 Total (number weight 500, "Total" weight 400) */}
                    <div className="text-[11px] leading-tight text-white">
                      <span className="font-medium text-white">{item.total.toLocaleString()}</span>{' '}
                      <span className="font-normal text-white/90">Total</span>
                    </div>

                    {/* Line 2: hollow dot (PRIMARY ring) + 38 Open */}
                    <div className="flex items-center gap-1.5 text-white/90 text-[11px] leading-none font-normal">
                      <span className="w-2 h-2 rounded-full border-[1.5px] border-primary bg-transparent inline-block flex-shrink-0" />
                      <span>{item.open} Open</span>
                    </div>

                    {/* Line 3: solid PRIMARY dot + 1,196 Closed */}
                    <div className="flex items-center gap-1.5 text-white/90 text-[11px] leading-none font-normal">
                      <span className="w-2 h-2 rounded-full bg-primary inline-block flex-shrink-0" />
                      <span>{item.closed.toLocaleString()} Closed</span>
                    </div>

                    {/* Caret */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45 border-r border-b border-white/10" />
                  </div>
                )}

                {/* Stacked Bar Container: max-w-[28px], centered, 4px gap */}
                <div
                  className="w-full max-w-[28px] flex flex-col justify-end transition-all duration-300"
                  style={{
                    height: `${item.totalHeight}%`,
                    gap: '4px', // 4px gap matching reference
                  }}
                >
                  {/* TOP BLOCK (Open conversations):
                      Reusable .hatch / .hatch-active class with 8px radius, straight vertical sides
                  */}
                  <div
                    className={`w-full rounded-[8px] flex-shrink-0 transition-all duration-300 ${
                      isSelected ? 'hatch-active' : 'hatch'
                    }`}
                    style={{
                      height: `calc(${hatchedHeightPercent}% - 2px)`,
                      minHeight: '18px',
                    }}
                  />

                  {/* BOTTOM BLOCK:
                      Normal month: solid SECONDARY #FCE8A3
                      Highlighted month: solid PRIMARY #F5B800
                      Glossy inner gradient overlay: linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 60%)
                      Radius 9px: straight vertical sides, clean flat top/bottom, rounded corners
                  */}
                  <div
                    className="w-full rounded-[9px] flex-1 transition-all duration-300"
                    style={{
                      minHeight: '22px',
                      backgroundColor: isSelected ? '#F5B800' : '#FCE8A3',
                      backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 60%)',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Month Labels in dedicated bottom row: Poppins 11px, #000000 at 55% opacity, selected 500 */}
        <div className="grid grid-cols-12 gap-1 md:gap-2 text-center mt-2.5 pt-1 select-none">
          {monthlyData.map((item) => {
            const isSelected = item.month === selectedMonth;
            return (
              <span
                key={item.month}
                onClick={() => setSelectedMonth(item.month)}
                className={`font-sans text-[11px] block leading-none cursor-pointer transition-colors ${
                  isSelected
                    ? 'text-black font-medium'
                    : 'text-black/55 hover:text-black font-normal'
                }`}
              >
                {item.month}
              </span>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
