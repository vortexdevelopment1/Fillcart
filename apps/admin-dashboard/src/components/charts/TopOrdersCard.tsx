import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { ChevronDown } from 'lucide-react';

interface ContactRow {
  id: string;
  name: string;
  email: string;
  share: number;
  orders: string;
  color: string;
  isOthers?: boolean;
}

const contactsData: ContactRow[] = [
  {
    id: 'c1',
    name: 'Sarah Mitchell',
    email: 'sarah@brights...',
    share: 12,
    orders: '1,240',
    color: '#F5B800',
  },
  {
    id: 'c2',
    name: 'David Kim',
    email: 'david.kim@email...',
    share: 8,
    orders: '850',
    color: '#FCE8A3',
  },
  {
    id: 'c3',
    name: 'Priya Patel',
    email: 'priya@oakrealty.c...',
    share: 4,
    orders: '425',
    color: '#8A6500',
  },
  {
    id: 'c4',
    name: 'Others',
    email: '',
    share: 76,
    orders: '7,011',
    color: '#ECECF0',
    isOthers: true,
  },
];

export const TopOrdersCard: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('This Week');

  return (
    <Card
      onClick={() => navigate('/orders')}
      title="Top Contacts"
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
      <div className="flex items-stretch gap-4 my-auto">
        {/* Left: Stacked Vertical Pill Bar matching exact height of 4 list rows */}
        <div className="w-[22px] rounded-full bg-[#F6F6F8] p-[2px] flex flex-col justify-between overflow-hidden border border-[#ECECF0] flex-shrink-0">
          {/* Segment 1: Solid Primary Yellow */}
          <div
            className="w-full bg-[#F5B800] rounded-t-full transition-all duration-300"
            style={{ height: '22%' }}
            title="Sarah Mitchell (12%)"
          />
          {/* Segment 2: Light Yellow */}
          <div
            className="w-full bg-[#FCE8A3] my-[2px] rounded-xs transition-all duration-300"
            style={{ height: '16%' }}
            title="David Kim (8%)"
          />
          {/* Segment 3: Amber Dark */}
          <div
            className="w-full bg-[#8A6500] my-[2px] rounded-xs transition-all duration-300"
            style={{ height: '12%' }}
            title="Priya Patel (4%)"
          />
          {/* Segment 4: Hatched Pattern */}
          <div
            className="w-full hatched-pattern-yellow rounded-b-full transition-all duration-300 border border-[#FCE8A3]"
            style={{ height: '50%' }}
            title="Others (76%)"
          />
        </div>

        {/* Right: 4 List Rows */}
        <div className="flex-1 flex flex-col justify-between gap-1.5 min-w-0">
          {contactsData.map((contact) => (
            <div key={contact.id} className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                {/* Bullet */}
                {contact.isOthers ? (
                  <div className="w-2 h-2 rounded-full border border-[#8A8A93] flex-shrink-0" />
                ) : (
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: contact.color }}
                  />
                )}
                <span className="font-semibold text-[#222026] truncate text-[12px]">
                  {contact.name}
                </span>
                {contact.email && (
                  <span className="text-[#8A8A93] text-[11px] truncate hidden sm:inline">
                    {contact.email}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-right flex-shrink-0 font-sans">
                <span className="text-[#8A8A93] text-[11px] font-medium w-7 text-right">
                  {contact.share}%
                </span>
                <span className="font-semibold text-[#222026] text-[12px] tabular-nums min-w-[36px] text-right">
                  {contact.orders}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
