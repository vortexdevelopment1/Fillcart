import React from 'react';

interface StatCardSuspendedProps {
  suspendedCount: number;
  total: number;
  items: { id: string; status: string; name: string }[];
}

export const StatCardSuspended: React.FC<StatCardSuspendedProps> = ({
  suspendedCount,
  total,
  items,
}) => {
  return (
    <div className="h-[130px] rounded-[22px] p-[14px_16px] bg-white text-ink flex flex-col justify-between overflow-hidden select-none relative shadow-sm border border-primary/10 cursor-pointer hover:border-secondary transition-all">
      {/* Top Title */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-sans text-primary/60 font-normal leading-tight">
          Suspended
        </span>
      </div>

      {/* Row: Big Count + "of N" */}
      <div className="flex items-baseline gap-1.5 -mt-1">
        <span className="font-heading text-[36px] font-normal text-primary leading-none">
          {suspendedCount}
        </span>
        <span className="text-[11px] font-sans text-primary/60 leading-none">
          of {total}
        </span>
      </div>

      {/* Bottom: Dot Matrix (one 14px circle per vendor/rider, gap 6px, wrapping) */}
      <div className="flex items-center flex-wrap gap-1.5 max-h-[36px] overflow-hidden">
        {items.map((item, idx) => {
          const isSuspended = item.status === 'Suspended';
          return (
            <div
              key={item.id || idx}
              title={`${item.name} (${item.status})`}
              className={`w-[14px] h-[14px] rounded-full flex-shrink-0 transition-colors ${
                isSuspended ? 'bg-primary shadow-xs' : 'bg-neutral'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
