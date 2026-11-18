import React, { useState } from 'react';
import { Order, OrderStatus } from '../../data/ordersData';
import { initialRiders } from '../../data/riders';
import {
  X,
  Bike,
  User,
  Store,
  MapPin,
  Clock,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  RotateCcw,
  Ban,
  ArrowRight,
} from 'lucide-react';
import { OrderCancelModal } from './OrderCancelModal';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onAssignRider: (
    orderId: string,
    rider: { id: string; name: string; phone: string; vehicleType: string }
  ) => void;
  onCancelOrder: (orderId: string, reason: string, remarks?: string) => void;
  onRefundOrder: (orderId: string) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  onAssignRider,
  onCancelOrder,
  onRefundOrder,
}) => {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedRiderId, setSelectedRiderId] = useState('');

  if (!isOpen || !order) return null;

  const isReadOnly = order.status === 'Delivered' || order.status === 'Cancelled';

  // Filter available riders: Verified + Active + Online
  const availableRiders = initialRiders.filter(
    (r) => r.verificationStatus === 'Verified' && r.status === 'Active' && r.availability === 'Online'
  );

  // Status Progression allowed forward steps
  const nextStatusMap: Record<OrderStatus, OrderStatus | null> = {
    Placed: 'Preparing',
    Preparing: 'Out for delivery',
    'Out for delivery': 'Delivered',
    Delivered: null,
    Cancelled: null,
  };

  const nextStatus = nextStatusMap[order.status];

  const handleStatusAdvance = () => {
    if (nextStatus) {
      onUpdateStatus(order.id, nextStatus);
    }
  };

  const handleRiderAssignment = (riderId: string) => {
    const rider = availableRiders.find((r) => r.id === riderId);
    if (rider) {
      onAssignRider(order.id, {
        id: rider.id,
        name: rider.name,
        phone: rider.phone,
        vehicleType: rider.vehicleType,
      });
      setSelectedRiderId('');
    }
  };

  const timelineSteps: { key: string; label: string; time?: string; done: boolean }[] = [
    { key: 'placed', label: 'Placed', time: order.timeline.placedAt, done: true },
    {
      key: 'accepted',
      label: 'Vendor Accepted',
      time: order.timeline.acceptedAt,
      done: Boolean(order.timeline.acceptedAt) || order.status !== 'Placed',
    },
    {
      key: 'preparing',
      label: 'Preparing',
      time: order.timeline.preparingAt,
      done: order.status === 'Preparing' || order.status === 'Out for delivery' || order.status === 'Delivered',
    },
    {
      key: 'outForDelivery',
      label: 'Out for Delivery',
      time: order.timeline.outForDeliveryAt,
      done: order.status === 'Out for delivery' || order.status === 'Delivered',
    },
    {
      key: 'delivered',
      label: 'Delivered',
      time: order.timeline.deliveredAt,
      done: order.status === 'Delivered',
    },
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-[24px] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-primary/10 relative p-5 md:p-7 select-none">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-primary/10">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-heading text-xl md:text-2xl font-normal text-ink">
                  {order.orderNumber}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full font-sans text-xs font-medium bg-primary text-white">
                  {order.status}
                </span>
                {order.isRefunded && (
                  <span className="px-2 py-0.5 rounded-full font-sans text-[11px] font-medium bg-neutral text-primary border border-primary/20">
                    Refunded
                  </span>
                )}
              </div>
              <p className="font-sans text-xs text-ink/55 mt-0.5">
                Ordered on {order.date} at {order.time} · {order.paymentMethod}
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-neutral hover:bg-neutral/80 flex items-center justify-center text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-secondary"
              aria-label="Close details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Timeline */}
          <div className="py-4 border-b border-primary/10">
            <h4 className="font-sans text-xs font-medium text-ink/75 mb-3">Order Dispatch Pipeline</h4>
            {order.status === 'Cancelled' ? (
              <div className="p-3.5 rounded-2xl bg-neutral/60 border border-primary/15 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-sans text-xs font-medium text-primary">Order Cancelled</h5>
                  <p className="font-sans text-xs text-ink/75 mt-0.5">
                    Reason: <strong>{order.cancelReason}</strong>
                  </p>
                  {order.cancelRemarks && (
                    <p className="font-sans text-[11px] text-ink/55 mt-0.5">Remarks: {order.cancelRemarks}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-2 text-center relative">
                {timelineSteps.map((step, idx) => (
                  <div key={step.key} className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 text-xs font-medium ${
                        step.done
                          ? 'bg-primary text-white'
                          : 'bg-neutral text-ink/40 border border-primary/15'
                      }`}
                    >
                      {step.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <span
                      className={`font-sans text-[10px] md:text-[11px] font-medium leading-tight ${
                        step.done ? 'text-primary' : 'text-ink/40'
                      }`}
                    >
                      {step.label}
                    </span>
                    {step.time && (
                      <span className="font-sans text-[9px] text-ink/50 mt-0.5">{step.time}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3 Columns: Customer, Vendor, Rider */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 py-4 border-b border-primary/10">
            {/* Customer */}
            <div className="p-3.5 rounded-2xl bg-neutral/40 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-primary" />
                <h4 className="font-sans text-xs font-medium text-ink">Customer</h4>
              </div>
              <p className="font-sans text-xs font-medium text-ink leading-tight">{order.customer.name}</p>
              <p className="font-sans text-[11px] text-ink/65 mt-0.5">{order.customer.phone}</p>
              <p className="font-sans text-[11px] text-ink/65 mt-0.5">{order.customer.email}</p>
              <div className="mt-2 pt-2 border-t border-primary/10 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                <p className="font-sans text-[11px] text-ink/75 leading-tight">{order.customer.address}</p>
              </div>
            </div>

            {/* Vendor */}
            <div className="p-3.5 rounded-2xl bg-neutral/40 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <Store className="w-4 h-4 text-primary" />
                <h4 className="font-sans text-xs font-medium text-ink">Store / Vendor</h4>
              </div>
              <p className="font-sans text-xs font-medium text-ink leading-tight">{order.vendor.name}</p>
              <p className="font-sans text-[11px] text-ink/65 mt-0.5">{order.vendor.phone}</p>
              <div className="mt-2 pt-2 border-t border-primary/10 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" />
                <p className="font-sans text-[11px] text-ink/75 leading-tight">{order.vendor.address}</p>
              </div>
            </div>

            {/* Rider */}
            <div className="p-3.5 rounded-2xl bg-neutral/40 border border-primary/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Bike className="w-4 h-4 text-secondary" />
                  <h4 className="font-sans text-xs font-medium text-ink">Assigned Rider</h4>
                </div>
              </div>

              {order.rider ? (
                <>
                  <p className="font-sans text-xs font-medium text-ink leading-tight">{order.rider.name}</p>
                  <p className="font-sans text-[11px] text-ink/65 mt-0.5">{order.rider.phone}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-secondary/15 text-primary text-[10px] font-medium">
                    {order.rider.vehicleType}
                  </span>
                </>
              ) : (
                <p className="font-sans text-xs text-secondary italic">No rider assigned yet</p>
              )}

              {/* Assign / Reassign Rider Dropdown */}
              {!isReadOnly && (
                <div className="mt-3 pt-2 border-t border-primary/10">
                  <label className="block font-sans text-[10px] font-medium text-ink/70 mb-1">
                    {order.rider ? 'Reassign Rider:' : 'Assign Available Rider:'}
                  </label>
                  <select
                    value={selectedRiderId}
                    onChange={(e) => {
                      setSelectedRiderId(e.target.value);
                      if (e.target.value) handleRiderAssignment(e.target.value);
                    }}
                    className="w-full px-2 py-1.5 rounded-lg border border-primary/20 bg-white font-sans text-[11px] text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    <option value="">Select active online rider...</option>
                    {availableRiders.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.vehicleType} · {r.city})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Items & Payment Breakdown */}
          <div className="py-4 border-b border-primary/10">
            <h4 className="font-sans text-xs font-medium text-ink/75 mb-2.5">
              Items Ordered ({order.items.length})
            </h4>
            <div className="border border-primary/10 rounded-2xl overflow-hidden mb-3">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral/60 border-b border-primary/10 text-[11px] font-sans font-medium text-ink/75">
                    <th className="py-2 px-3">Item</th>
                    <th className="py-2 px-3">Unit</th>
                    <th className="py-2 px-3 text-right">Price</th>
                    <th className="py-2 px-3 text-center">Qty</th>
                    <th className="py-2 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5 text-xs font-sans text-ink">
                  {order.items.map((it) => (
                    <tr key={it.id}>
                      <td className="py-2 px-3 font-medium">{it.name}</td>
                      <td className="py-2 px-3 text-ink/65">{it.unit}</td>
                      <td className="py-2 px-3 text-right">₹{it.price}</td>
                      <td className="py-2 px-3 text-center">{it.qty}</td>
                      <td className="py-2 px-3 text-right font-medium">₹{it.price * it.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-1 font-sans text-xs text-ink/75">
                <div className="flex justify-between">
                  <span>Item Subtotal:</span>
                  <span className="font-medium text-ink">₹{order.itemTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span className="font-medium text-ink">₹{order.deliveryFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (GST 5%):</span>
                  <span className="font-medium text-ink">₹{order.tax}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-primary/10 text-sm font-heading text-primary">
                  <span>Grand Total:</span>
                  <span className="font-normal">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Actions Footer */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* Refund Button */}
              {order.status === 'Cancelled' && !order.isRefunded && (
                <button
                  onClick={() => onRefundOrder(order.id)}
                  className="px-4 py-2 rounded-full bg-secondary text-white font-sans text-xs font-medium hover:bg-secondary/90 transition-colors shadow-sm flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Issue Full Refund (₹{order.totalAmount})</span>
                </button>
              )}

              {/* Cancel Button */}
              {!isReadOnly && (
                <button
                  onClick={() => setIsCancelModalOpen(true)}
                  className="px-4 py-2 rounded-full border border-primary/30 text-primary hover:bg-neutral font-sans text-xs font-medium transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Cancel Order</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full border border-primary/20 text-ink font-sans text-xs font-medium hover:bg-neutral transition-colors"
              >
                Close
              </button>

              {/* Forward Status Advance */}
              {!isReadOnly && nextStatus && (
                <button
                  type="button"
                  onClick={handleStatusAdvance}
                  className="px-5 py-2 rounded-full bg-primary text-white font-sans text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <span>Advance to {nextStatus}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      <OrderCancelModal
        isOpen={isCancelModalOpen}
        orderNumber={order.orderNumber}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={(reason, remarks) => {
          onCancelOrder(order.id, reason, remarks);
        }}
      />
    </>
  );
};
