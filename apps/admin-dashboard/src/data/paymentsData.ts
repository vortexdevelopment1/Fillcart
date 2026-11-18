export type TransactionType = 'Collection' | 'Vendor Payout' | 'Rider Payout' | 'Refund';
export type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded';
export type PaymentMethod = 'UPI' | 'Card' | 'Bank' | 'COD';

export interface PaymentTransaction {
  id: string;
  txNumber: string;
  date: string;
  time: string;
  party: string;
  partyType: 'Customer' | 'Vendor' | 'Rider';
  type: TransactionType;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  orderId?: string;
  reference: string;
  bankDetails?: {
    bankName: string;
    accountMasked: string;
    ifsc: string;
  };
  notes?: string;
}

export interface MonthlyStatement {
  id: string;
  month: string;
  year: number;
  totalOrders: number;
  totalSales: number;
  commission: number;
  vendorPayouts: number;
  riderPayouts: number;
  refunds: number;
  netRevenue: number;
  status: 'Reconciled' | 'Pending Audit' | 'Closed';
}

export const initialTransactions: PaymentTransaction[] = [
  {
    id: 'tx-2001',
    txNumber: 'TXN-90241',
    date: '18 Nov 2026',
    time: '10:24 AM',
    party: 'Ananya Sharma',
    partyType: 'Customer',
    type: 'Collection',
    method: 'UPI',
    amount: 916,
    status: 'Paid',
    orderId: '#FK-8921',
    reference: 'UPI/2611181024/90241',
  },
  {
    id: 'tx-2002',
    txNumber: 'TXN-90240',
    date: '18 Nov 2026',
    time: '10:15 AM',
    party: 'Rahul Verma',
    partyType: 'Customer',
    type: 'Collection',
    method: 'Card',
    amount: 488,
    status: 'Paid',
    orderId: '#FK-8920',
    reference: 'CRD/2611181015/88124',
  },
  {
    id: 'tx-2003',
    txNumber: 'TXN-90239',
    date: '18 Nov 2026',
    time: '09:45 AM',
    party: 'Fresh Mart Hub',
    partyType: 'Vendor',
    type: 'Vendor Payout',
    method: 'Bank',
    amount: 24500,
    status: 'Pending',
    reference: 'NEFT/PEND/FMH-11',
    bankDetails: {
      bankName: 'HDFC Bank',
      accountMasked: '•••• •••• 9214',
      ifsc: 'HDFC0001244',
    },
    notes: 'Bi-weekly vendor store disbursement',
  },
  {
    id: 'tx-2004',
    txNumber: 'TXN-90238',
    date: '18 Nov 2026',
    time: '09:30 AM',
    party: 'Vikram Singh',
    partyType: 'Rider',
    type: 'Rider Payout',
    method: 'UPI',
    amount: 4850,
    status: 'Pending',
    reference: 'UPI/PEND/RDR-01',
    bankDetails: {
      bankName: 'State Bank of India',
      accountMasked: '•••• •••• 4102',
      ifsc: 'SBIN0005120',
    },
    notes: 'Weekly rider delivery commission & tips',
  },
  {
    id: 'tx-2005',
    txNumber: 'TXN-90237',
    date: '18 Nov 2026',
    time: '09:18 AM',
    party: 'Kavita Menon',
    partyType: 'Customer',
    type: 'Refund',
    method: 'Card',
    amount: 628,
    status: 'Paid',
    orderId: '#FK-8917',
    reference: 'RFND/261118/77412',
    notes: 'Full refund for cancelled order #FK-8917',
  },
  {
    id: 'tx-2006',
    txNumber: 'TXN-90236',
    date: '17 Nov 2026',
    time: '08:20 PM',
    party: 'Royal Kirana',
    partyType: 'Vendor',
    type: 'Vendor Payout',
    method: 'Bank',
    amount: 18400,
    status: 'Paid',
    reference: 'NEFT/261117/RK-991',
    bankDetails: {
      bankName: 'ICICI Bank',
      accountMasked: '•••• •••• 8109',
      ifsc: 'ICIC0000412',
    },
    notes: 'Vendor cycle payout executed',
  },
  {
    id: 'tx-2007',
    txNumber: 'TXN-90235',
    date: '17 Nov 2026',
    time: '07:15 PM',
    party: 'Amit Kumar',
    partyType: 'Rider',
    type: 'Rider Payout',
    method: 'Bank',
    amount: 3950,
    status: 'Paid',
    reference: 'IMPS/261117/AK-441',
    bankDetails: {
      bankName: 'Punjab National Bank',
      accountMasked: '•••• •••• 7721',
      ifsc: 'PUNB0124800',
    },
    notes: 'Weekly delivery earnings cleared',
  },
  {
    id: 'tx-2008',
    txNumber: 'TXN-90234',
    date: '17 Nov 2026',
    time: '06:05 PM',
    party: 'Rohan Gupta',
    partyType: 'Customer',
    type: 'Collection',
    method: 'COD',
    amount: 540,
    status: 'Paid',
    orderId: '#FK-8902',
    reference: 'COD/COLLECT/8902',
  },
  {
    id: 'tx-2009',
    txNumber: 'TXN-90233',
    date: '17 Nov 2026',
    time: '04:50 PM',
    party: 'Sharma Dairy',
    partyType: 'Vendor',
    type: 'Vendor Payout',
    method: 'Bank',
    amount: 12800,
    status: 'Pending',
    reference: 'NEFT/PEND/SD-05',
    bankDetails: {
      bankName: 'Axis Bank',
      accountMasked: '•••• •••• 3312',
      ifsc: 'UTIB0000881',
    },
  },
  {
    id: 'tx-2010',
    txNumber: 'TXN-90232',
    date: '17 Nov 2026',
    time: '02:30 PM',
    party: 'Suresh Patil',
    partyType: 'Rider',
    type: 'Rider Payout',
    method: 'UPI',
    amount: 5200,
    status: 'Pending',
    reference: 'UPI/PEND/SP-09',
    bankDetails: {
      bankName: 'Kotak Mahindra Bank',
      accountMasked: '•••• •••• 1928',
      ifsc: 'KKBK0000188',
    },
  },
  {
    id: 'tx-2011',
    txNumber: 'TXN-90231',
    date: '17 Nov 2026',
    time: '01:10 PM',
    party: 'Harish Nair',
    partyType: 'Customer',
    type: 'Collection',
    method: 'UPI',
    amount: 1420,
    status: 'Failed',
    orderId: '#FK-8898',
    reference: 'UPI/FAIL/8898/TIMEO',
    notes: 'Gateway session timeout during OTP auth',
  },
  {
    id: 'tx-2012',
    txNumber: 'TXN-90230',
    date: '16 Nov 2026',
    time: '11:40 AM',
    party: 'Daily Needs Store',
    partyType: 'Vendor',
    type: 'Vendor Payout',
    method: 'Bank',
    amount: 21600,
    status: 'Paid',
    reference: 'NEFT/261116/DNS-88',
    bankDetails: {
      bankName: 'Bank of Baroda',
      accountMasked: '•••• •••• 5543',
      ifsc: 'BARB0INDORE',
    },
  },
  // Additional seed transactions for variety
  ...Array.from({ length: 24 }, (_, i) => {
    const idx = i + 13;
    const isPayout = idx % 3 === 0;
    const isRider = idx % 6 === 0;
    const isRefund = idx % 7 === 0;
    const methods: PaymentMethod[] = ['UPI', 'Card', 'Bank', 'COD'];

    const type: TransactionType = isRefund
      ? 'Refund'
      : isRider
      ? 'Rider Payout'
      : isPayout
      ? 'Vendor Payout'
      : 'Collection';

    const status: PaymentStatus =
      type === 'Collection'
        ? idx % 11 === 0
          ? 'Failed'
          : 'Paid'
        : idx % 2 === 0
        ? 'Pending'
        : 'Paid';

    const parties = [
      'Priyanka Sen',
      'Fresh Mart Hub',
      'Vikram Singh',
      'Baker Street',
      'Sunita Rao',
      'City Pharmacy',
      'Deepak Sharma',
    ];

    const party = parties[idx % parties.length];
    const partyType: 'Customer' | 'Vendor' | 'Rider' = isRider ? 'Rider' : isPayout ? 'Vendor' : 'Customer';
    const amount =
      type === 'Vendor Payout'
        ? 15000 + (idx * 950) % 20000
        : type === 'Rider Payout'
        ? 2800 + (idx * 310) % 4000
        : type === 'Refund'
        ? 350 + (idx * 45) % 800
        : 280 + (idx * 85) % 1800;

    return {
      id: `tx-${2000 + idx}`,
      txNumber: `TXN-${90230 - idx}`,
      date: `${Math.max(1, 16 - Math.floor(idx / 3))} Nov 2026`,
      time: '11:15 AM',
      party,
      partyType,
      type,
      method: methods[idx % methods.length],
      amount,
      status,
      orderId: type === 'Collection' || type === 'Refund' ? `#FK-${8900 - idx}` : undefined,
      reference: `REF/${261110 + idx}/${1000 + idx}`,
      bankDetails:
        partyType !== 'Customer'
          ? {
              bankName: 'HDFC Bank',
              accountMasked: '•••• •••• ' + (1000 + idx * 77).toString().slice(-4),
              ifsc: 'HDFC0001099',
            }
          : undefined,
    };
  }),
];

export const initialStatements: MonthlyStatement[] = [
  {
    id: 'stmt-2026-10',
    month: 'October',
    year: 2026,
    totalOrders: 3420,
    totalSales: 2854000,
    commission: 342480,
    vendorPayouts: 2140500,
    riderPayouts: 285400,
    refunds: 41200,
    netRevenue: 386900,
    status: 'Reconciled',
  },
  {
    id: 'stmt-2026-09',
    month: 'September',
    year: 2026,
    totalOrders: 3180,
    totalSales: 2640000,
    commission: 316800,
    vendorPayouts: 1980000,
    riderPayouts: 264000,
    refunds: 38400,
    netRevenue: 357600,
    status: 'Reconciled',
  },
  {
    id: 'stmt-2026-08',
    month: 'August',
    year: 2026,
    totalOrders: 2950,
    totalSales: 2410000,
    commission: 289200,
    vendorPayouts: 1807500,
    riderPayouts: 241000,
    refunds: 32000,
    netRevenue: 329500,
    status: 'Reconciled',
  },
  {
    id: 'stmt-2026-07',
    month: 'July',
    year: 2026,
    totalOrders: 2780,
    totalSales: 2280000,
    commission: 273600,
    vendorPayouts: 1710000,
    riderPayouts: 228000,
    refunds: 29500,
    netRevenue: 312500,
    status: 'Closed',
  },
  {
    id: 'stmt-2026-06',
    month: 'June',
    year: 2026,
    totalOrders: 2510,
    totalSales: 2050000,
    commission: 246000,
    vendorPayouts: 1537500,
    riderPayouts: 205000,
    refunds: 26100,
    netRevenue: 281400,
    status: 'Closed',
  },
  {
    id: 'stmt-2026-05',
    month: 'May',
    year: 2026,
    totalOrders: 2320,
    totalSales: 1890000,
    commission: 226800,
    vendorPayouts: 1417500,
    riderPayouts: 189000,
    refunds: 22400,
    netRevenue: 260100,
    status: 'Closed',
  },
];
