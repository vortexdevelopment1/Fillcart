import React, { useState, useMemo, useRef } from 'react';
import { Product, Category } from '../../data/products';
import { ProductRow } from './ProductRow';
import { CustomSelect } from '../common/CustomSelect';
import { SearchInput } from '../common/SearchInput';
import {
  Search,
  ChevronDown,
  SlidersHorizontal,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  categories: Category[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
  onApproveProduct?: (product: Product) => void;
  onRejectProduct?: (product: Product, reason: string) => void;
  onToggleStatus?: (product: Product) => void;
}

const BRAND_OPTIONS = [
  'All Brands',
  'Aashirvaad',
  'Amul',
  'Fortune',
  'Tata',
  'Parle',
  'Nestle',
  'Brooke Bond',
];

const REJECT_REASONS = [
  'Prohibited item',
  'Incorrect category',
  'Poor image quality',
  'Inaccurate pricing',
  'Duplicate listing',
];

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  categories,
  onEditProduct,
  onDeleteProduct,
  onApproveProduct,
  onRejectProduct,
  onToggleStatus,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [selectedTab, setSelectedTab] = useState<'All' | 'Active' | 'Needs approval' | 'Inactive'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Reject modal state
  const [rejectingProduct, setRejectingProduct] = useState<Product | null>(null);
  const [rejectReason, setRejectReason] = useState(REJECT_REASONS[0]);

  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Count of items needing approval
  const needsApprovalCount = useMemo(
    () => products.filter((p) => p.status === 'Pending approval').length,
    [products]
  );

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // 1. Tab filter
      if (selectedTab === 'Active' && prod.status !== 'Active') return false;
      if (selectedTab === 'Needs approval' && prod.status !== 'Pending approval') return false;
      if (selectedTab === 'Inactive' && prod.status !== 'Inactive') return false;

      // 2. Category filter
      if (selectedCategory !== 'All') {
        const normSelected = selectedCategory.trim().toLowerCase();
        const normProdCat = prod.category?.trim().toLowerCase() || '';
        const isGroceryMatch =
          normSelected.includes('grocer') && normProdCat.includes('grocer');
        if (normSelected !== normProdCat && !isGroceryMatch) return false;
      }

      // 3. Brand filter
      if (selectedBrand !== 'All Brands' && prod.brand !== selectedBrand) return false;

      // 4. Search query
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesName = prod.name.toLowerCase().includes(q);
        const matchesBrand = prod.brand.toLowerCase().includes(q);
        const matchesSku = prod.sku.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesSku) return false;
      }
      return true;
    });
  }, [products, search, selectedCategory, selectedBrand, selectedTab]);

  // Total pages and pagination bounds
  const totalFiltered = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));

  // Safe navigation with smooth scroll
  const goToPage = (page: number) => {
    const targetPage = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(targetPage);
    tableContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Slice visible rows for current page
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // Calculated display items
  const startItem = totalFiltered === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalFiltered);

  // Page numbers with ellipsis
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | '...')[] = [];
    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    pages.push(totalPages);
    return pages;
  }, [currentPage, totalPages]);

  // Keyboard navigation for pagination container
  const handlePaginationKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (currentPage > 1) {
        goToPage(currentPage - 1);
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (currentPage < totalPages) {
        goToPage(currentPage + 1);
      }
    }
  };

  return (
    <div className="w-full rounded-[20px] bg-white p-[14px] border border-primary/10 shadow-[0_8px_24px_rgba(18, 55, 71, 0.06)] select-none flex flex-col h-full min-h-[460px]">
      {/* Table Header Row: Title + Status Pill Tabs + Filters */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <h3 className="font-sans text-[13px] font-normal text-ink leading-tight">
              Product List
            </h3>
            <ArrowUpRight className="w-3.5 h-3.5 text-primary/60" />
          </div>

          {/* Pill tabs: All | Active | Needs approval (badge) | Inactive */}
          <div className="flex items-center p-0.5 rounded-full bg-neutral text-[11px] font-sans">
            <button
              type="button"
              onClick={() => { setSelectedTab('All'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-full transition-all ${
                selectedTab === 'All'
                  ? 'bg-primary text-white shadow-xs font-medium'
                  : 'text-primary/70 hover:text-primary'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => { setSelectedTab('Active'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-full transition-all ${
                selectedTab === 'Active'
                  ? 'bg-primary text-white shadow-xs font-medium'
                  : 'text-primary/70 hover:text-primary'
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => { setSelectedTab('Needs approval'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
                selectedTab === 'Needs approval'
                  ? 'bg-secondary text-white shadow-xs font-medium'
                  : 'text-primary/70 hover:text-primary'
              }`}
            >
              <span>Needs approval</span>
              {needsApprovalCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-primary text-white text-[9px] flex items-center justify-center font-bold">
                  {needsApprovalCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => { setSelectedTab('Inactive'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-full transition-all ${
                selectedTab === 'Inactive'
                  ? 'bg-primary text-white shadow-xs font-medium'
                  : 'text-primary/70 hover:text-primary'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Input */}
          <SearchInput
            value={search}
            onChange={(val) => {
              setSearch(val);
              setCurrentPage(1);
            }}
            placeholder="Search products..."
            containerClassName="w-[150px] sm:w-[170px]"
            className="h-[30px] pl-7 pr-7 text-[11px] bg-white border border-primary/10 rounded-full focus:ring-2 focus:ring-primary shadow-xs"
          />

          {/* Brand Select */}
          <CustomSelect
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setCurrentPage(1);
            }}
            className="h-[30px] px-2.5 text-[11px] font-sans bg-white border border-primary/10 rounded-full text-ink cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
          >
            {BRAND_OPTIONS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </CustomSelect>

          {/* Category Select */}
          <CustomSelect
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="h-[30px] px-2.5 text-[11px] font-sans bg-white border border-primary/10 rounded-full text-ink cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
          >
            <option value="All">All Categories</option>
            {Array.from(
              new Map(
                categories
                  .filter((c) => !/\d{6,}/.test(c.name))
                  .map((c) => [c.name.trim().toLowerCase(), c])
              ).values()
            ).map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </CustomSelect>

          {/* Filters icon button */}
          <button
            type="button"
            className="w-[30px] h-[30px] rounded-full bg-white border border-primary/10 flex items-center justify-center text-ink/70 hover:text-ink transition-colors shadow-xs"
            aria-label="More filters"
          >
            <SlidersHorizontal className="w-3 h-3 stroke-[1.5]" />
          </button>
        </div>
      </div>

      {/* Table Container with inner scroll and sticky header */}
      <div
        ref={tableContainerRef}
        className="w-full overflow-x-auto overflow-y-auto flex-1 min-h-[300px]"
      >
        <table className="w-full text-left border-collapse min-w-[840px]">
          <thead className="sticky top-0 bg-white z-10 shadow-[0_1px_0_rgba(18,55,71,0.08)]">
            <tr className="border-b border-primary/10 text-[11px] font-sans font-normal text-primary/60 bg-white">
              <th className="py-2.5 px-3 font-normal bg-white sticky left-0 z-20 shadow-[1px_0_0_rgba(18,55,71,0.08)]">Item</th>
              <th className="py-2.5 px-2.5 font-normal bg-white">Brand</th>
              <th className="py-2.5 px-2.5 font-normal bg-white">Category</th>
              <th className="py-2.5 px-2.5 font-normal bg-white">Vendor</th>
              <th className="py-2.5 px-2.5 font-normal bg-white">MRP</th>
              <th className="py-2.5 px-2.5 font-normal bg-white">Sale price</th>
              <th className="py-2.5 px-2.5 font-normal bg-white">Discount</th>
              <th className="py-2.5 px-2.5 font-normal bg-white">Items sold</th>
              <th className="py-2.5 px-2.5 font-normal bg-white">Status</th>
              <th className="py-2.5 px-3 font-normal text-right bg-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onEdit={onEditProduct}
                  onDelete={onDeleteProduct}
                  onApprove={onApproveProduct}
                  onReject={(p) => setRejectingProduct(p)}
                  onToggleStatus={onToggleStatus}
                />
              ))
            ) : (
              <tr>
                <td colSpan={10} className="py-12 text-center text-xs font-sans text-ink/50">
                  No products found matching filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ──────────── Table Footer / Pagination Row ────────────
          flex, justify-between, align-items center, pt-3, border-t 1px solid black 8%, pinned to bottom */}
      <div className="flex items-center justify-between pt-3 mt-auto border-t border-primary/10 flex-wrap gap-3 flex-shrink-0">
        {/* LEFT: "Showing 1-8 of 24 products" (11px, black 55%) */}
        <span className="text-[11px] font-sans text-primary/60 leading-none">
          Showing {startItem}-{endItem} of {totalFiltered.toLocaleString()} products
        </span>

        {/* RIGHT: pagination controls (flex, gap 6px, align-items center) */}
        <div
          tabIndex={0}
          onKeyDown={handlePaginationKeyDown}
          className="flex items-center gap-1.5 focus:outline-none"
          aria-label="Pagination Navigation"
        >
          {/* Page size select (small pill, 12px) */}
          <div className="mr-1">
            <CustomSelect
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              aria-label="Products per page"
              className="h-[32px] px-3 text-[12px] font-sans bg-white border border-primary/10 rounded-full text-ink cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
            >
              <option value={8}>8 / page</option>
              <option value={16}>16 / page</option>
              <option value={24}>24 / page</option>
            </CustomSelect>
          </div>

          {/* « First Button */}
          <button
            type="button"
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            title="First page"
            aria-label="First page"
            className="hidden sm:flex w-8 h-8 rounded-full items-center justify-center bg-white border border-primary/10 text-[12px] font-sans text-ink hover:bg-neutral focus:ring-2 focus:ring-primary focus:outline-none transition-colors disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          {/* < Previous Button */}
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            title="Previous page"
            aria-label="Previous page"
            className="flex w-8 h-8 rounded-full items-center justify-center bg-white border border-primary/10 text-[12px] font-sans text-ink hover:bg-neutral focus:ring-2 focus:ring-primary focus:outline-none transition-colors disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page numbers with ellipsis */}
          {pageNumbers.map((p, idx) => {
            if (p === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-8 h-8 flex items-center justify-center text-[12px] font-sans text-ink/40 select-none"
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
                onClick={() => goToPage(p)}
                aria-label={`Page ${p}`}
                aria-current={isActive ? 'page' : undefined}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-sans transition-all focus:ring-2 focus:ring-primary focus:outline-none ${
                  isActive
                    ? 'bg-primary text-white font-medium border-transparent shadow-xs'
                    : 'bg-white border border-primary/10 text-ink hover:bg-neutral'
                }`}
              >
                {p}
              </button>
            );
          })}

          {/* Next > Button */}
          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            title="Next page"
            aria-label="Next page"
            className="flex w-8 h-8 rounded-full items-center justify-center bg-white border border-primary/10 text-[12px] font-sans text-ink hover:bg-neutral focus:ring-2 focus:ring-primary focus:outline-none transition-colors disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Last » Button */}
          <button
            type="button"
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            title="Last page"
            aria-label="Last page"
            className="hidden sm:flex w-8 h-8 rounded-full items-center justify-center bg-white border border-primary/10 text-[12px] font-sans text-ink hover:bg-neutral focus:ring-2 focus:ring-primary focus:outline-none transition-colors disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reject Product Modal */}
      {rejectingProduct && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-white rounded-[20px] p-6 shadow-2xl border border-primary/10">
            <h3 className="font-heading text-[16px] text-ink font-normal mb-2">
              Reject Product Listing
            </h3>
            <p className="font-sans text-xs text-ink/70 mb-4">
              Select reason for rejecting <span className="font-medium text-ink">"{rejectingProduct.name}"</span>:
            </p>

            <div className="space-y-2 mb-5">
              {REJECT_REASONS.map((r) => (
                <label
                  key={r}
                  className={`flex items-center gap-2.5 p-2.5 rounded-[10px] border cursor-pointer text-xs font-sans transition-all ${
                    rejectReason === r
                      ? 'border-primary bg-neutral font-medium text-primary'
                      : 'border-primary/10 hover:bg-neutral/40 text-ink/80'
                  }`}
                >
                  <input
                    type="radio"
                    name="rejectReason"
                    value={r}
                    checked={rejectReason === r}
                    onChange={() => setRejectReason(r)}
                    className="accent-primary"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectingProduct(null)}
                className="px-4 py-2 rounded-full text-xs font-sans border border-primary/20 text-ink hover:bg-neutral transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onRejectProduct?.(rejectingProduct, rejectReason);
                  setRejectingProduct(null);
                }}
                className="px-4 py-2 rounded-full text-xs font-sans bg-primary text-white hover:opacity-90 transition-all font-medium"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
