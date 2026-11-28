# Frontend-to-Backend Integration Audit: Fillcart Customer Storefront

**Date:** 2026-11-28  
**Scope:** `apps/website/backend` (Customer Backend, Port 4100) vs `apps/website/frontend` (Customer Storefront, Port 5173).  
**Audit Type:** Read-Only Static Code Analysis. No existing code modified.

---

## Executive Summary

- **Total Customer Backend Endpoints (`apps/website/backend/src/routes/*.js`):** **34 endpoints**
- **Endpoints Integrated in Frontend (`apps/website/frontend/src`):** **0 endpoints (0%)**
- **Endpoints Not Integrated (Frontend uses local mock/config data or legacy/central auth):** **34 endpoints (100%)**
- **Overall Customer Storefront Integration Status:** **NONE (0/34)**

### Key Technical Findings

1. **Port & Base URL Misalignment:**
   - The Customer Backend runs on **Port 4100** with routes mounted under `/api/v1/*` (`apps/website/backend/src/config/env.js:8`, `apps/website/backend/src/app.js:39`).
   - The frontend API client (`apps/website/frontend/src/services/api.js:8-10, 14-16`) defaults to `http://localhost:4000/api` (Central Auth / Monolithic Backend) and appends `/api` (not `/api/v1`).
   - The string `4100` does not appear anywhere in `apps/website/frontend/src`.
2. **Product & Store Catalog Data:**
   - All catalog pages (Home, Categories, Stores, Product Details, Search) read exclusively from static mock and config files (`src/lib/data/*`, `src/lib/config/*`, `src/services/productService.js`).
   - `productService.js` provides purely client-side filtering on local arrays without executing any HTTP `fetch` or `axios` calls.
3. **Cart & Wishlist Architecture:**
   - Managed entirely via client-side React Context and `localStorage` (`CartContext.jsx:53-73`, `WishlistContext.jsx:15-27`).
   - The 6 backend Cart endpoints and 3 Wishlist endpoints are never invoked.
4. **Form Submissions:**
   - **Contact Us:** Simulates network with an 800ms `setTimeout` (`ContactPage.jsx:113-116`).
   - **Become a Vendor:** Simulates network with a 600ms `setTimeout` (`BecomeVendorPage.jsx:25-28`).
   - **Become a Rider:** Simulates network with a 600ms `setTimeout` (`BecomeRiderPage.jsx:23-26`).
   - **Support Ticket:** Sets local boolean state `ticketSubmitted = true` (`SupportPage.jsx:407`).
   - **Careers Application:** Sets local boolean state `formSubmitted = true` (`CareersPage.jsx:106`).
   - **Newsletter:** Sets local boolean state `subscribed = true` (`BlogPage.jsx:143`).
5. **Authentication Flow:**
   - Frontend authentication delegates directly to Central Auth on port 4000 (`authClient.js:8-10`, `AuthContext.jsx:17-37`).
   - Customer Backend does not issue tokens; it validates incoming Central Auth JWTs via JWKS.

---

## Table A: Customer Backend Endpoints Audit

All endpoints below are defined in `apps/website/backend/src/routes/*.js` and mounted under `/api/v1` via `apps/website/backend/src/routes/index.js` and `apps/website/backend/src/app.js:39`.

| # | HTTP Method & Path | Auth Required? | Frontend se call hota hai? | Frontend Caller File:Line & Status Notes |
|---|---------------------|----------------|----------------------------|------------------------------------------|
| 1 | `GET /api/v1/health` | No (Public) | **NOT CALLED** | None. No health-check call in frontend. |
| 2 | `GET /api/v1/home` | No (Public) | **NOT CALLED** | None. `AppKartHome.jsx` loads mock configs directly. |
| 3 | `GET /api/v1/categories` | No (Public) | **NOT CALLED** | None. `CategoryListingPage.jsx` uses `categoryPageData.js`. |
| 4 | `GET /api/v1/stores` | No (Public) | **NOT CALLED** | None. `StoresListingPage.jsx` imports `storesData.js`. |
| 5 | `GET /api/v1/stores/:slug` | No (Public) | **NOT CALLED** | None. `StoreDetailPage.jsx` imports `storesData.js`. |
| 6 | `GET /api/v1/products` | No (Public) | **NOT CALLED** | `UserProfilePage.jsx:187` calls `api.get("/products")` targeting port 4000 `/api/products` (not 4100 `/api/v1/products`). |
| 7 | `GET /api/v1/products/:slug` | No (Public) | **NOT CALLED** | None. `ProductDetailPage.jsx` reads `productDetailData.js`. |
| 8 | `GET /api/v1/offers` | No (Public) | **NOT CALLED** | None. `PaymentOffersPage.jsx` imports `paymentOffersData.js`. |
| 9 | `POST /api/v1/contact` | No (Public) | **NOT CALLED** | None. `ContactPage.jsx:113` runs mock `setTimeout(..., 800)`. |
| 10 | `GET /api/v1/search/suggestions` | No (Public) | **NOT CALLED** | None. `SearchDropdown.jsx:77` calls local in-memory `productService.js`. |
| 11 | `GET /api/v1/search` | No (Public) | **NOT CALLED** | None. `SearchResultsPage.jsx:31` calls local `productService.js`. |
| 12 | `GET /api/v1/careers/openings` | No (Public) | **NOT CALLED** | None. `CareersPage.jsx` uses local hardcoded openings array. |
| 13 | `POST /api/v1/careers/applications` | No (Public) | **NOT CALLED** | None. `CareersPage.jsx:106` sets local state `setFormSubmitted(true)`. |
| 14 | `POST /api/v1/partners/vendor-applications` | No (Public) | **NOT CALLED** | None. `BecomeVendorPage.jsx:26` runs mock `setTimeout(..., 600)`. |
| 15 | `POST /api/v1/partners/rider-applications` | No (Public) | **NOT CALLED** | None. `BecomeRiderPage.jsx:24` runs mock `setTimeout(..., 600)`. |
| 16 | `POST /api/v1/support/messages` | No (Public) | **NOT CALLED** | None. `SupportPage.jsx:407` sets local state `setTicketSubmitted(true)`. |
| 17 | `GET /api/v1/faqs` | No (Public) | **NOT CALLED** | None. `SupportPage.jsx` renders local static FAQ objects. |
| 18 | `POST /api/v1/newsletter/subscribe` | No (Public) | **NOT CALLED** | None. `BlogPage.jsx:143` sets local state `setSubscribed(true)`. |
| 19 | `GET /api/v1/cart` | Yes (`requireAuth`) | **NOT CALLED** | None. `CartContext.jsx:53-65` reads from `localStorage`. |
| 20 | `POST /api/v1/cart/items` | Yes (`requireAuth`) | **NOT CALLED** | None. `CartContext.jsx:85-120` writes to `localStorage`. |
| 21 | `PATCH /api/v1/cart/items/:itemId` | Yes (`requireAuth`) | **NOT CALLED** | None. `CartContext.jsx:122-150` writes to `localStorage`. |
| 22 | `DELETE /api/v1/cart/items/:itemId` | Yes (`requireAuth`) | **NOT CALLED** | None. `CartContext.jsx:152-168` writes to `localStorage`. |
| 23 | `DELETE /api/v1/cart` | Yes (`requireAuth`) | **NOT CALLED** | None. `CartContext.jsx:170-178` writes to `localStorage`. |
| 24 | `POST /api/v1/cart/merge` | Yes (`requireAuth`) | **NOT CALLED** | None. No guest-to-user cart merge API invocation exists. |
| 25 | `GET /api/v1/wishlist` | Yes (`requireAuth`) | **NOT CALLED** | None. `WishlistContext.jsx:15-27` reads from `localStorage`. |
| 26 | `POST /api/v1/wishlist/items` | Yes (`requireAuth`) | **NOT CALLED** | None. `WishlistContext.jsx:55-81` writes to `localStorage`. |
| 27 | `DELETE /api/v1/wishlist/items/:productId` | Yes (`requireAuth`) | **NOT CALLED** | None. `WishlistContext.jsx:84-105` writes to `localStorage`. |
| 28 | `GET /api/v1/addresses` | Yes (`requireAuth`) | **NOT CALLED** | `ProfileAddresses.jsx:70`, `CartPage.jsx:77`, `SubscriptionPage.jsx:435`, `UserProfilePage.jsx:264` call `api.get("/addresses")` targeting port 4000 `/api/addresses`. |
| 29 | `POST /api/v1/addresses` | Yes (`requireAuth`) | **NOT CALLED** | `ProfileAddresses.jsx:151`, `UserProfilePage.jsx:361` call `api.post("/addresses")` targeting port 4000 `/api/addresses`. |
| 30 | `PATCH /api/v1/addresses/:id` | Yes (`requireAuth`) | **NOT CALLED** | `ProfileAddresses.jsx:149`, `UserProfilePage.jsx:358` call `api.put("/addresses/:id")` (HTTP PUT targeting port 4000). |
| 31 | `DELETE /api/v1/addresses/:id` | Yes (`requireAuth`) | **NOT CALLED** | `ProfileAddresses.jsx:173`, `UserProfilePage.jsx:376` call `api.delete("/addresses/:id")` targeting port 4000. |
| 32 | `PATCH /api/v1/addresses/:id/default` | Yes (`requireAuth`) | **NOT CALLED** | `UserProfilePage.jsx:386` calls `api.patch("/addresses/:id/default")` targeting port 4000. |
| 33 | `GET /api/v1/me/profile` | Yes (`requireAuth`) | **NOT CALLED** | None. `AuthContext.jsx:21-31` parses claims from Central Auth JWT. |
| 34 | `PATCH /api/v1/me/profile` | Yes (`requireAuth`) | **NOT CALLED** | `ProfileAccount.jsx:47`, `UserProfilePage.jsx:508` call `api.put("/customer/profile")` (HTTP PUT targeting port 4000). |

---

## Table B: Frontend Pages vs Data Sources & Backend Endpoints

Mapped directly from `apps/website/frontend/src/app/routes.jsx`:

| Page / Route | Current Frontend Data Source (File & Path) | Matching Customer Backend Endpoint | Integration Status |
|--------------|--------------------------------------------|------------------------------------|---------------------|
| `/` (Home) | `src/lib/config/shopByCategory.js`, `popularProducts.js`, `storesData.js`, `homeEssentialsProducts.js`, `dailyCareProducts.js`, `chillFrozenProducts.js` | `GET /api/v1/home`, `GET /api/v1/categories`, `GET /api/v1/stores`, `GET /api/v1/products` | **NONE** |
| `/stores` | `src/lib/data/storesData.js` | `GET /api/v1/stores` | **NONE** |
| `/store/:slug` | `src/lib/data/storesData.js` (`getStore()`) | `GET /api/v1/stores/:slug` | **NONE** |
| `/search` | `src/services/productService.js` (in-memory mock array) + `src/lib/utils/searchUtils.js` | `GET /api/v1/search`, `GET /api/v1/search/suggestions` | **NONE** |
| `/category/:slug` | `src/lib/data/categoryPageData.js` | `GET /api/v1/categories`, `GET /api/v1/products` | **NONE** |
| `/product/:slug` & `/product/:id` | `src/lib/data/productDetailData.js` (`getProductDetail()`) | `GET /api/v1/products/:slug` | **NONE** |
| `/cart` | `src/lib/context/CartContext.jsx` (`localStorage: fillcarts_cart_*`) | `GET /api/v1/cart`, `POST /api/v1/cart/items`, `PATCH /api/v1/cart/items/:id`, `DELETE /api/v1/cart/items/:id` | **NONE** |
| `/wishlist` | `src/lib/context/WishlistContext.jsx` (`localStorage: fillcarts_wishlist_*`) | `GET /api/v1/wishlist`, `POST /api/v1/wishlist/items`, `DELETE /api/v1/wishlist/items/:id` | **NONE** |
| `/offers/payment` | `src/lib/data/paymentOffersData.js` (`bankOffers`, `walletOffers`) | `GET /api/v1/offers` | **NONE** |
| `/profile/orders` | `src/features/profile/ProfileOrders.jsx` (calls `api.get("/orders")` at port 4000; fallbacks to mock) | Missing in Customer Backend (`/api/v1/orders`) | **NONE** |
| `/profile/addresses` | `src/features/profile/ProfileAddresses.jsx` (calls `api.get("/addresses")` at port 4000; fallbacks to mock) | `GET /api/v1/addresses`, `POST /api/v1/addresses`, `PATCH /api/v1/addresses/:id`, `DELETE /api/v1/addresses/:id` | **NONE** (mismatched port 4000 & path `/api/addresses` vs port 4100 `/api/v1/addresses`) |
| `/profile/prescriptions` | `src/features/profile/ProfilePrescriptions.jsx` (calls `api.get("/prescriptions")` at port 4000; fallbacks to mock) | Missing in Customer Backend (`/api/v1/prescriptions`) | **NONE** |
| `/profile/account` | `src/features/profile/ProfileAccount.jsx` (calls `api.put("/customer/profile")` at port 4000) | `GET /api/v1/me/profile`, `PATCH /api/v1/me/profile` | **NONE** (mismatched endpoint & method) |
| `/profile/:tab` | `src/features/profile/UserProfilePage.jsx` | Same as sub-profile tabs above | **NONE** |
| `/login` & `/register` | `src/services/authClient.js` (Central Auth at port 4000: `/api/v1/auth/login`, `/register`) | Central Auth (Not Customer Backend) | **NONE** (Customer backend has no auth routes) |
| `/about` | Static JSX (`src/features/about/AboutPage.jsx`) | Static content (No backend route needed) | **DONE** (Static UI) |
| `/contact` | `src/features/contact/ContactPage.jsx` (fake `setTimeout` 800ms) | `POST /api/v1/contact` | **NONE** |
| `/support` & `/faq` & `/help` | `src/features/support/SupportPage.jsx` (static FAQs + mock bot `setTimeout`) | `GET /api/v1/faqs`, `POST /api/v1/support/messages` | **NONE** |
| `/careers` | `src/features/careers/CareersPage.jsx` (static job list + local state submit) | `GET /api/v1/careers/openings`, `POST /api/v1/careers/applications` | **NONE** |
| `/how-it-works` | Static config (`src/lib/config/footerPages.js`) | Static content (No backend route needed) | **DONE** (Static UI) |
| `/features` | Static arrays (`src/features/misc/FeaturesPage.jsx`) | Static content (No backend route needed) | **DONE** (Static UI) |
| `/terms` & `/privacy` | `src/lib/data/legalData.js` | Static legal content | **DONE** (Static UI) |
| `/become-vendor` | `src/features/vendors/BecomeVendorPage.jsx` (fake `setTimeout` 600ms) | `POST /api/v1/partners/vendor-applications` | **NONE** |
| `/become-rider` | `src/features/services/BecomeRiderPage.jsx` (fake `setTimeout` 600ms) | `POST /api/v1/partners/rider-applications` | **NONE** |
| `/subscriptions` | `src/features/misc/SubscriptionPage.jsx` (local mock products & states) | Missing in Customer Backend (`/api/v1/subscriptions`) | **NONE** |
| `/blog` | `src/features/misc/BlogPage.jsx` (local post objects + local state subscribe) | `POST /api/v1/newsletter/subscribe` (Blog content missing in backend) | **NONE** |
| `/styleguide` | Dev design system gallery (`src/features/misc/StyleguidePage.jsx`) | Developer utility (No backend route needed) | **DONE** (Utility UI) |
| `*` (Not Found) | Static 404 page (`src/features/misc/NotFoundPage.jsx`) | Not applicable | **DONE** (Static UI) |

---

## Table C: Frontend Features With Missing Backend APIs (Gaps)

These pages/features exist in the frontend UI, but **no corresponding routes exist in `apps/website/backend/src/routes`**:

| # | Frontend Feature / Page | File Reference | What Frontend Expects / Needs | Status in Customer Backend |
|---|--------------------------|----------------|-------------------------------|----------------------------|
| 1 | **Customer Order History & Tracking** | `ProfileOrders.jsx:76`, `UserProfilePage.jsx:161` | `GET /api/v1/orders`, `GET /api/v1/orders/:id`, order status, items, tracking | **MISSING** (No `orders.routes.js`) |
| 2 | **Checkout & Order Placement** | `CartPage.jsx:51-60` | `POST /api/v1/orders` (placing order from cart, payment selection, address selection) | **MISSING** (No order placement route) |
| 3 | **Prescriptions Management** | `ProfilePrescriptions.jsx:44,76`, `UserProfilePage.jsx:408,448` | `GET /api/v1/prescriptions`, `POST /api/v1/prescriptions` (file upload), `DELETE /api/v1/prescriptions/:id` | **MISSING** (No `prescriptions.routes.js`) |
| 4 | **Recurring Subscriptions** | `SubscriptionPage.jsx:250-300` | `GET /api/v1/subscriptions`, `POST /api/v1/subscriptions`, schedule daily/weekly, pause/cancel | **MISSING** (No `subscriptions.routes.js`) |
| 5 | **Product Reviews Submission** | `ProductDetailPage.jsx:27-33` | `POST /api/v1/products/:id/reviews`, `GET /api/v1/products/:id/reviews` | **MISSING** (Backend only has static average rating in product record) |
| 6 | **Delivery Slot Scheduling** | `ProductDetailPage.jsx:35-45` | `GET /api/v1/delivery-slots` (Today 7-9PM, Tomorrow morning/evening slots) | **MISSING** (No slots API) |
| 7 | **Blog Articles & Hyperlocal Stories** | `BlogPage.jsx:120-138` | `GET /api/v1/blogs`, `GET /api/v1/blogs/:slug` | **MISSING** (Hardcoded in frontend) |
| 8 | **Customer Support Ticket History / Live Chat** | `SupportPage.jsx:1163-1180` | `GET /api/v1/support/tickets` (Customer backend only has write-only `POST /support/messages`) | **MISSING** (No retrieval or chat endpoint) |

---

## Detailed Section Analyses

### 1. Cart and Wishlist Architecture
- **Cart Context (`apps/website/frontend/src/lib/context/CartContext.jsx`):**
  - Line 25-45: Location stored in `localStorage` under `"fillcarts_user_location"`.
  - Line 53-65: Cart loaded from `localStorage` under `fillcarts_cart_${user.phone || user.email || user.id}` for authenticated users, and `"fillcarts_guest_cart"` for guests.
  - Line 68-73: Cart state saved to `localStorage` on any modification.
  - Line 75-120: `addToCart` operates exclusively on local array state.
  - **Result:** None of the 6 backend cart routes (`GET /api/v1/cart`, `POST /api/v1/cart/items`, `PATCH /api/v1/cart/items/:itemId`, `DELETE /api/v1/cart/items/:itemId`, `DELETE /api/v1/cart`, `POST /api/v1/cart/merge`) are connected.
- **Wishlist Context (`apps/website/frontend/src/lib/context/WishlistContext.jsx`):**
  - Line 15-27: Loaded from `localStorage` under `fillcarts_wishlist_${userKey}` or `"fillcarts_guest_wishlist"`.
  - Line 55-81: `addToWishlist` appends to local array and writes to `localStorage`.
  - Line 84-105: `removeFromWishlist` filters local array and writes to `localStorage`.
  - **Result:** None of the 3 backend wishlist routes (`GET /api/v1/wishlist`, `POST /api/v1/wishlist/items`, `DELETE /api/v1/wishlist/items/:productId`) are connected.

### 2. Authentication & Login Architecture
- **Central Auth Service (`apps/website/frontend/src/services/authClient.js`):**
  - Line 8-10: Resolves Central Auth base URL (`http://localhost:4000` or `VITE_AUTH_API_URL`).
  - Line 74-86: `register()` calls Central Auth `POST /api/v1/auth/register`.
  - Line 92-101: `login()` calls Central Auth `POST /api/v1/auth/login`.
  - Line 107-113: `refresh()` calls Central Auth `POST /api/v1/auth/refresh`.
  - Line 119-127: `logout()` calls Central Auth `POST /api/v1/auth/logout`.
  - Line 133-155: Phone OTP calls `POST /api/v1/auth/otp/send` and `POST /api/v1/auth/otp/verify`.
  - Line 36-47: JWT Access Token is kept strictly in-memory (`inMemoryAccessToken`).
- **Customer Backend Role:**
  - Customer Backend (`apps/website/backend`) contains zero authentication endpoints; it is purely a resource server that validates tokens using Central Auth JWKS (`apps/website/backend/src/middlewares/requireAuth.js`).

### 3. Form Submission Handlers Analysis
- **Contact Us (`ContactPage.jsx:109-116`):**
  - Explicit comment: `// Frontend only simulation: 800ms timer, no network request`.
  - Executes `setTimeout(() => { setIsSubmitting(false); setIsSubmitted(true); }, 800)`.
- **Become a Vendor (`BecomeVendorPage.jsx:23-28`):**
  - Explicit comment: `// Simulate submission`.
  - Executes `setTimeout(() => { setLoading(false); setSubmitted(true); }, 600)`.
- **Become a Rider (`BecomeRiderPage.jsx:21-27`):**
  - Explicit comment: `// Simulate submission`.
  - Executes `setTimeout(() => { setLoading(false); setSubmitted(true); }, 600)`.
- **Support Ticket (`SupportPage.jsx:400-408`):**
  - Validates fields locally, then executes `setTicketSubmitted(true)`. No network request.
  - Support Chat (`SupportPage.jsx:1163-1180`) simulates an automated bot reply with `setTimeout(..., 1000)`.
- **Careers Application (`CareersPage.jsx:100-108`):**
  - Validates fields locally, then executes `setFormSubmitted(true)`. No network request.
  - Job openings are read from local constant `const openPositions = [...]` (`CareersPage.jsx:15-80`).
- **Newsletter (`BlogPage.jsx:140-145`):**
  - Executes `if (newsletterEmail.trim()) { setSubscribed(true); }`. No network request.

---

## Conclusion & Summary

1. **Zero Customer Backend Integration:** Currently, **0 out of 34** endpoints in the Customer Backend (`apps/website/backend`, port 4100, `/api/v1/*`) are connected to or consumed by the Customer Frontend (`apps/website/frontend`).
2. **Current State of Frontend:** The frontend is completely decoupled and operates entirely on local mock/config datasets and browser `localStorage`.
3. **Report Artifact:** Generated exclusively at `apps/website/backend/docs/FRONTEND_INTEGRATION_AUDIT.md`. No existing source code files or configurations were modified.
