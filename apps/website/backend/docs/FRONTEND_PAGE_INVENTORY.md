# Customer Frontend Page & Route Inventory Audit

**Audit Date:** 2026-11-28  
**Scope:** Customer Frontend (`apps/website/frontend`) route accessibility, in-page features, navigation link audit, and customer backend (`apps/website/backend`) readiness.  
**Auditor Policy:** Read-Only Audit. No existing code modified.

---

## 1. Route Inventory & Classification (Table 1)

Classification Rules:
- **VISIBLE:** Reachable via at least one real UI element (navbar, footer, sidebar tab, home card, product card, or button).
- **HIDDEN:** Route exists in `src/app/routes.jsx` but has ZERO navigation links in UI (accessible only by typing the direct URL in browser address bar).
- **REDIRECT:** Route immediately redirects to another route.
- **DEV-ONLY:** Route is only accessible during development or non-production modes.

| # | Route | Component File | Lazy? | Protected? | Status | UI Entry Point (File:Line) | Customer Backend Endpoint | Backend Status |
|---|-------|----------------|-------|------------|--------|----------------------------|---------------------------|----------------|
| 1 | `/` | `src/features/home/AppKartHome.jsx` | No | No | **VISIBLE** | Navbar Logo (`Navbar.jsx:291`), Footer Logo (`Footer.jsx:52`) | `GET /api/v1/home`, `/categories`, `/stores`, `/products` | **HAI** |
| 2 | `/stores` | `src/features/stores/StoresListingPage.jsx` | No | No | **VISIBLE** | Footer "Stores" link (`Footer.jsx:242`) | `GET /api/v1/stores` | **HAI** |
| 3 | `/store/:slug` | `src/features/stores/StoreDetailPage.jsx` | No | No | **VISIBLE** | Home StoreCard (`AppKartHome.jsx:226`, `StoreCard.jsx:14`) | `GET /api/v1/stores/:slug` | **HAI** |
| 4 | `/shops` | `<Navigate to="/stores" replace />` | No | No | **REDIRECT** | Route alias in `routes.jsx:45` | N/A (Redirect) | **NOT NEEDED** |
| 5 | `/search` | `src/features/catalog/SearchResultsPage.jsx` | No | No | **VISIBLE** | Navbar Search Form (`Navbar.jsx:549`, `SearchDropdown.jsx:87`) | `GET /api/v1/search` | **HAI** |
| 6 | `/categories` | `CategoriesRedirect` | No | No | **REDIRECT** | Helper redirecting to `/search` or `/category/:slug` (`routes.jsx:48-56`) | N/A (Redirect) | **NOT NEEDED** |
| 7 | `/groceries` | `<Navigate to="/category/grocery" replace />` | No | No | **REDIRECT** | Route alias in `routes.jsx:58` | N/A (Redirect) | **NOT NEEDED** |
| 8 | `/category` | `<Navigate to="/category/grocery" replace />` | No | No | **REDIRECT** | Route alias in `routes.jsx:59` | N/A (Redirect) | **NOT NEEDED** |
| 9 | `/category/:slug` | `src/features/catalog/CategoryListingPage.jsx` | No | No | **VISIBLE** | Navbar Category Bar (`Navbar.jsx:643`), Footer Shop Links (`Footer.jsx:119, 128, 137`) | `GET /api/v1/categories`, `GET /api/v1/products` | **HAI** |
| 10 | `/product/:slug` | `src/features/product/ProductDetailPage.jsx` | No | No | **VISIBLE** | Product Cards on Home/Catalog (`ProductCard.jsx:10`, `ListingProductCard.jsx:15`) | `GET /api/v1/products/:slug` | **HAI** |
| 11 | `/product/:id` | `src/features/product/ProductDetailPage.jsx` | No | No | **VISIBLE** | Legacy ID fallback route (`routes.jsx:65`) | `GET /api/v1/products/:slug` | **HAI** |
| 12 | `/cart` | `src/features/cart/CartPage.jsx` | No | No | **VISIBLE** | Navbar Cart Button (`Navbar.jsx:610`) | `GET/POST/PATCH/DELETE /api/v1/cart/*` | **HAI** |
| 13 | `/wishlist` | `src/features/wishlist/WishlistPage.jsx` | No | No | **VISIBLE** | Navbar Wishlist Icon (`Navbar.jsx:592`), Mobile Drawer (`Navbar.jsx:901`) | `GET/POST/DELETE /api/v1/wishlist/*` | **HAI** |
| 14 | `/offers/payment` | `src/features/offers/PaymentOffersPage.jsx` | No | No | **VISIBLE** | Home Promo Banner click (`AppKartHome.jsx:189`) | `GET /api/v1/offers` | **HAI** |
| 15 | `/payment-offers` | `<Navigate to="/offers/payment" replace />` | No | No | **REDIRECT** | Route alias in `routes.jsx:73` | N/A (Redirect) | **NOT NEEDED** |
| 16 | `/profile` | `<Navigate to="/profile/orders" replace />` | No | No | **REDIRECT** | Navbar Profile Icon (`Navbar.jsx:560`) -> redirects to `/profile/orders` | N/A (Redirect) | **NOT NEEDED** |
| 17 | `/profile/orders` | `src/features/profile/ProfileOrders.jsx` | No | Yes (Auth) | **VISIBLE** | Profile sidebar tab (`ProfileLayout.jsx:7`), Footer "Track an order" (`Footer.jsx:167`) | `GET /api/v1/orders`, `GET /api/v1/orders/:orderId/track` | **HAI** |
| 18 | `/profile/addresses` | `src/features/profile/ProfileAddresses.jsx` | No | Yes (Auth) | **VISIBLE** | Profile sidebar tab (`ProfileLayout.jsx:8`), Navbar Address dropdown (`Navbar.jsx:504`) | `GET/POST/PATCH/DELETE /api/v1/addresses/*` | **HAI** |
| 19 | `/profile/prescriptions` | `src/features/profile/ProfilePrescriptions.jsx` | No | Yes (Auth) | **VISIBLE** | Profile sidebar tab (`ProfileLayout.jsx:9`) | `GET/POST/DELETE /api/v1/prescriptions/*` | **HAI** |
| 20 | `/profile/account` | `src/features/profile/ProfileAccount.jsx` | No | Yes (Auth) | **VISIBLE** | Profile sidebar tab (`ProfileLayout.jsx:10`) | `GET/PATCH /api/v1/me/profile` | **HAI** |
| 21 | `/profile/:tab` | `src/features/profile/UserProfilePage.jsx` | No | Yes (Auth) | **VISIBLE** | Catch-all profile tab route (`routes.jsx:95`) | Dynamic matching profile endpoints | **HAI** |
| 22 | `/login` | `src/features/auth/CustomerLoginPage.jsx` | No | No | **VISIBLE** | Navbar "Sign In" button (`Navbar.jsx:580`) | Central Auth Port 4000 (`/api/v1/auth/*`) | **HAI** |
| 23 | `/register` | `src/features/auth/CustomerRegistrationPage.jsx` | No | No | **VISIBLE** | Login Page "Create account" link (`CustomerLoginPage.jsx:125`) | Central Auth Port 4000 (`/api/v1/auth/*`) | **HAI** |
| 24 | `/login/customer` | `src/features/auth/CustomerLoginPage.jsx` | No | No | **VISIBLE** | Alias login route (`routes.jsx:100`) | Central Auth Port 4000 (`/api/v1/auth/*`) | **HAI** |
| 25 | `/features` | `src/features/misc/FeaturesPage.jsx` | No | No | **HIDDEN** | **None.** No link anywhere in Navbar, Footer, or any page. Direct URL only (`routes.jsx:103`) | Static presentation content | **NOT NEEDED** |
| 26 | `/about` | `src/features/about/AboutPage.jsx` | No | No | **VISIBLE** | Footer "About us" link (`Footer.jsx:215`) | Static presentation content | **NOT NEEDED** |
| 27 | `/support` | `src/features/support/SupportPage.jsx` | No | No | **VISIBLE** | Footer "FAQs" link (`Footer.jsx:176`) | `GET /api/v1/faqs`, `POST /api/v1/support/messages` | **HAI** |
| 28 | `/faq` | `<Navigate to="/support" replace />` | No | No | **REDIRECT** | Route alias in `routes.jsx:106` | N/A (Redirect) | **NOT NEEDED** |
| 29 | `/help` | `<Navigate to="/support" replace />` | No | No | **REDIRECT** | Route alias in `routes.jsx:107` | N/A (Redirect) | **NOT NEEDED** |
| 30 | `/subscriptions` | `src/features/misc/SubscriptionPage.jsx` | No | No | **HIDDEN** | **None.** No link anywhere in Navbar, Footer, or Profile tabs. Direct URL only (`routes.jsx:108`) | Subscriptions backend tables & endpoints | **MISSING** |
| 31 | `/careers` | `src/features/careers/CareersPage.jsx` | No | No | **VISIBLE** | Footer "Careers" link (`Footer.jsx:251`) | `GET /api/v1/careers/openings`, `POST /api/v1/careers/applications` | **HAI** |
| 32 | `/blog` | `src/features/misc/BlogPage.jsx` | No | No | **VISIBLE** | Footer "Press" link (`Footer.jsx:278`) | `POST /api/v1/newsletter/subscribe` (HAI); Blog posts CMS | **MISSING** |
| 33 | `/terms` | `src/features/legal/LegalPage.jsx` | No | No | **VISIBLE** | Footer "Terms & conditions" (`Footer.jsx:260, 403`), Footer "Returns" (`Footer.jsx:194`) | Static legal document | **NOT NEEDED** |
| 34 | `/privacy` | `src/features/legal/LegalPage.jsx` | No | No | **VISIBLE** | Footer "Privacy policy" (`Footer.jsx:269, 393`) | Static legal document | **NOT NEEDED** |
| 35 | `/contact` | `src/features/contact/ContactPage.jsx` | No | No | **VISIBLE** | Footer "Contact us" (`Footer.jsx:185, 233`) | `POST /api/v1/contact` | **HAI** |
| 36 | `/how-it-works` | `src/features/misc/HowItWorksPage.jsx` | No | No | **VISIBLE** | Footer "How it works" link (`Footer.jsx:224`) | Static presentation content | **NOT NEEDED** |
| 37 | `/become-vendor` | `src/features/vendors/BecomeVendorPage.jsx` | No | No | **VISIBLE** | Footer "Become a vendor" link (`Footer.jsx:299`) | `POST /api/v1/partners/vendor-applications` | **HAI** |
| 38 | `/partner/vendor` | `src/features/vendors/BecomeVendorPage.jsx` | No | No | **VISIBLE** | Partner vendor alias route (`routes.jsx:116`) | `POST /api/v1/partners/vendor-applications` | **HAI** |
| 39 | `/become-rider` | `src/features/services/BecomeRiderPage.jsx` | No | No | **VISIBLE** | Footer "Become a rider" link (`Footer.jsx:308`) | `POST /api/v1/partners/rider-applications` | **HAI** |
| 40 | `/partner/rider` | `src/features/services/BecomeRiderPage.jsx` | No | No | **VISIBLE** | Partner rider alias route (`routes.jsx:118`) | `POST /api/v1/partners/rider-applications` | **HAI** |
| 41 | `/styleguide` | `src/features/styleguide/StyleguidePage.jsx` | Yes | No | **DEV-ONLY** | Development environment only (`routes.jsx:121`) | Component showcase | **NOT NEEDED** |
| 42 | `*` | `src/features/misc/NotFoundPage.jsx` | No | No | **VISIBLE** | 404 catch-all triggered on non-existent routes (`routes.jsx:132`) | Client-side 404 fallback | **NOT NEEDED** |

---

## 2. In-Page Major Features Audit (Table 2)

| Feature / Section | Containing Page / Component | Render Status | Location (File:Line) | Trigger / Conditional Condition | Customer Backend Endpoint | Backend Status |
|-------------------|-----------------------------|---------------|----------------------|---------------------------------|---------------------------|----------------|
| **Product Reviews & Ratings** | `ProductDetailPage.jsx` | **VISIBLE** | `ProductDetailPage.jsx:500-650` | Rendered when activeTab === 'reviews' | `GET /api/v1/products/:slug/reviews`<br>`POST/PATCH/DELETE /api/v1/products/:slug/reviews` | **HAI** |
| **Delivery Slot Selection** | `ProductDetailPage.jsx` | **VISIBLE** | `ProductDetailPage.jsx:35-45` | Dropdown in product buy-box | Hardcoded client array; Dynamic slots API | **MISSING** |
| **Prescription Upload** | `ProfilePrescriptions.jsx` | **VISIBLE** | `ProfilePrescriptions.jsx:30-100` | Rendered on My Prescriptions tab | `GET /api/v1/prescriptions`<br>`POST /api/v1/prescriptions`<br>`DELETE /api/v1/prescriptions/:id` | **HAI** |
| **Order Tracking Timeline** | `ProfileOrders.jsx` | **VISIBLE** | `ProfileOrders.jsx:70-150` | Rendered in Track Order modal upon clicking "Track order" | `GET /api/v1/orders/:orderId/track` | **HAI** |
| **Subscription Scheduler** | `SubscriptionPage.jsx` | **HIDDEN** | `SubscriptionPage.jsx:60-350` | Full wizard in page, but `/subscriptions` page has NO links | Subscription plan CRUD & scheduling | **MISSING** |
| **Support Live Chat** | `SupportPage.jsx` | **VISIBLE** | `SupportPage.jsx:1163-1180` | Floating chat launcher on Support page | Simulates local bot via `setTimeout`; Real chat API | **MISSING** |
| **Newsletter Subscription** | `BlogPage.jsx` | **VISIBLE** | `BlogPage.jsx:140-145` | Input & submit button on Blog page | `POST /api/v1/newsletter/subscribe` | **HAI** |
| **Coupon / Promo Code Box** | `CartPage.jsx` | **VISIBLE** | `CartPage.jsx:35-50` | Input box & apply button in Cart checkout sidebar | `POST /api/v1/coupons/apply`<br>`DELETE /api/v1/coupons/remove` | **HAI** |
| **Notify Me (Out of Stock)** | `ProductDetailPage.jsx` | **NOT RENDERED** | `ProductDetailPage.jsx:380-395` | Component exists in code, but items default to in-stock | `POST /api/v1/products/:id/notify-me` | **MISSING** |

---

## 3. Navigation Links Flat List (Table 3)

### A. Navbar Links (`src/components/layout/Navbar.jsx`)

| Label / Element | Destination Route | Render Context | Status / Dead Link Check |
|-----------------|-------------------|----------------|--------------------------|
| Logo (FillCart) | `/` | Desktop & Mobile (`Navbar.jsx:291, 744`) | Valid |
| Location Selector | `/profile/addresses` | Desktop Header (`Navbar.jsx:504`) | Valid |
| Search Bar Submit | `/search?q=...` | Desktop & Mobile (`Navbar.jsx:549, 786`) | Valid |
| Profile / My Account | `/profile` (redirects to `/profile/orders`) | Desktop Header (`Navbar.jsx:560`) | Valid |
| Sign In | `/login` | Desktop Header (Logged out) (`Navbar.jsx:580`) | Valid |
| Wishlist Icon | `/wishlist` | Desktop Header (`Navbar.jsx:592`) & Mobile Drawer (`Navbar.jsx:901`) | Valid |
| Cart Icon | `/cart` | Desktop Header (`Navbar.jsx:610`) & Mobile Header (`Navbar.jsx:758`) | Valid |
| Category: All Products | `/category/all` | Category Strip (`Navbar.jsx:643`) | Valid |
| Category: Vegetables & Fruits | `/category/fruits-vegetables` | Category Strip (`Navbar.jsx:643`) | Valid |
| Category: Dairy & Breakfast | `/category/dairy-breakfast` | Category Strip (`Navbar.jsx:643`) | Valid |
| Category: Beverages | `/category/beverages` | Category Strip (`Navbar.jsx:643`) | Valid |
| Category: Snacks & Munchies | `/category/snacks` | Category Strip (`Navbar.jsx:643`) | Valid |
| Category: Bakery & Biscuits | `/category/bakery` | Category Strip (`Navbar.jsx:643`) | Valid |
| Category: Instant & Frozen | `/category/instant-food` | Category Strip (`Navbar.jsx:643`) | Valid |
| Mobile: My Orders | `/profile/orders` | Mobile Drawer (`Navbar.jsx:877`) | Valid |
| Mobile: Saved Addresses | `/profile/addresses` | Mobile Drawer (`Navbar.jsx:889`) | Valid |

### B. Footer Links (`src/components/layout/Footer.jsx`)

| Section | Label Text | Destination Target | File:Line | Status / Dead Link Check |
|---------|------------|--------------------|-----------|--------------------------|
| Logo & Brand | FillCart Logo | `/` | `Footer.jsx:52` | Valid |
| Social Media | Instagram | `https://instagram.com` | `Footer.jsx:66` | External Link |
| Social Media | Facebook | `https://facebook.com` | `Footer.jsx:79` | External Link |
| Social Media | Twitter / X | `https://x.com` | `Footer.jsx:92` | External Link |
| Shop | Grocery | `/category/grocery` | `Footer.jsx:119` | Valid |
| Shop | Fruits & Vegetables | `/category/fruits-vegetables` | `Footer.jsx:128` | Valid |
| Shop | Dairy & Bakery | `/category/dairy-bakery` | `Footer.jsx:137` | Valid |
| Shop | Offers | `/category/offers` | `Footer.jsx:147` | Valid route (opens category listing with 'offers') |
| Help & Info | Track an order | `/profile/orders` | `Footer.jsx:167` | Valid |
| Help & Info | FAQs | `/support` | `Footer.jsx:176` | Valid |
| Help & Info | Contact us | `/contact` | `Footer.jsx:185` | Valid |
| Help & Info | Returns | `/terms` | `Footer.jsx:194` | Valid |
| Company | About us | `/about` | `Footer.jsx:215` | Valid |
| Company | How it works | `/how-it-works` | `Footer.jsx:224` | Valid |
| Company | Contact us | `/contact` | `Footer.jsx:233` | Valid |
| Company | Stores | `/stores` | `Footer.jsx:242` | Valid |
| Company | Careers | `/careers` | `Footer.jsx:251` | Valid |
| Company | Terms & conditions | `/terms` | `Footer.jsx:260` | Valid |
| Company | Privacy policy | `/privacy` | `Footer.jsx:269` | Valid |
| Company | Press | `/blog` | `Footer.jsx:278` | Valid |
| Partner With Us | Become a vendor | `/become-vendor` | `Footer.jsx:299` | Valid |
| Partner With Us | Become a rider | `/become-rider` | `Footer.jsx:308` | Valid |
| App Download | Google Play | `#google-play` | `Footer.jsx:339` | ⚠️ **DEAD LINK (Anchor `#google-play` opens no page or app store)** |
| App Download | App Store | `#app-store` | `Footer.jsx:354` | ⚠️ **DEAD LINK (Anchor `#app-store` opens no page or app store)** |
| Sub-Footer | Privacy policy | `/privacy` | `Footer.jsx:393` | Valid |
| Sub-Footer | Terms of service | `/terms` | `Footer.jsx:403` | Valid |

### C. Profile Sidebar Tabs (`src/features/profile/ProfileLayout.jsx`)

| Tab Label | Route | Icon | File:Line | Status |
|-----------|-------|------|-----------|--------|
| My Orders | `/profile/orders` | ShoppingBag | `ProfileLayout.jsx:7` | Valid |
| Saved Addresses | `/profile/addresses` | MapPin | `ProfileLayout.jsx:8` | Valid |
| My Prescriptions | `/profile/prescriptions` | FileText | `ProfileLayout.jsx:9` | Valid |
| Account Settings | `/profile/account` | User | `ProfileLayout.jsx:10` | Valid |

---

## 4. Summary Totals & Backend Readiness Analysis

### Route Statistics
- **Total Registered Routes:** 42
- **VISIBLE Routes:** 32 (Reachable directly via Navbar, Footer, Profile tabs, or In-Page Cards/Buttons)
- **HIDDEN Routes:** 2 (`/features`, `/subscriptions` — zero navigation links anywhere in UI)
- **REDIRECT Routes:** 7 (`/shops`, `/categories`, `/groceries`, `/category`, `/payment-offers`, `/profile`, `/faq`, `/help`)
- **DEV-ONLY Routes:** 1 (`/styleguide`)

### Missing Backend Endpoints for Visible Pages & Features
1. **Dynamic Delivery Slots API:** Missing backend slot calculation endpoint (`ProductDetailPage.jsx:35-45`).
2. **Blog Posts CMS / Listing API:** Missing API to fetch dynamic blog posts; only static articles currently render in `BlogPage.jsx` (though newsletter subscription is implemented).
3. **Live Chat Support Backend:** Floating widget in `SupportPage.jsx` uses mock bot replies (`setTimeout`).
4. **Out of Stock Notification ("Notify Me"):** Missing subscription/notification endpoint (`ProductDetailPage.jsx:380-395`).
5. **Subscription Scheduler Backend:** `/subscriptions` page has a full scheduling wizard, but the customer backend has no subscription tables or endpoints (page is also currently HIDDEN).

---

## 5. Audit Integrity Statement
- **Report File Created:** `apps/website/backend/docs/FRONTEND_PAGE_INVENTORY.md`
- **Existing Files Modified:** **0 (Zero)** — Strictly read-only audit. No source code or configuration files were touched.
