import React, { useState, useEffect } from 'react';
import { X, Milk, Apple, ShoppingBag, Sparkles, Coffee, Soup, Croissant, Home, Check } from 'lucide-react';
import { Category } from '../../data/products';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Partial<Category>) => void;
  category?: Category | null;
}

const AVAILABLE_ICONS = [
  { name: 'Milk', icon: Milk },
  { name: 'Apple', icon: Apple },
  { name: 'ShoppingBag', icon: ShoppingBag },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Coffee', icon: Coffee },
  { name: 'Soup', icon: Soup },
  { name: 'Croissant', icon: Croissant },
  { name: 'Home', icon: Home },
];

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  category,
}) => {
  const [name, setName] = useState('');
  const [iconName, setIconName] = useState('ShoppingBag');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setIconName(category.iconName || 'ShoppingBag');
      setIsActive(category.isActive);
    } else {
      setName('');
      setIconName('ShoppingBag');
      setIsActive(true);
    }
    setError('');
  }, [category, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    onSave({
      name: name.trim(),
      iconName,
      isActive,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#123747]/35 backdrop-blur-[6px] animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[500px] bg-white rounded-[24px] shadow-[0_24px_60px_rgba(18, 55, 71, 0.25)] border border-primary/10 overflow-hidden flex flex-col animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-primary/10">
          <div>
            <h2 className="font-heading text-[20px] font-normal text-ink leading-tight">
              {category ? 'Edit Category' : 'Add New Category'}
            </h2>
            <p className="font-sans text-[12px] text-ink/55 mt-0.5">
              Organize products in your catalogue
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/[0.04] hover:bg-black/[0.08] flex items-center justify-center text-ink/70 hover:text-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {/* Category Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-ink">
              Category Name <span className="text-ink/50">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Dairy & Eggs"
              className="h-10 px-3.5 rounded-full border border-black/[0.12] text-[13px] text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            {error && <p className="text-[11px] text-ink font-medium">{error}</p>}
          </div>

          {/* Select Icon */}
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-medium text-ink">Choose Icon</label>
            <div className="grid grid-cols-4 gap-2.5">
              {AVAILABLE_ICONS.map((item) => {
                const IconComp = item.icon;
                const isSelected = iconName === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setIconName(item.name)}
                    className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-[16px] border transition-all ${
                      isSelected
                        ? 'border-primary bg-secondary text-white shadow-sm'
                        : 'border-primary/10 bg-white text-primary hover:bg-neutral'
                    }`}
                  >
                    <IconComp className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-primary'}`} />
                    <span className={`text-[11px] font-medium truncate max-w-full ${isSelected ? 'text-white' : 'text-primary'}`}>
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-[16px] border border-primary/10 bg-neutral">
            <div>
              <p className="text-[13px] font-medium text-primary">Category Status</p>
              <p className="text-[11px] text-primary/60">Active categories are visible to customers</p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isActive ? 'bg-primary' : 'bg-primary/20'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-primary/10">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-full border border-primary/25 text-[13px] font-medium text-primary hover:bg-neutral transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-6 rounded-full bg-primary text-white text-[13px] font-medium hover:opacity-90 transition-colors flex items-center gap-2 shadow-xs"
            >
              <Check className="w-4 h-4 text-white" />
              <span>{category ? 'Save Changes' : 'Create Category'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
