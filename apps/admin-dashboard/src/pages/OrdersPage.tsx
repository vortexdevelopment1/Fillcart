import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../data/ordersData';
import { OrderRow } from '../components/orders/OrderRow';
import { OrderDetailsModal } from '../components/orders/OrderDetailsModal';
import { OrdersActivityCard } from '../components/charts/OrdersActivityCard';
import { HatchBar } from '../components/common/HatchBar';
import {
  Search,
  Filter,
  RotateCcw,
  ShoppingBag,
  CheckCircle2,
  Clock,
  Ban,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const {
    orders,
    assignmentMode,
    setAssignmentMode,
    updateOrderStatus,
    assignRider,
    cancelOrder,
    refundOrder,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Stats calculation
  const totalOrdersCount = orders.length;
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;
  const inProgressCount = orders.filter(
    (o) => o.status === 'Placed' || o.status === 'Preparing' || o.status === 'Out for delivery'
  ).length;
  const unassignedCount = orders.filter(
    (o) => !o.rider && (o.status === 'Placed' || o.status === 'Preparing')
  ).length;
  const cancelledCount = orders.filter((o) => o.status === 'Cancelled').length;

  const deliveredPct = Math.round((deliveredCount / totalOrdersCount) * 100) || 0;
  const inProgressPct = Math.round((inProgressCount / totalOrdersCount) * 100) || 0;
  const cancelledPct = Math.round((cancelledCount / totalOrdersCount) * 100) || 0;

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      if (selectedStatus !== 'All' && ord.status !== selectedStatus) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesNumber = ord.orderNumber.toLowerCase().includes(q);
        const matchesCustomer = ord.customer.name.toLowerCase().includes(q);
        const matchesVendor = ord.vendor.name.toLowerCase().includes(q);
        if (!matchesNumber && !matchesCustomer && !matchesVendor) return false;
      }
      return true;
    });
  }, [orders, search, selectedStatus]);

  // Pagination
  const totalFiltered = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  const handleViewOrder = (order: Order) => {
    setActiveOrder(order);
    setIsDetailsOpen(true);
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedStatus('All');
    setCurrentPage(1);
  };

  const renderStatCards = () => (
    <>
      {/* 1. Total Orders: PRIMARY */}
      <div className="p-4 rounded-[22px] bg-primary text-white shadow-sm flex flex-col justify-between min-h-[118px]">
        <div className="flex items-center justify-between">
          <span className="font-sans text-xs font-medium text-white/80">Total Orders</span>
          <ShoppingBag className="w-4 h-4 text-white/70" />
        </div>
        <div>
          <span className="font-heading text-2xl font-normal text-white leading-none block">
            {totalOrdersCount}
          </span>
          <span className="font-sans text-[11px] text-white/75 mt-0.5 block">
            Platform-wide mock volume
          </span>
        </div>
        <HatchBar progress={100} colorScheme="primary" height={8} />
      </div>

      {/* 2. Delivered: SECONDARY */}
      <div className="p-4 rounded-[22px] bg-secondary text-white shadow-sm flex flex-col justify-between min-h-[118px]">
        <div className="flex items-center justify-between">
          <span className="font-sans text-xs font-medium text-white/80">Delivered</span>
          <CheckCircle2 className="w-4 h-4 text-white/70" />
        </div>
        <div>
          <span className="font-heading text-2xl font-normal text-white leading-none block">
            {deliveredCount}
          </span>
          <span className="font-sans text-[11px] text-white/75 mt-0.5 block">
            {deliveredPct}% fulfillment rate
          </span>
        </div>
        <HatchBar progress={deliveredPct} colorScheme="secondary" height={8} />
      </div>

      {/* 3. In Progress: NEUTRAL */}
      <div className="p-4 rounded-[22px] bg-neutral border border-primary/10 shadow-sm flex flex-col justify-between min-h-[118px]">
        <div className="flex items-center justify-between">
          <span className="font-sans text-xs font-medium text-ink/75">In Progress</span>
          <div className="flex items-center gap-1.5">
            {unassignedCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-medium bg-primary text-white shadow-2xs">
                {unassignedCount} unassigned
              </span>
            )}
            <Clock className="w-4 h-4 text-primary" />
          </div>
        </div>
        <div>
          <span className="font-heading text-2xl font-normal text-primary leading-none block">
            {inProgressCount}
          </span>
          <span className="font-sans text-[11px] text-ink/60 mt-0.5 block">
            Placed, preparing & out
          </span>
        </div>
        <HatchBar progress={inProgressPct} colorScheme="neutral" height={8} />
      </div>

      {/* 4. Cancelled: White */}
      <div className="p-4 rounded-[22px] bg-white border border-primary/15 shadow-sm flex flex-col justify-between min-h-[118px]">
        <div className="flex items-center justify-between">
          <span className="font-sans text-xs font-medium text-ink/75">Cancelled</span>
          <Ban className="w-4 h-4 text-primary" />
        </div>
        <div>
          <span className="font-heading text-2xl font-normal text-primary leading-none block">
            {cancelledCount}
          </span>
          <span className="font-sans text-[11px] text-ink/60 mt-0.5 block">
            {cancelledPct}% exception rate
          </span>
        </div>
        <HatchBar progress={cancelledPct} colorScheme="white" height={8} />
      </div>
    </>
  );

  return (
    <div className="pb-12 w-full">
      {/* BELOW 1280px: 4 stat cards move ABOVE the page content as a 2x2 grid (<640px: 1 col) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 min-[1280px]:hidden mb-[14px]">
        {renderStatCards()}
      </div>

      {/* NEW LAYOUT (desktop >= 1280px):
          display: grid;
          grid-template-columns: minmax(0, 1fr) 270px;
          column-gap: 16px;
          align-items: start;
      */}
      <div
        style={{
          transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="grid grid-cols-1 min-[1280px]:grid-cols-[minmax(0,1fr)_270px] min-[1280px]:gap-x-[16px] items-start w-full"
      >
        {/* LEFT COLUMN (min-width: 0, flex column, gap 14px), top to bottom:
            1) the Orders heatmap card (title "Orders", number, badge, Week/Month pills, heatmap, day labels)
            2) the toolbar (search, filter icon, status select)
            3) the order rows
            4) the pagination footer
        */}
        <div className="flex flex-col gap-[14px] min-w-0 w-full">
          {/* 1) Orders heatmap card */}
          <div className="w-full min-w-0">
            <OrdersActivityCard />
          </div>

          {/* 2) Toolbar */}
          <div className="p-3.5 rounded-[22px] bg-white border border-primary/10 shadow-[0_2px_8px_rgba(18,55,71,0.02)] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-1 min-w-[240px]">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-ink/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by order #, customer, or vendor..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-1.5 rounded-full border border-primary/15 bg-neutral/40 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white transition-all"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-ink/50" />
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 rounded-full border border-primary/15 bg-neutral/40 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="All">All Statuses ({totalOrdersCount})</option>
                  <option value="Placed">Placed</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Right: Assignment Mode Toggle & Reset */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 p-1 rounded-full bg-neutral border border-primary/10">
                <span className="text-[11px] font-sans text-primary/70 pl-2 hidden sm:inline">
                  Assignment mode:
                </span>
                <div className="flex items-center bg-white rounded-full p-0.5 border border-primary/15 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setAssignmentMode('Manual')}
                    className={`px-3 py-1 rounded-full text-[11px] font-sans font-medium transition-all ${
                      assignmentMode === 'Manual'
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-primary/70 hover:text-primary'
                    }`}
                  >
                    Manual
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssignmentMode('Auto')}
                    className={`px-3 py-1 rounded-full text-[11px] font-sans font-medium transition-all ${
                      assignmentMode === 'Auto'
                        ? 'bg-secondary text-white shadow-xs'
                        : 'text-primary/70 hover:text-primary'
                    }`}
                  >
                    Auto
                  </button>
                </div>
              </div>

              {(search || selectedStatus !== 'All') && (
                <button
                  onClick={resetFilters}
                  className="px-3 py-1.5 rounded-full border border-primary/20 text-ink/75 hover:bg-neutral font-sans text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* 3) Order Rows */}
          <div className="space-y-2.5">
            {paginatedOrders.length === 0 ? (
              <div className="p-12 text-center rounded-[20px] bg-white border border-primary/10">
                <ShoppingBag className="w-10 h-10 text-primary/30 mx-auto mb-2" />
                <h4 className="font-heading text-base font-normal text-ink">No matching orders found</h4>
                <p className="font-sans text-xs text-ink/50 mt-1">Try clearing filters or search terms</p>
                <button
                  onClick={resetFilters}
                  className="mt-3 px-4 py-1.5 rounded-full bg-primary text-white font-sans text-xs font-medium"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              paginatedOrders.map((order) => (
                <OrderRow key={order.id} order={order} onView={handleViewOrder} />
              ))
            )}
          </div>

          {/* 4) Pagination Footer */}
          {totalFiltered > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 px-1">
              <span className="font-sans text-xs text-ink/60">
                Showing{' '}
                <strong className="text-ink">
                  {(currentPage - 1) * pageSize + 1} -{' '}
                  {Math.min(currentPage * pageSize, totalFiltered)}
                </strong>{' '}
                of <strong className="text-ink">{totalFiltered}</strong> orders
              </span>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded-lg bg-white border border-primary/15 disabled:opacity-30 flex items-center justify-center text-ink hover:bg-neutral transition-colors"
                    aria-label="First page"
                  >
                    <ChevronsLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded-lg bg-white border border-primary/15 disabled:opacity-30 flex items-center justify-center text-ink hover:bg-neutral transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  <span className="px-3 py-1 font-sans text-xs font-medium text-ink">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 rounded-lg bg-white border border-primary/15 disabled:opacity-30 flex items-center justify-center text-ink hover:bg-neutral transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 rounded-lg bg-white border border-primary/15 disabled:opacity-30 flex items-center justify-center text-ink hover:bg-neutral transition-colors"
                    aria-label="Last page"
                  >
                    <ChevronsRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-primary/15 bg-white font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value={8}>8 / page</option>
                  <option value={16}>16 / page</option>
                  <option value={24}>24 / page</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (270px, display flex column, gap 14px, position: sticky; top: 16px):
            the 4 stat cards stacked vertically, in this order: Total Orders (PRIMARY), Delivered
            (SECONDARY), In Progress (NEUTRAL), Cancelled (white).
        */}
        <div className="hidden min-[1280px]:flex flex-col gap-[14px] w-[270px] flex-shrink-0 sticky top-[16px]">
          {renderStatCards()}
        </div>
      </div>

      {/* View / Manage Order Details Modal */}
      <OrderDetailsModal
        order={activeOrder}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setActiveOrder(null);
        }}
        onUpdateStatus={(orderId, status) => {
          updateOrderStatus(orderId, status);
          if (activeOrder && activeOrder.id === orderId) {
            setActiveOrder({ ...activeOrder, status });
          }
        }}
        onAssignRider={(orderId, rider) => {
          assignRider(orderId, rider);
          if (activeOrder && activeOrder.id === orderId) {
            setActiveOrder({ ...activeOrder, rider });
          }
        }}
        onCancelOrder={(orderId, reason, remarks) => {
          cancelOrder(orderId, reason, remarks);
          if (activeOrder && activeOrder.id === orderId) {
            setActiveOrder({ ...activeOrder, status: 'Cancelled', cancelReason: reason, cancelRemarks: remarks });
          }
        }}
        onRefundOrder={(orderId) => {
          refundOrder(orderId);
          if (activeOrder && activeOrder.id === orderId) {
            setActiveOrder({ ...activeOrder, isRefunded: true });
          }
        }}
      />
    </div>
  );
};
