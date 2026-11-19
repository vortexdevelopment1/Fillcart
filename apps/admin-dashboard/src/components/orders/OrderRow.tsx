import React from 'react';
import { Order } from '../../data/ordersData';
import { Bike, Eye, UserCheck, AlertCircle } from 'lucide-react';

interface OrderRowProps {
  order: Order;
  onView: (order: Order) => void;
}

export const OrderRow: React.FC<OrderRowProps> = ({ order, onView }) => {
  // Status Badge styling per prompt rules:
  // - Delivered: PRIMARY bg, white text
  // - Out for delivery: SECONDARY bg, white text
  // - Preparing: SECONDARY 18% bg + PRIMARY text + 1px border
  // - Placed: white bg + 1px PRIMARY border + PRIMARY text
  // - Cancelled: white bg + 1px PRIMARY border + PRIMARY text
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return 'bg-primary text-white border-transparent';
      case 'Out for delivery':
        return 'bg-secondary text-white border-transparent';
      case 'Preparing':
        return 'bg-secondary/18 text-primary border border-secondary/35';
      case 'Placed':
        return 'bg-white text-primary border border-primary';
      case 'Cancelled':
        return 'bg-neutral text-primary/70 border border-primary/20';
      default:
        return 'bg-neutral text-primary';
    }
  };

  return (
    <div className="w-full rounded-[20px] bg-white border border-primary/10 shadow-[0_2px_8px_rgba(18,55,71,0.03)] hover:border-secondary hover:bg-neutral/20 transition-all p-[12px_18px] select-none">
      <div className="grid grid-cols-[1fr_auto] min-[1280px]:grid-cols-[180px_minmax(180px,1.5fr)_160px_100px_130px_70px] gap-3 items-center">
        {/* Col 1: Order ID + Date + Payment method */}
        <div>
          <div className="flex items-center gap-2">
            <span className="font-sans font-medium text-[13px] text-primary">
              {order.orderNumber}
            </span>
            <span className="px-1.5 py-0.5 rounded-[4px] bg-neutral text-ink/75 font-sans text-[10px] font-medium border border-primary/10">
              {order.paymentMethod}
            </span>
          </div>
          <span className="font-sans text-[11px] text-ink/55 block mt-0.5">
            {order.date} · {order.time}
          </span>
        </div>

        {/* Col 2: Customer + Vendor */}
        <div className="hidden min-[1280px]:block min-w-0">
          <h4 className="font-sans text-[13px] font-medium text-ink truncate leading-tight">
            {order.customer.name}
          </h4>
          <span className="font-sans text-[11px] text-ink/60 truncate block mt-0.5">
            From: <strong className="text-primary font-medium">{order.vendor.name}</strong>
          </span>
        </div>

        {/* Col 3: Rider */}
        <div className="hidden min-[1280px]:block min-w-0">
          {order.rider ? (
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-secondary/15 flex items-center justify-center flex-shrink-0">
                <Bike className="w-3 h-3 text-secondary" />
              </div>
              <div className="truncate">
                <span className="font-sans text-[12px] font-medium text-ink block leading-none truncate">
                  {order.rider.name}
                </span>
                <span className="font-sans text-[10px] text-ink/50 leading-none block mt-0.5">
                  {order.rider.vehicleType}
                </span>
              </div>
            </div>
          ) : order.status === 'Cancelled' ? (
            <span className="font-sans text-[11px] text-ink/40 italic">Not required</span>
          ) : (
            <div className="flex items-center gap-1.5 text-secondary">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="font-sans text-[11px] font-medium">Unassigned</span>
            </div>
          )}
        </div>

        {/* Col 4: Amount */}
        <div className="hidden min-[1280px]:block">
          <span className="font-heading text-[15px] font-normal text-ink block leading-tight">
            ₹{order.totalAmount.toLocaleString()}
          </span>
          <span className="font-sans text-[10px] text-ink/50 block">
            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Col 5: Status Badge */}
        <div className="flex items-center justify-start">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full font-sans text-[11px] font-medium whitespace-nowrap leading-none ${getStatusBadge(
              order.status
            )}`}
          >
            {order.status}
          </span>
        </div>

        {/* Col 6: View Button */}
        <div className="flex justify-end xs:flex hidden">
          <button
            onClick={() => onView(order)}
            className="h-[32px] px-3.5 rounded-full bg-white border border-primary/20 text-primary hover:bg-primary hover:text-white font-sans text-xs font-medium transition-all shadow-2xs flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-secondary"
            aria-label={`View details of order ${order.orderNumber}`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View</span>
          </button>
        </div>
      </div>

      {/* ──────────── LINE 2 FOR < 1280px (CHIPS) ──────────── */}
      <div className="flex min-[1280px]:hidden flex-wrap items-center gap-2 mt-2 pt-2 border-t border-primary/5 text-[11px] font-sans">
        {/* Amount */}
        <span className="font-heading font-medium text-ink px-2 py-0.5 rounded-full bg-neutral">
          ₹{order.totalAmount.toLocaleString()} ({order.items.length} items)
        </span>

        {/* Customer */}
        <span className="px-2 py-0.5 rounded-full bg-neutral text-ink/80">
          Cust: <strong className="font-medium text-ink">{order.customer.name}</strong>
        </span>

        {/* Vendor */}
        <span className="px-2 py-0.5 rounded-full bg-neutral text-ink/80">
          From: <strong className="font-medium text-primary">{order.vendor.name}</strong>
        </span>

        {/* Rider */}
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral text-ink/75">
          <Bike className="w-3 h-3 text-secondary" />
          {order.rider ? (
            <span>{order.rider.name} ({order.rider.vehicleType})</span>
          ) : order.status === 'Cancelled' ? (
            <span className="italic">No rider needed</span>
          ) : (
            <span className="text-secondary font-medium">Unassigned</span>
          )}
        </span>

        {/* Full-width View on < 480px */}
        <div className="w-full xs:hidden pt-1.5">
          <button
            onClick={() => onView(order)}
            className="w-full h-[32px] rounded-full bg-white border border-primary/20 text-primary hover:bg-primary hover:text-white font-sans text-xs font-medium transition-all shadow-2xs flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-secondary"
            aria-label={`View details of order ${order.orderNumber}`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};
