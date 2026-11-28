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

All customer storefront APIs are public and return standardized JSON responses:
- Success: `{ "success": true, "data": ... }`
- Error: `{ "success": false, "error": { "code": "...", "message": "..." } }`

| Method | Endpoint | Query / Body Parameters | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | None | Service liveness health check |
| `GET` | `/api/v1/home` | None | Home hero banners, featured categories, and 4 sections (popular, chill-frozen, daily-care, home-essentials) |
| `GET` | `/api/v1/categories` | `featured=true` (optional) | Active categories ordered by position |
| `GET` | `/api/v1/stores` | `q` (optional name search) | Active neighbourhood stores |
| `GET` | `/api/v1/stores/:slug` | Path parameter `:slug` | Store detail and catalog products (max 24) |
| `GET` | `/api/v1/products` | `category`, `store`, `q`, `sort` (`popular` \| `price_asc` \| `price_desc`), `page` (default 1), `limit` (default 20, max 50) | Paginated catalog search and filtering |
| `GET` | `/api/v1/products/:slug` | Path parameter `:slug` | Product detail with gallery, nutrition, brand, and 8 related items |
| `GET` | `/api/v1/offers` | `type` (`BANK` \| `WALLET` \| `UPI`, optional) | Active payment and bank discount offers |
| `POST` | `/api/v1/contact` | Body: `{ fullName, email, phone?, subject?, message }` | Contact inquiry submission (rate limited: 5 req / 10 min per IP) |

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


