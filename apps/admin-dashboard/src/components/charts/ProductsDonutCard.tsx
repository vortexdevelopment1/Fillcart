import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const donutData = [
  { name: 'Direct', value: 48, color: '#222026', change: '0.3%', isPositive: true },
  { name: 'Campaigns', value: 28, color: '#FCE8A3', change: '25.4%', isPositive: false },
  { name: 'Automations', value: 24, color: '#F5B800', change: '15%', isPositive: true },
];

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
          className="flex items-center gap-1.5 text-[12px] text-[#222026] bg-white px-3 py-1 rounded-full cursor-pointer hover:bg-[#F6F6F8] border border-[#ECECF0] shadow-xs"
        >
          <span>{filter}</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#8A8A93]" />
        </div>
      }
      className="h-[210px] flex flex-col justify-between"
    >
      <div className="flex items-center gap-3 my-auto h-full pt-1 pb-1">
        {/* Donut Chart: Ring thickness 24px (outer 60, inner 36), 6px gap, rounded caps */}
        <div className="relative w-[130px] h-[130px] flex-shrink-0 flex items-center justify-center select-none">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                innerRadius={36}
                outerRadius={60}
                paddingAngle={6}
                cornerRadius={12} // Rounded line caps
                dataKey="value"
                strokeWidth={0}
              >
                {donutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center 24%: 16px, weight 400 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[16px] font-normal text-[#222026]">24%</span>
          </div>

          {/* White Pill Badge 18% placed ON the ring with 1px dark border */}
          <div className="absolute top-2 left-0 bg-white text-[#222026] text-[11px] font-normal px-2 py-[1px] rounded-full border border-[#222026] shadow-xs pointer-events-none">
            18%
          </div>

          {/* White Pill Badge 17% placed ON the ring with 1px dark border */}
          <div className="absolute bottom-2 left-1 bg-white text-[#222026] text-[11px] font-normal px-2 py-[1px] rounded-full border border-[#222026] shadow-xs pointer-events-none">
            17%
          </div>
        </div>

        {/* Right Legend */}
        <div className="flex-1 flex flex-col justify-between h-full min-w-0 py-1">
          {donutData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-1.5 text-[13px]">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-[8px] h-[8px] rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: item.color,
                    border: item.color === '#FCE8A3' ? '1px solid #F3D77A' : 'none',
                  }}
                />
                <span className="font-normal text-[#222026] text-[13px] truncate">
                  {item.name}
                </span>
              </div>

              {/* Small Trend Badge */}
              <div
                className={`flex items-center gap-0.5 text-[11px] font-normal px-2 py-[1.5px] rounded-full ${
                  item.isPositive
                    ? 'bg-[#FFF3C4] text-[#8A6500]'
                    : 'bg-[#FDE8E8] text-[#D32F2F]'
                }`}
              >
                {item.isPositive ? (
                  <TrendingUp className="w-2.5 h-2.5 inline" />
                ) : (
                  <TrendingDown className="w-2.5 h-2.5 inline" />
                )}
                <span>{item.change}</span>
              </div>
            </div>
          ))}

          <div className="text-right text-[10px] text-[#9A9AA3] mt-auto">
            vs last month
          </div>
        </div>
      </div>
    </Card>
  );
};
