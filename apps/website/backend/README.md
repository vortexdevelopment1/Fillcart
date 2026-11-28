# Fillcart Website Customer Backend

Lightweight, modular Node.js (ESM) backend for Fillcart customer website storefront.

## Architecture & Layering

The codebase follows a clean 4-tier layered architecture:

```
[Request]
   │
   ▼
[Routes]         (src/routes/)        -> Defines HTTP endpoints and mounts middlewares
   │
   ▼
[Controllers]    (src/controllers/)   -> Handles request/response, validation, status codes
   │
   ▼
[Services]       (src/services/)      -> Encapsulates business logic and domain rules
   │
   ▼
[Repositories]   (src/repositories/)  -> Data access abstraction (queries, persistence)
   │
   ▼
[Database / Data Source]
```

### Folder Structure Overview

- `src/config/`: Environment configuration and Zod runtime schema validation.
- `src/routes/`: Route definitions prefixed with `/api/v1`.
- `src/controllers/`: HTTP request handlers invoking services and returning unified response format.
- `src/services/`: Pure business logic independent of HTTP context.
- `src/repositories/`: Data access layer for database/storage operations.
- `src/models/`: Domain entities and schema definitions.
- `src/validators/`: Request validation schemas (e.g., Zod).
- `src/data/`: Static seed or mock dataset files.
- `src/middlewares/`: Express middlewares (`validate`, `errorHandler`, `notFound`).
- `src/utils/`: Common utilities (`ApiError`, `asyncHandler`, `logger`).
- `tests/`: Automated unit and integration tests (Vitest + Supertest).

---

## Response & Error Conventions

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description"
  }
}
```

---

## How to Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```

### 3. Start Development Server
```bash
npm run dev
```
Server runs with Node.js built-in watch mode on `http://127.0.0.1:4100`.

### 4. Run Tests
```bash
npm run test
```

### 5. Production Start
```bash
npm start
```

---

## Database Setup (Prisma & PostgreSQL)

The database layer uses **Prisma 7** with `@prisma/adapter-pg` and targets PostgreSQL under the isolated schema `"customer"`. Central Auth tables in the `"public"` schema are completely isolated and untouched.

#### Store & Product Many-to-Many Architecture (`store_products`)
Stores and products have a many-to-many relationship tracked by the `StoreProduct` model (`store_products` table). Each store offers an inventory tailored to its store type (e.g., bakeries offer bakery goods, pharmacies offer wellness goods, supermarkets offer groceries and staples).
- `GET /api/v1/stores/:slug` fetches products linked through `store_products`.
- `GET /api/v1/products?store=:slug` filters products linked to that store via `store_products`.
- The legacy `Product.storeId` direct relation is preserved for backward compatibility.

### 1. Environment Variable
Ensure `DATABASE_URL` is set in your `.env`:
```env
DATABASE_URL="postgresql://fillcart_user:fillcart_pass@127.0.0.1:5433/fillcart?schema=customer"
```

### 2. Generate Prisma Client
Generates the Prisma Client types and query engine:
```bash
npm run db:generate
```

### 3. Apply Migrations
Creates the `"customer"` schema and all storefront tables (`categories`, `stores`, `products`, `store_products`, `banners`, `offers`, `contact_messages`):
```bash
npm run db:migrate
```

### 4. Seed Database
Runs the idempotent seed script (`prisma/seed.js`), populating categories, stores, home/category products, store-product catalog mappings (`store_products`), banners, and payment offers from `src/data/`:
```bash
npm run db:seed
```

### 5. Open Prisma Studio (GUI)
Inspect and manage data visually in your browser:
```bash
npm run db:studio
```

---

## Customer Storefront Endpoints (`/api/v1`)

> **Total Storefront APIs Implemented:** **34 Endpoints**  
> - **18 Public Storefront Endpoints** (Home, Categories, Stores, Products, Search, Offers, Leads, FAQs, Health)  
> - **16 Customer Authenticated Endpoints** (Cart, Wishlist, Addresses, Customer Profile protected by `requireAuth`)

All endpoints return standardized JSON responses:
- Success: `{ "success": true, "data": ... }`
- Error: `{ "success": false, "error": { "code": "...", "message": "..." } }`

### Public Endpoints (No Token Required)

| Method | Endpoint | Query / Body Parameters | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | None | Service liveness health check |
| `GET` | `/api/v1/home` | None | Home hero banners, featured categories, and 4 sections |
| `GET` | `/api/v1/categories` | `featured=true` (optional) | Active categories ordered by position |
| `GET` | `/api/v1/stores` | `q` (optional name search) | Active neighbourhood stores |
| `GET` | `/api/v1/stores/:slug` | Path parameter `:slug` | Store detail and catalog products (max 24) |
| `GET` | `/api/v1/products` | `category`, `store`, `q`, `sort`, `page`, `limit` | Paginated catalog search and filtering |
| `GET` | `/api/v1/products/:slug` | Path parameter `:slug` | Product detail with gallery, nutrition, brand, and 8 related items |
| `GET` | `/api/v1/offers` | `type` (`BANK` \| `WALLET` \| `UPI`, optional) | Active payment and bank discount offers |
| `POST` | `/api/v1/contact` | Body: `{ fullName, email, phone?, subject?, message }` | Contact inquiry submission (rate limited: 5 req / 10 min) |
| `GET` | `/api/v1/search` | `q` (min 2 chars), `limit` (default 8, max 20) | Unified search across products, stores, and categories |
| `GET` | `/api/v1/search/suggestions` | `q` (min 1 char) | Quick dropdown suggestions (name, type, slug; max 8) |
| `GET` | `/api/v1/careers/openings` | `department` (optional), `q` (optional) | Hyperlocal job openings list |
| `POST` | `/api/v1/careers/applications` | Body: `{ fullName, email, phone, jobTitle?, department?, experience?, resumeName?, coverNote? }` | Career job application submission (rate limited: 5 req / 10 min) |
| `POST` | `/api/v1/partners/vendor-applications` | Body: `{ storeName, ownerName, phone, email, category?, city, address }` | Merchant / store onboarding lead capture (rate limited: 5 req / 10 min) |
| `POST` | `/api/v1/partners/rider-applications` | Body: `{ fullName, phone, email, city, vehicleType, hasLicense }` | Delivery partner rider application (rate limited: 5 req / 10 min) |
| `POST` | `/api/v1/support/messages` | Body: `{ subject, category, orderId?, description, fullName?, email?, phone? }` | Support desk ticket creation (rate limited: 5 req / 10 min) |
| `GET` | `/api/v1/faqs` | `category` (optional), `q` (optional query search) | FAQ Help Centre questions and answers |
| `POST` | `/api/v1/newsletter/subscribe` | Body: `{ email }` | Newsletter / daily deals email subscription (rate limited: 5 req / 10 min) |

### Authenticated Endpoints (`Authorization: Bearer <CentralAuthJWT>`)

| Method | Endpoint | Query / Body Parameters | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/cart` | None | Fetch user's persistent cart, items, product specs & subtotal |
| `POST` | `/api/v1/cart/items` | Body: `{ productId \| slug, quantity? }` | Add item or increment quantity in user's cart (max 20 per item) |
| `PATCH` | `/api/v1/cart/items/:itemId` | Body: `{ quantity }` | Update item quantity in cart (`0` removes item) |
| `DELETE` | `/api/v1/cart/items/:itemId` | Path parameter `:itemId` | Remove specific item from cart |
| `DELETE` | `/api/v1/cart` | None | Clear entire cart |
| `POST` | `/api/v1/cart/merge` | Body: `{ items: [{ productId \| slug, quantity }] }` | Merge guest/local cart items on customer login |
| `GET` | `/api/v1/wishlist` | None | Fetch user's wishlisted products |
| `POST` | `/api/v1/wishlist/items` | Body: `{ productId \| slug }` | Add product to user's wishlist |
| `DELETE` | `/api/v1/wishlist/items/:productId` | Path parameter `:productId` (UUID or slug) | Remove product from user's wishlist |
| `GET` | `/api/v1/addresses` | None | List saved delivery addresses for user |
| `POST` | `/api/v1/addresses` | Body: `{ label, fullName, phone, line1, line2?, landmark?, city, state, pincode, isDefault? }` | Create new delivery address |
| `PATCH` | `/api/v1/addresses/:id` | Body: Address fields to update | Update existing delivery address |
| `DELETE` | `/api/v1/addresses/:id` | Path parameter `:id` | Delete delivery address |
| `PATCH` | `/api/v1/addresses/:id/default` | Path parameter `:id` | Set address as default in atomic transaction |
| `GET` | `/api/v1/me/profile` | None | Fetch customer profile (fullName, phone, avatarUrl) |
| `PATCH` | `/api/v1/me/profile` | Body: `{ fullName?, phone?, avatarUrl? }` | Update customer profile |

### Example cURL Invocations

#### 1. Home Page Feed
```bash
curl -X GET http://127.0.0.1:4100/api/v1/home
```

#### 2. Categories
```bash
curl -X GET "http://127.0.0.1:4100/api/v1/categories?featured=true"
```

#### 3. Stores List & Store Detail
```bash
curl -X GET "http://127.0.0.1:4100/api/v1/stores?q=fresh"
curl -X GET http://127.0.0.1:4100/api/v1/stores/fresh-mart-supermarket
```

#### 4. Product Catalog & Detail
```bash
curl -X GET "http://127.0.0.1:4100/api/v1/products?category=grocery&sort=price_asc&limit=10"
curl -X GET http://127.0.0.1:4100/api/v1/products/fresh-royal-apples
```

#### 5. Payment Offers
```bash
curl -X GET "http://127.0.0.1:4100/api/v1/offers?type=BANK"
```

#### 6. Contact Form Submission
```bash
curl -X POST http://127.0.0.1:4100/api/v1/contact \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Aarav Sharma",
    "email": "aarav.sharma@example.com",
    "phone": "+91 98765 43210",
    "subject": "Store Partnership",
    "message": "Hello, I am interested in partnering as a verified vendor."
  }'
```

#### 7. Unified Search & Suggestions
```bash
curl -X GET "http://127.0.0.1:4100/api/v1/search?q=milk&limit=8"
curl -X GET "http://127.0.0.1:4100/api/v1/search/suggestions?q=fresh"
```

#### 8. Careers Openings & Job Application
```bash
curl -X GET "http://127.0.0.1:4100/api/v1/careers/openings?department=Engineering"
curl -X POST http://127.0.0.1:4100/api/v1/careers/applications \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Rohan Verma",
    "email": "rohan.verma@example.com",
    "phone": "+91 98765 12345",
    "jobTitle": "Senior Geospatial & Dispatch Engineer",
    "department": "Engineering",
    "experience": "4-7 Years",
    "resumeName": "rohan_resume.pdf",
    "coverNote": "Passionate about hyperlocal logistics."
  }'
```

#### 9. Vendor & Rider Partner Applications
```bash
curl -X POST http://127.0.0.1:4100/api/v1/partners/vendor-applications \
  -H "Content-Type: application/json" \
  -d '{
    "storeName": "Sharma Super Store",
    "ownerName": "Mukesh Sharma",
    "phone": "+91 98111 22233",
    "email": "mukesh@example.com",
    "category": "grocery",
    "city": "Indore",
    "address": "Shop 14, Scheme 78, Vijay Nagar, Indore"
  }'

curl -X POST http://127.0.0.1:4100/api/v1/partners/rider-applications \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Deepak Choudhary",
    "phone": "+91 98222 33445",
    "email": "deepak@example.com",
    "city": "Indore",
    "vehicleType": "bike",
    "hasLicense": "yes"
  }'
```

#### 10. Support Ticket Desk & Help Centre FAQs
```bash
curl -X POST http://127.0.0.1:4100/api/v1/support/messages \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Orders & Delivery",
    "subject": "Delayed refund for order FC-10492",
    "orderId": "FC-10492",
    "description": "Item was cancelled but refund has not reflected yet."
  }'

curl -X GET "http://127.0.0.1:4100/api/v1/faqs?category=orders"
```

#### 11. Newsletter Subscription
```bash
curl -X POST http://127.0.0.1:4100/api/v1/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "subscriber@example.com"
  }'
```

#### 12. Promotional Coupons (requireAuth)
```bash
# Apply coupon code to cart (calculates discount, deliveryFee, tax, and grand total)
curl -X POST http://127.0.0.1:4100/api/v1/coupons/apply \
  -H "Authorization: Bearer <CUSTOMER_JWT>" \
  -H "Content-Type: application/json" \
  -d '{ "code": "WELCOME10" }'

# Remove applied coupon from cart
curl -X DELETE http://127.0.0.1:4100/api/v1/coupons/remove \
  -H "Authorization: Bearer <CUSTOMER_JWT>"
```

#### 13. Orders & Tracking (requireAuth)
```bash
# Place new order (COD only, validates stock, snapshots address & items, clears cart)
curl -X POST http://127.0.0.1:4100/api/v1/orders \
  -H "Authorization: Bearer <CUSTOMER_JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "addressId": "your-address-uuid",
    "paymentMethod": "COD",
    "notes": "Ring bell on arrival"
  }'

# List customer orders (with pagination and optional status filter)
curl -X GET "http://127.0.0.1:4100/api/v1/orders?page=1&limit=10" \
  -H "Authorization: Bearer <CUSTOMER_JWT>"

# Get single order details by id or orderNumber (e.g. FC-123456)
curl -X GET http://127.0.0.1:4100/api/v1/orders/FC-123456 \
  -H "Authorization: Bearer <CUSTOMER_JWT>"

# Track order lifecycle & status timeline
curl -X GET http://127.0.0.1:4100/api/v1/orders/FC-123456/track \
  -H "Authorization: Bearer <CUSTOMER_JWT>"

# Cancel order (permitted only in PLACED or CONFIRMED state; restores stock)
curl -X POST http://127.0.0.1:4100/api/v1/orders/FC-123456/cancel \
  -H "Authorization: Bearer <CUSTOMER_JWT>" \
  -H "Content-Type: application/json" \
  -d '{ "reason": "Placed by mistake" }'

# Reorder previous order (adds available items back into user cart)
curl -X POST http://127.0.0.1:4100/api/v1/orders/FC-123456/reorder \
  -H "Authorization: Bearer <CUSTOMER_JWT>"
```

#### 14. Prescriptions Management (requireAuth)
```bash
# Upload / register new prescription document (https URL, max 20 per customer)
curl -X POST http://127.0.0.1:4100/api/v1/prescriptions \
  -H "Authorization: Bearer <CUSTOMER_JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "dr_mehta_prescription.pdf",
    "fileUrl": "https://res.cloudinary.com/fillcart/rx/dr_mehta_prescription.pdf",
    "fileType": "pdf",
    "doctorName": "Dr. Arvind Mehta",
    "patientName": "Aarav Sharma"
  }'

# List user prescriptions
curl -X GET http://127.0.0.1:4100/api/v1/prescriptions \
  -H "Authorization: Bearer <CUSTOMER_JWT>"

# Get single prescription detail
curl -X GET http://127.0.0.1:4100/api/v1/prescriptions/<prescription-id> \
  -H "Authorization: Bearer <CUSTOMER_JWT>"

# Delete own prescription
curl -X DELETE http://127.0.0.1:4100/api/v1/prescriptions/<prescription-id> \
  -H "Authorization: Bearer <CUSTOMER_JWT>"
```

#### 15. Product Ratings & Reviews
```bash
# Fetch product reviews & summary rating math (Public)
curl -X GET "http://127.0.0.1:4100/api/v1/products/fresh-royal-apples/reviews?page=1&limit=10&sort=recent"

# Submit a product review (requireAuth, 1 review per user per product, verified badge automatic)
curl -X POST http://127.0.0.1:4100/api/v1/products/fresh-royal-apples/reviews \
  -H "Authorization: Bearer <CUSTOMER_JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "title": "Outstanding Freshness",
    "comment": "Crisp and juicy apples, delivered in 15 minutes!",
    "displayName": "Aarav S."
  }'

# Update own review (requireAuth)
curl -X PATCH http://127.0.0.1:4100/api/v1/products/fresh-royal-apples/reviews/mine \
  -H "Authorization: Bearer <CUSTOMER_JWT>" \
  -H "Content-Type: application/json" \
  -d '{ "rating": 5, "comment": "Updated comment after second order." }'

# Delete own review (requireAuth)
curl -X DELETE http://127.0.0.1:4100/api/v1/products/fresh-royal-apples/reviews/mine \
  -H "Authorization: Bearer <CUSTOMER_JWT>"
```

#### 16. Delivery Slots (Public)
```bash
# Fetch delivery slots from today up to 3 days (default 2 days, IST timezone aware)
curl -X GET "http://127.0.0.1:4100/api/v1/delivery-slots?days=2"
```

#### 17. Blogs & Insights (Public)
```bash
# List published blog posts (content omitted for fast catalog navigation)
curl -X GET "http://127.0.0.1:4100/api/v1/blogs?category=Hyperlocal%20Tech&page=1&limit=10"

# Read full article with markdown content
curl -X GET "http://127.0.0.1:4100/api/v1/blogs/why-local-kiranas-beat-megastores-on-freshness-in-hyperlocal-delivery"
```

#### 18. Restock Notifications ("Notify Me")
```bash
# Guest subscriber (Rate-limited, email or phone required)
curl -X POST http://127.0.0.1:4100/api/v1/products/fresh-royal-apples/notify-me \
  -H "Content-Type: application/json" \
  -d '{ "email": "customer@example.com" }'

# Authenticated customer subscriber
curl -X POST http://127.0.0.1:4100/api/v1/products/fresh-royal-apples/notify-me \
  -H "Authorization: Bearer <CUSTOMER_JWT>"

# Authenticated customer unsubscribe
curl -X DELETE http://127.0.0.1:4100/api/v1/products/fresh-royal-apples/notify-me \
  -H "Authorization: Bearer <CUSTOMER_JWT>"
```



