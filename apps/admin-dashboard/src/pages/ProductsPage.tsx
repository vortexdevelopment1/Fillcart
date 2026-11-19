import React, { useState, useMemo } from 'react';
import { Plus, Upload, FileText } from 'lucide-react';
import {
  initialProducts,
  initialCategories,
  Product,
  Category,
} from '../data/products';
import { StatCardBlack } from '../components/products/StatCardBlack';
import { StatCardPrimary } from '../components/products/StatCardPrimary';
import { TopCategoriesChart } from '../components/products/TopCategoriesChart';
import { CategoryBars } from '../components/products/CategoryBars';
import { ProductTable } from '../components/products/ProductTable';
import { CategoryGrid } from '../components/products/CategoryGrid';
import { ProductModal } from '../components/products/ProductModal';
import { CategoryModal } from '../components/products/CategoryModal';
import { ConfirmModal } from '../components/products/ConfirmModal';
import { ProductReportModal } from '../components/products/ProductReportModal';
import { useApp } from '../context/AppContext';

export const ProductsPage: React.FC = () => {
  // State for products and categories
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  // Active top tab: 'Products' | 'Categories'
  const [activeTab, setActiveTab] = useState<'Products' | 'Categories'>('Products');

  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const { logAudit, settings } = useApp();
  const allowPharmacy = settings?.onboarding?.allowPharmacy ?? true;

  const displayCategories = useMemo(() => {
    if (allowPharmacy) return categories;
    return categories.filter((c) => !c.name.toLowerCase().includes('pharmacy'));
  }, [categories, allowPharmacy]);

  const [deleteItem, setDeleteItem] = useState<{
    type: 'product' | 'category';
    id: string;
    name: string;
  } | null>(null);

  // Toast state
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  // Status handlers
  const handleApproveProduct = (product: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, status: 'Active', isActive: true } : p))
    );
    showToast(`Approved "${product.name}"`);
    logAudit?.('Approve', 'Products', product.name, 'Approved vendor product listing', 'Admin Audit');
  };

  const handleRejectProduct = (product: Product, reason: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, status: 'Rejected', rejectReason: reason, isActive: false } : p))
    );
    showToast(`Rejected "${product.name}" (${reason})`);
    logAudit?.('Update', 'Products', product.name, `Rejected listing: ${reason}`, 'Admin Audit');
  };

  const handleToggleProductStatus = (product: Product) => {
    const nextStatus = product.status === 'Active' ? 'Inactive' : 'Active';
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, status: nextStatus, isActive: nextStatus === 'Active' } : p))
    );
    showToast(`Marked "${product.name}" as ${nextStatus}`);
    logAudit?.('Update', 'Products', product.name, `Toggled status to ${nextStatus}`, 'Admin Audit');
  };

  // Total stats calculations
  const totalProductsCount = products.length;
  const activeCategoriesCount = displayCategories.filter((c: Category) => c.isActive).length;
  const totalCategoriesCount = displayCategories.length;

  // Handlers for Product CRUD
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setDeleteItem({
      type: 'product',
      id: product.id,
      name: product.name,
    });
  };

  const handleSaveProduct = (productData: Partial<Product>) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? ({ ...p, ...productData } as Product) : p))
      );
      showToast(`Updated "${productData.name || editingProduct.name}"`);
    } else {
      const mrpVal = productData.mrp ?? 100;
      const saleVal = productData.salePrice ?? mrpVal;
      const discount = mrpVal > 0 ? Math.round(((mrpVal - saleVal) / mrpVal) * 100) : 0;

      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: productData.name || 'New Item',
        category: productData.category || (categories[0]?.name ?? 'Grocery & Staples'),
        vendor: productData.vendor || 'Fresh Mart Hub',
        mrp: mrpVal,
        salePrice: saleVal,
        discountPct: discount > 0 ? discount : 0,
        itemsSold: 0,
        status: productData.status || 'Active',
        sku: productData.sku || `SKU-${Date.now().toString().slice(-6)}`,
        brand: productData.brand || 'Fillkart Essentials',
        unit: productData.unit || '1 kg',
        description: productData.description || '',
        isActive: productData.isActive ?? true,
      };
      setProducts((prev) => [newProduct, ...prev]);
      showToast(`Added "${newProduct.name}" to catalogue`);
    }
    setIsProductModalOpen(false);
  };

  // Handlers for Category CRUD
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleToggleCategoryStatus = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === categoryId) {
          const nextActive = !c.isActive;
          showToast(`Marked "${c.name}" as ${nextActive ? 'Active' : 'Inactive'}`);
          return { ...c, isActive: nextActive };
        }
        return c;
      })
    );
  };

  const handleSaveCategory = (categoryData: Partial<Category>) => {
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? ({ ...c, ...categoryData } as Category) : c))
      );
      showToast(`Updated category "${categoryData.name || editingCategory.name}"`);
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: categoryData.name || 'New Category',
        iconName: categoryData.iconName || 'ShoppingBag',
        productCount: 0,
        isActive: categoryData.isActive ?? true,
      };
      setCategories((prev) => [...prev, newCat]);
      showToast(`Created category "${newCat.name}"`);
    }
    setIsCategoryModalOpen(false);
  };

  // Confirm delete handler
  const handleConfirmDelete = () => {
    if (!deleteItem) return;

    if (deleteItem.type === 'product') {
      setProducts((prev) => prev.filter((p) => p.id !== deleteItem.id));
      showToast(`Deleted "${deleteItem.name}"`);
    } else {
      setCategories((prev) => prev.filter((c) => c.id !== deleteItem.id));
      showToast(`Deleted category "${deleteItem.name}"`);
    }
    setDeleteItem(null);
  };

  // Export statistics handler
  const handleExport = () => {
    showToast('Exporting catalogue statistics report...');
    setTimeout(() => {
      showToast('Catalogue report exported successfully');
    }, 1200);
  };

  return (
    <div className="w-full flex flex-col pb-8">
      {/* ──────────────── 1. TOOLBAR ROW ────────────────
          Between page header and Row 1 cards: flex, justify-between, flex-wrap, margin-bottom 14px */}
      <div className="flex items-center justify-between gap-3 flex-wrap min-h-[40px] mb-[14px] flex-shrink-0">
        {/* Left: pill tabs [Products | Categories] (active = PRIMARY, container black 5% bg) */}
        <div className="h-[36px] p-0.5 rounded-full bg-neutral flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('Products')}
            className={`h-[32px] px-4 rounded-full text-[12px] font-sans font-medium transition-all ${
              activeTab === 'Products'
                ? 'bg-primary text-white font-medium shadow-xs'
                : 'text-primary/70 hover:text-primary'
            }`}
          >
            Products
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('Categories')}
            className={`h-[32px] px-4 rounded-full text-[12px] font-sans font-medium transition-all ${
              activeTab === 'Categories'
                ? 'bg-primary text-white font-medium shadow-xs'
                : 'text-primary/70 hover:text-primary'
            }`}
          >
            Categories
          </button>
        </div>

        {/* Right: "Product report", "Export", "+ Add Category", "+ Add Product". */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Product Report Button */}
          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="h-[36px] px-4 rounded-full border border-primary/15 bg-white text-ink text-[12px] font-sans font-medium hover:bg-neutral transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 stroke-[1.75]" />
            <span>Product report</span>
          </button>

          {/* Export Button: outline pill with upload icon */}
          <button
            type="button"
            onClick={handleExport}
            className="h-[36px] px-4 rounded-full border border-primary/15 bg-white text-ink text-[12px] font-sans font-medium hover:bg-neutral transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Upload className="w-3.5 h-3.5 stroke-[1.75]" />
            <span>Export</span>
          </button>

          {/* + Add Category (Outline Pill) */}
          <button
            type="button"
            onClick={handleOpenAddCategory}
            className="h-[36px] px-4 rounded-full border border-primary/15 bg-white text-ink text-[12px] font-sans font-medium hover:bg-neutral transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </button>

          {/* + Add Product (Black Pill) */}
          <button
            type="button"
            onClick={handleOpenAddProduct}
            className="h-[36px] px-4 rounded-full bg-primary text-white text-[12px] font-sans font-medium hover:opacity-90 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* ──────────────── ROW 1: FOUR CARDS IN ONE ROW (Height: 200px) ────────────────
          Desktop: 0.85fr 0.85fr 1.15fr 1.15fr
          All 4 cards: height 200px, radius 22px, padding 14px 16px */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[0.85fr_0.85fr_1.15fr_1.15fr] gap-[14px] items-stretch mb-[14px] flex-shrink-0">
        {/* Card 1: Total Products (BLACK card) */}
        <StatCardBlack totalCount={totalProductsCount} />

        {/* Card 2: Total Categories (PRIMARY card) */}
        <StatCardPrimary
          categoryCount={totalCategoriesCount}
          activeCount={activeCategoriesCount}
        />

        {/* Card 3: Top Categories (Clean Donut) */}
        <TopCategoriesChart />

        {/* Card 4: Sales by Category */}
        <CategoryBars />
      </div>

      {/* ──────────────── PRODUCT LIST / CATEGORIES CARD (FULL WIDTH, DIRECTLY BELOW ROW 1) ──────────────── */}
      <div className="w-full flex-1 min-h-0">
        {activeTab === 'Products' ? (
          <ProductTable
            products={products}
            categories={displayCategories}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onApproveProduct={handleApproveProduct}
            onRejectProduct={handleRejectProduct}
            onToggleStatus={handleToggleProductStatus}
          />
        ) : (
          <CategoryGrid
            categories={displayCategories}
            onAddCategory={handleOpenAddCategory}
            onEditCategory={handleEditCategory}
            onToggleStatus={handleToggleCategoryStatus}
          />
        )}
      </div>

      {/* Modals */}
      <ProductReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        products={products}
      />

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
        categories={displayCategories}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        category={editingCategory}
      />

      <ConfirmModal
        isOpen={!!deleteItem}
        title={deleteItem?.type === 'product' ? 'Delete Product' : 'Delete Category'}
        message={`Are you sure you want to delete "${deleteItem?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteItem(null)}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-primary text-white px-5 py-2.5 rounded-full text-xs font-medium shadow-xl flex items-center gap-2 pointer-events-none animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
};
