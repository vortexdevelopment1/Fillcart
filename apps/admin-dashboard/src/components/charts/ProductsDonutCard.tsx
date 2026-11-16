import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';

export const ProductsDonutCard: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('This Month');

  return (
    <Card
      onClick={() => navigate('/products')}
      title="Messages By Type"
      action={
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1.5 text-[12px] text-black bg-white px-3 py-1 rounded-full cursor-pointer hover:bg-black/[0.03] border border-black/[0.08]"
        >
          <span>{filter}</span>
          <ChevronDown className="w-3.5 h-3.5 text-black/55" />
        </div>
      }
      className="h-[210px] flex flex-col justify-between"
    >
      <div className="flex items-center my-auto h-full pt-1 pb-1">
        {/* ──────────── DONUT WRAPPER (120px x 120px, mr-24px) ──────────── */}
        <div className="w-[120px] h-[120px] mr-[24px] flex-shrink-0 relative flex items-center justify-center select-none">
          {/* SVG Donut Circle with 3 rounded-cap segments and gaps */}
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            className="w-[120px] h-[120px] transform -rotate-90"
          >
            {/* Segment 1: Direct, BLACK #000000 (right arc: ~11° to 165°) */}
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="#000000"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="129 172.6"
              strokeDashoffset="-9.2"
            />

            {/* Segment 2: Automations, PRIMARY #F5B800 (bottom-left arc: ~187° to 257°) */}
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="#F5B800"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="58.6 243"
              strokeDashoffset="-156.6"
            />

            {/* Segment 3: Campaigns, SECONDARY #FCE8A3 (top-left arc: ~279° to 349°) */}
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="#FCE8A3"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="58.6 243"
              strokeDashoffset="-233.7"
            />
          </svg>

          {/* Three White Pill Badges ON the Ring (center hole is empty) */}
          {/* Badge "16%" on top-left (Campaigns) arc */}
          <div
            className="absolute bg-white text-black text-[10px] font-normal px-[6px] py-[1.5px] rounded-full border border-black pointer-events-none leading-none z-10 shadow-sm"
            style={{ top: '22%', left: '21%', transform: 'translate(-50%, -50%)' }}
          >
            16%
          </div>

          {/* Badge "24%" on right (Direct) arc */}
          <div
            className="absolute bg-white text-black text-[10px] font-normal px-[6px] py-[1.5px] rounded-full border border-black pointer-events-none leading-none z-10 shadow-sm"
            style={{ top: '50%', left: '90%', transform: 'translate(-50%, -50%)' }}
          >
            24%
          </div>

          {/* Badge "17%" on bottom-left (Automations) arc */}
          <div
            className="absolute bg-white text-black text-[10px] font-normal px-[6px] py-[1.5px] rounded-full border border-black pointer-events-none leading-none z-10 shadow-sm"
            style={{ top: '80%', left: '23%', transform: 'translate(-50%, -50%)' }}
          >
            17%
          </div>
        </div>

        {/* ──────────── LEGEND ──────────── */}
        <div className="flex-1 flex flex-col justify-center h-full min-w-0">
          <div className="flex flex-col gap-[14px]">
            {/* Row 1: Direct (BLACK) */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-[10px] h-[10px] rounded-full bg-black flex-shrink-0" />
                <span className="font-sans font-normal text-black text-[13px] truncate leading-none">
                  Direct
                </span>
              </div>
              {/* Positive: background SECONDARY #FCE8A3, text #000000, Poppins 10px */}
              <div className="flex items-center gap-0.5 font-sans text-[10px] font-normal px-[8px] py-[2px] rounded-[8px] bg-secondary text-black leading-none flex-shrink-0">
                <TrendingUp className="w-2.5 h-2.5 inline text-black" />
                <span>0.3%</span>
              </div>
            </div>

            {/* Row 2: Campaigns (SECONDARY #FCE8A3) */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-[10px] h-[10px] rounded-full bg-secondary flex-shrink-0" />
                <span className="font-sans font-normal text-black text-[13px] truncate leading-none">
                  Campaigns
                </span>
              </div>
              {/* Negative badge: background #FFFFFF with 1px #000000 border, text #000000, down-arrow, Poppins 10px */}
              <div className="flex items-center gap-0.5 font-sans text-[10px] font-normal px-[8px] py-[2px] rounded-[8px] bg-white border border-black text-black leading-none flex-shrink-0">
                <TrendingDown className="w-2.5 h-2.5 inline text-black" />
                <span>25.4%</span>
              </div>
            </div>

            {/* Row 3: Automations (PRIMARY #F5B800) */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-[10px] h-[10px] rounded-full bg-primary flex-shrink-0" />
                <span className="font-sans font-normal text-black text-[13px] truncate leading-none">
                  Automations
                </span>
              </div>
              {/* Positive: background SECONDARY #FCE8A3, text #000000, Poppins 10px */}
              <div className="flex items-center gap-0.5 font-sans text-[10px] font-normal px-[8px] py-[2px] rounded-[8px] bg-secondary text-black leading-none flex-shrink-0">
                <TrendingUp className="w-2.5 h-2.5 inline text-black" />
                <span>15%</span>
              </div>
            </div>
          </div>

          {/* Bottom-right: "vs last month" (#000000 at 55% opacity, Poppins 11px) */}
          <div className="text-right font-sans text-[11px] text-black/55 mt-2 leading-none">
            vs last month
          </div>
        </div>
      </div>
    </Card>
  );
};
