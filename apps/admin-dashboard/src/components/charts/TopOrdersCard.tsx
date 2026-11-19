import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { ChevronDown, Check } from 'lucide-react';

interface VendorRow {
  id: string;
  name: string;
  category: string;
  share: string;
  count: string;
  dotType: 'block1' | 'block2' | 'block3' | 'hollow';
}

const TIMEFRAME_DATA: Record<
  string,
  {
    vendors: VendorRow[];
    h1: number;
    h2: number;
    h3: number;
    minH4: number;
  }
> = {
  'Today': {
    vendors: [
      { id: 'v1', name: 'Fresh Mart Hub', category: 'Delhi · Grocery', share: '16%', count: '298', dotType: 'block1' },
      { id: 'v2', name: 'Royal Kirana', category: 'Indore · FMCG', share: '10%', count: '186', dotType: 'block2' },
      { id: 'v3', name: 'Sharma Dairy', category: 'Jabalpur · Dairy', share: '5%', count: '94', dotType: 'block3' },
      { id: 'v4', name: 'Others', category: '312 stores', share: '69%', count: '1,282', dotType: 'hollow' },
    ],
    h1: 30,
    h2: 20,
    h3: 12,
    minH4: 80,
  },
  'This Week': {
    vendors: [
      { id: 'v1', name: 'Fresh Mart Hub', category: 'Delhi · Grocery', share: '12%', count: '1,240', dotType: 'block1' },
      { id: 'v2', name: 'Royal Kirana', category: 'Indore · FMCG', share: '8%', count: '850', dotType: 'block2' },
      { id: 'v3', name: 'Sharma Dairy', category: 'Jabalpur · Dairy', share: '4%', count: '425', dotType: 'block3' },
      { id: 'v4', name: 'Others', category: '312 stores', share: '76%', count: '7,011', dotType: 'hollow' },
    ],
    h1: 26,
    h2: 18,
    h3: 11,
    minH4: 85,
  },
  'This Month': {
    vendors: [
      { id: 'v1', name: 'Fresh Mart Hub', category: 'Delhi · Grocery', share: '14%', count: '5,420', dotType: 'block1' },
      { id: 'v2', name: 'Royal Kirana', category: 'Indore · FMCG', share: '9%', count: '3,480', dotType: 'block2' },
      { id: 'v3', name: 'Sharma Dairy', category: 'Jabalpur · Dairy', share: '5%', count: '1,940', dotType: 'block3' },
      { id: 'v4', name: 'Others', category: '312 stores', share: '72%', count: '27,880', dotType: 'hollow' },
    ],
    h1: 28,
    h2: 19,
    h3: 12,
    minH4: 82,
  },
};

const TIMEFRAME_OPTIONS = ['Today', 'This Week', 'This Month'];

export const TopOrdersCard: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'Today' | 'This Week' | 'This Month'>('This Week');
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

  const currentData = TIMEFRAME_DATA[filter];

  return (
    <Card
      onClick={() => navigate('/vendors')}
      title="Top Vendors"
      action={
        <div ref={dropdownRef} className="relative select-none" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 text-[12px] text-ink/80 bg-neutral px-3 py-1 rounded-full cursor-pointer hover:bg-neutral/80 border border-primary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          >
            <span>{filter}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-ink/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full mt-1.5 z-40 bg-white rounded-xl shadow-lg border border-primary/15 py-1 min-w-[125px] animate-fadeIn">
              {TIMEFRAME_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setFilter(opt as any);
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
      className="h-auto min-h-[220px] xs:min-h-[240px] flex flex-col justify-between cursor-pointer hover:border-secondary transition-all w-full max-w-full min-w-0 overflow-hidden"
    >
      {/* Card body */}
      <div className="flex flex-row items-stretch gap-3 xs:gap-4 mt-3 xs:mt-4 select-none">
        {/* LEFT: stacked bar column */}
        <div
          className="w-[32px] xs:w-[36px] h-[150px] xs:h-[160px] flex flex-col flex-shrink-0 select-none"
          style={{ gap: '5px' }}
        >
          {/* Block 1 */}
          <div
            className="w-full bg-primary transition-all duration-300 flex-shrink-0"
            style={{ height: `${currentData.h1}px`, borderRadius: '10px' }}
            title={`Top Vendor (${currentData.vendors[0].share})`}
          />

          {/* Block 2 */}
          <div
            className="w-full bg-secondary transition-all duration-300 flex-shrink-0"
            style={{ height: `${currentData.h2}px`, borderRadius: '8px' }}
            title={`Second Vendor (${currentData.vendors[1].share})`}
          />

          {/* Block 3 */}
          <div
            className="w-full transition-all duration-300 flex-shrink-0"
            style={{
              height: `${currentData.h3}px`,
              borderRadius: '6px',
              backgroundColor: 'rgba(82, 119, 129, 0.55)',
            }}
            title={`Third Vendor (${currentData.vendors[2].share})`}
          />

          {/* Block 4: Others, Tallest hatched block matching reference */}
          <div
            className="w-full hatch transition-all duration-300 flex-1"
            style={{
              minHeight: `${currentData.minH4}px`,
              borderRadius: '11px',
              border: '1px solid rgba(18,55,71,0.22)',
            }}
            title={`Others (${currentData.vendors[3].share})`}
          />
        </div>

        {/* RIGHT: rows container */}
        <div className="flex-1 flex flex-col justify-between min-h-[140px] sm:h-[160px] min-w-0 gap-1">
          {currentData.vendors.map((row) => (
            <div key={row.id} className="min-h-[34px] sm:h-[40px] flex items-center gap-2 sm:gap-2.5 min-w-0 py-0.5 sm:py-0">
              {/* Row Dots */}
              {row.dotType === 'block1' && (
                <div className="w-[8px] h-[8px] rounded-full bg-primary flex-shrink-0" />
              )}
              {row.dotType === 'block2' && (
                <div className="w-[8px] h-[8px] rounded-full bg-secondary flex-shrink-0" />
              )}
              {row.dotType === 'block3' && (
                <div
                  className="w-[8px] h-[8px] rounded-full flex-shrink-0"
                  style={{ backgroundColor: 'rgba(82, 119, 129, 0.55)' }}
                />
              )}
              {row.dotType === 'hollow' && (
                <div className="w-[8px] h-[8px] rounded-full border-[1.5px] border-primary bg-transparent flex-shrink-0" />
              )}

              {/* Text columns: on desktop (>=sm) single row identical to before; on mobile (<sm) clean 2-line layout so no text cuts off */}
              <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-baseline justify-between sm:justify-start gap-0.5 sm:gap-2.5">
                <div className="flex items-baseline gap-1.5 min-w-0 flex-1">
                  <span className="font-sans font-normal text-ink text-[12px] sm:text-[13px] whitespace-nowrap flex-shrink-0">
                    {row.name}
                  </span>
                  <span className="font-sans text-[11px] sm:text-[12px] text-ink/60 truncate flex-1 min-w-0">
                    {row.category}
                  </span>
                </div>

                <div className="flex items-baseline justify-end gap-2 sm:gap-2.5 flex-shrink-0">
                  <span className="font-sans text-[11px] sm:text-[12px] text-ink/60 sm:w-[40px] text-right tabular-nums">
                    {row.share}
                  </span>
                  <span className="font-sans font-medium text-ink text-[12px] sm:text-[13px] sm:w-[56px] text-right tabular-nums">
                    {row.count}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
