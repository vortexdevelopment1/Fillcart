import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { VerificationStatus } from '../../data/verification';

interface VerificationToolbarProps {
  activeTab: 'All' | 'Riders' | 'Vendors';
  onTabChange: (tab: 'All' | 'Riders' | 'Vendors') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: 'All' | VerificationStatus;
  onStatusChange: (status: 'All' | VerificationStatus) => void;
}

export const VerificationToolbar: React.FC<VerificationToolbarProps> = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
}) => {
  const tabs: ('All' | 'Riders' | 'Vendors')[] = ['All', 'Riders', 'Vendors'];

  return (
    <div className="w-full flex items-center justify-between gap-4 flex-wrap select-none pt-1">
      {/* Left: Pill Tabs [All | Riders | Vendors] in soft black-5% container */}
      <div className="inline-flex items-center p-1 rounded-full bg-neutral gap-1 overflow-x-auto no-scrollbar max-w-full min-w-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`px-[clamp(10px,2.5vw,16px)] py-[clamp(5px,1.5vw,6px)] rounded-full text-[clamp(11px,2.8vw,12px)] sm:text-xs font-sans transition-all whitespace-nowrap flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-secondary ${
                isActive
                  ? 'bg-primary text-white font-medium shadow-sm'
                  : 'text-ink/60 hover:text-ink font-normal'
              }`}
              aria-pressed={isActive}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Right: Search input (pill, 210px) + Status select */}
      <div className="flex items-center gap-3">
        {/* Search input */}
        <div className="relative w-[210px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink/45 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search name or city"
            className="w-full h-[36px] pl-8 pr-3 text-xs font-sans bg-white border border-black/[0.08] rounded-full text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm"
          />
        </div>

        {/* Status select dropdown */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as 'All' | VerificationStatus)}
            className="h-[36px] pl-3.5 pr-8 text-xs font-sans bg-white border border-black/[0.08] rounded-full text-ink cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm"
            aria-label="Filter by verification status"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Reupload">Re-upload asked</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink/55 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
