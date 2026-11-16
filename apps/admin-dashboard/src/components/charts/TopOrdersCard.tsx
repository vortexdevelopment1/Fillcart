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
          className="flex items-center gap-1.5 text-[12px] text-black bg-white px-3 py-1 rounded-full cursor-pointer hover:bg-black/[0.03] border border-black/[0.08]"
        >
          <span>{filter}</span>
          <ChevronDown className="w-3.5 h-3.5 text-black/55" />
        </div>
      }
      className="h-[210px] flex flex-col justify-between"
    >
      <div className="flex items-center gap-4 my-auto h-full pt-1 pb-1">
        {/* Left: Stacked Bar (width 36px, same total height as 4 rows, 4px gap) */}
        <div
          className="w-[36px] h-full flex flex-col flex-shrink-0 select-none"
          style={{ gap: '4px' }}
        >
          {/* Block 1: SECONDARY #FCE8A3, radius 10px */}
          <div
            className="w-full rounded-[10px] bg-secondary transition-all"
            style={{ height: '28%' }}
            title="Block 1 (Sarah Mitchell)"
          />

          {/* Block 2: PRIMARY #F5B800, radius 8px */}
          <div
            className="w-full rounded-[8px] bg-primary transition-all"
            style={{ height: '11%' }}
            title="Block 2 (David Kim)"
          />

          {/* Block 3: PRIMARY at 50% opacity, radius 8px */}
          <div
            className="w-full rounded-[8px] transition-all"
            style={{
              height: '9%',
              backgroundColor: 'rgba(245, 184, 0, 0.50)',
            }}
            title="Block 3 (Priya Patel)"
          />

          {/* Block 4: Hatched pattern (.hatch class), radius 10px */}
          <div
            className="w-full flex-1 rounded-[10px] hatch transition-all"
            title="Block 4 (Others)"
          />
        </div>

        {/* Right: 4 Contact Rows */}
        <div className="flex-1 flex flex-col justify-between h-full min-w-0 py-0.5">
          {contactsData.map((row) => (
            <div key={row.id} className="flex items-center gap-2.5 text-[13px] leading-tight">
              {/* Row Dots matching blocks */}
              {row.dotType === 'block1' && (
                <div className="w-[8px] h-[8px] rounded-full bg-secondary flex-shrink-0" />
              )}
              {row.dotType === 'block2' && (
                <div className="w-[8px] h-[8px] rounded-full bg-primary flex-shrink-0" />
              )}
              {row.dotType === 'block3' && (
                <div
                  className="w-[8px] h-[8px] rounded-full flex-shrink-0"
                  style={{ backgroundColor: 'rgba(245, 184, 0, 0.50)' }}
                />
              )}
              {row.dotType === 'hollow' && (
                <div className="w-[8px] h-[8px] rounded-full border-[1.5px] border-primary bg-transparent flex-shrink-0" />
              )}

              {/* Name: weight 400, text-black, Poppins 12px */}
              <span className="font-sans font-normal text-black text-[12px] whitespace-nowrap">
                {row.name}
              </span>

              {/* Email: #000000 at 55% opacity, Poppins 11px */}
              <span className="font-sans text-[11px] text-black/55 truncate flex-1 min-w-0">
                {row.email}
              </span>

              {/* Percent: 40px right-aligned, #000000 at 55%, Poppins 12px */}
              <span className="font-sans text-[12px] text-black/55 w-[40px] text-right tabular-nums flex-shrink-0">
                {row.share}
              </span>

              {/* Count: 56px right-aligned, weight 400, text-black, Poppins 12px */}
              <span className="font-sans font-normal text-black text-[12px] w-[56px] text-right tabular-nums flex-shrink-0">
                {row.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
