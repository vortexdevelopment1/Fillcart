export interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  unit: string;
}

export type OrderStatus = 'Placed' | 'Preparing' | 'Out for delivery' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'UPI' | 'Card' | 'Bank' | 'COD';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  time: string;
  paymentMethod: PaymentMethod;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  vendor: {
    name: string;
    phone: string;
    address: string;
  };
  rider: {
    id: string;
    name: string;
    phone: string;
    vehicleType: string;
  } | null;
  items: OrderItem[];
  itemTotal: number;
  deliveryFee: number;
  tax: number;
  totalAmount: number;
  status: OrderStatus;
  timeline: {
    placedAt: string;
    acceptedAt?: string;
    preparingAt?: string;
    outForDeliveryAt?: string;
    deliveredAt?: string;
    cancelledAt?: string;
  };
  cancelReason?: string;
  cancelRemarks?: string;
  isRefunded?: boolean;
}

export const CANCELLATION_REASONS = [
  'Customer requested cancellation',
  'Item out of stock at vendor',
  'No rider available in vicinity',
  'Delivery address outside serviceable zone',
  'Suspected fraudulent transaction',
  'Operational delay exceeded threshold',
  'Other administrative reason',
];

export const initialOrders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: '#FK-8921',
    date: '18 Nov 2026',
    time: '10:24 AM',
    paymentMethod: 'UPI',
    customer: {
      name: 'Ananya Sharma',
      phone: '9820112233',
      email: 'ananya.s@gmail.com',
      address: 'Flat 402, Lotus Greens, Indirapuram, Ghaziabad',
    },
    vendor: {
      name: 'Fresh Mart Hub',
      phone: '9810000000',
      address: 'Shop 12, Sector 4 Central Market, Delhi',
    },
    rider: {
      id: 'r-001',
      name: 'Vikram Singh',
      phone: '9876543210',
      vehicleType: 'Motorcycle',
    },
    items: [
      { id: 'i-1', name: 'Aashirvaad Superior MP Atta', qty: 1, price: 289, unit: '5 kg' },
      { id: 'i-2', name: 'Amul Butter', qty: 2, price: 260, unit: '500 g' },
      { id: 'i-3', name: 'Tata Salt Iodized', qty: 1, price: 25, unit: '1 kg' },
    ],
    itemTotal: 834,
    deliveryFee: 40,
    tax: 42,
    totalAmount: 916,
    status: 'Out for delivery',
    timeline: {
      placedAt: '10:24 AM',
      acceptedAt: '10:27 AM',
      preparingAt: '10:35 AM',
      outForDeliveryAt: '10:48 AM',
    },
  },
  {
    id: 'ord-1002',
    orderNumber: '#FK-8920',
    date: '18 Nov 2026',
    time: '10:15 AM',
    paymentMethod: 'Card',
    customer: {
      name: 'Rahul Verma',
      phone: '9811223344',
      email: 'rahul.v@outlook.com',
      address: 'B-14, Green Park Extension, New Delhi',
    },
    vendor: {
      name: 'Royal Kirana',
      phone: '9817341111',
      address: 'MG Road Market, Indore',
    },
    rider: {
      id: 'r-002',
      name: 'Amit Kumar',
      phone: '9823456789',
      vehicleType: 'Scooter',
    },
    items: [
      { id: 'i-4', name: 'Fortune Sunlite Sunflower Oil', qty: 2, price: 142, unit: '1 L' },
      { id: 'i-5', name: 'Nestle Maggi 12-Pack', qty: 1, price: 152, unit: '840 g' },
    ],
    itemTotal: 436,
    deliveryFee: 30,
    tax: 22,
    totalAmount: 488,
    status: 'Preparing',
    timeline: {
      placedAt: '10:15 AM',
      acceptedAt: '10:18 AM',
      preparingAt: '10:25 AM',
    },
  },
  {
    id: 'ord-1003',
    orderNumber: '#FK-8919',
    date: '18 Nov 2026',
    time: '09:50 AM',
    paymentMethod: 'UPI',
    customer: {
      name: 'Pooja Iyer',
      phone: '9833445566',
      email: 'pooja.iyer@yahoo.com',
      address: 'Tower 7, Apt 1102, Hiranandani Estate, Thane',
    },
    vendor: {
      name: 'Sharma Dairy',
      phone: '9824582222',
      address: 'Civil Lines, Jabalpur',
    },
    rider: null,
    items: [
      { id: 'i-6', name: 'Brooke Bond Red Label Tea', qty: 1, price: 265, unit: '500 g' },
      { id: 'i-7', name: 'Parle-G Gold Glucose Biscuits', qty: 3, price: 105, unit: '1 kg' },
    ],
    itemTotal: 580,
    deliveryFee: 35,
    tax: 29,
    totalAmount: 644,
    status: 'Placed',
    timeline: {
      placedAt: '09:50 AM',
    },
  },
  {
    id: 'ord-1004',
    orderNumber: '#FK-8918',
    date: '18 Nov 2026',
    time: '09:30 AM',
    paymentMethod: 'COD',
    customer: {
      name: 'Ramesh Patel',
      phone: '9844556677',
      email: 'ramesh.p@gmail.com',
      address: '15, Shanti Niketan Society, Paldi, Ahmedabad',
    },
    vendor: {
      name: 'Daily Needs Store',
      phone: '9832023333',
      address: 'Race Course Road, Indore',
    },
    rider: {
      id: 'r-003',
      name: 'Deepak Sharma',
      phone: '9834567890',
      vehicleType: 'Electric',
    },
    items: [
      { id: 'i-8', name: 'Fresh Farm Red Hybrid Tomatoes', qty: 2, price: 42, unit: '1 kg' },
      { id: 'i-9', name: 'Aashirvaad Superior MP Atta', qty: 1, price: 289, unit: '5 kg' },
    ],
    itemTotal: 373,
    deliveryFee: 40,
    tax: 19,
    totalAmount: 432,
    status: 'Delivered',
    timeline: {
      placedAt: '09:30 AM',
      acceptedAt: '09:33 AM',
      preparingAt: '09:40 AM',
      outForDeliveryAt: '09:55 AM',
      deliveredAt: '10:18 AM',
    },
  },
  {
    id: 'ord-1005',
    orderNumber: '#FK-8917',
    date: '18 Nov 2026',
    time: '09:10 AM',
    paymentMethod: 'Card',
    customer: {
      name: 'Kavita Menon',
      phone: '9855667788',
      email: 'kavita.m@gmail.com',
      address: 'Villa 12, Palm Meadows, Whitefield, Bengaluru',
    },
    vendor: {
      name: 'City Pharmacy',
      phone: '9839364444',
      address: 'MP Nagar Zone 1, Bhopal',
    },
    rider: null,
    items: [
      { id: 'i-10', name: 'First Aid Kit Deluxe', qty: 1, price: 450, unit: 'Pack' },
      { id: 'i-11', name: 'Bandages Sterile', qty: 2, price: 60, unit: 'Box' },
    ],
    itemTotal: 570,
    deliveryFee: 30,
    tax: 28,
    totalAmount: 628,
    status: 'Cancelled',
    cancelReason: 'Customer requested cancellation',
    cancelRemarks: 'Accidentally ordered double items, customer re-ordered',
    timeline: {
      placedAt: '09:10 AM',
      cancelledAt: '09:18 AM',
    },
  },
  {
    id: 'ord-1006',
    orderNumber: '#FK-8916',
    date: '18 Nov 2026',
    time: '08:45 AM',
    paymentMethod: 'UPI',
    customer: {
      name: 'Mohit Agarwal',
      phone: '9866778899',
      email: 'mohit.a@techcorp.in',
      address: 'Flat 501, Oakwood Residency, Sector 62, Noida',
    },
    vendor: {
      name: 'Baker Street',
      phone: '9846705555',
      address: 'Arera Colony, Bhopal',
    },
    rider: {
      id: 'r-004',
      name: 'Suresh Patil',
      phone: '9845678901',
      vehicleType: 'Motorcycle',
    },
    items: [
      { id: 'i-12', name: 'Sourdough Artisan Loaf', qty: 1, price: 180, unit: '400 g' },
      { id: 'i-13', name: 'Almond Croissant', qty: 2, price: 120, unit: 'Piece' },
    ],
    itemTotal: 420,
    deliveryFee: 35,
    tax: 21,
    totalAmount: 476,
    status: 'Delivered',
    timeline: {
      placedAt: '08:45 AM',
      acceptedAt: '08:48 AM',
      preparingAt: '08:55 AM',
      outForDeliveryAt: '09:10 AM',
      deliveredAt: '09:32 AM',
    },
  },
  {
    id: 'ord-1007',
    orderNumber: '#FK-8915',
    date: '18 Nov 2026',
    time: '08:20 AM',
    paymentMethod: 'UPI',
    customer: {
      name: 'Sunita Rao',
      phone: '9877889900',
      email: 'sunita.rao@hotmail.com',
      address: '24, Jubilee Hills Road No. 36, Hyderabad',
    },
    vendor: {
      name: 'Green Basket',
      phone: '9854046666',
      address: 'Freeganj, Ujjain',
    },
    rider: {
      id: 'r-001',
      name: 'Vikram Singh',
      phone: '9876543210',
      vehicleType: 'Motorcycle',
    },
    items: [
      { id: 'i-14', name: 'Organic Spinach Bunches', qty: 2, price: 35, unit: '250 g' },
      { id: 'i-15', name: 'Farm Fresh Carrots', qty: 1, price: 55, unit: '1 kg' },
      { id: 'i-16', name: 'Green Bell Peppers', qty: 1, price: 45, unit: '500 g' },
    ],
    itemTotal: 170,
    deliveryFee: 40,
    tax: 9,
    totalAmount: 219,
    status: 'Delivered',
    timeline: {
      placedAt: '08:20 AM',
      acceptedAt: '08:22 AM',
      preparingAt: '08:30 AM',
      outForDeliveryAt: '08:42 AM',
      deliveredAt: '09:05 AM',
    },
  },
  {
    id: 'ord-1008',
    orderNumber: '#FK-8914',
    date: '18 Nov 2026',
    time: '07:55 AM',
    paymentMethod: 'Bank',
    customer: {
      name: 'Gaurav Kulkarni',
      phone: '9888990011',
      email: 'gaurav.k@kulkarni.org',
      address: '88, Model Colony, Shivaji Nagar, Pune',
    },
    vendor: {
      name: 'Fresh Mart Hub',
      phone: '9810000000',
      address: 'Shop 12, Sector 4 Central Market, Delhi',
    },
    rider: {
      id: 'r-002',
      name: 'Amit Kumar',
      phone: '9823456789',
      vehicleType: 'Scooter',
    },
    items: [
      { id: 'i-17', name: 'Basmati Rice Premium Kohinoor', qty: 1, price: 520, unit: '5 kg' },
      { id: 'i-18', name: 'Cow Ghee Pure Desi', qty: 1, price: 610, unit: '1 L' },
    ],
    itemTotal: 1130,
    deliveryFee: 50,
    tax: 57,
    totalAmount: 1237,
    status: 'Delivered',
    timeline: {
      placedAt: '07:55 AM',
      acceptedAt: '08:00 AM',
      preparingAt: '08:12 AM',
      outForDeliveryAt: '08:30 AM',
      deliveredAt: '08:52 AM',
    },
  },
  // Orders 9 to 40 to complete 40 mock orders
  ...Array.from({ length: 32 }, (_, i) => {
    const idx = i + 9;
    const orderNum = `#FK-${8914 - idx}`;
    const day = (18 - Math.floor(idx / 5)).toString().padStart(2, '0');
    const hr = (8 + (idx % 12)).toString().padStart(2, '0');
    const min = ((idx * 7) % 60).toString().padStart(2, '0');
    const time = `${hr}:${min} ${parseInt(hr) >= 12 ? 'PM' : 'AM'}`;
    const methods: PaymentMethod[] = ['UPI', 'Card', 'COD', 'Bank'];
    const pMethod = methods[idx % methods.length];

    const customers = [
      { name: 'Priyanka Sen', phone: '9891001122', email: 'priyanka.s@gmail.com', address: 'Block C, Salt Lake Sector 1, Kolkata' },
      { name: 'Aditya Roy', phone: '9872112233', email: 'aditya.roy@yahoo.com', address: '404, Marine Drive, Mumbai' },
      { name: 'Harish Nair', phone: '9863223344', email: 'harish.n@gmail.com', address: 'Road 14, Banjara Hills, Hyderabad' },
      { name: 'Sneha Deshmukh', phone: '9854334455', email: 'sneha.d@gmail.com', address: 'Flat 12, Kothrud, Pune' },
      { name: 'Rohan Gupta', phone: '9845445566', email: 'rohan.g@corp.in', address: 'Sector 15, Chandigarh' },
      { name: 'Meera Chawla', phone: '9836556677', email: 'meera.c@gmail.com', address: 'Civil Lines, Jaipur' },
      { name: 'Farhan Zaidi', phone: '9827667788', email: 'farhan.z@gmail.com', address: 'Hazratganj, Lucknow' },
      { name: 'Tanvi Joshi', phone: '9818778899', email: 'tanvi.j@gmail.com', address: 'Alkapuri, Vadodara' },
    ];
    const cust = customers[idx % customers.length];

    const vendors = [
      { name: 'Fresh Mart Hub', phone: '9810000000', address: 'Shop 12, Sector 4, Delhi' },
      { name: 'Royal Kirana', phone: '9817341111', address: 'MG Road, Indore' },
      { name: 'Sharma Dairy', phone: '9824582222', address: 'Civil Lines, Jabalpur' },
      { name: 'Daily Needs Store', phone: '9832023333', address: 'Race Course Road, Indore' },
      { name: 'City Pharmacy', phone: '9839364444', address: 'MP Nagar, Bhopal' },
      { name: 'Baker Street', phone: '9846705555', address: 'Arera Colony, Bhopal' },
      { name: 'Green Basket', phone: '9854046666', address: 'Freeganj, Ujjain' },
    ];
    const vend = vendors[idx % vendors.length];

    const riders = [
      { id: 'r-001', name: 'Vikram Singh', phone: '9876543210', vehicleType: 'Motorcycle' },
      { id: 'r-002', name: 'Amit Kumar', phone: '9823456789', vehicleType: 'Scooter' },
      { id: 'r-003', name: 'Deepak Sharma', phone: '9834567890', vehicleType: 'Electric' },
      { id: 'r-004', name: 'Suresh Patil', phone: '9845678901', vehicleType: 'Motorcycle' },
      { id: 'r-005', name: 'Manoj Tiwari', phone: '9856789012', vehicleType: 'Scooter' },
    ];
    const rdr = idx % 5 === 0 ? null : riders[idx % riders.length];

    const statuses: OrderStatus[] = [
      'Delivered',
      'Delivered',
      'Out for delivery',
      'Preparing',
      'Delivered',
      'Cancelled',
      'Placed',
      'Delivered',
    ];
    const status = statuses[idx % statuses.length];

    const itemPrice1 = 120 + ((idx * 33) % 350);
    const itemPrice2 = 60 + ((idx * 17) % 200);
    const itemTotal = itemPrice1 + itemPrice2;
    const deliveryFee = 35;
    const tax = Math.round(itemTotal * 0.05);
    const totalAmount = itemTotal + deliveryFee + tax;

    return {
      id: `ord-${1000 + idx}`,
      orderNumber: orderNum,
      date: `${day} Nov 2026`,
      time: time,
      paymentMethod: pMethod,
      customer: cust,
      vendor: vend,
      rider: status === 'Placed' || status === 'Cancelled' ? null : rdr,
      items: [
        { id: `item-${idx}-1`, name: `Pack of Pantry Staples #${idx}`, qty: 1, price: itemPrice1, unit: '1 unit' },
        { id: `item-${idx}-2`, name: `Fresh Essentials #${(idx % 10) + 1}`, qty: 2, price: itemPrice2 / 2, unit: '500 g' },
      ],
      itemTotal,
      deliveryFee,
      tax,
      totalAmount,
      status,
      cancelReason: status === 'Cancelled' ? CANCELLATION_REASONS[idx % CANCELLATION_REASONS.length] : undefined,
      cancelRemarks: status === 'Cancelled' ? 'Auto-logged administrative remark.' : undefined,
      timeline: {
        placedAt: `${time}`,
        acceptedAt: status !== 'Placed' && status !== 'Cancelled' ? '10 min later' : undefined,
        preparingAt: status === 'Preparing' || status === 'Out for delivery' || status === 'Delivered' ? '20 min later' : undefined,
        outForDeliveryAt: status === 'Out for delivery' || status === 'Delivered' ? '35 min later' : undefined,
        deliveredAt: status === 'Delivered' ? '50 min later' : undefined,
        cancelledAt: status === 'Cancelled' ? '15 min later' : undefined,
      },
    };
  }),
];
