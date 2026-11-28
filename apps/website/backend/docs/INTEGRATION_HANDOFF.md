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
