import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { ChevronDown, TrendingUp, TrendingDown, Check } from 'lucide-react';

const REVENUE_TIMEFRAME_OPTIONS = ['Today', 'This Week', 'This Month', 'This Year'] as const;
type RevenueTimeframe = typeof REVENUE_TIMEFRAME_OPTIONS[number];

const REVENUE_DATA: Record<
  RevenueTimeframe,
  {
    revPct: number;
    commPct: number;
    refPct: number;
    revGrowth: string;
    commGrowth: string;
    refGrowth: string;
    vsLabel: string;
  }
> = {
  'Today': {
    revPct: 80,
    commPct: 15,
    refPct: 5,
    revGrowth: '+11.8%',
    commGrowth: '+6.4%',
    refGrowth: '-0.8%',
    vsLabel: 'vs yesterday',
  },
  'This Week': {
    revPct: 77,
    commPct: 16,
    refPct: 7,
    revGrowth: '+13.5%',
    commGrowth: '+7.9%',
    refGrowth: '-1.0%',
    vsLabel: 'vs last week',
  },
  'This Month': {
    revPct: 78,
    commPct: 16,
    refPct: 6,
    revGrowth: '+14.2%',
    commGrowth: '+8.5%',
    refGrowth: '-1.2%',
    vsLabel: 'vs last month',
  },
  'This Year': {
    revPct: 76,
    commPct: 18,
    refPct: 6,
    revGrowth: '+28.4%',
    commGrowth: '+22.1%',
    refGrowth: '-2.5%',
    vsLabel: 'vs last year',
  },
};

export const ProductsDonutCard: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<RevenueTimeframe>('This Month');
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

  const activeData = REVENUE_DATA[filter];

  return (
    <Card
      onClick={() => navigate('/payments')}
      title="Revenue split"
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
              {REVENUE_TIMEFRAME_OPTIONS.map((opt) => (
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
      className="h-auto min-h-[200px] xs:min-h-[210px] flex flex-col justify-between cursor-pointer hover:border-secondary transition-all w-full max-w-full min-w-0 overflow-hidden"
    >
      <div className="flex flex-col min-[420px]:flex-row items-center my-auto h-full pt-1 pb-1 min-w-0">
        {/* DONUT WRAPPER (120px x 120px, mr-24px) */}
        <div className="w-[110px] h-[110px] xs:w-[120px] xs:h-[120px] min-[420px]:mr-[24px] mb-3 min-[420px]:mb-0 flex-shrink-0 relative flex items-center justify-center select-none">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            className="w-full h-full transform -rotate-90"
          >
            {/* Segment 1: Revenue, INK #000000 (right arc: ~78%) */}
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="#000000"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="180 121.6"
              strokeDashoffset="-9.2"
            />

            {/* Segment 2: Commission, PRIMARY #123747 (~16%) */}
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="#123747"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="52 249.6"
              strokeDashoffset="-200"
            />

            {/* Segment 3: Refund, SECONDARY #527781 (~6%) */}
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="#527781"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="24 277.6"
              strokeDashoffset="-260"
            />
          </svg>

          {/* Three White Pill Badges ON the Ring with 1px INK border */}
          <div
            className="absolute bg-white text-ink text-[9px] xs:text-[10px] font-normal px-[5px] py-[1px] xs:px-[6px] xs:py-[1.5px] rounded-full border border-ink pointer-events-none leading-none z-10 shadow-sm whitespace-nowrap"
            style={{ top: '22%', left: '22%', transform: 'translate(-50%, -50%)' }}
          >
            {activeData.refPct}%
          </div>

          <div
            className="absolute bg-white text-ink text-[9px] xs:text-[10px] font-normal px-[5px] py-[1px] xs:px-[6px] xs:py-[1.5px] rounded-full border border-ink pointer-events-none leading-none z-10 shadow-sm whitespace-nowrap"
            style={{ top: '50%', left: '80%', transform: 'translate(-50%, -50%)' }}
          >
            {activeData.revPct}%
          </div>

          <div
            className="absolute bg-white text-ink text-[9px] xs:text-[10px] font-normal px-[5px] py-[1px] xs:px-[6px] xs:py-[1.5px] rounded-full border border-ink pointer-events-none leading-none z-10 shadow-sm whitespace-nowrap"
            style={{ top: '78%', left: '24%', transform: 'translate(-50%, -50%)' }}
          >
            {activeData.commPct}%
          </div>
        </div>

        {/* LEGEND */}
        <div className="flex-1 flex flex-col justify-center h-full min-w-0">
          <div className="flex flex-col gap-[14px]">
            {/* Row 1: Net Revenue (INK) */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-[10px] h-[10px] rounded-full bg-ink flex-shrink-0" />
                <span className="font-sans font-normal text-ink text-[13px] truncate leading-none">
                  Revenue
                </span>
              </div>
              <div className="flex items-center gap-0.5 font-sans text-[10px] font-normal px-[8px] py-[2px] rounded-[8px] bg-primary text-white leading-none flex-shrink-0">
                <TrendingUp className="w-2.5 h-2.5 inline text-white" />
                <span>{activeData.revGrowth}</span>
              </div>
            </div>

            {/* Row 2: Commission (PRIMARY) */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-[10px] h-[10px] rounded-full bg-primary flex-shrink-0" />
                <span className="font-sans font-normal text-ink text-[13px] truncate leading-none">
                  Commission
                </span>
              </div>
              <div className="flex items-center gap-0.5 font-sans text-[10px] font-normal px-[8px] py-[2px] rounded-[8px] bg-primary text-white leading-none flex-shrink-0">
                <TrendingUp className="w-2.5 h-2.5 inline text-white" />
                <span>{activeData.commGrowth}</span>
              </div>
            </div>

            {/* Row 3: Refund (SECONDARY) */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-[10px] h-[10px] rounded-full bg-secondary flex-shrink-0" />
                <span className="font-sans font-normal text-ink text-[13px] truncate leading-none">
                  Refunds
                </span>
              </div>
              <div className="flex items-center gap-0.5 font-sans text-[10px] font-normal px-[8px] py-[2px] rounded-[8px] bg-white border border-ink text-ink leading-none flex-shrink-0">
                <TrendingDown className="w-2.5 h-2.5 inline text-ink" />
                <span>{activeData.refGrowth}</span>
              </div>
            </div>
          </div>

          <div className="text-right font-sans text-[11px] text-ink/60 mt-2 leading-none">
            {activeData.vsLabel}
          </div>
        </div>
      </div>
    </Card>
  );
};
