import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { productsCategoryDonutData } from '../../data/mockDashboardData';

export const ProductsDonutCard: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('This Month');

  return (
    <Card
      onClick={() => navigate('/products')}
      title="Products & Categories"
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
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-1">
        {/* Donut Chart with callout badge overlay */}
        <div className="relative w-40 h-40 flex items-center justify-center flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={productsCategoryDonutData}
                innerRadius={46}
                outerRadius={68}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {productsCategoryDonutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-[#222026]">24%</span>
          </div>

          {/* Callout pill 18% (top left) */}
          <div className="absolute -top-1 left-2 bg-[#FCE8A3] text-[#8A6500] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-white">
            18%
          </div>

          {/* Callout pill 17% (bottom left) */}
          <div className="absolute -bottom-1 left-3 bg-[#F5B800] text-[#222026] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-white">
            17%
          </div>
        </div>

        {/* Right Legend */}
        <div className="flex-1 w-full flex flex-col justify-between gap-3 text-xs pl-2">
          {productsCategoryDonutData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-semibold text-[#222026]">{item.name}</span>
              </div>
              <div
                className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                  item.isPositive
                    ? 'bg-[#FCE8A3] text-[#8A6500]'
                    : 'bg-[#FDECEC] text-[#D32F2F]'
                }`}
              >
                {item.isPositive ? (
                  <TrendingUp className="w-3 h-3 inline" />
                ) : (
                  <TrendingDown className="w-3 h-3 inline" />
                )}
                <span>{item.change}</span>
              </div>
            </div>
          ))}

          <div className="text-right text-[10px] text-[#8A8A93] pt-1">
            vs last month
          </div>
        </div>
      </div>
    </Card>
  );
};
