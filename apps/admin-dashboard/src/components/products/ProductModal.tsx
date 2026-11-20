import React, { useState, useEffect } from 'react';
import { Product, Category } from '../../data/products';
import { CustomSelect } from '../common/CustomSelect';
import { X, Image as ImageIcon } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: (product: Partial<Product>) => void;
}

const AVAILABLE_VENDORS = [
  'Fresh Mart Hub',
  'Royal Kirana',
  'Sharma Dairy',
  'Green Grocers',
  'City Supermarket',
];

export const AVAILABLE_BRANDS = [
  'Aashirvaad',
  'Amul',
  'Fortune',
  'Tata',
  'Parle',
  'Nestle',
  'Brooke Bond',
  'Other',
];

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  product,
  categories,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(product);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [vendor, setVendor] = useState('Fresh Mart Hub');
  const [sku, setSku] = useState('');
  const [brand, setBrand] = useState('');
  const [mrp, setMrp] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [unit, setUnit] = useState('1 kg');
  const [status, setStatus] = useState<Product['status']>('Active');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setVendor(product.vendor || 'Fresh Mart Hub');
      setSku(product.sku);
      setBrand(product.brand);
      setMrp(product.mrp);
      setSalePrice(product.salePrice);
      setUnit(product.unit);
      setStatus(product.status || 'Active');
      setDescription(product.description || '');
      setIsActive(product.isActive);
    } else {
      setName('');
      setCategory(categories[0]?.name || 'Grocery & Staples');
      setVendor('Fresh Mart Hub');
      setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
      setBrand('');
      setMrp(100);
      setSalePrice(90);
      setUnit('1 kg');
      setStatus('Active');
      setDescription('');
      setIsActive(true);
    }
  }, [product, categories, isOpen]);

  // Lock scroll and listen to Escape
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const discountPct = mrp > 0 ? Math.max(0, Math.round(((mrp - salePrice) / mrp) * 100)) : 0;

    onSave({
      id: product?.id,
      name: name.trim(),
      category,
      vendor,
      sku: sku.trim(),
      brand: brand.trim() || 'Fillkart Essentials',
      mrp: Number(mrp),
      salePrice: Number(salePrice),
      unit,
      description: description.trim(),
      discountPct,
      itemsSold: product?.itemsSold || 0,
      status,
      isActive,
    });
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 transition-all duration-200"
      style={{
        backgroundColor: 'rgba(18, 55, 71, 0.35)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
      role="dialog"
      aria-modal="true"
      aria-label={isEditing ? 'Edit Product' : 'Add Product'}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[calc(100vw-24px)] min-[780px]:w-[min(780px,calc(100vw-32px))] max-h-[calc(100dvh-48px)] bg-white rounded-[24px] shadow-[0_24px_60px_rgba(18, 55, 71, 0.25)] flex flex-col overflow-hidden relative select-none animate-fade-in"
      >
        {/* Modal Header */}
        <div className="p-[20px_24px] border-b border-primary/10 flex items-center justify-between flex-shrink-0 bg-white">
          <div>
            <h3 className="font-heading text-[18px] text-ink font-normal leading-tight">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h3>
            <span className="font-sans text-[11px] text-ink/55 block mt-0.5">
              Fill in product catalogue, vendor, and pricing specifications
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-neutral flex items-center justify-center text-ink/55 hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-secondary"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-ink" />
          </button>
        </div>

        {/* Modal Body: Form in 2-column grid */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            {/* 1. Product Name */}
            <div>
              <label className="block text-ink/70 mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aashirvaad Atta 5kg"
                className="w-full h-[38px] px-3 rounded-lg border border-black/[0.12] focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            {/* 2. Category Select */}
            <div>
              <label className="block text-ink/70 mb-1">Category *</label>
              <CustomSelect
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-[38px] px-3 rounded-lg border border-black/[0.12] bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </CustomSelect>
            </div>

            {/* 3. Vendor Select */}
            <div>
              <label className="block text-ink/70 mb-1">Vendor *</label>
              <CustomSelect
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="w-full h-[38px] px-3 rounded-lg border border-black/[0.12] bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                {AVAILABLE_VENDORS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </CustomSelect>
            </div>

            {/* 4. SKU */}
            <div>
              <label className="block text-ink/70 mb-1">SKU / Item Code</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. AAS-ATT-5KG"
                className="w-full h-[38px] px-3 rounded-lg border border-black/[0.12] focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            {/* 5. Brand */}
            <div>
              <label className="block text-ink/70 mb-1">Brand Name *</label>
              <CustomSelect
                value={brand || AVAILABLE_BRANDS[0]}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full h-[38px] px-3 rounded-lg border border-black/[0.12] bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                {AVAILABLE_BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </CustomSelect>
            </div>

            {/* 6. Measurement Unit */}
            <div>
              <label className="block text-ink/70 mb-1">Measurement Unit</label>
              <CustomSelect
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full h-[38px] px-3 rounded-lg border border-black/[0.12] bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="1 kg">1 kg</option>
                <option value="5 kg">5 kg</option>
                <option value="500 g">500 g</option>
                <option value="1 L">1 L</option>
                <option value="500 ml">500 ml</option>
                <option value="1 Pack">1 Pack</option>
                <option value="12-Pack">12-Pack</option>
                <option value="1 Piece">1 Piece</option>
              </CustomSelect>
            </div>

            {/* 7. MRP */}
            <div>
              <label className="block text-ink/70 mb-1">MRP (₹) *</label>
              <input
                type="number"
                min="0"
                required
                value={mrp}
                onChange={(e) => setMrp(Number(e.target.value))}
                className="w-full h-[38px] px-3 rounded-lg border border-black/[0.12] focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            {/* 8. Sale Price */}
            <div>
              <label className="block text-ink/70 mb-1">Sale Price (₹) *</label>
              <input
                type="number"
                min="0"
                required
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
                className="w-full h-[38px] px-3 rounded-lg border border-black/[0.12] focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            {/* 9. Status Select */}
            <div className="sm:col-span-2">
              <label className="block text-ink/70 mb-1">Catalogue Status</label>
              <CustomSelect
                value={status}
                onChange={(e) => setStatus(e.target.value as Product['status'])}
                className="w-full h-[38px] px-3 rounded-lg border border-black/[0.12] bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="Active">Active</option>
                <option value="Pending approval">Pending approval</option>
                <option value="Inactive">Inactive</option>
              </CustomSelect>
            </div>

            {/* 10. Description (Full width) */}
            <div className="sm:col-span-2">
              <label className="block text-ink/70 mb-1">Product Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description of ingredients, pack size, storage details..."
                className="w-full p-2.5 rounded-lg border border-black/[0.12] focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
              />
            </div>

            {/* 11. Image Upload Box (Dashed placeholder) */}
            <div className="sm:col-span-2">
              <label className="block text-ink/70 mb-1">Product Image</label>
              <div className="w-full border-2 border-dashed border-primary/15 hover:border-primary rounded-[16px] p-4 flex items-center justify-center gap-4 bg-white/70 cursor-pointer transition-colors group">
                <div className="w-12 h-12 rounded-[12px] bg-neutral flex items-center justify-center border border-primary/10">
                  <ImageIcon className="w-5 h-5 text-ink/60 group-hover:text-ink transition-colors" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-normal text-ink block">
                    Click to browse or drop product PNG / JPG
                  </span>
                  <span className="text-[11px] text-ink/50 block mt-0.5">
                    Recommended 600x600 px
                  </span>
                </div>
              </div>
            </div>

            {/* 12. Visibility Toggle */}
            <div className="sm:col-span-2 flex items-center justify-between p-3 rounded-[12px] bg-black/[0.03] border border-primary/10">
              <div>
                <span className="font-normal text-ink block">Product Visibility</span>
                <span className="text-[11px] text-ink/50 block">
                  Active products appear live in the customer mobile app
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 focus:outline-none focus:ring-2 focus:ring-secondary ${
                  isActive ? 'bg-primary' : 'bg-primary/20'
                }`}
                aria-pressed={isActive}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    isActive ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-primary/10 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-sans bg-white border border-primary/25 text-primary hover:bg-neutral transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-xs font-sans bg-primary text-white font-medium hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
              {isEditing ? 'Update Product' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
