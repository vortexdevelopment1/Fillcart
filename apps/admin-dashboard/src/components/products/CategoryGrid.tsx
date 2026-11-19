import React, { useState, useMemo } from 'react';
import { Category } from '../../data/products';
import {
  Plus,
  Pencil,
  Power,
  Search,
  ChevronDown,
  ShoppingBag,
  Milk,
  Apple,
  Coffee,
  Sparkles,
  Home,
  Soup,
  Croissant,
} from 'lucide-react';

interface CategoryGridProps {
  categories: Category[];
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  onToggleStatus: (categoryId: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  onAddCategory,
  onEditCategory,
  onToggleStatus,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  // Helper icon mapper
  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Milk':
        return <Milk className="w-5 h-5 text-ink stroke-[1.5]" />;
      case 'Apple':
        return <Apple className="w-5 h-5 text-ink stroke-[1.5]" />;
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-ink stroke-[1.5]" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-ink stroke-[1.5]" />;
      case 'Home':
        return <Home className="w-5 h-5 text-ink stroke-[1.5]" />;
      case 'Soup':
        return <Soup className="w-5 h-5 text-ink stroke-[1.5]" />;
      case 'Croissant':
        return <Croissant className="w-5 h-5 text-ink stroke-[1.5]" />;
      case 'ShoppingBag':
      default:
        return <ShoppingBag className="w-5 h-5 text-ink stroke-[1.5]" />;
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      if (statusFilter === 'Active' && !c.isActive) return false;
      if (statusFilter === 'Inactive' && c.isActive) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        if (!c.name.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [categories, search, statusFilter]);

  return (
    <div className="w-full space-y-4 select-none">
      {/* Category Toolbar: Search + Status Filter */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-white p-4 rounded-[20px] border border-primary/10 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="font-sans text-[14px] font-normal text-ink">
            All Categories ({filteredCategories.length})
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Search */}
          <div className="relative w-[180px] sm:w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink/45 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search category..."
              className="w-full h-[34px] pl-8 pr-3 text-xs font-sans bg-white border border-primary/10 rounded-full text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'All' | 'Active' | 'Inactive')}
              className="h-[34px] pl-3 pr-7 text-xs font-sans bg-white border border-primary/10 rounded-full text-ink cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink/55 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Grid of Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* First Card: Dashed + Add Category Card */}
        <button
          type="button"
          onClick={onAddCategory}
          className="rounded-[24px] border-2 border-dashed border-black/20 hover:border-primary bg-white/50 hover:bg-white p-5 flex flex-col items-center justify-center min-h-[170px] cursor-pointer transition-all group focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <div className="w-12 h-12 rounded-full bg-primary/20 group-hover:bg-primary text-white flex items-center justify-center transition-colors mb-2.5">
            <Plus className="w-6 h-6 stroke-[2]" />
          </div>
          <span className="font-sans text-[13px] font-normal text-ink group-hover:text-ink">
            + Add New Category
          </span>
          <span className="font-sans text-[11px] text-ink/50 mt-0.5">
            Create catalog classification
          </span>
        </button>

        {/* Category Cards */}
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            className="rounded-[24px] bg-white border border-primary/10 shadow-[0_8px_24px_rgba(18, 55, 71, 0.06)] p-5 flex flex-col justify-between min-h-[170px] hover:border-secondary transition-all"
          >
            {/* Top row: Icon tile + Status Badge */}
            <div className="flex items-start justify-between">
              {/* Category Icon Tile (SECONDARY) */}
              <div className="w-11 h-11 rounded-[14px] bg-secondary flex items-center justify-center border border-primary/10">
                {renderCategoryIcon(cat.iconName)}
              </div>

              {/* Status Badge */}
              {cat.isActive ? (
                <span className="px-2.5 py-0.5 rounded-[8px] bg-primary text-white text-[11px] font-sans font-normal">
                  Active
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-[8px] bg-white border border-black text-ink text-[11px] font-sans font-normal">
                  Inactive
                </span>
              )}
            </div>

            {/* Middle: Name & Product count */}
            <div className="my-2">
              <h4 className="font-sans text-[14px] font-normal text-ink leading-tight">
                {cat.name}
              </h4>
              <span className="font-sans text-[11px] text-ink/55 block mt-0.5 leading-none">
                {cat.productCount} products listed
              </span>
            </div>

            {/* Bottom: [Edit] [Disable/Enable] Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/[0.06]">
              <button
                type="button"
                onClick={() => onEditCategory(cat)}
                className="px-3 py-1 rounded-full text-xs font-sans text-ink hover:bg-black/5 flex items-center gap-1.5 transition-colors"
              >
                <Pencil className="w-3 h-3 stroke-[1.5]" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleStatus(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-sans border transition-all flex items-center gap-1.5 ${
                  cat.isActive
                    ? 'border-black text-ink hover:bg-black/5'
                    : 'border-black bg-black text-white hover:opacity-90'
                }`}
              >
                <Power className="w-3 h-3 stroke-[1.5]" />
                <span>{cat.isActive ? 'Disable' : 'Enable'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
