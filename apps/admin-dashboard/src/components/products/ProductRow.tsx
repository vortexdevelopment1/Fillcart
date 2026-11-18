import React from 'react';
import { Product } from '../../data/products';
import { Pencil, Trash2, Check, X, Ban, CheckCircle2 } from 'lucide-react';

interface ProductRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onApprove?: (product: Product) => void;
  onReject?: (product: Product) => void;
  onToggleStatus?: (product: Product) => void;
}

export const ProductRow: React.FC<ProductRowProps> = ({
  product,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onToggleStatus,
}) => {
  return (
    <tr className="border-b border-primary/10 hover:bg-neutral/40 transition-colors select-none h-[44px]">
      {/* 1. Item Column: initials tile + name (matches reference) */}
      <td className="py-1 px-3 min-w-[200px]">
        <div className="flex items-center gap-2.5">
          <div className="w-[36px] h-[36px] rounded-[12px] bg-neutral text-primary font-sans text-xs flex items-center justify-center font-medium flex-shrink-0 select-none">
            {(product.brand || product.name || 'PR').substring(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h4 className="font-sans text-[12px] font-normal text-ink truncate leading-tight">
              {product.name}
            </h4>
            <span className="font-sans text-[10px] text-ink/55 leading-none block mt-0.5">
              {product.sku} · {product.unit}
            </span>
          </div>
        </div>
      </td>

      {/* 2. Brand Column */}
      <td className="py-1 px-2.5 text-[11px] font-sans font-medium text-ink whitespace-nowrap">
        {product.brand || 'Fillkart'}
      </td>

      {/* 3. Category */}
      <td className="py-1 px-2.5 text-[11px] font-sans text-ink/75 whitespace-nowrap">
        {product.category}
      </td>

      {/* 4. Vendor */}
      <td className="py-1 px-2.5 text-[11px] font-sans text-ink whitespace-nowrap">
        {product.vendor || 'Fresh Mart Hub'}
      </td>

      {/* 5. MRP */}
      <td className="py-1 px-2.5 text-[11px] font-sans text-ink/50 line-through tabular-nums whitespace-nowrap">
        ₹{product.mrp}
      </td>

      {/* 6. Sale price */}
      <td className="py-1 px-2.5 text-[12px] font-medium font-sans text-ink tabular-nums whitespace-nowrap">
        ₹{product.salePrice}
      </td>

      {/* 7. Discount */}
      <td className="py-1 px-2.5 text-[11px] font-sans text-ink tabular-nums whitespace-nowrap">
        ↗ {product.discountPct}%
      </td>

      {/* 8. Items sold */}
      <td className="py-1 px-2.5 text-[11px] font-sans text-ink/70 tabular-nums whitespace-nowrap">
        {product.itemsSold}
      </td>

      {/* 9. Status Badge */}
      <td className="py-1 px-2.5 whitespace-nowrap">
        {product.status === 'Active' && (
          <span className="inline-block px-2.5 py-0.5 rounded-[6px] bg-primary text-white text-[10px] font-sans font-medium leading-none">
            Active
          </span>
        )}
        {product.status === 'Pending approval' && (
          <span className="inline-block px-2.5 py-0.5 rounded-[6px] bg-secondary text-white text-[10px] font-sans font-medium leading-none">
            Pending approval
          </span>
        )}
        {product.status === 'Inactive' && (
          <span className="inline-block px-2.5 py-0.5 rounded-[6px] bg-white border border-primary text-primary text-[10px] font-sans font-medium leading-none">
            Inactive
          </span>
        )}
        {product.status === 'Rejected' && (
          <span className="inline-block px-2.5 py-0.5 rounded-[6px] bg-white border border-secondary text-secondary text-[10px] font-sans font-medium leading-none" title={product.rejectReason}>
            Rejected
          </span>
        )}
      </td>

      {/* 10. Actions */}
      <td className="py-1 px-3 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1 text-ink/60">
          {product.status === 'Pending approval' && (
            <>
              <button
                type="button"
                onClick={() => onApprove?.(product)}
                className="p-1 rounded-full hover:bg-neutral text-primary hover:opacity-85 transition-colors"
                title="Approve Product"
                aria-label={`Approve ${product.name}`}
              >
                <Check className="w-3.5 h-3.5 stroke-[2.2]" />
              </button>
              <button
                type="button"
                onClick={() => onReject?.(product)}
                className="p-1 rounded-full hover:bg-neutral text-secondary hover:opacity-85 transition-colors"
                title="Reject Product"
                aria-label={`Reject ${product.name}`}
              >
                <X className="w-3.5 h-3.5 stroke-[2.2]" />
              </button>
            </>
          )}

          {product.status === 'Active' && (
            <button
              type="button"
              onClick={() => onToggleStatus?.(product)}
              className="p-1 rounded-full hover:bg-neutral text-ink/60 hover:text-ink transition-colors"
              title="Disable Product (Set Inactive)"
              aria-label={`Disable ${product.name}`}
            >
              <Ban className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>
          )}

          {product.status === 'Inactive' && (
            <button
              type="button"
              onClick={() => onToggleStatus?.(product)}
              className="p-1 rounded-full hover:bg-neutral text-primary hover:opacity-85 transition-colors"
              title="Enable Product (Set Active)"
              aria-label={`Enable ${product.name}`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>
          )}

          <button
            type="button"
            onClick={() => onEdit(product)}
            className="p-1 rounded-full hover:bg-neutral hover:text-ink transition-colors"
            title="Edit Product"
            aria-label={`Edit ${product.name}`}
          >
            <Pencil className="w-3.5 h-3.5 stroke-[1.5]" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(product)}
            className="p-1 rounded-full hover:bg-neutral hover:text-ink transition-colors"
            title="Delete Product"
            aria-label={`Delete ${product.name}`}
          >
            <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
          </button>
        </div>
      </td>
    </tr>
  );
};
