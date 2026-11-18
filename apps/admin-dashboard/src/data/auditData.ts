export type AuditAction = 'Create' | 'Update' | 'Delete' | 'Approve' | 'Suspend' | 'Login';

export interface AuditDiff {
  field: string;
  before: string;
  after: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  admin: {
    name: string;
    role: string;
    email: string;
  };
  action: AuditAction;
  module: string;
  target: string;
  details: string;
  ip: string;
  browser: string;
  diff?: AuditDiff[];
}

export interface ApiLogEntry {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  endpoint: string;
  statusCode: number;
  latencyMs: number;
  userOrAdmin: string;
  ip: string;
  requestId: string;
  errorCode?: string;
  errorMessage?: string;
  browser: string;
}

export const initialApiLogs: ApiLogEntry[] = [
  {
    id: 'api-001',
    timestamp: '18 Nov 2026, 12:28:44 PM',
    method: 'GET',
    endpoint: '/api/v1/admin/orders?page=1&status=all',
    statusCode: 200,
    latencyMs: 48,
    userOrAdmin: 'Sarah Mitchell (Super Admin)',
    ip: '192.168.1.45',
    requestId: 'req-99120-ord',
    browser: 'Chrome 128 / macOS Sonoma',
  },
  {
    id: 'api-002',
    timestamp: '18 Nov 2026, 12:25:10 PM',
    method: 'POST',
    endpoint: '/api/v1/admin/vendors/v-102/approve',
    statusCode: 200,
    latencyMs: 142,
    userOrAdmin: 'Sarah Mitchell (Super Admin)',
    ip: '192.168.1.45',
    requestId: 'req-99121-appr',
    browser: 'Chrome 128 / macOS Sonoma',
  },
  {
    id: 'api-003',
    timestamp: '18 Nov 2026, 12:22:04 PM',
    method: 'POST',
    endpoint: '/api/v1/admin/auth/login',
    statusCode: 401,
    latencyMs: 36,
    userOrAdmin: 'alok.n@fillkart.in',
    ip: '192.168.1.99',
    requestId: 'req-99122-auth',
    errorCode: 'ADMIN_001',
    errorMessage: 'Unauthorized access: Invalid MFA verification challenge or expired OTP token',
    browser: 'Firefox 130 / Linux Ubuntu',
  },
  {
    id: 'api-004',
    timestamp: '18 Nov 2026, 12:15:33 PM',
    method: 'POST',
    endpoint: '/api/v1/admin/settlements/batch-disburse',
    statusCode: 200,
    latencyMs: 312,
    userOrAdmin: 'Alok Nambiar (Finance Admin)',
    ip: '192.168.1.33',
    requestId: 'req-99123-setl',
    browser: 'Chrome 128 / macOS Sonoma',
  },
  {
    id: 'api-005',
    timestamp: '18 Nov 2026, 12:08:19 PM',
    method: 'PATCH',
    endpoint: '/api/v1/admin/staff/roles/st-004',
    statusCode: 403,
    latencyMs: 52,
    userOrAdmin: 'Priya Patel (Support Admin)',
    ip: '192.168.1.28',
    requestId: 'req-99124-rbac',
    errorCode: 'ADMIN_003',
    errorMessage: 'Insufficient permissions: Modifying RBAC privilege matrices requires Super Admin authorization',
    browser: 'Safari 18 / iOS 17.5',
  },
  {
    id: 'api-006',
    timestamp: '18 Nov 2026, 12:03:12 PM',
    method: 'PATCH',
    endpoint: '/api/v1/admin/products/prod-001/status',
    statusCode: 200,
    latencyMs: 84,
    userOrAdmin: 'Sarah Mitchell (Super Admin)',
    ip: '192.168.1.45',
    requestId: 'req-99125-prod',
    browser: 'Chrome 128 / macOS Sonoma',
  },
  {
    id: 'api-007',
    timestamp: '18 Nov 2026, 11:58:40 AM',
    method: 'GET',
    endpoint: '/api/v1/admin/reports/analytics?period=month',
    statusCode: 200,
    latencyMs: 210,
    userOrAdmin: 'Alok Nambiar (Finance Admin)',
    ip: '192.168.1.33',
    requestId: 'req-99126-rep',
    browser: 'Chrome 128 / macOS Sonoma',
  },
  {
    id: 'api-008',
    timestamp: '18 Nov 2026, 11:49:15 AM',
    method: 'POST',
    endpoint: '/api/v1/admin/payments/gateway/webhook',
    statusCode: 500,
    latencyMs: 1420,
    userOrAdmin: 'ICICI Nodal Escrow Gateway',
    ip: '10.0.4.12',
    requestId: 'req-99127-gate',
    errorCode: 'SRV_500',
    errorMessage: 'Payment gateway timeout: Upstream banking nodal server unresponsive after 1200ms handshake',
    browser: 'Go-http-client/1.1 (Automated Webhook)',
  },
  {
    id: 'api-009',
    timestamp: '18 Nov 2026, 11:42:01 AM',
    method: 'POST',
    endpoint: '/api/v1/admin/orders/FK-8917/refund',
    statusCode: 200,
    latencyMs: 168,
    userOrAdmin: 'Alok Nambiar (Finance Admin)',
    ip: '192.168.1.33',
    requestId: 'req-99128-ref',
    browser: 'Chrome 128 / macOS Sonoma',
  },
  {
    id: 'api-010',
    timestamp: '18 Nov 2026, 11:35:22 AM',
    method: 'PUT',
    endpoint: '/api/v1/admin/commission/categories/cat-02',
    statusCode: 200,
    latencyMs: 95,
    userOrAdmin: 'Alok Nambiar (Finance Admin)',
    ip: '192.168.1.33',
    requestId: 'req-99129-comm',
    browser: 'Chrome 128 / macOS Sonoma',
  },
  {
    id: 'api-011',
    timestamp: '18 Nov 2026, 11:28:09 AM',
    method: 'GET',
    endpoint: '/api/v1/admin/riders?status=Online',
    statusCode: 200,
    latencyMs: 62,
    userOrAdmin: 'David Kim (Operations Admin)',
    ip: '192.168.1.18',
    requestId: 'req-99130-rdr',
    browser: 'Edge 128 / Windows 11 Pro',
  },
  {
    id: 'api-012',
    timestamp: '18 Nov 2026, 11:20:54 AM',
    method: 'DELETE',
    endpoint: '/api/v1/admin/coupons/WELCOME99',
    statusCode: 404,
    latencyMs: 41,
    userOrAdmin: 'Alok Nambiar (Finance Admin)',
    ip: '192.168.1.33',
    requestId: 'req-99131-coup',
    errorCode: 'RES_404',
    errorMessage: 'Coupon entity WELCOME99 not found in platform promotion catalog or already purged',
    browser: 'Chrome 128 / Windows 11',
  },
  {
    id: 'api-013',
    timestamp: '18 Nov 2026, 11:15:30 AM',
    method: 'POST',
    endpoint: '/api/v1/admin/wallet/customers/c-881/credit',
    statusCode: 200,
    latencyMs: 112,
    userOrAdmin: 'Alok Nambiar (Finance Admin)',
    ip: '192.168.1.33',
    requestId: 'req-99132-wall',
    browser: 'Chrome 128 / macOS Sonoma',
  },
  {
    id: 'api-014',
    timestamp: '18 Nov 2026, 11:05:12 AM',
    method: 'GET',
    endpoint: '/api/v1/admin/taxes/gst-summary?month=11&year=2026',
    statusCode: 200,
    latencyMs: 130,
    userOrAdmin: 'Alok Nambiar (Finance Admin)',
    ip: '192.168.1.33',
    requestId: 'req-99133-tax',
    browser: 'Chrome 128 / macOS Sonoma',
  },
  {
    id: 'api-015',
    timestamp: '18 Nov 2026, 10:55:40 AM',
    method: 'PATCH',
    endpoint: '/api/v1/admin/orders/FK-8921/dispatch',
    statusCode: 200,
    latencyMs: 78,
    userOrAdmin: 'Sarah Mitchell (Super Admin)',
    ip: '192.168.1.45',
    requestId: 'req-99134-disp',
    browser: 'Chrome 128 / macOS Sonoma',
  },
  {
    id: 'api-016',
    timestamp: '18 Nov 2026, 10:48:21 AM',
    method: 'POST',
    endpoint: '/api/v1/admin/auth/refresh-token',
    statusCode: 401,
    latencyMs: 28,
    userOrAdmin: 'Unknown IP (Client App)',
    ip: '203.0.113.84',
    requestId: 'req-99135-tok',
    errorCode: 'AUTH_004',
    errorMessage: 'Refresh token expired or revoked in security blacklist',
    browser: 'Python-requests/2.31.0',
  },
  {
    id: 'api-017',
    timestamp: '18 Nov 2026, 10:35:19 AM',
    method: 'POST',
    endpoint: '/api/v1/admin/settlements/riders/RDR-PAY-048',
    statusCode: 200,
    latencyMs: 185,
    userOrAdmin: 'Alok Nambiar (Finance Admin)',
    ip: '192.168.1.33',
    requestId: 'req-99136-rpay',
    browser: 'Chrome 128 / macOS Sonoma',
  },
  {
    id: 'api-018',
    timestamp: '18 Nov 2026, 10:22:04 AM',
    method: 'GET',
    endpoint: '/api/v1/admin/vendors?verification=pending',
    statusCode: 200,
    latencyMs: 54,
    userOrAdmin: 'David Kim (Operations Admin)',
    ip: '192.168.1.18',
    requestId: 'req-99137-vlst',
    browser: 'Edge 128 / Windows 11 Pro',
  },
  {
    id: 'api-019',
    timestamp: '18 Nov 2026, 10:14:52 AM',
    method: 'POST',
    endpoint: '/api/v1/admin/coupons',
    statusCode: 201,
    latencyMs: 104,
    userOrAdmin: 'Alok Nambiar (Finance Admin)',
    ip: '192.168.1.33',
    requestId: 'req-99138-cnew',
    browser: 'Chrome 128 / macOS Sonoma',
  },
  {
    id: 'api-020',
    timestamp: '18 Nov 2026, 10:02:11 AM',
    method: 'PUT',
    endpoint: '/api/v1/admin/taxes/categories/cat-01/hsn',
    statusCode: 400,
    latencyMs: 39,
    userOrAdmin: 'Alok Nambiar (Finance Admin)',
    ip: '192.168.1.33',
    requestId: 'req-99139-hsn',
    errorCode: 'VAL_400',
    errorMessage: 'Invalid HSN format: Must be 6 or 8 digits compliant with CBIC GST tariff structure',
    browser: 'Chrome 128 / macOS Sonoma',
  },
  {
    id: 'api-021',
    timestamp: '18 Nov 2026, 09:48:33 AM',
    method: 'POST',
    endpoint: '/api/v1/admin/vendors/v-89/kyc/verify',
    statusCode: 200,
    latencyMs: 220,
    userOrAdmin: 'David Kim (Operations Admin)',
    ip: '192.168.1.18',
    requestId: 'req-99140-kyc',
    browser: 'Edge 128 / Windows 11 Pro',
  },
  {
    id: 'api-022',
    timestamp: '18 Nov 2026, 09:30:15 AM',
    method: 'GET',
    endpoint: '/api/v1/admin/audit-logs/export.csv',
    statusCode: 200,
    latencyMs: 340,
    userOrAdmin: 'Sarah Mitchell (Super Admin)',
    ip: '192.168.1.45',
    requestId: 'req-99141-csv',
    browser: 'Chrome 128 / macOS Sonoma',
  },
  {
    id: 'api-023',
    timestamp: '18 Nov 2026, 09:12:44 AM',
    method: 'DELETE',
    endpoint: '/api/v1/admin/products/temp-draft-09',
    statusCode: 200,
    latencyMs: 72,
    userOrAdmin: 'Sarah Mitchell (Super Admin)',
    ip: '192.168.1.45',
    requestId: 'req-99142-pdel',
    browser: 'Chrome 128 / macOS Sonoma',
  },
  {
    id: 'api-024',
    timestamp: '18 Nov 2026, 08:55:02 AM',
    method: 'POST',
    endpoint: '/api/v1/admin/system/backup',
    statusCode: 500,
    latencyMs: 3100,
    userOrAdmin: 'System Cron (Automated Daemon)',
    ip: '127.0.0.1',
    requestId: 'req-99143-bkup',
    errorCode: 'SRV_503',
    errorMessage: 'Database snapshot storage volume write I/O limit exceeded during automated snapshot',
    browser: 'CronRunner/2.1 Linux Daemon',
  },
];

export const initialAuditLogs: AuditLogEntry[] = [
  // 1. Finance Audit: Vendor Settlement Release
  {
    id: 'aud-001',
    timestamp: '18 Nov 2026, 12:15 PM',
    admin: { name: 'Alok Nambiar', role: 'Finance Admin', email: 'alok.n@fillkart.in' },
    action: 'Approve',
    module: 'Payments',
    target: 'TXN-90241',
    details: 'Released bulk weekly merchant payout ₹48,200 to Fresh Mart Hub via HDFC Corporate NEFT',
    ip: '192.168.1.33',
    browser: 'Chrome 128 / macOS',
    diff: [
      { field: 'payoutStatus', before: 'Pending Reconciliation', after: 'Settled & Transferred' },
      { field: 'utrReference', before: '-', after: 'HDFCN2632298104' },
      { field: 'commissionDeducted', before: '0%', after: '15% (₹7,230)' },
    ],
  },
  // 2. Finance Audit: Customer Refund Processing
  {
    id: 'aud-002',
    timestamp: '18 Nov 2026, 11:42 AM',
    admin: { name: 'Alok Nambiar', role: 'Finance Admin', email: 'alok.n@fillkart.in' },
    action: 'Update',
    module: 'Payments',
    target: '#FK-8917 / REF-5542',
    details: 'Executed customer refund of ₹628 to original UPI handle per cancellation policy',
    ip: '192.168.1.33',
    browser: 'Chrome 128 / macOS',
    diff: [
      { field: 'refundStatus', before: 'Initiated', after: 'Credited to Source (UPI)' },
      { field: 'refundAmount', before: '₹0', after: '₹628' },
    ],
  },
  // 3. Finance Audit: Platform Commission Reconcile
  {
    id: 'aud-003',
    timestamp: '18 Nov 2026, 11:10 AM',
    admin: { name: 'Alok Nambiar', role: 'Finance Admin', email: 'alok.n@fillkart.in' },
    action: 'Create',
    module: 'Payments',
    target: 'COMM-NOV-W3',
    details: 'Auto-reconciled platform commission ₹29,400 across 186 daily orders with ICICI Nodal Escrow',
    ip: '192.168.1.33',
    browser: 'Chrome 128 / macOS',
    diff: [
      { field: 'grossMerchandiseValue', before: '₹0', after: '₹1,96,000' },
      { field: 'netPlatformFee', before: '₹0', after: '₹29,400' },
    ],
  },
  // 4. Finance Audit: Rider Payout Disbursed
  {
    id: 'aud-004',
    timestamp: '18 Nov 2026, 10:35 AM',
    admin: { name: 'Alok Nambiar', role: 'Finance Admin', email: 'alok.n@fillkart.in' },
    action: 'Approve',
    module: 'Payments',
    target: 'RDR-PAY-048',
    details: 'Approved daily delivery earnings payout of ₹1,450 to rider Vikram Singh (22 orders completed)',
    ip: '192.168.1.33',
    browser: 'Chrome 128 / macOS',
    diff: [
      { field: 'riderPayout', before: 'Queued', after: 'Disbursed (Instant IMPS)' },
      { field: 'incentiveBonus', before: '₹0', after: '₹250 (100% SLA)' },
    ],
  },
  // 5. Operations: Order Dispatch
  {
    id: 'aud-005',
    timestamp: '18 Nov 2026, 10:24 AM',
    admin: { name: 'Sarah Mitchell', role: 'Super Admin', email: 'sarah.m@fillkart.in' },
    action: 'Update',
    module: 'Orders',
    target: '#FK-8921',
    details: 'Dispatched order with rider Vikram Singh',
    ip: '192.168.1.45',
    browser: 'Chrome 128 / macOS',
    diff: [
      { field: 'status', before: 'Preparing', after: 'Out for delivery' },
      { field: 'rider', before: 'Unassigned', after: 'Vikram Singh (r-001)' },
    ],
  },
  // 6. Document Verification
  {
    id: 'aud-006',
    timestamp: '18 Nov 2026, 09:48 AM',
    admin: { name: 'David Kim', role: 'Operations Admin', email: 'david.kim@fillkart.in' },
    action: 'Approve',
    module: 'Document Verification',
    target: 'Fresh Mart Hub',
    details: 'Approved GST Certificate and FSSAI Food Licence',
    ip: '192.168.1.18',
    browser: 'Chrome 128 / Windows 11',
  },
  // 7. Finance Audit: Monthly Settlement Reconciliation
  {
    id: 'aud-007',
    timestamp: '18 Nov 2026, 08:30 AM',
    admin: { name: 'Alok Nambiar', role: 'Finance Admin', email: 'alok.n@fillkart.in' },
    action: 'Approve',
    module: 'Payments',
    target: 'TXN-90236',
    details: 'Released vendor payout ₹18,400 to Royal Kirana via NEFT with 18% GST tax invoice',
    ip: '192.168.1.33',
    browser: 'Safari 18 / macOS',
    diff: [
      { field: 'status', before: 'Pending', after: 'Paid' },
      { field: 'gstInputTaxCredit', before: '₹0', after: '₹2,806' },
    ],
  },
  // 8. Finance Audit: Merchant Security Deposit Reconcile
  {
    id: 'aud-008',
    timestamp: '17 Nov 2026, 06:15 PM',
    admin: { name: 'Alok Nambiar', role: 'Finance Admin', email: 'alok.n@fillkart.in' },
    action: 'Create',
    module: 'Payments',
    target: 'DEP-CITY-PHARM',
    details: 'Verified refundable vendor onboarding security deposit ₹10,000 for City Pharmacy',
    ip: '192.168.1.33',
    browser: 'Safari 18 / macOS',
    diff: [{ field: 'depositLedger', before: 'Unverified', after: 'Credited Escrow' }],
  },
  // 9. Finance Audit: Tax & Slab Invoice Generation
  {
    id: 'aud-009',
    timestamp: '17 Nov 2026, 05:15 PM',
    admin: { name: 'Alok Nambiar', role: 'Finance Admin', email: 'alok.n@fillkart.in' },
    action: 'Create',
    module: 'Payments',
    target: 'TAX-INV-OCT26',
    details: 'Generated monthly GST slab report (5% / 12% / 18%) for commercial sales audit',
    ip: '192.168.1.33',
    browser: 'Safari 18 / macOS',
  },
  // 10. Product Update
  {
    id: 'aud-010',
    timestamp: '17 Nov 2026, 04:12 PM',
    admin: { name: 'David Kim', role: 'Operations Admin', email: 'david.kim@fillkart.in' },
    action: 'Update',
    module: 'Products',
    target: 'Aashirvaad Superior Atta 5kg',
    details: 'Adjusted sale price and active promotion discount',
    ip: '192.168.1.18',
    browser: 'Chrome 128 / Windows 11',
    diff: [
      { field: 'salePrice', before: '₹295', after: '₹289' },
      { field: 'discount', before: '9%', after: '11%' },
    ],
  },
  // 11. Security Audit: Admin Login
  {
    id: 'aud-011',
    timestamp: '17 Nov 2026, 02:05 PM',
    admin: { name: 'Sarah Mitchell', role: 'Super Admin', email: 'sarah.m@fillkart.in' },
    action: 'Login',
    module: 'Security',
    target: 'Admin Console',
    details: 'Successful two-factor authentication login via Hardware Key',
    ip: '192.168.1.45',
    browser: 'Chrome 128 / macOS',
  },
  // 12. Finance Audit: Cash on Delivery Reconciliation
  {
    id: 'aud-012',
    timestamp: '17 Nov 2026, 01:20 PM',
    admin: { name: 'Alok Nambiar', role: 'Finance Admin', email: 'alok.n@fillkart.in' },
    action: 'Update',
    module: 'Payments',
    target: 'COD-BATCH-109',
    details: 'Reconciled ₹14,850 Cash on Delivery collections deposited by field riders at hub safe',
    ip: '192.168.1.33',
    browser: 'Safari 18 / macOS',
    diff: [{ field: 'codReconciliation', before: 'In Transit', after: 'Hub Deposited' }],
  },
  // 13. Vendor Suspension Action
  {
    id: 'aud-013',
    timestamp: '17 Nov 2026, 12:40 PM',
    admin: { name: 'Sarah Mitchell', role: 'Super Admin', email: 'sarah.m@fillkart.in' },
    action: 'Suspend',
    module: 'Vendors',
    target: 'Spice Route Kitchen',
    details: 'Suspended merchant due to repeated health hygiene inspection flags',
    ip: '192.168.1.45',
    browser: 'Chrome 128 / macOS',
    diff: [{ field: 'status', before: 'Active', after: 'Suspended' }],
  },
  // 14. Finance Audit: Vendor Settlement Release
  {
    id: 'aud-014',
    timestamp: '16 Nov 2026, 04:30 PM',
    admin: { name: 'Alok Nambiar', role: 'Finance Admin', email: 'alok.n@fillkart.in' },
    action: 'Approve',
    module: 'Payments',
    target: 'TXN-90198',
    details: 'Disbursed bi-weekly payout ₹21,900 to Sharma Dairy via RTGS',
    ip: '192.168.1.33',
    browser: 'Safari 18 / macOS',
    diff: [{ field: 'settlementStatus', before: 'Pending', after: 'Disbursed' }],
  },
  // Additional 20 seeded audit logs
  ...Array.from({ length: 20 }, (_, i) => {
    const idx = i + 15;
    const actions: AuditAction[] = ['Update', 'Approve', 'Create', 'Suspend', 'Update', 'Login'];
    const act = actions[idx % actions.length];
    const isFin = idx % 3 === 0;
    const mod = isFin ? 'Payments' : ['Orders', 'Vendors', 'Riders', 'Products', 'Staff', 'Document Verification'][idx % 6];
    const adm = isFin
      ? { name: 'Alok Nambiar', role: 'Finance Admin', email: 'alok.n@fillkart.in' }
      : [
          { name: 'Sarah Mitchell', role: 'Super Admin', email: 'sarah.m@fillkart.in' },
          { name: 'David Kim', role: 'Operations Admin', email: 'david.kim@fillkart.in' },
          { name: 'Priya Patel', role: 'Support Admin', email: 'priya.patel@fillkart.in' },
        ][idx % 3];

    const target = isFin ? `TXN-${90200 - idx}` : `#FK-${8920 - idx}`;
    const details = isFin
      ? `Processed vendor payout settlement of ₹${(12000 + idx * 850).toLocaleString()} with bank reconciliation`
      : `Executed administrative ${act.toLowerCase()} workflow on ${mod} entity`;

    return {
      id: `aud-${idx.toString().padStart(3, '0')}`,
      timestamp: `${Math.max(1, 16 - Math.floor(idx / 4))} Nov 2026, 0${(idx % 8) + 1}:30 PM`,
      admin: adm,
      action: act,
      module: mod,
      target: target,
      details: details,
      ip: `192.168.1.${20 + (idx * 3) % 80}`,
      browser: idx % 2 === 0 ? 'Chrome 128 / Windows 11' : 'Safari 18 / macOS',
      diff:
        act === 'Update' || act === 'Approve'
          ? [
              {
                field: isFin ? 'settlementStatus' : 'status',
                before: isFin ? 'Pending' : 'Previous Value',
                after: isFin ? 'Settled' : 'Updated Value',
              },
            ]
          : undefined,
    };
  }),
];
