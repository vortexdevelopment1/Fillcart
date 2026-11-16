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
          className="flex items-center gap-1 text-[11px] text-[#8A8A93] bg-[#F6F6F8] px-2.5 py-0.5 rounded-full cursor-pointer hover:text-[#222026] border border-[#ECECF0]"
        >
          <span>{filter}</span>
          <ChevronDown className="w-3 h-3 text-[#8A8A93]" />
        </div>
      }
      className="h-[210px] flex flex-col justify-between"
    >
      <div className="flex items-center gap-3 my-auto">
        {/* Donut Chart with Callout Badges */}
        <div className="relative w-[130px] h-[130px] flex-shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                innerRadius={36}
                outerRadius={56}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {donutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center 24% */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-base font-bold text-[#222026]">24%</span>
          </div>

          {/* Callout pill 18% (top left) */}
          <div className="absolute top-1 left-0 bg-[#FCE8A3] text-[#8A6500] text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-xs border border-white">
            18%
          </div>

          {/* Callout pill 17% (bottom left) */}
          <div className="absolute bottom-1 left-1 bg-[#F5B800] text-[#222026] text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-xs border border-white">
            17%
          </div>
        </div>

        {/* Right Legend */}
        <div className="flex-1 flex flex-col justify-between gap-2 text-xs min-w-0">
          {donutData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-semibold text-[#222026] text-[12px] truncate">
                  {item.name}
                </span>
              </div>
              <div
                className={`flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                  item.isPositive
                    ? 'bg-[#FCE8A3] text-[#8A6500]'
                    : 'bg-[#FDECEC] text-[#D32F2F]'
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

          <div className="text-right text-[10px] text-[#8A8A93]">
            vs last month
          </div>
        </div>
      </div>
    </Card>
  );
};
