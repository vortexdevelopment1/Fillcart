import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';

export const ProductsDonutCard: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('This Month');

  // SVG Donut Geometry:
  // Center: (60, 60), Radius: 48, StrokeWidth: 14
  // Circumference: 2 * PI * 48 ≈ 301.6
  // Segment 1 (Direct, dark #222026): stroke-dasharray="98 203.6", offset="-7"
  // Segment 3 (Automations, #F5B800): stroke-dasharray="70 231.6", offset="-119"
  // Segment 2 (Campaigns, #FCE8A3): stroke-dasharray="84 217.6", offset="-203"

  return (
    <Card
      onClick={() => navigate('/products')}
      title="Messages By Type"
      action={
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1.5 text-[12px] text-[#222026] bg-white px-3 py-1 rounded-full cursor-pointer hover:bg-[#F6F6F8] border border-[#ECECF0] shadow-xs"
        >
          <span>{filter}</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#8A8A93]" />
        </div>
      }
      className="h-[210px] flex flex-col justify-between"
    >
      <div className="flex items-center my-auto h-full pt-1 pb-1">
        {/* ──────────── DONUT WRAPPER (120px x 120px, mr-24px, flex-shrink-0) ──────────── */}
        <div className="w-[120px] h-[120px] mr-[24px] flex-shrink-0 relative flex items-center justify-center select-none">
          {/* SVG Donut Circle with 3 rounded-cap segments and gaps */}
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            className="w-[120px] h-[120px] transform -rotate-90"
          >
            {/* Segment 1: Direct, dark #222026 (~34%, top-right) */}
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="#222026"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="98 203.6"
              strokeDashoffset="-7"
            />

            {/* Segment 3: Automations, PRIMARY #F5B800 (~26%, bottom-right) */}
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="#F5B800"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="70 231.6"
              strokeDashoffset="-119"
            />

            {/* Segment 2: Campaigns, SECONDARY #FCE8A3 (~34%, bottom-left to top-left) */}
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="#FCE8A3"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="84 217.6"
              strokeDashoffset="-203"
            />
          </svg>

          {/* Center Text "24%": 15px, weight 400, #222026, perfectly centered */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15px] font-normal text-[#222026] pointer-events-none leading-none">
            24%
          </div>

          {/* ──────────── PERCENT BADGES (White pill badges ON the ring) ──────────── */}
          {/* Badge "18%" at top-left of the ring (Campaigns arc start) */}
          <div
            className="absolute bg-white text-[#222026] text-[10px] font-normal px-[6px] py-[1px] rounded-full border border-[#222026] pointer-events-none leading-none z-10"
            style={{ top: '18%', left: '8%' }}
          >
            18%
          </div>

          {/* Badge "24%" at the right of the ring (Direct arc end) -- as in reference */}
          <div
            className="absolute bg-white text-[#222026] text-[10px] font-normal px-[6px] py-[1px] rounded-full border border-[#222026] pointer-events-none leading-none z-10"
            style={{ top: '44%', left: '80%' }}
          >
            24%
          </div>

          {/* Badge "17%" at bottom-left of the ring */}
          <div
            className="absolute bg-white text-[#222026] text-[10px] font-normal px-[6px] py-[1px] rounded-full border border-[#222026] pointer-events-none leading-none z-10"
            style={{ top: '74%', left: '14%' }}
          >
            17%
          </div>
        </div>

        {/* ──────────── LEGEND (flex-1, 14px row spacing, 10px dots, 14px labels) ──────────── */}
        <div className="flex-1 flex flex-col justify-center h-full min-w-0">
          <div className="flex flex-col gap-[14px]">
            {/* Row 1: Direct */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-[10px] h-[10px] rounded-full bg-[#222026] flex-shrink-0" />
                <span className="font-normal text-[#222026] text-[14px] truncate leading-none">
                  Direct
                </span>
              </div>
              <div className="flex items-center gap-0.5 text-[11px] font-normal px-[8px] py-[2px] rounded-[8px] bg-[#FFF3C4] text-[#8A6500] leading-none flex-shrink-0">
                <TrendingUp className="w-2.5 h-2.5 inline" />
                <span>0.3%</span>
              </div>
            </div>

            {/* Row 2: Campaigns */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-[10px] h-[10px] rounded-full bg-[#FCE8A3] border border-[#F3D77A] flex-shrink-0" />
                <span className="font-normal text-[#222026] text-[14px] truncate leading-none">
                  Campaigns
                </span>
              </div>
              <div className="flex items-center gap-0.5 text-[11px] font-normal px-[8px] py-[2px] rounded-[8px] bg-[#FDE8E8] text-[#D32F2F] leading-none flex-shrink-0">
                <TrendingDown className="w-2.5 h-2.5 inline" />
                <span>25.4%</span>
              </div>
            </div>

            {/* Row 3: Automations */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-[10px] h-[10px] rounded-full bg-[#F5B800] flex-shrink-0" />
                <span className="font-normal text-[#222026] text-[14px] truncate leading-none">
                  Automations
                </span>
              </div>
              <div className="flex items-center gap-0.5 text-[11px] font-normal px-[8px] py-[2px] rounded-[8px] bg-[#FFF3C4] text-[#8A6500] leading-none flex-shrink-0">
                <TrendingUp className="w-2.5 h-2.5 inline" />
                <span>15%</span>
              </div>
            </div>
          </div>

          {/* Bottom-right: "vs last month" (11px muted) */}
          <div className="text-right text-[11px] text-[#9A9AA3] mt-2 leading-none">
            vs last month
          </div>
        </div>
      </div>
    </Card>
  );
};
