import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
} from 'lucide-react';

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  itemLabel?: string;
}

export const PaginationControl: React.FC<PaginationControlProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  itemLabel = 'items',
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Compute pagination array (e.g. [1, 2, 3, '...', 15])
  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 mt-auto border-t border-primary/10 gap-3 flex-shrink-0 select-none">
      {/* Left: Showing x-y of N */}
      <span className="text-[11px] font-sans text-primary/60 leading-none">
        Showing {startItem}-{endItem} of {totalItems.toLocaleString()} {itemLabel}
      </span>

      {/* Right: Controls */}
      <div className="flex items-center flex-wrap gap-1.5 focus:outline-none" aria-label="Pagination">
        {/* Page size select */}
        <div className="relative mr-1">
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
            }}
            aria-label={`${itemLabel} per page`}
            className="h-[32px] pl-3 pr-7 text-[12px] font-sans bg-white border border-primary/10 rounded-full text-ink cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-secondary shadow-xs"
          >
            <option value={8}>8 / page</option>
            <option value={16}>16 / page</option>
            <option value={24}>24 / page</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-primary/60 pointer-events-none" />
        </div>

        {/* « First Button (hidden below 480px) */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          title="First page"
          aria-label="First page"
          className="hidden xs:flex w-8 h-8 rounded-full items-center justify-center bg-white border border-primary/10 text-[12px] font-sans text-primary hover:bg-neutral focus:ring-2 focus:ring-secondary focus:outline-none transition-colors disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-white"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* < Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Previous page"
          aria-label="Previous page"
          className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-primary/10 text-[12px] font-sans text-primary hover:bg-neutral focus:ring-2 focus:ring-secondary focus:outline-none transition-colors disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-white"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Number buttons */}
        {pages.map((p, idx) => {
          if (p === '...') {
            return (
              <span
                key={`ell-${idx}`}
                className="w-8 h-8 flex items-center justify-center text-[12px] font-sans text-ink/40"
              >
                ...
              </span>
            );
          }

          const isActive = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p}`}
              aria-current={isActive ? 'page' : undefined}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-sans transition-all focus:ring-2 focus:ring-secondary focus:outline-none ${
                isActive
                  ? 'bg-primary text-white font-medium border-transparent shadow-xs'
                  : 'bg-white border border-primary/10 text-primary hover:bg-neutral'
              }`}
            >
              {p}
            </button>
          );
        })}

        {/* > Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          title="Next page"
          aria-label="Next page"
          className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-primary/10 text-[12px] font-sans text-primary hover:bg-neutral focus:ring-2 focus:ring-secondary focus:outline-none transition-colors disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-white"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* » Last Button (hidden below 480px) */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0}
          title="Last page"
          aria-label="Last page"
          className="hidden xs:flex w-8 h-8 rounded-full items-center justify-center bg-white border border-primary/10 text-[12px] font-sans text-primary hover:bg-neutral focus:ring-2 focus:ring-secondary focus:outline-none transition-colors disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-white"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
