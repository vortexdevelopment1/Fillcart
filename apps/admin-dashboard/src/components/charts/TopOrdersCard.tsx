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
      className="min-h-[240px] flex flex-col justify-between"
    >
      {/* Card body: flex row, align-items: stretch, gap 16px, 16px margin from title */}
      <div className="flex flex-row items-stretch gap-4 mt-4 select-none">
        {/* LEFT: stacked bar column, width 36px, flex-shrink 0, display flex column, gap 6px */}
        <div
          className="w-[36px] h-[160px] flex flex-col flex-shrink-0 select-none"
          style={{ gap: '6px' }}
        >
          {/* Block 1: flex 2.2, background PRIMARY #F5B800, radius 10px */}
          <div
            className="w-full bg-primary transition-all"
            style={{
              flex: 2.2,
              minHeight: '12px',
              borderRadius: '10px',
            }}
            title="Block 1 (Sarah Mitchell)"
          />

          {/* Block 2: flex 1, background SECONDARY #FCE8A3, border 1px solid #F5B800, radius 8px */}
          <div
            className="w-full bg-secondary transition-all"
            style={{
              flex: 1,
              minHeight: '12px',
              borderRadius: '8px',
              border: '1px solid #F5B800',
            }}
            title="Block 2 (David Kim)"
          />

          {/* Block 3: flex 0.8, background rgba(245,184,0,0.45), radius 8px */}
          <div
            className="w-full transition-all"
            style={{
              flex: 0.8,
              minHeight: '12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(245, 184, 0, 0.45)',
            }}
            title="Block 3 (Priya Patel)"
          />

          {/* Block 4: flex 4.5, class .hatch, radius 10px, no border */}
          <div
            className="w-full hatch transition-all"
            style={{
              flex: 4.5,
              minHeight: '12px',
              borderRadius: '10px',
              border: 'none',
            }}
            title="Block 4 (Others)"
          />
        </div>

        {/* RIGHT: rows container, flex-1, 4 rows with equal height (each row height 40px) */}
        <div className="flex-1 flex flex-col justify-between h-[160px] min-w-0">
          {contactsData.map((row) => (
            <div
              key={row.id}
              className="h-[40px] flex items-center gap-2.5 min-w-0"
            >
              {/* Row Dots (match blocks exactly) */}
              {row.dotType === 'block1' && (
                <div className="w-[8px] h-[8px] rounded-full bg-primary flex-shrink-0" />
              )}
              {row.dotType === 'block2' && (
                <div
                  className="w-[8px] h-[8px] rounded-full bg-secondary flex-shrink-0"
                  style={{ border: '1px solid #F5B800' }}
                />
              )}
              {row.dotType === 'block3' && (
                <div
                  className="w-[8px] h-[8px] rounded-full flex-shrink-0"
                  style={{ backgroundColor: 'rgba(245, 184, 0, 0.45)' }}
                />
              )}
              {row.dotType === 'hollow' && (
                <div className="w-[8px] h-[8px] rounded-full border-[1.5px] border-primary bg-transparent flex-shrink-0" />
              )}

              {/* Text columns: sitting on one baseline */}
              <div className="flex-1 min-w-0 flex items-baseline gap-2.5">
                {/* Name: Poppins 13px, black, no truncation */}
                <span className="font-sans font-normal text-black text-[13px] whitespace-nowrap flex-shrink-0">
                  {row.name}
                </span>

                {/* Email: Poppins 12px, black 45%, flex-1, ellipsis */}
                <span className="font-sans text-[12px] text-black/45 truncate flex-1 min-w-0">
                  {row.email}
                </span>

                {/* Percent: 12px, black 55%, width 40px, right-aligned */}
                <span className="font-sans text-[12px] text-black/55 w-[40px] text-right tabular-nums flex-shrink-0">
                  {row.share}
                </span>

                {/* Count: 13px, weight 500, width 56px, right-aligned, tabular-nums */}
                <span className="font-sans font-medium text-black text-[13px] w-[56px] text-right tabular-nums flex-shrink-0">
                  {row.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
