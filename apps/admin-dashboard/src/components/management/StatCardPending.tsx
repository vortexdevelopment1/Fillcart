import React from 'react';
import { useNavigate } from 'react-router-dom';

interface StatCardPendingProps {
  pendingCount: number;
  total: number;
  pendingPeople: { id: string; initials: string; name: string }[];
  type: 'vendor' | 'rider';
}

export const StatCardPending: React.FC<StatCardPendingProps> = ({
  pendingCount,
  total,
  pendingPeople,
  type,
}) => {
  const navigate = useNavigate();
  const safeTotal = total || 1;
  const percent = Math.min(100, Math.round((pendingCount / safeTotal) * 100));

  // Up to 3 overlapping avatars
  const avatars = pendingPeople.slice(0, 3);

  const handleReviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/document-verification?type=${type}`);
  };

  return (
    <div
      onClick={handleReviewClick}
      className="h-[130px] rounded-[22px] p-[14px_16px] bg-neutral text-ink flex flex-col justify-between overflow-hidden select-none relative shadow-sm border border-primary/10 cursor-pointer hover:border-secondary transition-all"
    >
      {/* Top Title */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-sans text-primary font-normal leading-tight">
          Pending Verification
        </span>
      </div>

      {/* Row: Big Count + Overlapping Avatars + Review Button */}
      <div className="flex items-center justify-between gap-2 -mt-1">
        <span className="font-heading text-[36px] font-normal text-primary leading-none">
          {pendingCount}
        </span>

        <div className="flex items-center gap-2">
          {/* Overlapping Initials Avatars */}
          {avatars.length > 0 && (
            <div className="flex items-center">
              {avatars.map((person, idx) => (
                <div
                  key={person.id}
                  style={{ marginLeft: idx === 0 ? 0 : -8, zIndex: 10 - idx }}
                  className="w-[28px] h-[28px] rounded-full bg-white border-2 border-secondary/40 flex items-center justify-center text-[9px] font-sans font-medium text-primary shadow-xs flex-shrink-0"
                  title={person.name}
                >
                  {person.initials}
                </div>
              ))}
            </div>
          )}

          {/* Small BLACK "Review" pill (26px high, 10px text) */}
          <button
            type="button"
            onClick={handleReviewClick}
            className="h-[26px] px-3 rounded-full bg-primary text-white text-[10px] font-sans font-medium flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-xs flex-shrink-0"
          >
            Review
          </button>
        </div>
      </div>

      {/* Bottom: 8px hatched progress bar + caption */}
      <div className="w-full flex flex-col gap-1">
        <div className="w-full h-[8px] rounded-full bg-primary/10 overflow-hidden relative">
          <div
            style={{
              width: `${Math.max(pendingCount > 0 ? 8 : 0, percent)}%`,
              backgroundColor: '#FFFFFF',
              backgroundImage:
                'repeating-linear-gradient(45deg, #123747 0 1px, transparent 1px 2.5px)',
            }}
            className="h-full rounded-full transition-all duration-500 ease-out"
          />
        </div>

        <span className="text-[10px] font-sans text-primary/70 leading-none">
          {pendingCount} of {total} awaiting documents review
        </span>
      </div>
    </div>
  );
};
