export const pendingVerificationsStats = {
  rate: "91.7%",
  change: "+0.3%",
  pendingLabel: "8.3% pending",
  totalPending: 18,
  totalSubmissions: 216,
  ticks: Array.from({ length: 72 }, (_, i) => i < 66),
};

export const vendorsStats = {
  count: 25,
  badge: "4 active",
  ticks: Array.from({ length: 72 }, (_, i) => ({
    filled: i < 18,
    color: i >= 14 ? '#123747' : 'rgba(18, 55, 71, 0.55)',
  })),
};

export const ridersTallStats = {
  count: "3,241",
  badge: "192 New in July",
  change: "12%",
  bars: [
    { label: "J", value: 78, isHatched: false },
    { label: "F", value: 42, isHatched: false },
    { label: "M", value: 65, isHatched: false },
    { label: "A", value: 36, isHatched: false },
    { label: "M", value: 48, isHatched: false },
    { label: "J", value: 72, isHatched: false },
    { label: "J", value: 55, isHatched: true },
  ],
};

export const topOrdersVendors = [
  {
    id: "v1",
    name: "Sarah Mitchell",
    email: "sarah@brights...",
    share: "12%",
    orders: "1,240",
    color: "#123747",
  },
  {
    id: "v2",
    name: "David Kim",
    email: "david.kim@email...",
    share: "8%",
    orders: "850",
    color: "#527781",
  },
  {
    id: "v3",
    name: "Priya Patel",
    email: "priya@oakrealty.c...",
    share: "4%",
    orders: "425",
    color: "rgba(82, 119, 129, 0.55)",
  },
  {
    id: "v4",
    name: "Others",
    email: "",
    share: "76%",
    orders: "7,011",
    color: "#FFFFFF",
  },
];

export const productsCategoryDonutData = [
  { name: "Direct", value: 48, color: "#123747", change: "0.3%", isPositive: true },
  { name: "Campaigns", value: 28, color: "#527781", change: "25.4%", isPositive: false },
  { name: "Automations", value: 24, color: "rgba(82, 119, 129, 0.45)", change: "15%", isPositive: true },
];

export const paymentsSummary = {
  total: "$2,450",
  subtext: "$350 Used",
  change: "+14.8%",
};

export const basicReportsData = {
  total: "95,215",
  subtext: "1,243 today",
  badge: "51%",
  chartPoints: [
    { label: "1 Jul", value: 420 },
    { label: "5 Jul", value: 680 },
    { label: "8 Jul", value: 390 },
    { label: "12 Jul", value: 310 },
    { label: "15 Jul", value: 220 },
    { label: "20 Jul", value: 450 },
    { label: "25 Jul", value: 890 },
  ],
};

export const platformActivityMonthlyData = [
  { month: "Jan", open: 340, closed: 850, total: 1190, isHighlighted: false },
  { month: "Feb", open: 220, closed: 420, total: 640, isHighlighted: false },
  { month: "Mar", open: 410, closed: 980, total: 1390, isHighlighted: false },
  { month: "Apr", open: 390, closed: 870, total: 1260, isHighlighted: false },
  { month: "May", open: 480, closed: 1140, total: 1620, isHighlighted: false },
  { month: "Jun", open: 510, closed: 1280, total: 1790, isHighlighted: false },
  { 
    month: "Jul", 
    open: 38, 
    closed: 1196, 
    total: 1234, 
    isHighlighted: true, 
    tooltip: { total: "1,234 Total", open: "38 Open", closed: "1,196 Closed" } 
  },
  { month: "Aug", open: 380, closed: 890, total: 1270, isHighlighted: false },
  { month: "Sep", open: 290, closed: 780, total: 1070, isHighlighted: false },
  { month: "Oct", open: 440, closed: 1020, total: 1460, isHighlighted: false },
  { month: "Nov", open: 520, closed: 1310, total: 1830, isHighlighted: false },
  { month: "Dec", open: 460, closed: 1180, total: 1640, isHighlighted: false },
];

export const auditLogsSample = [
  {
    id: "log-1",
    adminName: "Ananya Iyer",
    adminAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    action: "Approved KYC Documents",
    target: "Rider #RD-8842 (Rajesh Kumar)",
    timeAgo: "8 mins ago",
    badgeType: "approval" as const,
  },
  {
    id: "log-2",
    adminName: "Vikram Malhotra",
    adminAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    action: "Updated Store Commission",
    target: "Fresh Mart Hub (8.5% → 7.0%)",
    timeAgo: "42 mins ago",
    badgeType: "update" as const,
  },
  {
    id: "log-3",
    adminName: "Karan Johar",
    adminAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    action: "Role Permission Altered",
    target: "Verification Ops: Granted Bulk Review",
    timeAgo: "2 hours ago",
    badgeType: "security" as const,
  },
];
