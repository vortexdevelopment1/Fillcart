import { create } from 'zustand';
import { Order, initialOrders, OrderStatus } from '../data/ordersData';
import {
  PaymentTransaction,
  MonthlyStatement,
  initialTransactions,
  initialStatements,
} from '../data/paymentsData';
import {
  StaffMember,
  initialStaff,
  initialRolePermissions,
  RolePermissions,
  ModuleName,
  ActionName,
  SUPER_ADMIN_PERMISSIONS,
} from '../data/staffData';
import { AuditLogEntry, initialAuditLogs, AuditAction, AuditDiff } from '../data/auditData';
import { Product, initialProducts, Category, initialCategories } from '../data/products';
import { initialRiders, Rider } from '../data/riders';
import { initialVendors, Vendor } from '../data/vendors';
import { SystemSettings } from '../types/settings';
import { initialSettings } from '../data/settingsData';
import {
  getVendorChecklist,
  RIDER_BASE_DOCS,
  isRiderDocApplicable,
  VENDOR_VERIFICATION_STEP,
  RIDER_VERIFICATION_STEP,
} from '../config/onboardingDocs';

export interface DashboardData {
  customers: number;
  vendors: number;
  riders: number;
  ordersToday: number;
  revenueToday: number;
  activeDeliveries: number;
  commissionToday: number;
  refundToday: number;
  activeUsers: number;
}

export type AuditLogCategory =
  | 'Admin Audit'
  | 'API'
  | 'User Activity'
  | 'Payment'
  | 'Order'
  | 'Security';

export interface ExtendedAuditLogEntry extends AuditLogEntry {
  category: AuditLogCategory;
}

interface AppStoreState {
  // Loading & Error states
  isLoading: boolean;
  errorMessage: string | null;
  setLoading: (loading: boolean) => void;
  setError: (msg: string | null) => void;

  // 1. Dashboard
  dashboard: DashboardData;

  // 2. Orders & Assignment Mode (Manual | Auto)
  orders: Order[];
  assignmentMode: 'Manual' | 'Auto';
  setAssignmentMode: (mode: 'Manual' | 'Auto') => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  assignRider: (
    orderId: string,
    rider: { id: string; name: string; phone: string; vehicleType: string }
  ) => void;
  cancelOrder: (orderId: string, reason: string, remarks?: string) => void;
  refundOrder: (orderId: string) => void;

  // 3. Payments & Settlements
  transactions: PaymentTransaction[];
  statements: MonthlyStatement[];
  releasePayout: (transactionId: string) => void;
  processSettlement: (transactionIds: string[]) => void;
  generateStatement: (month: string, year: number, partyName?: string) => void;

  // 4. Products & Categories (Brand, Approval Flow, Disable/Enable)
  products: Product[];
  categories: Category[];
  approveProduct: (id: string) => void;
  rejectProduct: (id: string, reason: string) => void;
  disableProduct: (id: string) => void;
  enableProduct: (id: string) => void;
  addProduct: (product: Partial<Product>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Omit<Category, 'id' | 'itemsCount'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // 5. Users (Vendors, Riders, Customers)
  vendors: Vendor[];
  riders: Rider[];
  suspendBlockVendor: (id: string, reason: string) => void;
  unblockVendor: (id: string) => void;
  setVendorActive: (id: string, active: boolean) => void;
  suspendBlockRider: (id: string, reason: string) => void;
  unblockRider: (id: string) => void;
  setRiderActive: (id: string, active: boolean) => void;

  // 6. Staff & RBAC
  staff: StaffMember[];
  roles: Record<string, RolePermissions>;
  currentRole: string;
  setCurrentRole: (role: string) => void;
  hasPermission: (module: ModuleName, action: ActionName) => boolean;
  addStaff: (data: { name: string; email: string; phone: string; role: string; isActive: boolean }) => void;
  updateStaff: (id: string, updates: Partial<StaffMember>) => void;
  toggleStaffActive: (id: string) => boolean;
  deleteStaff: (id: string) => boolean;
  saveRolePermissions: (role: string, permissions: RolePermissions) => void;
  addCustomRole: (role: string) => void;

  // 7. Audit Logs with 6 tabs & retention
  auditLogs: ExtendedAuditLogEntry[];
  logAudit: (
    action: AuditAction,
    module: string,
    target: string,
    details: string,
    category?: AuditLogCategory,
    diff?: AuditDiff[]
  ) => void;

  // 8. System Settings
  settings: SystemSettings;
  updateSettings: (newSettings: SystemSettings) => void;
}

// Convert initial audit logs to extended with categories
const seededAuditLogs: ExtendedAuditLogEntry[] = initialAuditLogs.map((l, idx) => {
  let cat: AuditLogCategory = 'Admin Audit';
  if (l.action === 'Login' || idx % 7 === 0) cat = 'Security';
  else if (l.module === 'Payments') cat = 'Payment';
  else if (l.module === 'Orders') cat = 'Order';
  else if (idx % 5 === 0) cat = 'API';
  else if (idx % 6 === 0) cat = 'User Activity';
  return { ...l, category: cat };
});

export const useAppStore = create<AppStoreState>((set, get) => ({
  isLoading: false,
  errorMessage: null,
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (msg) => set({ errorMessage: msg }),

  // 1. Dashboard KPIs matching the document:
  dashboard: {
    customers: 12540,
    vendors: 315,
    riders: 486,
    ordersToday: 1860,
    revenueToday: 245000,
    activeDeliveries: 126,
    commissionToday: 29400,
    refundToday: 3850,
    activeUsers: 1243,
  },

  // 2. Orders & Assignment Mode
  orders: initialOrders,
  assignmentMode: 'Manual',

  setAssignmentMode: (mode) => {
    const oldMode = get().assignmentMode;
    const oldSettings = get().settings;
    set({
      assignmentMode: mode,
      settings: oldSettings
        ? {
            ...oldSettings,
            orders: {
              ...oldSettings.orders,
              assignmentMode: mode,
            },
          }
        : initialSettings,
    });

    get().logAudit(
      'Update',
      'Settings',
      'Order Assignment Mode',
      `Switched dispatch assignment mode from "${oldMode}" to "${mode}"`,
      'Admin Audit',
      [{ field: 'assignmentMode', before: oldMode, after: mode }]
    );

    // If switched to Auto, automatically assign unassigned pending orders to online riders
    if (mode === 'Auto') {
      const { orders, riders } = get();
      const onlineRiders = riders.filter(
        (r) => r.verificationStatus === 'Verified' && r.status === 'Active' && r.availability === 'Online'
      );

      if (onlineRiders.length > 0) {
        let riderIdx = 0;
        const updated = orders.map((o) => {
          if (!o.rider && o.status !== 'Cancelled' && o.status !== 'Delivered') {
            const assigned = onlineRiders[riderIdx % onlineRiders.length];
            riderIdx++;
            const timeNow = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            return {
              ...o,
              rider: {
                id: assigned.id,
                name: assigned.name,
                phone: assigned.phone,
                vehicleType: assigned.vehicleType,
              },
              timeline: {
                ...o.timeline,
                acceptedAt: o.timeline.acceptedAt || timeNow,
              },
            };
          }
          return o;
        });
        set({ orders: updated });
      }
    }
  },

  updateOrderStatus: (orderId, nextStatus) => {
    const order = get().orders.find((o) => o.id === orderId);
    if (!order) return;
    const oldStatus = order.status;

    const updatedTimeline = { ...order.timeline };
    const timeNow = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    if (nextStatus === 'Preparing') updatedTimeline.preparingAt = timeNow;
    if (nextStatus === 'Out for delivery') updatedTimeline.outForDeliveryAt = timeNow;
    if (nextStatus === 'Delivered') updatedTimeline.deliveredAt = timeNow;

    get().logAudit(
      'Update',
      'Orders',
      order.orderNumber,
      `Changed order status to "${nextStatus}"`,
      'Order',
      [{ field: 'status', before: oldStatus, after: nextStatus }]
    );

    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status: nextStatus, timeline: updatedTimeline } : o
      ),
    }));
  },

  assignRider: (orderId, rider) => {
    const order = get().orders.find((o) => o.id === orderId);
    if (!order) return;
    const oldRider = order.rider ? `${order.rider.name} (${order.rider.phone})` : 'Unassigned';

    get().logAudit(
      'Update',
      'Orders',
      order.orderNumber,
      `Assigned rider ${rider.name} (${rider.vehicleType}) to order`,
      'Order',
      [{ field: 'rider', before: oldRider, after: `${rider.name} (${rider.vehicleType})` }]
    );

    set((state) => ({
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, rider } : o)),
    }));
  },

  cancelOrder: (orderId, reason, remarks) => {
    const order = get().orders.find((o) => o.id === orderId);
    if (!order) return;

    get().logAudit(
      'Update',
      'Orders',
      order.orderNumber,
      `Order cancelled: ${reason}. Remarks: ${remarks || 'None'}`,
      'Order',
      [{ field: 'status', before: order.status, after: 'Cancelled' }]
    );

    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'Cancelled',
              cancelReason: reason,
              cancelRemarks: remarks,
              timeline: {
                ...o.timeline,
                cancelledAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
              },
            }
          : o
      ),
    }));
  },

  refundOrder: (orderId) => {
    const order = get().orders.find((o) => o.id === orderId);
    if (!order) return;

    const now = new Date();
    const newTx: PaymentTransaction = {
      id: `tx-${Date.now().toString().slice(-6)}`,
      txNumber: `TXN-${Math.floor(90000 + Math.random() * 9999)}`,
      date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      party: order.customer.name,
      partyType: 'Customer',
      type: 'Refund',
      method: order.paymentMethod,
      amount: order.totalAmount,
      status: 'Paid',
      orderId: order.orderNumber,
      reference: `RFND/${Date.now().toString().slice(-8)}`,
      notes: `Automated refund for order ${order.orderNumber}`,
    };

    set((state) => ({
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, isRefunded: true } : o)),
      transactions: [newTx, ...state.transactions],
    }));

    get().logAudit(
      'Create',
      'Payments',
      newTx.txNumber,
      `Processed refund of ₹${order.totalAmount} for ${order.orderNumber}`,
      'Payment'
    );
  },

  // 3. Payments & Settlements
  transactions: initialTransactions,
  statements: initialStatements,

  releasePayout: (transactionId) => {
    const tx = get().transactions.find((t) => t.id === transactionId);
    if (!tx) return;

    get().logAudit(
      'Approve',
      'Payments',
      tx.txNumber,
      `Released payout of ₹${tx.amount.toLocaleString()} to ${tx.party} (${tx.type})`,
      'Payment',
      [{ field: 'status', before: tx.status, after: 'Paid' }]
    );

    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === transactionId ? { ...t, status: 'Paid' } : t
      ),
    }));
  },

  processSettlement: (transactionIds) => {
    set((state) => ({
      transactions: state.transactions.map((t) =>
        transactionIds.includes(t.id) ? { ...t, status: 'Paid' } : t
      ),
    }));

    get().logAudit(
      'Approve',
      'Payments',
      'Bulk Settlement',
      `Processed and released batch settlement payouts for ${transactionIds.length} partners`,
      'Payment'
    );
  },

  generateStatement: (month, year, partyName) => {
    const newStmt: MonthlyStatement = {
      id: `stmt-${year}-${Date.now().toString().slice(-4)}`,
      month,
      year,
      totalOrders: 3100 + Math.floor(Math.random() * 400),
      totalSales: 2600000 + Math.floor(Math.random() * 300000),
      commission: 312000 + Math.floor(Math.random() * 36000),
      vendorPayouts: 1950000 + Math.floor(Math.random() * 200000),
      riderPayouts: 260000 + Math.floor(Math.random() * 30000),
      refunds: 34000 + Math.floor(Math.random() * 8000),
      netRevenue: 350000 + Math.floor(Math.random() * 40000),
      status: 'Reconciled',
    };

    set((state) => ({
      statements: [newStmt, ...state.statements],
    }));

    get().logAudit(
      'Create',
      'Payments',
      `${month} ${year} Statement`,
      `Generated settlement statement report ${partyName ? `for ${partyName}` : 'for all partners'}`,
      'Payment'
    );
  },

  // 4. Products & Categories (Brand, Approval Flow, Enable/Disable)
  products: initialProducts,
  categories: initialCategories,

  approveProduct: (id) => {
    const prod = get().products.find((p) => p.id === id);
    if (!prod) return;

    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, status: 'Active', isActive: true } : p)),
    }));

    get().logAudit('Approve', 'Products', prod.name, `Approved product catalog listing (status: Active)`, 'Admin Audit');
  },

  rejectProduct: (id, reason) => {
    const prod = get().products.find((p) => p.id === id);
    if (!prod) return;

    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, status: 'Inactive', isActive: false } : p)),
    }));

    get().logAudit('Update', 'Products', prod.name, `Rejected product listing: ${reason}`, 'Admin Audit');
  },

  disableProduct: (id) => {
    const prod = get().products.find((p) => p.id === id);
    if (!prod) return;

    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, status: 'Inactive', isActive: false } : p)),
    }));

    get().logAudit('Update', 'Products', prod.name, 'Disabled product listing (now Inactive in consumer app)', 'Admin Audit');
  },

  enableProduct: (id) => {
    const prod = get().products.find((p) => p.id === id);
    if (!prod) return;

    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, status: 'Active', isActive: true } : p)),
    }));

    get().logAudit('Update', 'Products', prod.name, 'Enabled product listing (now Active in consumer app)', 'Admin Audit');
  },

  addProduct: (productData) => {
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: productData.name || 'New Item',
      category: productData.category || 'Grocery & Staples',
      vendor: productData.vendor || 'Fresh Mart Hub',
      mrp: productData.mrp ?? 100,
      salePrice: productData.salePrice ?? 90,
      discountPct: productData.discountPct ?? 10,
      itemsSold: 0,
      status: 'Pending approval', // By default Pending approval
      sku: productData.sku || `SKU-${Date.now().toString().slice(-6)}`,
      brand: productData.brand || 'Aashirvaad',
      unit: productData.unit || '1 kg',
      description: productData.description || '',
      isActive: false,
    };

    set((state) => ({
      products: [newProd, ...state.products],
    }));

    get().logAudit('Create', 'Products', newProd.name, `Submitted new product for approval (${newProd.brand})`, 'Admin Audit');
  },

  updateProduct: (id, updates) => {
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
    get().logAudit('Update', 'Products', updates.name || id, 'Updated product catalog information', 'Admin Audit');
  },

  deleteProduct: (id) => {
    const prod = get().products.find((p) => p.id === id);
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));
    get().logAudit('Delete', 'Products', prod?.name || id, 'Deleted product from catalog', 'Admin Audit');
  },

  addCategory: (catData) => {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      ...catData,
      productCount: catData.productCount ?? 0,
    };
    set((state) => ({
      categories: [...state.categories, newCat],
    }));
    get().logAudit('Create', 'Products', newCat.name, 'Created new product category', 'Admin Audit');
  },

  updateCategory: (id, updates) => {
    set((state) => ({
      categories: state.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
    get().logAudit('Update', 'Products', updates.name || id, 'Updated category properties', 'Admin Audit');
  },

  deleteCategory: (id) => {
    const cat = get().categories.find((c) => c.id === id);
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    }));
    get().logAudit('Delete', 'Products', cat?.name || id, 'Deleted category', 'Admin Audit');
  },

  // 5. Users (Vendors & Riders Suspend/Block & Inactive/Active)
  vendors: initialVendors,
  riders: initialRiders,

  suspendBlockVendor: (id, reason) => {
    const vendor = get().vendors.find((v) => v.id === id);
    set((state) => ({
      vendors: state.vendors.map((v) =>
        v.id === id
          ? {
              ...v,
              status: 'Suspended',
              statusReason: reason,
              statusDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            }
          : v
      ),
    }));

    get().logAudit('Suspend', 'Users', vendor?.storeName || id, `Suspended (Blocked) merchant store: ${reason}`, 'User Activity');
  },

  unblockVendor: (id) => {
    const vendor = get().vendors.find((v) => v.id === id);
    set((state) => ({
      vendors: state.vendors.map((v) => (v.id === id ? { ...v, status: 'Active' } : v)),
    }));

    get().logAudit('Update', 'Users', vendor?.storeName || id, 'Unblocked merchant store access', 'User Activity');
  },

  setVendorActive: (id, active) => {
    const vendor = get().vendors.find((v) => v.id === id);
    const nextStatus = active ? 'Active' : 'Inactive';
    set((state) => ({
      vendors: state.vendors.map((v) => (v.id === id ? { ...v, status: nextStatus } : v)),
    }));

    get().logAudit('Update', 'Users', vendor?.storeName || id, `Set merchant status to ${nextStatus}`, 'User Activity');
  },

  suspendBlockRider: (id, reason) => {
    const rider = get().riders.find((r) => r.id === id);
    set((state) => ({
      riders: state.riders.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Suspended',
              statusReason: reason,
              statusDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            }
          : r
      ),
    }));

    get().logAudit('Suspend', 'Users', rider?.name || id, `Suspended (Blocked) delivery rider: ${reason}`, 'User Activity');
  },

  unblockRider: (id) => {
    const rider = get().riders.find((r) => r.id === id);
    set((state) => ({
      riders: state.riders.map((r) => (r.id === id ? { ...r, status: 'Active' } : r)),
    }));

    get().logAudit('Update', 'Users', rider?.name || id, 'Unblocked delivery rider access', 'User Activity');
  },

  setRiderActive: (id, active) => {
    const rider = get().riders.find((r) => r.id === id);
    const nextStatus = active ? 'Active' : 'Inactive';
    set((state) => ({
      riders: state.riders.map((r) => (r.id === id ? { ...r, status: nextStatus } : r)),
    }));

    get().logAudit('Update', 'Users', rider?.name || id, `Set rider status to ${nextStatus}`, 'User Activity');
  },

  // 6. Staff & RBAC
  staff: initialStaff,
  roles: initialRolePermissions,
  currentRole: 'Super Admin',

  setCurrentRole: (role) => set({ currentRole: role }),

  hasPermission: (module, action) => {
    const role = get().currentRole;
    if (role === 'Super Admin') return true;
    const rolePerms = get().roles[role];
    if (!rolePerms || !rolePerms[module]) return false;
    return Boolean(rolePerms[module][action]);
  },

  addStaff: (data) => {
    const initials = data.name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newMember: StaffMember = {
      id: `st-${Date.now().toString().slice(-4)}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      lastLogin: 'Never',
      isActive: data.isActive,
      initials: initials || 'ST',
      createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    set((state) => ({ staff: [newMember, ...state.staff] }));
    get().logAudit('Create', 'Staff', newMember.name, `Added staff member with role ${newMember.role}`, 'Admin Audit');
  },

  updateStaff: (id, updates) => {
    const member = get().staff.find((m) => m.id === id);
    if (!member) return;

    set((state) => ({
      staff: state.staff.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }));

    get().logAudit('Update', 'Staff', member.name, `Updated profile details (${Object.keys(updates).join(', ')})`, 'Admin Audit');
  },

  toggleStaffActive: (id) => {
    const { staff } = get();
    const member = staff.find((m) => m.id === id);
    if (!member) return false;

    // Protection: cannot deactivate the last active Super Admin
    if (member.role === 'Super Admin' && member.isActive) {
      const activeSuperAdmins = staff.filter((s) => s.role === 'Super Admin' && s.isActive);
      if (activeSuperAdmins.length <= 1) return false;
    }

    const nextState = !member.isActive;
    set((state) => ({
      staff: state.staff.map((m) => (m.id === id ? { ...m, isActive: nextState } : m)),
    }));

    get().logAudit(
      'Update',
      'Staff',
      member.name,
      `${nextState ? 'Activated' : 'Deactivated'} staff account`,
      'Admin Audit',
      [{ field: 'isActive', before: String(member.isActive), after: String(nextState) }]
    );
    return true;
  },

  deleteStaff: (id) => {
    const { staff } = get();
    const member = staff.find((m) => m.id === id);
    if (!member) return false;

    if (member.role === 'Super Admin') {
      const superAdmins = staff.filter((s) => s.role === 'Super Admin');
      if (superAdmins.length <= 1) return false;
    }

    set((state) => ({
      staff: state.staff.filter((m) => m.id !== id),
    }));

    get().logAudit('Delete', 'Staff', member.name, `Deleted staff account (${member.role})`, 'Admin Audit');
    return true;
  },

  saveRolePermissions: (role, permissions) => {
    set((state) => ({
      roles: { ...state.roles, [role]: permissions },
    }));

    get().logAudit('Update', 'Staff', `${role} Permissions`, `Updated RBAC permission matrix for ${role}`, 'Admin Audit');
  },

  addCustomRole: (roleName) => {
    if (get().roles[roleName]) return;
    const blankPerms = Object.fromEntries(
      Object.keys(SUPER_ADMIN_PERMISSIONS).map((k) => [
        k,
        { View: true, Create: false, Edit: false, Delete: false, Approve: false },
      ])
    ) as RolePermissions;

    set((state) => ({
      roles: { ...state.roles, [roleName]: blankPerms },
    }));

    get().logAudit('Create', 'Staff', `${roleName} Role`, `Created new RBAC role template "${roleName}"`, 'Admin Audit');
  },

  // 7. Audit Logs (6 categories)
  auditLogs: seededAuditLogs,

  logAudit: (action, module, target, details, category = 'Admin Audit', diff) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const currentRole = get().currentRole;
    const currentMember = get().staff.find((s) => s.role === currentRole && s.isActive);
    const admin = currentMember
      ? { name: currentMember.name, role: currentMember.role, email: currentMember.email }
      : { name: 'Sarah Mitchell', role: currentRole, email: 'sarah.m@fillkart.in' };

    const newEntry: ExtendedAuditLogEntry = {
      id: `aud-${Date.now().toString().slice(-6)}`,
      timestamp: `${dateStr}, ${timeStr}`,
      admin,
      action,
      module,
      target,
      details,
      category,
      ip: '192.168.1.45',
      browser: 'Chrome 128 / macOS',
      diff,
    };

    set((state) => ({
      auditLogs: [newEntry, ...state.auditLogs],
    }));
  },

  // 8. System Settings
  settings: initialSettings,
  updateSettings: (newSettings) => {
    const currentMode = get().assignmentMode;
    const nextMode = newSettings.orders.assignmentMode;
    set({ settings: newSettings });
    if (nextMode !== currentMode) {
      get().setAssignmentMode(nextMode);
    }
  },
}));
