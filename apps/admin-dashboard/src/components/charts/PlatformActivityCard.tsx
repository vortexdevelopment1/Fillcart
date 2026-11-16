import React, { useState } from 'react';
import { Card } from '../common/Card';
import { ChevronDown } from 'lucide-react';
import { platformActivityMonthlyData } from '../../data/mockDashboardData';

export const PlatformActivityCard: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('Jul');
  const [filter, setFilter] = useState('This Year');

  return (
    <Card
      title={
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <h3 className="text-base font-semibold text-[#222026] tracking-tight">
            Platform Activity
          </h3>
          <div className="flex items-center gap-4 text-xs text-[#8A8A93]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border border-[#8A8A93]" />
              <span>Open orders</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F5B800]" />
              <span>Delivered</span>
            </div>
          </div>
        </div>
      }
      action={
        <div
          className="flex items-center gap-1 text-xs text-[#8A8A93] bg-[#F6F6F8] px-3 py-1 rounded-full cursor-pointer hover:text-[#222026] border border-[#ECECF0]"
        >
          <span>{filter}</span>
          <ChevronDown className="w-3 h-3 text-[#8A8A93]" />
        </div>
      }
      className="w-full"
    >
      {/* 12 Month Bar Chart */}
      <div className="pt-8 pb-2 relative">
        <div className="h-56 flex items-end justify-between gap-2 md:gap-4 px-2">
          {platformActivityMonthlyData.map((item) => {
            const isSelected = item.month === selectedMonth;
            // Heights relative to max (1830)
            const totalHeightPercent = Math.min(100, Math.round((item.total / 1830) * 100));
            const openHeightPercent = Math.round((item.open / item.total) * 100);

            return (
              <div
                key={item.month}
                onClick={() => setSelectedMonth(item.month)}
                className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
              >
                {/* Floating Dark Tooltip above selected month (exact match to reference) */}
                {isSelected && (
                  <div className="absolute -top-16 z-30 bg-[#222026] text-white text-[11px] py-2 px-3 rounded-xl shadow-xl whitespace-nowrap border border-white/10 animate-fade-in pointer-events-none">
                    <div className="font-semibold text-xs border-b border-white/10 pb-1 mb-1">
                      {item.total.toLocaleString()} Total
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <span className="w-2 h-2 rounded-full border border-white inline-block" />
                      <span>{item.open} Open</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <span className="w-2 h-2 rounded-full bg-[#F5B800] inline-block" />
                      <span>{item.closed.toLocaleString()} Closed</span>
                    </div>

                    {/* Arrow beak */}
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#222026] rotate-45 border-r border-b border-white/10" />
                  </div>
                )}

                {/* Pill Bar Container */}
                <div
                  className={`w-full max-w-[42px] rounded-full overflow-hidden flex flex-col justify-end transition-all duration-300 ${
                    isSelected
                      ? 'ring-4 ring-[#F5B800]/20 scale-[1.02]'
                      : 'hover:opacity-90'
                  }`}
                  style={{ height: `${totalHeightPercent}%` }}
                >
                  {/* Top Segment: Hatched Pattern (unless selected month, which is solid #F5B800 per reference) */}
                  <div
                    className={`w-full transition-all duration-300 ${
                      isSelected
                        ? 'bg-[#E5A500]'
                        : 'hatched-pattern-yellow border-t border-[#FCE8A3]'
                    }`}
                    style={{ height: `${openHeightPercent}%` }}
                  />

                  {/* Base Segment: Solid fill */}
                  <div
                    className={`w-full flex-1 transition-all duration-300 ${
                      isSelected ? 'bg-[#F5B800]' : 'bg-[#FCE8A3]'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Month Labels Jan - Dec */}
        <div className="flex justify-between gap-2 md:gap-4 px-2 mt-4 text-center text-xs font-medium text-[#8A8A93]">
          {platformActivityMonthlyData.map((item) => (
            <span
              key={item.month}
              onClick={() => setSelectedMonth(item.month)}
              className={`flex-1 cursor-pointer transition-colors ${
                item.month === selectedMonth
                  ? 'text-[#222026] font-bold underline decoration-[#F5B800] decoration-2 underline-offset-4'
                  : 'hover:text-[#222026]'
              }`}
            >
              {item.month}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
};
