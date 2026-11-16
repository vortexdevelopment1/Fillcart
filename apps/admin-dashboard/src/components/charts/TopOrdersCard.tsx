import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { topOrdersVendors } from '../../data/mockDashboardData';
import { ChevronDown } from 'lucide-react';

export const TopOrdersCard: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('This Week');

  return (
    <Card
      onClick={() => navigate('/orders')}
      title="Orders by Store"
      action={
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-xs text-[#8A8A93] bg-[#F6F6F8] px-3 py-1 rounded-full cursor-pointer hover:text-[#222026] border border-[#ECECF0]"
        >
          <span>{filter}</span>
          <ChevronDown className="w-3 h-3 text-[#8A8A93]" />
        </div>
      }
      className="flex flex-col justify-between"
    >
      <div className="flex items-center gap-6 mt-1">
        {/* Left: Stacked Vertical Pill Bar with Hatched segment */}
        <div className="w-7 h-44 rounded-full bg-[#F6F6F8] p-1 flex flex-col justify-between overflow-hidden border border-[#ECECF0] shadow-inner flex-shrink-0">
          {/* Segment 1: Primary Yellow */}
          <div
            className="w-full bg-[#F5B800] rounded-t-full transition-all duration-300"
            style={{ height: '18%' }}
            title="Fresh Mart Hub (12%)"
          />
          {/* Segment 2: Light Yellow */}
          <div
            className="w-full bg-[#FCE8A3] my-1 rounded-sm transition-all duration-300"
            style={{ height: '14%' }}
            title="Royal Kirana (8%)"
          />
          {/* Segment 3: Amber dark */}
          <div
            className="w-full bg-[#D49E00] my-1 rounded-sm transition-all duration-300"
            style={{ height: '10%' }}
            title="Priya Dairy (4%)"
          />
          {/* Segment 4: Hatched Bottom Segment */}
          <div
            className="w-full hatched-pattern-yellow rounded-b-full transition-all duration-300 border border-[#FCE8A3]"
            style={{ height: '54%' }}
            title="Others (76%)"
          />
        </div>

        {/* Right: Vendor Rows with colored bullets, percentages & counts */}
        <div className="flex-1 flex flex-col justify-between gap-3 text-xs">
          {topOrdersVendors.map((vendor, idx) => (
            <div key={vendor.id} className="flex items-center justify-between gap-2 group">
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Dot */}
                {idx === 3 ? (
                  <div className="w-2.5 h-2.5 rounded-full border border-[#8A8A93] flex-shrink-0" />
                ) : (
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: vendor.color }}
                  />
                )}
                <div className="truncate">
                  <span className="font-semibold text-[#222026] group-hover:text-[#F5B800] transition-colors">
                    {vendor.name}
                  </span>
                  <span className="text-[#8A8A93] ml-1 text-[11px] hidden sm:inline truncate">
                    {vendor.email}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-right flex-shrink-0">
                <span className="text-[#8A8A93] font-medium">{vendor.share}%</span>
                <span className="font-semibold text-[#222026] min-w-[40px]">{vendor.orders}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
