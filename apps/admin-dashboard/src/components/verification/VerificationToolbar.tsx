import React from 'react';
import { ChevronDown } from 'lucide-react';
import { VerificationStatus } from '../../data/verification';
import { CustomSelect } from '../common/CustomSelect';
import { SearchInput } from '../common/SearchInput';

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
    <div className="w-full flex items-center justify-between gap-3 sm:gap-4 flex-wrap select-none pt-1 min-w-0 max-w-full">
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

      {/* Right: Search input (with clear X) + Status select */}
      <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap sm:flex-nowrap min-w-0 max-w-full">
        {/* Search input with Clear (X) button */}
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search name or city"
          containerClassName="w-full sm:w-[220px] min-w-0 flex-1 sm:flex-initial"
          className="h-[36px] bg-white border border-black/[0.08] rounded-full focus:ring-2 focus:ring-secondary shadow-sm"
        />

        {/* Status select dropdown */}
        <CustomSelect
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as 'All' | VerificationStatus)}
          className="h-[36px] px-3.5 text-xs font-sans bg-white border border-black/[0.08] rounded-full text-ink cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm"
          aria-label="Filter by verification status"
        >
          <option value="All">All status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Reupload">Re-upload asked</option>
        </CustomSelect>
      </div>
    </div>
  );
};
