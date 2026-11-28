# Engineering Handoff: Orders, Lifecycle, Tracking & Payment Integration

> **Target Audience:** Engineering Manager, Tech Leads (Vendor App, Rider App, Payment Gateway Integration)  
> **Service:** Customer Website Backend (`apps/website/backend`, Port 4100)  
> **Date:** November 28, 2026  
> **Status:** Customer Standalone Layer Implemented; Ready for Cross-Service Integration  

---

## 1. Customer Order Lifecycle & Database State Machine

### Tables & Key Fields in Schema (`customer`)
- **`Order` (`orders`):**
  - `id` (UUID PK): Internal unique order ID.
  - `orderNumber` (String Unique): User-facing human-friendly identifier (e.g. `FC-104928`).
  - `userId` (String): Central Auth customer user ID (`sub`). No DB foreign key to Central Auth.
  - `storeId` (UUID FK?): Set when all cart items belong to a single vendor store; `null` for multi-store carts.
  - `status` (String): Canonical order status (`PLACED`, `CONFIRMED`, `PACKED`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`).
  - `paymentMethod` (String): Currently `"COD"` (Cash on Delivery).
  - `paymentStatus` (String): Default `"PENDING"`.
  - `subtotal`, `discount`, `deliveryFee`, `tax`, `total` (Decimal): Precise monetary values.
  - `addressSnapshot` (Json): Complete immutable snapshot of delivery address at checkout time.
  - `placedAt`, `deliveredAt`, `cancelledAt`, `estimatedDeliveryAt` (DateTime).
- **`OrderItem` (`order_items`):**
  - `productId` (UUID FK?): Optional reference to catalog product (SetNull on delete).
  - `nameSnapshot`, `imageSnapshot`, `unitPriceSnapshot`, `mrpSnapshot`, `unit`, `quantity`, `lineTotal`: Immutable snapshot so future price or catalog changes never distort historical orders.
- **`OrderStatusEvent` (`order_status_events`):**
  - Timeline of lifecycle events (`orderId`, `status`, `note`, `createdAt`). Used directly by `GET /api/v1/orders/:orderId/track`.

### Status Transitions & Who Changes Them
- **Customer Frontend (Current Scope):**
  - `PLACED`: Set automatically on order creation via `POST /api/v1/orders`.
  - `CANCELLED`: Set when customer cancels via `POST /api/v1/orders/:orderId/cancel` (permitted only if status is `PLACED` or `CONFIRMED`).
- **Vendor / Rider / Admin Services (Future Integration):**
  - *Current Status:* There are currently **NO public or customer APIs** to transition orders to `CONFIRMED`, `PACKED`, `OUT_FOR_DELIVERY`, or `DELIVERED`. These transitions currently happen only at the database level.
  - *Handoff Requirement:* When vendor and rider services are connected, internal S2S or webhooks must update `Order.status` and append a corresponding `OrderStatusEvent` record to keep the customer tracking timeline updated:
    1. **Vendor App accepts order:** `PLACED` ➔ `CONFIRMED`
    2. **Vendor marks packed:** `CONFIRMED` ➔ `PACKED`
    3. **Rider picks up order:** `PACKED` ➔ `OUT_FOR_DELIVERY`
    4. **Rider delivers order:** `OUT_FOR_DELIVERY` ➔ `DELIVERED` (and set `deliveredAt = now()`, `paymentStatus = "COMPLETED"` for COD)

---

## 2. Payment Gateway Hook (Razorpay / Cashfree / Stripe)

- **Current Implementation:**
  - `POST /api/v1/orders` only accepts `paymentMethod: "COD"`.
  - Any request with `paymentMethod: "ONLINE"` or unsupported methods immediately rejects with:
    ```json
    {
      "success": false,
      "error": {
        "code": "PAYMENT_METHOD_NOT_SUPPORTED",
        "message": "Only Cash on Delivery (COD) is supported at this time"
      }
    }
    ```
- **How to Connect a Payment Gateway Later:**
  1. **Schema Readiness:** The `Order` table already contains `paymentStatus` (default `"PENDING"`).
  2. **Order Creation Hook (`OrderService.createOrder`):**
     - Allow `"ONLINE"` in `paymentMethod`.
     - Create the `Order` with `paymentStatus: "PENDING"`.
     - Initialize gateway order (e.g., `razorpay.orders.create({ amount: total * 100, currency: "INR", receipt: orderNumber })`).
     - Return gateway `orderId`, `key`, and signature payload alongside customer order details.
  3. **Webhook Handler (`/api/v1/payments/webhook`):**
     - Verify HMAC SHA256 gateway signature.
     - On payment success: update `Order.paymentStatus = "COMPLETED"`, append `OrderStatusEvent("CONFIRMED", "Online payment verified via Razorpay")`.
     - On payment failure: update `Order.paymentStatus = "FAILED"`, restore stock, mark `status = "CANCELLED"`.

---

## 3. Vendor Inventory & Price Synchronization

- **Current Implementation:**
  - Order creation atomically decrements `Product.countInStock` and updates `inStock = (countInStock > 0)`.
  - Customer cancellation atomically restores `Product.countInStock` and resets `inStock = true`.
- **How Vendor Real-Time Sync Must Connect:**
  - **Vendor Stock Updates:** When a vendor updates stock in their vendor management portal or POS, it must update `customer.products.count_in_stock`.
  - **Multi-Vendor Carts:** If an order spans multiple stores (`Order.storeId = null`), fulfillment must either be split into sub-orders or handled via separate dispatch tickets per vendor.
  - **Price Drift Protection:** Because `OrderItem` stores `unitPriceSnapshot` and `mrpSnapshot`, vendor price updates in `Product` will not retroactively alter previously placed customer orders.

---

## 4. Summary of Assumptions & Configuration Defaults

As specified by the customer frontend (`CartPage.jsx` and `ProfileOrders.jsx`), the following constants are declared in `src/config/orderConfig.js`:
- `ORDER_CONFIG.DELIVERY_FEE`: ₹39 (standard delivery charge)
- `ORDER_CONFIG.FREE_DELIVERY_ABOVE`: ₹299 (subtotal threshold for free delivery)
- `ORDER_CONFIG.TAX`: ₹15 (taxes and handling fees)
- `ORDER_CONFIG.ESTIMATED_DELIVERY_MINUTES`: 15 minutes (hyperlocal 15-minute express delivery promise)
- Order Number Format: `FC-` prefix followed by 6 unique digits (e.g. `FC-491028`).
- Rider Tracking: Explicitly returns `rider: null` on `GET /orders/:orderId/track` until rider dispatch backend and WebSocket GPS tracking are provisioned.

---

## 5. Prescriptions Verification & File Storage Architecture

- **Current Implementation:**
  - `Prescription` records are registered via `POST /api/v1/prescriptions` with a secure HTTPS `fileUrl`, status `"PENDING"`, and optional patient/doctor metadata.
  - Strict privacy: `fileUrl` is treated as sensitive health data and is never logged in console outputs or error stacks. Endpoints are strictly owner-isolated (foreign requests return 404).
  - Maximum 20 prescriptions per user limit enforced.
- **Handoff for Pharmacy / Admin Verification:**
  - **Who Verifies:** A licensed pharmacy partner or internal admin portal must review the prescription image/document before dispensing prescription-only medicines.
  - **Status Transitions:** Admin/Pharmacy service will transition status from `PENDING` ➔ `VERIFIED` or `PENDING` ➔ `REJECTED` (with `rejectionReason`).
  - **File Storage Recommendation:** Production uploads should use a private cloud bucket (e.g. Cloudinary authenticated upload or private S3/GCS bucket with short-lived presigned GET URLs) rather than publicly accessible CDN assets to maintain healthcare data compliance.

---

## 6. Product Reviews & Moderation

- **Current Implementation:**
  - Public endpoint `GET /api/v1/products/:slugOrId/reviews` returns reviews with dynamic mathematical summary: `average` rating, `count`, and `distribution` (1 to 5 stars) computed strictly from real reviews in `customer.product_reviews`.
  - Database seed columns `Product.rating` and `Product.reviewCount` are intentionally preserved untouched to protect catalog presentation consistency.
  - One review per user per product enforced via unique constraint.
  - Automatic `isVerifiedPurchase` badge: When a customer submits a review, the service checks whether the user has a `DELIVERED` order containing that product item.
- **Handoff for Moderation:**
  - An admin/vendor dashboard or automated profanity filter can be connected to flag or hide offensive reviews without breaking the mathematical summary.

---

## 7. Status of Subscriptions Module

- **Explicit Decision:** As per engineering review, the Recurring Subscriptions feature has been **skipped** from backend implementation because the subscription flow is neither reachable nor exposed anywhere in the customer website navigation, footer, or profile menus.

---

## 8. Delivery Slots & Fleet Capacity Integration

- **Current Implementation:**
  - `GET /api/v1/delivery-slots?days=2` returns dynamic time windows (Morning: 7–9 AM, Afternoon: 1–3 PM, Evening: 7–9 PM) generated from IST configuration (`src/config/deliverySlots.js`).
  - Automatically marks passed time slots on the current day as `available: false` based on real-time IST clock calculations.
- **Handoff for Vendor Operating Hours & Rider Capacity:**
  1. **Vendor Store Operating Hours:** When integrating with vendor backends, slots should cross-reference `Store.openHours` and vendor holiday schedules to disable slots outside store operational hours.
  2. **Rider Fleet Capacity Throttling:** A real-time dispatch service should track open orders per zone per slot. When rider dispatch capacity reaches its ceiling (e.g. 50 orders per hour per dark store/hub), that slot should dynamically return `available: false` or `badge: "Surge / Filling Fast"`.
  3. **Cut-off Buffers:** Configure a lead-time buffer (e.g. 45 minutes prior to slot start) to allow vendors sufficient pick & pack preparation time before dispatch.

---

## 9. Blogs CMS & Content Administration

- **Current Implementation:**
  - Table `BlogPost` (`customer.blog_posts`) stores markdown articles, cover images, author metadata, read times, and tags.
  - Public endpoints `GET /api/v1/blogs` (listing excludes heavy content) and `GET /api/v1/blogs/:slug` (full markdown body).
  - Draft or unpublished posts (`isPublished: false`) are strictly hidden from customers (return 404).
- **Handoff for Marketing & CMS Team:**
  1. **Admin Portal / Headless CMS Integration:** Staff or marketing leads can use an internal admin panel or headless CMS webhook (e.g. Strapi, Sanity) to write and update articles in `customer.blog_posts`.
  2. **Image CDN Hosting:** Blog images in seed point to Unsplash. Production images should be uploaded via FillCart's Cloudinary / S3 pipeline.
  3. **Markdown Rendering:** Frontend renders article markdown using standard markdown rendering components.

---

## 10. Restock Notifications ("Notify Me") Architecture

- **Current Implementation:**
  - Table `StockNotification` (`customer.stock_notifications`) records customer restock intent for out-of-stock items (`status: "PENDING"`).
  - Dual support: Authenticated customers (using JWT `req.user.id`) and guest shoppers (providing `email` or `phone`, rate-limited).
  - Idempotent: Duplicate subscription requests return `200 OK` without duplicating database rows (`@@unique([productId, userId])`, `@@unique([productId, email])`).
  - If item is already in stock, requests reject with `409 PRODUCT_IN_STOCK`.
  - Authenticated customers can unsubscribe via `DELETE /api/v1/products/:slugOrId/notify-me`.
- **Handoff for Restock Notification Dispatch Worker:**
  1. **Restock Trigger:** When a vendor updates `Product.countInStock > 0` or toggles `inStock = true`:
     - An asynchronous worker (e.g., BullMQ / Kafka queue) should query pending notifications:
       ```sql
       SELECT * FROM customer.stock_notifications WHERE product_id = :id AND status = 'PENDING';
       ```
  2. **Multi-Channel Dispatch:**
     - For `userId`: Dispatch in-app push notification (FCM) and customer account notification.
     - For `email`: Send personalized transactional email ("Back in Stock: <Product Name> is now available!").
     - For `phone`: Send SMS / WhatsApp notification via notification gateway (e.g. Twilio, Gupshup).
  3. **Status Transition:** Once dispatched, mark rows as `status = 'NOTIFIED'`.


