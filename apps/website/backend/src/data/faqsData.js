/**
 * Single source of truth for Fillcart Customer FAQ / Help Centre data.
 */
export const faqCategories = [
  {
    id: "orders",
    label: "Orders",
    subtitle: "Placing, tracking and cancelling orders",
    icon: "bag",
    items: [
      {
        id: "orders-1",
        q: "How do I track my active order?",
        a: "Go to 'My Orders' in your profile and tap 'Track order'. You will see the live rider movement on a map, with an updated delivery time.",
      },
      {
        id: "orders-2",
        q: "Can I cancel an order after placing it?",
        a: "You can cancel your order free of charge within 2 minutes of checkout before the merchant store begins packing.",
      },
      {
        id: "orders-3",
        q: "What should I do if my order is delayed?",
        a: "If your delivery partner is delayed by adverse weather or peak traffic, check the live map for updated ETA or tap 'Live chat' to reach support within 5 minutes.",
      },
      {
        id: "orders-4",
        q: "Can I change my delivery address after placing an order?",
        a: "Address adjustments are permitted within 2 minutes of placing an order if your rider has not yet been dispatched.",
      },
    ],
  },
  {
    id: "payments",
    label: "Payments & Refunds",
    subtitle: "Payment methods, refunds and offers",
    icon: "wallet",
    items: [
      {
        id: "payments-1",
        q: "How can I pay for my order?",
        a: "We accept UPI (Google Pay, PhonePe, Paytm), Credit and Debit cards, Net Banking, and Cash on Delivery (COD).",
      },
      {
        id: "payments-2",
        q: "My payment failed but the money was deducted. What now?",
        a: "Bank deductions for unsuccessful transactions are automatically reversed by your issuing bank within 24-48 business hours.",
      },
      {
        id: "payments-3",
        q: "When will I get my refund?",
        a: "Refunds for cancelled or returned orders are initiated immediately and reflect in your original payment method within 3 to 5 business days.",
      },
      {
        id: "payments-4",
        q: "Are online payments secure on Fillcart?",
        a: "Yes, all transactions are processed through RBI-compliant, 256-bit encrypted payment gateways.",
      },
    ],
  },
  {
    id: "returns",
    label: "Returns & Replacements",
    subtitle: "Return window, damaged items and process",
    icon: "refresh",
    items: [
      {
        id: "returns-1",
        q: "What is the return policy for groceries and fresh produce?",
        a: "Fresh fruits, vegetables, dairy, and bakery items can be returned at the doorstep upon delivery if quality does not meet expectations.",
      },
      {
        id: "returns-2",
        q: "What should I do if an item is missing or damaged?",
        a: "Tap 'Raise a support ticket' or contact our support team within 24 hours of delivery with a photo of the received invoice and package.",
      },
      {
        id: "returns-3",
        q: "Can I replace a product with a different variant?",
        a: "Direct variant swaps are not supported post-delivery. You can return the item for a full refund and place a fresh order.",
      },
    ],
  },
  {
    id: "delivery",
    label: "Delivery & Tracking",
    subtitle: "Delivery fees, express delivery and slots",
    icon: "truck",
    items: [
      {
        id: "delivery-1",
        q: "How fast is Fillcart express delivery?",
        a: "Hyperlocal orders are delivered within 10 to 30 minutes from your chosen neighbourhood partner stores.",
      },
      {
        id: "delivery-2",
        q: "Is there a minimum order amount for free delivery?",
        a: "Orders above ₹299 enjoy free delivery. For smaller orders, a nominal delivery fee of ₹30 applies.",
      },
      {
        id: "delivery-3",
        q: "Do you deliver during late night or early morning hours?",
        a: "Operating hours depend on our partner stores, typically from 7:00 AM to 11:00 PM daily in active service pincodes.",
      },
    ],
  },
  {
    id: "account",
    label: "Account & Settings",
    subtitle: "Profile, addresses and notifications",
    icon: "user",
    items: [
      {
        id: "account-1",
        q: "How do I update my registered mobile number or email?",
        a: "Go to 'Profile' > 'Account' and tap edit next to your contact details. An OTP verification is required for security.",
      },
      {
        id: "account-2",
        q: "How do I add or manage saved delivery addresses?",
        a: "Navigate to 'Profile' > 'Addresses' to add new addresses, set a default home/office location, or update pincodes.",
      },
      {
        id: "account-3",
        q: "How do I delete my Fillcart account?",
        a: "Submit an account deletion request through the Support Help Centre or email privacy@fillcart.com.",
      },
    ],
  },
];
