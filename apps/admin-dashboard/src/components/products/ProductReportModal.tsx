import React from 'react';
import { Product } from '../../data/products';
import { X, Download, FileText } from 'lucide-react';

interface ProductReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export const ProductReportModal: React.FC<ProductReportModalProps> = ({
  isOpen,
  onClose,
  products,
}) => {
  if (!isOpen) return null;

  const totalCatalog = products.length;
  const approvedItems = products.filter((p) => p.status === 'Active').length;
  const pendingItems = products.filter((p) => p.status === 'Pending approval').length;
  const inactiveItems = products.filter((p) => p.status === 'Inactive').length;

  const top5Items = [...products].sort((a, b) => b.itemsSold - a.itemsSold).slice(0, 5);

  const handleDownloadCSV = () => {
    const headers = ['Product ID', 'Name', 'Brand', 'Category', 'Vendor', 'Price', 'Items Sold', 'Status'];
    const rows = products.map((p) => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.brand || ''}"`,
      `"${p.category}"`,
      `"${p.vendor || ''}"`,
      p.salePrice,
      p.itemsSold,
      p.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fillkart-product-report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-xs select-none"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-[24px] shadow-2xl border border-primary/10 overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-[20px_24px] border-b border-primary/10 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-neutral text-primary flex items-center justify-center">
              <FileText className="w-4 h-4 stroke-[1.75]" />
            </div>
            <div>
              <h3 className="font-heading text-[18px] text-ink font-normal leading-tight">
                Product Catalog Report
              </h3>
              <p className="font-sans text-[11px] text-ink/60 mt-0.5">
                Catalog availability, status breakdown and sales performance
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-neutral flex items-center justify-center text-ink/60 hover:text-ink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* 4 KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-[16px] bg-neutral border border-primary/10">
              <span className="text-[11px] font-sans text-primary/70 block">Total Items</span>
              <span className="font-heading text-[22px] text-primary block mt-1">{totalCatalog}</span>
            </div>
            <div className="p-3.5 rounded-[16px] bg-neutral border border-primary/10">
              <span className="text-[11px] font-sans text-primary/70 block">Active Items</span>
              <span className="font-heading text-[22px] text-primary block mt-1">{approvedItems}</span>
            </div>
            <div className="p-3.5 rounded-[16px] bg-neutral border border-primary/10">
              <span className="text-[11px] font-sans text-primary/70 block">Pending Approval</span>
              <span className="font-heading text-[22px] text-secondary block mt-1">{pendingItems}</span>
            </div>
            <div className="p-3.5 rounded-[16px] bg-neutral border border-primary/10">
              <span className="text-[11px] font-sans text-primary/70 block">Inactive Items</span>
              <span className="font-heading text-[22px] text-primary/50 block mt-1">{inactiveItems}</span>
            </div>
          </div>

          {/* Top 5 Items Sold */}
          <div>
            <h4 className="font-sans text-[13px] font-medium text-ink mb-2.5">
              Top 5 Best-Selling Products
            </h4>
            <div className="border border-primary/10 rounded-[14px] overflow-hidden">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="bg-neutral text-primary/70 border-b border-primary/10">
                    <th className="py-2 px-3 font-normal">Rank</th>
                    <th className="py-2 px-3 font-normal">Item</th>
                    <th className="py-2 px-3 font-normal">Brand</th>
                    <th className="py-2 px-3 font-normal">Price</th>
                    <th className="py-2 px-3 font-normal text-right">Units Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {top5Items.map((p, idx) => (
                    <tr key={p.id} className="border-b border-primary/5 hover:bg-neutral/40 transition-colors">
                      <td className="py-2 px-3 text-primary/60 font-medium">#{idx + 1}</td>
                      <td className="py-2 px-3 font-medium text-ink">{p.name}</td>
                      <td className="py-2 px-3 text-ink/75">{p.brand || 'Fillkart'}</td>
                      <td className="py-2 px-3 text-ink">₹{p.salePrice}</td>
                      <td className="py-2 px-3 text-right font-medium text-primary">{p.itemsSold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-[14px_24px] border-t border-primary/10 bg-neutral/30 flex items-center justify-between flex-shrink-0">
          <span className="text-[11px] font-sans text-ink/60">
            Generated on {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-[34px] px-4 rounded-full border border-primary/20 text-ink text-xs font-sans hover:bg-neutral transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="h-[34px] px-4 rounded-full bg-primary text-white text-xs font-sans font-medium hover:opacity-90 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
