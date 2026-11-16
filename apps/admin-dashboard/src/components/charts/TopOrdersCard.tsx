import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { ChevronDown } from 'lucide-react';

interface ContactRow {
  id: string;
  name: string;
  email: string;
  share: string;
  count: string;
  dotType: 'block1' | 'block2' | 'block3' | 'hollow';
}

const contactsData: ContactRow[] = [
  {
    id: 'c1',
    name: 'Sarah Mitchell',
    email: 'sarah@brights...',
    share: '12%',
    count: '1,240',
    dotType: 'block1',
  },
  {
    id: 'c2',
    name: 'David Kim',
    email: 'david.kim@email...',
    share: '8%',
    count: '850',
    dotType: 'block2',
  },
  {
    id: 'c3',
    name: 'Priya Patel',
    email: 'priya@oakrealty.c...',
    share: '4%',
    count: '425',
    dotType: 'block3',
  },
  {
    id: 'c4',
    name: 'Others',
    email: '',
    share: '76%',
    count: '7,011',
    dotType: 'hollow',
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
          className="flex items-center gap-1.5 text-[12px] text-[#222026] bg-white px-3 py-1 rounded-full cursor-pointer hover:bg-[#F6F6F8] border border-[#ECECF0] shadow-xs"
        >
          <span>{filter}</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#8A8A93]" />
        </div>
      }
      className="h-[210px] flex flex-col justify-between"
    >
      <div className="flex items-center gap-4 my-auto h-full pt-1 pb-1">
        {/* Left: Stacked Bar (width 36px, same total height as the 4 rows, 6px gap) */}
        <div
          className="w-[36px] h-full flex flex-col flex-shrink-0 select-none"
          style={{ gap: '6px' }}
        >
          {/* Block 1: ~28% height, #FCE8A3, radius 10px */}
          <div
            className="w-full rounded-[10px] bg-[#FCE8A3] border border-[#F3D77A]/50 transition-all"
            style={{ height: '28%' }}
            title="Block 1 (Sarah Mitchell)"
          />

          {/* Block 2: ~10% height, #F5B800, radius 8px */}
          <div
            className="w-full rounded-[8px] bg-[#F5B800] transition-all"
            style={{ height: '11%' }}
            title="Block 2 (David Kim)"
          />

          {/* Block 3: ~8% height, #F8D45A, radius 8px */}
          <div
            className="w-full rounded-[8px] bg-[#F8D45A] transition-all"
            style={{ height: '9%' }}
            title="Block 3 (Priya Patel)"
          />

          {/* Block 4: ~45% height, Hatched pattern, radius 10px */}
          <div
            className="w-full flex-1 rounded-[10px] border border-[#F3E3A0] transition-all"
            style={{
              backgroundColor: '#FFF6D6',
              backgroundImage: 'repeating-linear-gradient(45deg, #F3C94A 0, #F3C94A 1.5px, transparent 1.5px, transparent 5px)',
            }}
            title="Block 4 (Others)"
          />
        </div>

        {/* Right: 4 Contact Rows (matching vertical rhythm) */}
        <div className="flex-1 flex flex-col justify-between h-full min-w-0 py-0.5">
          {contactsData.map((row) => (
            <div key={row.id} className="flex items-center gap-2.5 text-[13px] leading-tight">
              {/* Dot: 8px */}
              {row.dotType === 'block1' && (
                <div className="w-[8px] h-[8px] rounded-full bg-[#FCE8A3] border border-[#F3D77A] flex-shrink-0" />
              )}
              {row.dotType === 'block2' && (
                <div className="w-[8px] h-[8px] rounded-full bg-[#F5B800] flex-shrink-0" />
              )}
              {row.dotType === 'block3' && (
                <div className="w-[8px] h-[8px] rounded-full bg-[#F8D45A] flex-shrink-0" />
              )}
              {row.dotType === 'hollow' && (
                <div className="w-[8px] h-[8px] rounded-full border-[1.5px] border-[#F3C94A] bg-white flex-shrink-0" />
              )}

              {/* Name: auto width, weight 400, NOT truncated */}
              <span className="font-normal text-[#222026] text-[13px] whitespace-nowrap">
                {row.name}
              </span>

              {/* Email: flex-1 with ellipsis, muted #9A9AA3 */}
              <span className="text-[12px] text-[#9A9AA3] truncate flex-1 min-w-0">
                {row.email}
              </span>

              {/* Percent: 40px right-aligned, muted, tabular-nums */}
              <span className="text-[12px] text-[#9A9AA3] w-[40px] text-right tabular-nums flex-shrink-0">
                {row.share}
              </span>

              {/* Count: 56px right-aligned, weight 500, tabular-nums */}
              <span className="font-medium text-[#222026] text-[13px] w-[56px] text-right tabular-nums flex-shrink-0">
                {row.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
