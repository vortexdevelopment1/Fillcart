export type InternalStaffRole =
  | 'Super Admin'
  | 'Operations Admin'
  | 'Finance Admin'
  | 'Support Admin'
  | 'Marketing Admin';

export type ExternalRole = 'Vendor' | 'Vendor Staff' | 'Rider' | 'Customer';

export interface ExternalRoleDefinition {
  name: ExternalRole;
  scope: string;
  description: string;
  capabilities: string[];
}

export const EXTERNAL_ROLES_DEFINITIONS: ExternalRoleDefinition[] = [
  {
    name: 'Vendor',
    scope: 'Merchant Portal',
    description:
      'Store owners who list items, manage inventory availability, view settlement reports and dispatch orders.',
    capabilities: [
      'Manage store catalog and item pricing',
      'Accept and prepare customer orders',
      'View daily settlements and transaction history',
      'Upload KYC compliance and shop registration documents',
    ],
  },
  {
    name: 'Vendor Staff',
    scope: 'Merchant POS',
    description: 'Store workers who pack bags and hand over parcels to riders.',
    capabilities: [
      'View incoming order queue',
      'Mark items packed and ready for pickup',
      'No access to banking or payout settlements',
    ],
  },
  {
    name: 'Rider',
    scope: 'Rider App',
    description: 'Delivery partners who pick up orders from vendors and deliver them to customers.',
    capabilities: [
      'Toggle availability (Online / Offline)',
      'Accept assigned deliveries and navigate routes',
      'Mark deliveries completed with OTP verification',
      'View daily trip earnings and tips',
    ],
  },
  {
    name: 'Customer',
    scope: 'Customer App / Web',
    description: 'End consumers who browse local stores, place orders and track deliveries.',
    capabilities: [
      'Browse nearby vendors and add products to cart',
      'Pay via UPI, Cards or COD',
      'Track live rider location on map',
      'Rate vendor and delivery experience',
    ],
  },
];

export type StaffRole = InternalStaffRole | ExternalRole | string;

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  lastLogin: string;
  isActive: boolean;
  avatar?: string;
  initials: string;
  createdDate: string;
}

export const MODULE_NAMES = [
  'Dashboard',
  'Users',
  'Products',
  'Orders',
  'Payments',
  'Reports',
  'Marketing',
  'Audit Logs',
  'Settings',
] as const;

export type ModuleName = typeof MODULE_NAMES[number];

export const ACTION_NAMES = ['View', 'Create', 'Edit', 'Delete', 'Approve'] as const;
export type ActionName = typeof ACTION_NAMES[number];

export type ModulePermissions = Record<ActionName, boolean>;
export type RolePermissions = Record<ModuleName, ModulePermissions>;

const createAllPerms = (flag: boolean): ModulePermissions => ({
  View: flag,
  Create: flag,
  Edit: flag,
  Delete: flag,
  Approve: flag,
});

// Super Admin: All checked, locked
export const SUPER_ADMIN_PERMISSIONS: RolePermissions = MODULE_NAMES.reduce((acc, mod) => {
  acc[mod] = createAllPerms(true);
  return acc;
}, {} as RolePermissions);

// Operations Admin: Dashboard, Users, Products, Orders (full) + Reports (view)
export const OPERATIONS_ADMIN_PERMISSIONS: RolePermissions = {
  Dashboard: createAllPerms(true),
  Users: createAllPerms(true),
  Products: createAllPerms(true),
  Orders: createAllPerms(true),
  Payments: { View: false, Create: false, Edit: false, Delete: false, Approve: false },
  Reports: { View: true, Create: false, Edit: false, Delete: false, Approve: false },
  Marketing: { View: true, Create: false, Edit: false, Delete: false, Approve: false },
  'Audit Logs': { View: true, Create: false, Edit: false, Delete: false, Approve: false },
  Settings: { View: true, Create: false, Edit: false, Delete: false, Approve: false },
};

// Finance Admin: Payments (full), Reports, Orders (view)
export const FINANCE_ADMIN_PERMISSIONS: RolePermissions = {
  Dashboard: { View: true, Create: false, Edit: false, Delete: false, Approve: false },
  Users: { View: true, Create: false, Edit: false, Delete: false, Approve: false },
  Products: { View: false, Create: false, Edit: false, Delete: false, Approve: false },
  Orders: { View: true, Create: false, Edit: false, Delete: false, Approve: false },
  Payments: createAllPerms(true),
  Reports: createAllPerms(true),
  Marketing: { View: false, Create: false, Edit: false, Delete: false, Approve: false },
  'Audit Logs': { View: true, Create: false, Edit: false, Delete: false, Approve: false },
  Settings: { View: false, Create: false, Edit: false, Delete: false, Approve: false },
};

// Support Admin: Orders and Users (view/edit), Products (view)
export const SUPPORT_ADMIN_PERMISSIONS: RolePermissions = {
  Dashboard: { View: true, Create: false, Edit: false, Delete: false, Approve: false },
  Users: { View: true, Create: false, Edit: true, Delete: false, Approve: false },
  Products: { View: true, Create: false, Edit: false, Delete: false, Approve: false },
  Orders: { View: true, Create: false, Edit: true, Delete: false, Approve: false },
  Payments: { View: false, Create: false, Edit: false, Delete: false, Approve: false },
  Reports: { View: false, Create: false, Edit: false, Delete: false, Approve: false },
  Marketing: { View: false, Create: false, Edit: false, Delete: false, Approve: false },
  'Audit Logs': { View: false, Create: false, Edit: false, Delete: false, Approve: false },
  Settings: { View: false, Create: false, Edit: false, Delete: false, Approve: false },
};

// Marketing Admin: Marketing (full), Reports (view)
export const MARKETING_ADMIN_PERMISSIONS: RolePermissions = {
  Dashboard: { View: true, Create: false, Edit: false, Delete: false, Approve: false },
  Users: { View: true, Create: false, Edit: false, Delete: false, Approve: false },
  Products: { View: true, Create: false, Edit: false, Delete: false, Approve: false },
  Orders: { View: true, Create: false, Edit: false, Delete: false, Approve: false },
  Payments: { View: false, Create: false, Edit: false, Delete: false, Approve: false },
  Reports: { View: true, Create: false, Edit: false, Delete: false, Approve: false },
  Marketing: createAllPerms(true),
  'Audit Logs': { View: false, Create: false, Edit: false, Delete: false, Approve: false },
  Settings: { View: false, Create: false, Edit: false, Delete: false, Approve: false },
};

export const initialRolePermissions: Record<string, RolePermissions> = {
  'Super Admin': SUPER_ADMIN_PERMISSIONS,
  'Operations Admin': OPERATIONS_ADMIN_PERMISSIONS,
  'Finance Admin': FINANCE_ADMIN_PERMISSIONS,
  'Support Admin': SUPPORT_ADMIN_PERMISSIONS,
  'Marketing Admin': MARKETING_ADMIN_PERMISSIONS,
};

// External Roles (Read-only tab)
export const EXTERNAL_ROLES: Record<ExternalRole, { description: string; permissionsSummary: string }> = {
  Vendor: {
    description: 'Store owner account with access to Merchant Portal, inventory catalogue & order fulfillment.',
    permissionsSummary: 'Store Catalog, Live Orders, Vendor Settlements, Store Profile',
  },
  'Vendor Staff': {
    description: 'Store employee with delegated access to pack, prepare and dispatch assigned merchant orders.',
    permissionsSummary: 'Order Packing, Store Inventory View, Order Status Prep',
  },
  Rider: {
    description: 'Fleet delivery partner with access to the Fillkart Rider Mobile App for dispatch and navigation.',
    permissionsSummary: 'Rider App, Assigned Orders, Delivery GPS, Payout Statements',
  },
  Customer: {
    description: 'End customer on consumer mobile application or website.',
    permissionsSummary: 'Browse Catalog, Cart Checkout, Order Tracking, Customer Support Tickets',
  },
};

export const initialStaff: StaffMember[] = [
  {
    id: 'st-01',
    name: 'Sarah Mitchell',
    email: 'sarah.m@fillkart.in',
    phone: '9810011223',
    role: 'Super Admin',
    lastLogin: '18 Nov 2026, 10:25 AM',
    isActive: true,
    initials: 'SM',
    createdDate: '15 Jan 2026',
  },
  {
    id: 'st-02',
    name: 'David Kim',
    email: 'david.kim@fillkart.in',
    phone: '9820022334',
    role: 'Operations Admin',
    lastLogin: '18 Nov 2026, 09:40 AM',
    isActive: true,
    initials: 'DK',
    createdDate: '01 Feb 2026',
  },
  {
    id: 'st-03',
    name: 'Alok Nambiar',
    email: 'alok.n@fillkart.in',
    phone: '9840044556',
    role: 'Finance Admin',
    lastLogin: '18 Nov 2026, 08:30 AM',
    isActive: true,
    initials: 'AN',
    createdDate: '22 Apr 2026',
  },
  {
    id: 'st-04',
    name: 'Priya Patel',
    email: 'priya.patel@fillkart.in',
    phone: '9830033445',
    role: 'Support Admin',
    lastLogin: '17 Nov 2026, 06:10 PM',
    isActive: true,
    initials: 'PP',
    createdDate: '10 Mar 2026',
  },
  {
    id: 'st-05',
    name: 'Neha Singhania',
    email: 'neha.s@fillkart.in',
    phone: '9860066778',
    role: 'Marketing Admin',
    lastLogin: '17 Nov 2026, 04:00 PM',
    isActive: true,
    initials: 'NS',
    createdDate: '05 Jul 2026',
  },
  {
    id: 'st-06',
    name: 'Karan Mehra',
    email: 'karan.m@fillkart.in',
    phone: '9850055667',
    role: 'Support Admin',
    lastLogin: '16 Nov 2026, 05:30 PM',
    isActive: false,
    initials: 'KM',
    createdDate: '15 Jun 2026',
  },
];
