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
  { month: 'Jan', totalHeight: 55, hatchedRatio: 38, open: 340, closed: 850, total: 1190 },
  { month: 'Feb', totalHeight: 40, hatchedRatio: 36, open: 220, closed: 420, total: 640 },
  { month: 'Mar', totalHeight: 70, hatchedRatio: 32, open: 410, closed: 980, total: 1390 },
  { month: 'Apr', totalHeight: 62, hatchedRatio: 30, open: 390, closed: 870, total: 1260 },
  { month: 'May', totalHeight: 85, hatchedRatio: 26, open: 480, closed: 1140, total: 1620 },
  { month: 'Jun', totalHeight: 75, hatchedRatio: 30, open: 510, closed: 1280, total: 1790 },
  {
    month: 'Jul',
    totalHeight: 100,
    hatchedRatio: 22,
    open: 38,
    closed: 1196,
    total: 1234,
    isHighlighted: true,
  },
  { month: 'Aug', totalHeight: 58, hatchedRatio: 35, open: 380, closed: 890, total: 1270 },
  { month: 'Sep', totalHeight: 48, hatchedRatio: 32, open: 290, closed: 780, total: 1070 },
  { month: 'Oct', totalHeight: 66, hatchedRatio: 28, open: 440, closed: 1020, total: 1460 },
  { month: 'Nov', totalHeight: 95, hatchedRatio: 25, open: 520, closed: 1310, total: 1830 },
  { month: 'Dec', totalHeight: 72, hatchedRatio: 30, open: 460, closed: 1180, total: 1640 },
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
          <div className="flex items-center gap-3 text-xs text-black/55">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full border border-black/55" />
              <span className="text-[11px] text-black/55">Open conversations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[11px] text-black/55">Closed</span>
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
      {/* Chart Canvas */}
      <div className="flex-1 min-h-0 w-full pt-10 pb-0 flex flex-col justify-end">
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
                {/* Floating Dark Tooltip above Jul (BLACK #000000, white text) */}
                {isSelected && (
                  <div className="absolute -top-[48px] left-1/2 -translate-x-1/2 z-30 bg-black text-white text-[11px] font-sans py-1.5 px-3 rounded-[12px] shadow-xl whitespace-nowrap border border-white/10 pointer-events-none">
                    <div className="font-medium text-[11px] leading-tight text-white mb-0.5 font-sans">
                      {item.total.toLocaleString()} Total
                    </div>
                    <div className="flex items-center gap-2 text-white/80 text-[10px] leading-none font-sans font-normal">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full border border-white inline-block" />
                        {item.open} Open
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                        {item.closed.toLocaleString()} Closed
                      </span>
                    </div>

                    {/* Caret */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45 border-r border-b border-white/10" />
                  </div>
                )}

                {/* Stacked Bar Container: max-w-[36px], centered */}
                <div
                  className="w-full max-w-[36px] flex flex-col justify-end transition-all duration-300"
                  style={{
                    height: `${item.totalHeight}%`,
                    gap: '6px', // 6px gap
                  }}
                >
                  {/* TOP BLOCK:
                      Normal month: PRIMARY #F5B800 lines over SECONDARY #FCE8A3
                      Highlighted month: PRIMARY #F5B800 lines over WHITE #FFFFFF
                  */}
                  <div
                    className="w-full rounded-[14px] flex-shrink-0 transition-all duration-300"
                    style={{
                      height: `calc(${hatchedHeightPercent}% - 3px)`,
                      minHeight: '12px',
                      backgroundColor: isSelected ? '#FFFFFF' : '#FCE8A3',
                      backgroundImage: 'repeating-linear-gradient(45deg, #F5B800 0, #F5B800 1.5px, transparent 1.5px, transparent 5px)',
                      border: isSelected ? '1px solid rgba(0, 0, 0, 0.08)' : 'none',
                    }}
                  />

                  {/* BOTTOM BLOCK:
                      Normal month: solid SECONDARY #FCE8A3
                      Highlighted month: solid PRIMARY #F5B800
                  */}
                  <div
                    className="w-full rounded-[14px] flex-1 transition-all duration-300"
                    style={{
                      minHeight: '16px',
                      backgroundColor: isSelected ? '#F5B800' : '#FCE8A3',
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
