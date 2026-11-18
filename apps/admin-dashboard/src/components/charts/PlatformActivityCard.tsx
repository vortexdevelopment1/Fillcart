import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { ChevronDown, Check } from 'lucide-react';

interface MonthBarData {
  month: string;
  totalHeight: number;
  hatchedRatio: number;
  open: number;
  closed: number;
  total: number;
  isHighlighted?: boolean;
}

const HATCH_HEIGHTS: Record<string, number> = {
  Jan: 26,
  Feb: 20,
  Mar: 28,
  Apr: 28,
  May: 30,
  Jun: 24,
  Jul: 28,
  Aug: 26,
  Sep: 24,
  Oct: 26,
  Nov: 28,
  Dec: 26,
};

const DATA_THIS_YEAR: MonthBarData[] = [
  { month: 'Jan', totalHeight: 58, hatchedRatio: 35, open: 340, closed: 850, total: 1190 },
  { month: 'Feb', totalHeight: 38, hatchedRatio: 40, open: 220, closed: 420, total: 640 },
  { month: 'Mar', totalHeight: 78, hatchedRatio: 30, open: 410, closed: 980, total: 1390 },
  { month: 'Apr', totalHeight: 88, hatchedRatio: 28, open: 390, closed: 870, total: 1260 },
  { month: 'May', totalHeight: 98, hatchedRatio: 24, open: 480, closed: 1140, total: 1620 },
  { month: 'Jun', totalHeight: 54, hatchedRatio: 36, open: 510, closed: 1280, total: 1790 },
  {
    month: 'Jul',
    totalHeight: 88,
    hatchedRatio: 22,
    open: 38,
    closed: 1196,
    total: 1234,
    isHighlighted: true,
  },
  { month: 'Aug', totalHeight: 78, hatchedRatio: 30, open: 380, closed: 890, total: 1270 },
  { month: 'Sep', totalHeight: 52, hatchedRatio: 34, open: 290, closed: 780, total: 1070 },
  { month: 'Oct', totalHeight: 64, hatchedRatio: 28, open: 440, closed: 1020, total: 1460 },
  { month: 'Nov', totalHeight: 86, hatchedRatio: 24, open: 520, closed: 1310, total: 1830 },
  { month: 'Dec', totalHeight: 74, hatchedRatio: 28, open: 460, closed: 1180, total: 1640 },
];

const DATA_LAST_YEAR: MonthBarData[] = [
  { month: 'Jan', totalHeight: 46, hatchedRatio: 35, open: 240, closed: 650, total: 890 },
  { month: 'Feb', totalHeight: 32, hatchedRatio: 40, open: 180, closed: 340, total: 520 },
  { month: 'Mar', totalHeight: 62, hatchedRatio: 30, open: 310, closed: 780, total: 1090 },
  { month: 'Apr', totalHeight: 70, hatchedRatio: 28, open: 290, closed: 690, total: 980 },
  { month: 'May', totalHeight: 78, hatchedRatio: 24, open: 360, closed: 910, total: 1270 },
  { month: 'Jun', totalHeight: 44, hatchedRatio: 36, open: 410, closed: 980, total: 1390 },
  {
    month: 'Jul',
    totalHeight: 68,
    hatchedRatio: 22,
    open: 28,
    closed: 896,
    total: 924,
    isHighlighted: true,
  },
  { month: 'Aug', totalHeight: 60, hatchedRatio: 30, open: 280, closed: 710, total: 990 },
  { month: 'Sep', totalHeight: 42, hatchedRatio: 34, open: 220, closed: 610, total: 830 },
  { month: 'Oct', totalHeight: 52, hatchedRatio: 28, open: 340, closed: 820, total: 1160 },
  { month: 'Nov', totalHeight: 68, hatchedRatio: 24, open: 410, closed: 1050, total: 1460 },
  { month: 'Dec', totalHeight: 58, hatchedRatio: 28, open: 360, closed: 920, total: 1280 },
];

const YEAR_OPTIONS = ['This Year', 'Last Year'] as const;

export const PlatformActivityCard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState('Sep');
  const [filter, setFilter] = useState<'This Year' | 'Last Year'>('This Year');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const activeMonthlyData = filter === 'This Year' ? DATA_THIS_YEAR : DATA_LAST_YEAR;

  return (
    <Card
      onClick={() => navigate('/orders')}
      title={
        <div className="flex items-center gap-4">
          <h3 className="text-[16px] font-normal text-ink tracking-[0px]">
            Orders by Month
          </h3>
          <div className="flex items-center gap-[14px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full border-[1.5px] border-primary bg-transparent inline-block flex-shrink-0" />
              <span className="font-sans text-[11px] text-ink/60 leading-none">In progress</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary inline-block flex-shrink-0" />
              <span className="font-sans text-[11px] text-ink/60 leading-none">Delivered</span>
            </div>
          </div>
        </div>
      }
      action={
        <div ref={dropdownRef} className="relative select-none" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 text-[12px] text-ink/80 bg-neutral px-3 py-1 rounded-full cursor-pointer hover:bg-neutral/80 border border-primary/[0.08] transition-colors focus:outline-none focus:ring-2 focus:ring-secondary"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          >
            <span>{filter}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-ink/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full mt-1.5 z-40 bg-white rounded-xl shadow-lg border border-primary/15 py-1 min-w-[125px] animate-fadeIn">
              {YEAR_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setFilter(opt);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between transition-colors ${
                    filter === opt
                      ? 'bg-secondary/10 text-primary font-semibold'
                      : 'text-ink/80 hover:bg-neutral'
                  }`}
                >
                  <span>{opt}</span>
                  {filter === opt && <Check className="w-3.5 h-3.5 text-secondary" />}
                </button>
              ))}
            </div>
          )}
        </div>
      }
      className="h-full flex-1 min-h-[220px] flex flex-col justify-between cursor-pointer hover:border-secondary transition-all"
    >
      <div className="flex-1 min-h-0 w-full pt-7 pb-0 flex flex-col justify-end">
        <div className="flex-1 min-h-0 w-full grid grid-cols-12 gap-1 md:gap-2 items-end">
          {activeMonthlyData.map((item) => {
            const isSelected = item.month === selectedMonth;
            const hatchHeight = HATCH_HEIGHTS[item.month] ?? 28;

            return (
              <div
                key={item.month}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMonth(item.month);
                }}
                className="flex flex-col items-center justify-end h-full min-h-0 cursor-pointer relative"
              >
                <div
                  className="w-[34px] max-w-[70%] flex flex-col justify-end transition-all duration-300 relative"
                  style={{
                    height: `${item.totalHeight}%`,
                    gap: '6px',
                  }}
                >
                  {/* Floating Tooltip */}
                  {isSelected && (
                    <div className="absolute -top-[74px] left-1/2 -translate-x-1/2 z-30 bg-primary text-white text-[11px] font-sans p-[10px_12px] rounded-[12px] shadow-xl whitespace-nowrap border border-white/10 pointer-events-none flex flex-col gap-1 leading-[1.5]">
                      <div className="text-[11px] leading-tight text-white">
                        <span className="font-medium text-white">{item.total.toLocaleString()}</span>{' '}
                        <span className="font-normal text-white/90">Total</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/90 text-[11px] leading-none font-normal">
                        <span className="w-2 h-2 rounded-full border-[1.5px] border-white bg-transparent inline-block flex-shrink-0" />
                        <span>{item.open} In progress</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/90 text-[11px] leading-none font-normal">
                        <span className="w-2 h-2 rounded-full bg-white inline-block flex-shrink-0" />
                        <span>{item.closed} Delivered</span>
                      </div>
                    </div>
                  )}

                  {/* 1. Hatch Block */}
                  <div
                    className="w-full flex-shrink-0"
                    style={{
                      height: `${hatchHeight}px`,
                      borderRadius: '10px',
                      backgroundColor: '#FFFFFF',
                      backgroundImage:
                        'repeating-linear-gradient(45deg, var(--primary, #123747) 0 1px, transparent 1px 2.5px)',
                      border: '1px solid rgba(18,55,71,0.25)',
                    }}
                  />

                  {/* 2. Gradient Bar */}
                  <div
                    className="w-full flex-1 min-h-[14px]"
                    style={{
                      borderRadius: '14px',
                      background: 'linear-gradient(180deg, #527781 0%, #123747 100%)',
                    }}
                  />
                </div>

                {/* X-axis Label */}
                <span
                  className={`mt-2 text-[11px] tracking-tight font-sans transition-colors ${
                    isSelected ? 'font-medium text-ink' : 'font-normal text-ink/60'
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
