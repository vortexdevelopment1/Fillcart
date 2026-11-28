/**
 * Curated Blog Posts copied from frontend BlogPage.jsx
 * UTF-8 encoded, clean markdown content
 */

export const BLOG_TOPIC_IMAGES = {
  1: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&auto=format&fit=crop&q=80",
  2: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&auto=format&fit=crop&q=80",
  3: "https://images.unsplash.com/photo-1587560699334-bea93391dcef?w=800&auto=format&fit=crop&q=80",
  4: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&auto=format&fit=crop&q=80",
  5: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&auto=format&fit=crop&q=80",
  6: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80",
};

export const BLOG_POSTS = [
  {
    slug: "why-local-kiranas-beat-megastores-on-freshness-in-hyperlocal-delivery",
    title: "Why Local Kiranas Beat Megastores on Freshness in Hyperlocal Delivery",
    category: "Kirana Digitization",
    readTimeMinutes: 5,
    publishedAt: "2026-08-05T09:00:00.000Z",
    authorName: "Priya Sharma",
    authorRole: "Head of Merchant Growth",
    coverImageUrl: BLOG_TOPIC_IMAGES[1],
    isFeatured: true,
    isPublished: true,
    tags: ["kirana", "freshness", "hyperlocal", "groceries"],
    excerpt: "Centralized dark stores hold stock for days. Local Kirana stores turn over inventory daily. Here is why FillCarts partners with neighbourhood shops.",
    content: `When mega quick-commerce apps build 5,000 sq.ft dark-store warehouses, they incur heavy real estate overheads and store perishables for multiple days.

FillCarts takes a different approach: **Empowering the existing network of 12+ million Kirana stores, daily milk booths, and local fruit vendors across India.**

### Key Advantages of Hyperlocal Kiranas

1. **Daily Stock Rotation:** Local vendors replenish milk, paneer, and green vegetables every morning from local mandis.
2. **Proximity Under 1 KM:** Riders pick up orders within 3 minutes of customer checkout.
3. **Hyper-Regional Variety:** From specific local atta brands to regional spices, local shops carry what neighbours actually buy.

By connecting shopkeepers to our low-latency POS merchant app, we turn every local shop into a high-speed quick-commerce node.`,
  },
  {
    slug: "inside-the-tech-how-h3-geospatial-grids-power-15-minute-rider-dispatch",
    title: "Inside the Tech: How H3 Geospatial Grids Power 15-Minute Rider Dispatch",
    category: "Hyperlocal Tech",
    readTimeMinutes: 7,
    publishedAt: "2026-08-01T10:30:00.000Z",
    authorName: "Ankit Verma",
    authorRole: "Principal Systems Architect",
    coverImageUrl: BLOG_TOPIC_IMAGES[2],
    isFeatured: false,
    isPublished: true,
    tags: ["tech", "h3", "geospatial", "rider-dispatch"],
    excerpt: "A technical look at Uber H3 spatial indexing, WebSocket store alerts, and real-time route optimization for dense urban traffic.",
    content: `Delivering groceries in 15 minutes in congested Indian cities requires sub-second decision making.

When a customer taps 'Order Now', FillCarts executes three parallel algorithms:

- **H3 Hexagonal Spatial Indexing:** We map cities into Resolution-9 hexagonal cells (approx 100m diameter).
- **Sub-100ms Store Inventory Query:** Redis memory caches confirm item availability at nearby stores.
- **Rider Proximity & Traffic Estimation:** Real-time GPS telemetry evaluates rider velocity and signal delays to dispatch the optimal delivery partner.`,
  },
  {
    slug: "100-percent-medical-cover-and-daily-payouts-rethinking-delivery-fleet-welfare",
    title: "100% Medical Cover & Daily Payouts: Rethinking Delivery Fleet Welfare",
    category: "Fleet & Safety",
    readTimeMinutes: 5,
    publishedAt: "2026-07-24T14:15:00.000Z",
    authorName: "Rajesh Kumar",
    authorRole: "Rider Experience Lead",
    coverImageUrl: BLOG_TOPIC_IMAGES[3],
    isFeatured: false,
    isPublished: true,
    tags: ["fleet", "rider-safety", "welfare"],
    excerpt: "Speed should never compromise safety. Here is how we enforce strict speed limits, daily payouts, and full medical coverage.",
    content: `Our delivery partners are the backbone of hyperlocal commerce.

### Our Fleet Commitments

- **No Penalty for Traffic Delays:** We never penalize riders if an order takes longer due to weather or traffic.
- **Instant Daily Payouts:** Riders can transfer earnings directly to their bank account at the end of every shift.
- **Comprehensive Insurance:** Full accident coverage, hospitalization benefit, and family health cover from Day 1.`,
  },
  {
    slug: "the-economics-of-morning-milk-and-daily-bread-subscriptions",
    title: "The Economics of Morning Milk & Daily Bread Subscriptions",
    category: "Subscriptions & Daily Needs",
    readTimeMinutes: 6,
    publishedAt: "2026-07-18T08:00:00.000Z",
    authorName: "Meera Deshmukh",
    authorRole: "Product Lead - Subscriptions",
    coverImageUrl: BLOG_TOPIC_IMAGES[4],
    isFeatured: false,
    isPublished: true,
    tags: ["subscriptions", "milk", "daily-needs"],
    excerpt: "How automated 7 AM milk deliveries create predictable revenue for local dairies and zero-friction mornings for households.",
    content: `Daily milk, curd, and fresh bread represent the highest-frequency purchases in Indian households.

By allowing users to set flexible subscriptions (e.g. 1L Milk Daily, 500g Curd on Mon/Thu), local dairy vendors can predict exact morning demand 24 hours in advance, eliminating unsold stock wastage.`,
  },
  {
    slug: "farm-to-plate-in-3-hours-preserving-nutrients-in-leafy-greens",
    title: "Farm-to-Plate in 3 Hours: Preserving Nutrients in Leafy Greens",
    category: "Produce Freshness",
    readTimeMinutes: 4,
    publishedAt: "2026-07-10T11:45:00.000Z",
    authorName: "Dr. Kavita Reddy",
    authorRole: "Quality & Supply Chain Advisor",
    coverImageUrl: BLOG_TOPIC_IMAGES[5],
    isFeatured: false,
    isPublished: true,
    tags: ["produce", "freshness", "vegetables", "farm-to-table"],
    excerpt: "How direct mandi-to-kirana sourcing cuts supply chain links and delivers crisper spinach, tomatoes, and herbs.",
    content: `Traditional supply chains pass vegetables through 4-5 middlemen over 48 hours. FillCarts hyperlocal vendors source directly from local farmers and wholesale mandis at 4 AM, delivering to customers by 7 AM.`,
  },
  {
    slug: "how-pharmacy-quick-commerce-saves-lives-in-late-night-emergencies",
    title: "How Pharmacy Quick-Commerce Saves Lives in Late-Night Emergencies",
    category: "Kirana Digitization",
    readTimeMinutes: 5,
    publishedAt: "2026-06-28T22:30:00.000Z",
    authorName: "Siddharth Mehta",
    authorRole: "Category Head - Pharmacy",
    coverImageUrl: BLOG_TOPIC_IMAGES[6],
    isFeatured: false,
    isPublished: true,
    tags: ["pharmacy", "medicine", "emergency", "health"],
    excerpt: "Partnering with verified 24/7 neighbourhood chemists to deliver essential OTC medicines and first-aid late at night.",
    content: `When a child develops a fever at 2 AM, waiting until morning is not an option. By onboarding licensed neighbourhood chemists with 24/7 delivery permissions, FillCarts ensures critical medicines reach homes within 15 minutes.`,
  },
];
