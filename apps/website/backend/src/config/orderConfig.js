/**
 * Order Configuration Constants
 * Aligned with customer frontend CartPage.jsx and ProfileOrders.jsx specifications
 */
export const ORDER_CONFIG = {
  // Standard delivery fee charged when subtotal is below the free delivery threshold
  DELIVERY_FEE: 39,

  // Minimum subtotal required to qualify for free delivery (CartPage.jsx:28)
  FREE_DELIVERY_ABOVE: 299,

  // Fixed taxes & handling charges per order (CartPage.jsx:30)
  TAX: 15,

  // Estimated express delivery turnaround time in minutes (CartPage.jsx:42)
  ESTIMATED_DELIVERY_MINUTES: 15,

  // Canonical order statuses throughout customer lifecycle
  STATUSES: {
    PLACED: "PLACED",
    CONFIRMED: "CONFIRMED",
    PACKED: "PACKED",
    OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED",
  },

  // Supported customer payment methods (standalone COD without external gateway)
  PAYMENT_METHODS: {
    COD: "COD",
  },

  // Payment statuses (PENDING default for cash on delivery)
  PAYMENT_STATUSES: {
    PENDING: "PENDING",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED",
    REFUNDED: "REFUNDED",
  },
};
