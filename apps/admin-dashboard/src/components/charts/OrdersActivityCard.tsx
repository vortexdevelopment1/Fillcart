import React, { useState, useEffect } from 'react';

const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_LABELS = ['1 Nov', '5 Nov', '10 Nov', '15 Nov', '20 Nov', '25 Nov', '30 Nov'];

// 36 columns x 7 rows (desktop >= 900px)
// Mon: 5 (0..4), Tue: 5 (5..9), Wed: 5 (10..14), Thu: 5 (15..19), Fri: 6 (20..25), Sat: 5 (26..30), Sun: 5 (31..35)
// Peak column at index 22 (inside Friday, height 7, 186 orders)
const WEEK_COLUMNS_36 = [
  // Mon (cols 0..4)
  { day: 'Mon', filled: 2, orders: 110 },
  { day: 'Mon', filled: 2, orders: 114 },
  { day: 'Mon', filled: 3, orders: 122 },
  { day: 'Mon', filled: 3, orders: 128 },
  { day: 'Mon', filled: 4, orders: 138 },
  // Tue (cols 5..9)
  { day: 'Tue', filled: 4, orders: 144 },
  { day: 'Tue', filled: 5, orders: 152 },
  { day: 'Tue', filled: 6, orders: 162 },
  { day: 'Tue', filled: 5, orders: 155 },
  { day: 'Tue', filled: 4, orders: 140 },
  // Wed (cols 10..14)
  { day: 'Wed', filled: 4, orders: 142 },
  { day: 'Wed', filled: 5, orders: 150 },
  { day: 'Wed', filled: 5, orders: 156 },
  { day: 'Wed', filled: 6, orders: 164 },
  { day: 'Wed', filled: 5, orders: 154 },
  // Thu (cols 15..19)
  { day: 'Thu', filled: 5, orders: 156 },
  { day: 'Thu', filled: 6, orders: 164 },
  { day: 'Thu', filled: 6, orders: 168 },
  { day: 'Thu', filled: 6, orders: 166 },
  { day: 'Thu', filled: 5, orders: 158 },
  // Fri (cols 20..25) - Peak at col 22 (186 orders, height 7)
  { day: 'Fri', filled: 5, orders: 160 },
  { day: 'Fri', filled: 6, orders: 176 },
  { day: 'Fri', filled: 7, orders: 186, isPeak: true },
  { day: 'Fri', filled: 6, orders: 178 },
  { day: 'Fri', filled: 5, orders: 164 },
  { day: 'Fri', filled: 4, orders: 148 },
  // Sat (cols 26..30)
  { day: 'Sat', filled: 4, orders: 144 },
  { day: 'Sat', filled: 4, orders: 138 },
  { day: 'Sat', filled: 3, orders: 132 },
  { day: 'Sat', filled: 3, orders: 128 },
  { day: 'Sat', filled: 3, orders: 124 },
  // Sun (cols 31..35)
  { day: 'Sun', filled: 3, orders: 120 },
  { day: 'Sun', filled: 2, orders: 112 },
  { day: 'Sun', filled: 2, orders: 108 },
  { day: 'Sun', filled: 2, orders: 104 },
  { day: 'Sun', filled: 2, orders: 98 },
];

const MONTH_COLUMNS_36 = [
  // 1 Nov (cols 0..4)
  { day: '1 Nov', filled: 3, orders: 124 },
  { day: '1 Nov', filled: 3, orders: 128 },
  { day: '1 Nov', filled: 4, orders: 136 },
  { day: '1 Nov', filled: 4, orders: 142 },
  { day: '1 Nov', filled: 5, orders: 150 },
  // 5 Nov (cols 5..9)
  { day: '5 Nov', filled: 5, orders: 156 },
  { day: '5 Nov', filled: 6, orders: 166 },
  { day: '5 Nov', filled: 6, orders: 170 },
  { day: '5 Nov', filled: 5, orders: 160 },
  { day: '5 Nov', filled: 4, orders: 142 },
  // 10 Nov (cols 10..14)
  { day: '10 Nov', filled: 4, orders: 146 },
  { day: '10 Nov', filled: 5, orders: 152 },
  { day: '10 Nov', filled: 5, orders: 158 },
  { day: '10 Nov', filled: 6, orders: 168 },
  { day: '10 Nov', filled: 5, orders: 160 },
  // 15 Nov (cols 15..19)
  { day: '15 Nov', filled: 6, orders: 168 },
  { day: '15 Nov', filled: 6, orders: 172 },
  { day: '15 Nov', filled: 6, orders: 176 },
  { day: '15 Nov', filled: 6, orders: 170 },
  { day: '15 Nov', filled: 5, orders: 160 },
  // 20 Nov (cols 20..25) - Peak at col 22
  { day: '20 Nov', filled: 6, orders: 174 },
  { day: '20 Nov', filled: 6, orders: 178 },
  { day: '20 Nov', filled: 7, orders: 186, isPeak: true },
  { day: '20 Nov', filled: 6, orders: 180 },
  { day: '20 Nov', filled: 5, orders: 164 },
  { day: '20 Nov', filled: 5, orders: 158 },
  // 25 Nov (cols 26..30)
  { day: '25 Nov', filled: 5, orders: 156 },
  { day: '25 Nov', filled: 4, orders: 148 },
  { day: '25 Nov', filled: 4, orders: 142 },
  { day: '25 Nov', filled: 3, orders: 132 },
  { day: '25 Nov', filled: 3, orders: 128 },
  // 30 Nov (cols 31..35)
  { day: '30 Nov', filled: 3, orders: 128 },
  { day: '30 Nov', filled: 3, orders: 120 },
  { day: '30 Nov', filled: 2, orders: 114 },
  { day: '30 Nov', filled: 2, orders: 108 },
  { day: '30 Nov', filled: 2, orders: 104 },
];

// 28 columns for mobile screens (< 900px)
const WEEK_COLUMNS_28 = [
  // Mon (0..3)
  { day: 'Mon', filled: 2, orders: 110 },
  { day: 'Mon', filled: 3, orders: 124 },
  { day: 'Mon', filled: 4, orders: 136 },
  { day: 'Mon', filled: 4, orders: 140 },
  // Tue (4..7)
  { day: 'Tue', filled: 5, orders: 150 },
  { day: 'Tue', filled: 6, orders: 162 },
  { day: 'Tue', filled: 5, orders: 155 },
  { day: 'Tue', filled: 4, orders: 142 },
  // Wed (8..11)
  { day: 'Wed', filled: 4, orders: 142 },
  { day: 'Wed', filled: 5, orders: 154 },
  { day: 'Wed', filled: 6, orders: 164 },
  { day: 'Wed', filled: 5, orders: 156 },
  // Thu (12..15)
  { day: 'Thu', filled: 5, orders: 156 },
  { day: 'Thu', filled: 6, orders: 166 },
  { day: 'Thu', filled: 6, orders: 168 },
  { day: 'Thu', filled: 5, orders: 158 },
  // Fri (16..19) - Peak at col 17
  { day: 'Fri', filled: 6, orders: 176 },
  { day: 'Fri', filled: 7, orders: 186, isPeak: true },
  { day: 'Fri', filled: 6, orders: 178 },
  { day: 'Fri', filled: 5, orders: 160 },
  // Sat (20..23)
  { day: 'Sat', filled: 4, orders: 144 },
  { day: 'Sat', filled: 4, orders: 140 },
  { day: 'Sat', filled: 3, orders: 132 },
  { day: 'Sat', filled: 3, orders: 128 },
  // Sun (24..27)
  { day: 'Sun', filled: 3, orders: 122 },
  { day: 'Sun', filled: 2, orders: 112 },
  { day: 'Sun', filled: 2, orders: 106 },
  { day: 'Sun', filled: 2, orders: 98 },
];

const MONTH_COLUMNS_28 = [
  // 1 Nov
  { day: '1 Nov', filled: 3, orders: 124 },
  { day: '1 Nov', filled: 4, orders: 136 },
  { day: '1 Nov', filled: 5, orders: 150 },
  { day: '1 Nov', filled: 5, orders: 156 },
  // 5 Nov
  { day: '5 Nov', filled: 6, orders: 166 },
  { day: '5 Nov', filled: 6, orders: 170 },
  { day: '5 Nov', filled: 5, orders: 160 },
  { day: '5 Nov', filled: 4, orders: 145 },
  // 10 Nov
  { day: '10 Nov', filled: 4, orders: 148 },
  { day: '10 Nov', filled: 5, orders: 156 },
  { day: '10 Nov', filled: 6, orders: 166 },
  { day: '10 Nov', filled: 5, orders: 160 },
  // 15 Nov
  { day: '15 Nov', filled: 6, orders: 168 },
  { day: '15 Nov', filled: 6, orders: 174 },
  { day: '15 Nov', filled: 6, orders: 172 },
  { day: '15 Nov', filled: 5, orders: 160 },
  // 20 Nov - Peak at col 17
  { day: '20 Nov', filled: 6, orders: 178 },
  { day: '20 Nov', filled: 7, orders: 186, isPeak: true },
  { day: '20 Nov', filled: 6, orders: 180 },
  { day: '20 Nov', filled: 5, orders: 164 },
  // 25 Nov
  { day: '25 Nov', filled: 5, orders: 154 },
  { day: '25 Nov', filled: 4, orders: 144 },
  { day: '25 Nov', filled: 3, orders: 132 },
  { day: '25 Nov', filled: 3, orders: 128 },
  // 30 Nov
  { day: '30 Nov', filled: 3, orders: 126 },
  { day: '30 Nov', filled: 2, orders: 114 },
  { day: '30 Nov', filled: 2, orders: 108 },
  { day: '30 Nov', filled: 2, orders: 104 },
];

const DAY_CENTER_COLS_36 = [2, 7, 12, 17, 22, 28, 33];
const DAY_CENTER_COLS_28 = [1, 5, 9, 13, 17, 21, 25];

export const OrdersActivityCard: React.FC = () => {
  const [timeTab, setTimeTab] = useState<'Week' | 'Month'>('Week');
  const [hoveredColIdx, setHoveredColIdx] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const motionHandler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', motionHandler);

    const checkWidth = () => {
      setIsSmallScreen(window.innerWidth < 900);
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);

    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 40);

    return () => {
      mq.removeEventListener('change', motionHandler);
      window.removeEventListener('resize', checkWidth);
      clearTimeout(timer);
    };
  }, []);

  const totalCols = isSmallScreen ? 28 : 36;
  const currentDataset = isSmallScreen
    ? (timeTab === 'Week' ? WEEK_COLUMNS_28 : MONTH_COLUMNS_28)
    : (timeTab === 'Week' ? WEEK_COLUMNS_36 : MONTH_COLUMNS_36);

  const defaultPeakIdx = isSmallScreen ? 17 : 22; // Fri peak column
  const activeColIdx =
    hoveredColIdx !== null && hoveredColIdx < totalCols
      ? hoveredColIdx
      : defaultPeakIdx;
  const activeCol = currentDataset[activeColIdx] || currentDataset[defaultPeakIdx];

  // Determine cell color for a given column and row from bottom
  const getCellBg = (
    cIdx: number,
    rowFromBottom: number,
    effectiveFilled: number
  ) => {
    // Empty cell: pure white
    if (rowFromBottom >= effectiveFilled) {
      return '#FFFFFF';
    }

    const isPeakOrHovered = cIdx === activeColIdx;
    const isNeighbor = cIdx === activeColIdx - 1 || cIdx === activeColIdx + 1;

    // Peak or hovered column:
    // PRIMARY with SECONDARY top cells
    if (isPeakOrHovered) {
      const isTopTwo = rowFromBottom >= effectiveFilled - 2;
      return isTopTwo ? '#527781' : '#123747';
    }

    // Immediate neighbours of peak/hovered: SECONDARY at 55%
    if (isNeighbor) {
      return 'rgba(82, 119, 129, 0.55)';
    }

    // All other normal columns: filled PRIMARY at 14%
    return 'rgba(18, 55, 71, 0.14)';
  };

  return (
    <div className="w-full bg-secondary text-white rounded-[22px] p-3.5 sm:p-[12px_20px] relative shadow-[0_8px_24px_rgba(18,55,71,0.06)] h-auto select-none overflow-hidden min-w-0 max-w-full">
      {/* 2-Column Grid on desktop (>=900px): 190px 1fr, gap 20px; Single column on <900px */}
      <div className="flex flex-col min-[900px]:grid min-[900px]:grid-cols-[190px_minmax(0,1fr)] gap-3 min-[900px]:gap-[20px] items-stretch">
        {/* ──────────── 1. LEFT COLUMN (Orders title at top, 1,284 + orders centered vertically, Week/Month at bottom) ──────────── */}
        <div className="flex flex-row items-center justify-between min-[900px]:flex-col min-[900px]:justify-between h-auto min-[900px]:h-full w-full min-[900px]:w-[190px] min-[900px]:max-w-[190px] py-0.5 flex-wrap min-[500px]:flex-nowrap gap-2 min-[900px]:gap-0">
          {/* Top Title */}
          <div className="w-auto min-[900px]:w-full">
            <span className="font-sans text-[13px] text-white/80 font-normal leading-tight">
              Orders
            </span>
          </div>

          {/* Numbers block centered vertically with badge positioned below the number */}
          <div className="flex flex-col items-start my-auto w-auto min-[900px]:w-full py-0.5">
            <span className="font-heading text-[28px] min-[900px]:text-[34px] text-white font-normal leading-none tracking-tight">
              {timeTab === 'Week' ? '1,284' : '5,420'}
            </span>
            {/* Badge positioned below the number (where the arrow points) */}
            <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-white/20 text-white font-normal border border-white/20 leading-none shadow-xs mt-1.5 inline-block">
              {timeTab === 'Week' ? '↗ +12%' : '↗ +18%'}
            </span>
          </div>

          {/* BOTTOM: Week / Month pills (height 28px, 10px text, full column width 190px max) */}
          <div className="h-[28px] p-0.5 rounded-full bg-primary/25 border border-white/10 flex items-center gap-1 w-[130px] min-[900px]:w-full min-[900px]:max-w-[190px] flex-shrink-0">
            <button
              type="button"
              onClick={() => setTimeTab('Week')}
              className={`flex-1 h-[24px] rounded-full text-[10px] font-sans transition-all text-center flex items-center justify-center leading-none ${
                timeTab === 'Week'
                  ? 'bg-primary text-white font-medium shadow-xs'
                  : 'text-white/80 hover:text-white font-normal'
              }`}
            >
              Week
            </button>
            <button
              type="button"
              onClick={() => setTimeTab('Month')}
              className={`flex-1 h-[24px] rounded-full text-[10px] font-sans transition-all text-center flex items-center justify-center leading-none ${
                timeTab === 'Month'
                  ? 'bg-primary text-white font-medium shadow-xs'
                  : 'text-white/80 hover:text-white font-normal'
              }`}
            >
              Month
            </button>
          </div>
        </div>

        {/* ──────────── 2. RIGHT COLUMN (graph: tooltip strip, panel with Y-axis numbers, day labels) ──────────── */}
        <div
          className="flex-1 flex flex-col justify-end min-w-0"
          onMouseLeave={() => setHoveredColIdx(null)}
        >
          {/* Tooltip strip (22px) */}
          <div className="h-[22px] w-full relative flex-shrink-0">
            <div
              className="absolute bottom-1 z-30 bg-ink text-white px-2.5 py-1 rounded-[8px] shadow-lg pointer-events-none leading-none flex items-center justify-center"
              style={{
                left: `calc(24px + ${((activeColIdx + 0.5) / totalCols)} * (100% - 24px))`,
                transform: 'translateX(-50%)',
                transition: prefersReducedMotion ? 'none' : 'left 150ms ease-out',
              }}
            >
              <span className="text-[11px] font-sans font-medium text-white whitespace-nowrap leading-none">
                {activeCol.orders} orders
              </span>
              {/* Small Downward Caret */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-ink rotate-45" />
            </div>
          </div>

          {/* Light Panel: background rgba(255,255,255,0.55), radius 12px, padding 6px, width 100% */}
          <div className="w-full bg-white/[0.55] rounded-[12px] p-[6px] shadow-xs overflow-x-auto min-[900px]:overflow-x-visible no-scrollbar">
            <div className="flex items-end gap-1.5 w-full min-w-[340px] min-[900px]:min-w-0">
              {/* Y-Axis level indicators for the 7 rows */}
              <div className="flex flex-col justify-between h-[89px] text-[8px] font-sans text-primary/70 font-semibold select-none flex-shrink-0 text-right w-[20px] py-[0.5px]">
                <span>180</span>
                <span>150</span>
                <span>120</span>
                <span>90</span>
                <span>60</span>
                <span>30</span>
                <span>0</span>
              </div>

              {/* 7 Rows x 36 (or 28) Columns Grid, fixed 11px row height */}
              <div
                className="flex-1 grid gap-[2px] items-end"
                style={{
                  gridTemplateColumns: `repeat(${totalCols}, minmax(0, 1fr))`,
                }}
              >
                {currentDataset.map((col, cIdx) => {
                  const effectiveFilled =
                    !isMounted && !prefersReducedMotion ? 0 : col.filled;

                  return (
                    <div
                      key={cIdx}
                      onMouseEnter={() => setHoveredColIdx(cIdx)}
                      className="flex flex-col gap-[2px] justify-end relative cursor-pointer group"
                    >
                      {/* 7 Rows from Top (row 6) down to Bottom (row 0), fixed 11px cell height */}
                      {[6, 5, 4, 3, 2, 1, 0].map((rowFromBottom) => {
                        const cellColor = getCellBg(cIdx, rowFromBottom, effectiveFilled);

                        return (
                          <div
                            key={rowFromBottom}
                            className="w-full h-[11px] rounded-[2px] transition-colors duration-150"
                            style={{
                              backgroundColor: cellColor,
                              transition: prefersReducedMotion
                                ? 'none'
                                : `background-color 250ms ease-out, transform 250ms ease-out`,
                              transitionDelay:
                                !isMounted && !prefersReducedMotion ? `${cIdx * 8}ms` : '0ms',
                            }}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Day / Date labels: 7 equal columns under grid, matching grid offset with Y-axis */}
          <div className="w-full grid grid-cols-7 text-center mt-[4px] pl-[26px] pr-[6px] flex-shrink-0">
            {(timeTab === 'Week' ? WEEK_LABELS : MONTH_LABELS).map((label, dIdx) => {
              const isPeakDay = timeTab === 'Week' ? label === 'Fri' : label === '20 Nov';

              return (
                <div
                  key={label}
                  className="flex flex-col items-center justify-start cursor-pointer"
                  onMouseEnter={() =>
                    setHoveredColIdx(
                      isSmallScreen ? DAY_CENTER_COLS_28[dIdx] : DAY_CENTER_COLS_36[dIdx]
                    )
                  }
                >
                  {/* 4px dot above peak day / date */}
                  <span
                    className={`w-1 h-1 rounded-full bg-white mb-0.5 transition-opacity ${
                      isPeakDay ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-sans leading-none ${
                      isPeakDay
                        ? 'text-white font-medium'
                        : 'text-white/70 font-normal'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
