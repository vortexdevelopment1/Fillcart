import React, { useState } from 'react';
import { Card } from '../common/Card';
import { ChevronDown } from 'lucide-react';

interface MonthData {
  month: string;
  totalPercent: number; // 35 to 95
  hatchedPercent: number; // percent of bar that is hatched
  open: number;
  closed: number;
  total: number;
  isHighlighted?: boolean;
}

const monthlyData: MonthData[] = [
  { month: 'Jan', totalPercent: 62, hatchedPercent: 32, open: 340, closed: 850, total: 1190 },
  { month: 'Feb', totalPercent: 42, hatchedPercent: 35, open: 220, closed: 420, total: 640 },
  { month: 'Mar', totalPercent: 78, hatchedPercent: 30, open: 410, closed: 980, total: 1390 },
  { month: 'Apr', totalPercent: 70, hatchedPercent: 28, open: 390, closed: 870, total: 1260 },
  { month: 'May', totalPercent: 86, hatchedPercent: 28, open: 480, closed: 1140, total: 1620 },
  { month: 'Jun', totalPercent: 92, hatchedPercent: 26, open: 510, closed: 1280, total: 1790 },
  {
    month: 'Jul',
    totalPercent: 82,
    hatchedPercent: 0, // full solid #F5B800
    open: 38,
    closed: 1196,
    total: 1234,
    isHighlighted: true,
  },
  { month: 'Aug', totalPercent: 72, hatchedPercent: 30, open: 380, closed: 890, total: 1270 },
  { month: 'Sep', totalPercent: 64, hatchedPercent: 30, open: 290, closed: 780, total: 1070 },
  { month: 'Oct', totalPercent: 82, hatchedPercent: 26, open: 440, closed: 1020, total: 1460 },
  { month: 'Nov', totalPercent: 94, hatchedPercent: 24, open: 520, closed: 1310, total: 1830 },
  { month: 'Dec', totalPercent: 86, hatchedPercent: 28, open: 460, closed: 1180, total: 1640 },
];

export const PlatformActivityCard: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('Jul');
  const [filter, setFilter] = useState('This Year');

  return (
    <Card
      title={
        <div className="flex items-center gap-4">
          <h3 className="text-[15px] font-semibold text-[#222026] tracking-tight">
            Messages By Month
          </h3>
          <div className="flex items-center gap-3 text-xs text-[#8A8A93]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full border border-[#8A8A93]" />
              <span className="text-[11px]">Open conversations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F5B800]" />
              <span className="text-[11px]">Closed</span>
            </div>
          </div>
        </div>
      }
      action={
        <div
          className="flex items-center gap-1 text-[11px] text-[#8A8A93] bg-[#F6F6F8] px-2.5 py-0.5 rounded-full cursor-pointer hover:text-[#222026] border border-[#ECECF0]"
        >
          <span>{filter}</span>
          <ChevronDown className="w-3 h-3 text-[#8A8A93]" />
        </div>
      }
      className="h-full flex-1 min-h-[220px] flex flex-col justify-between"
    >
      {/* 12 Equal Columns (Jan..Dec) inside chart area with flex-1 + min-h-0 */}
      <div className="flex-1 min-h-0 w-full pt-11 pb-1 flex flex-col">
        <div className="flex-1 min-h-0 w-full grid grid-cols-12 gap-1 md:gap-2">
          {monthlyData.map((item) => {
            const isSelected = item.month === selectedMonth;

            return (
              <div
                key={item.month}
                onClick={() => setSelectedMonth(item.month)}
                className="flex flex-col items-center h-full min-h-0 cursor-pointer group"
              >
                {/* Bar Area: Flex-1, items-end to align bar to bottom */}
                <div className="w-full flex-1 flex items-end justify-center min-h-0 relative">
                  {/* Floating Dark Tooltip above highlighted month */}
                  {isSelected && (
                    <div className="absolute -top-[44px] left-1/2 -translate-x-1/2 z-30 bg-[#222026] text-white text-[10px] py-1.5 px-2.5 rounded-xl shadow-xl whitespace-nowrap border border-white/10 pointer-events-none">
                      <div className="font-semibold text-[11px] leading-tight">
                        {item.total.toLocaleString()} Total
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-white/80 text-[9px] leading-none">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full border border-white inline-block" />
                          {item.open} Open
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F5B800] inline-block" />
                          {item.closed.toLocaleString()} Closed
                        </span>
                      </div>

                      {/* Tooltip Down Arrow */}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#222026] rotate-45 border-r border-b border-white/10" />
                    </div>
                  )}

                  {/* Pill Bar Container (width ~28px, border-radius 999px) */}
                  <div
                    className={`w-full max-w-[28px] rounded-full overflow-hidden flex flex-col justify-end transition-all duration-300 ${
                      isSelected
                        ? 'ring-4 ring-[#F5B800]/25 scale-[1.02]'
                        : 'group-hover:opacity-90'
                    }`}
                    style={{ height: `${item.totalPercent}%` }}
                  >
                    {/* Top Segment: Hatched Pattern (Solid #F5B800 if selected) */}
                    {item.hatchedPercent > 0 && !isSelected ? (
                      <div
                        className="w-full hatched-pattern-yellow border-t border-[#FCE8A3] transition-all duration-300"
                        style={{ height: `${item.hatchedPercent}%` }}
                      />
                    ) : null}

                    {/* Bottom Segment: Solid fill */}
                    <div
                      className={`w-full flex-1 transition-all duration-300 ${
                        isSelected ? 'bg-[#F5B800]' : 'bg-[#FCE8A3]'
                      }`}
                    />
                  </div>
                </div>

                {/* Month Label (Centered directly below the bar) */}
                <span
                  className={`text-[11px] mt-2 block leading-none transition-colors select-none ${
                    isSelected
                      ? 'text-[#222026] font-bold'
                      : 'text-[#8A8A93] group-hover:text-[#222026]'
                  }`}
                >
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
