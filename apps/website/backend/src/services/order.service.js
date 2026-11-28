import { OrderRepository } from "../repositories/order.repository.js";
import { CartRepository } from "../repositories/cart.repository.js";
import { CouponRepository } from "../repositories/coupon.repository.js";
import { AddressRepository } from "../repositories/address.repository.js";
import { ORDER_CONFIG } from "../config/orderConfig.js";
import { ApiError } from "../utils/ApiError.js";
import { serialize } from "../utils/serialize.js";

export class OrderService {
  constructor() {
    this.orderRepo = new OrderRepository();
    this.cartRepo = new CartRepository();
    this.couponRepo = new CouponRepository();
    this.addressRepo = new AddressRepository();
  }

  formatOrderResponse(order) {
    if (!order) return null;
    const s = serialize(order);
    return {
      ...s,
      orderId: s.orderNumber || s.id, // Compatibility helper for frontend ProfileOrders.jsx
    };
  }

  async generateOrderNumber() {
    for (let i = 0; i < 5; i++) {
      const randomSixDigit = Math.floor(100000 + Math.random() * 900000);
      const candidate = `FC-${randomSixDigit}`;
      // Verify uniqueness
      const existing = await this.orderRepo.findUserOrderByIdOrNumber(candidate, "").catch(() => null);
      if (!existing) {
        return candidate;
      }
    }
    return `FC-${Date.now().toString().slice(-6)}`;
  }

  async createOrder(userId, { addressId, paymentMethod = "COD", notes }) {
    // 1. Validate payment method (only COD supported, ONLINE returns 400 PAYMENT_METHOD_NOT_SUPPORTED)
    const normalizedMethod = (paymentMethod || "COD").trim().toUpperCase();
    if (normalizedMethod !== ORDER_CONFIG.PAYMENT_METHODS.COD) {
      throw new ApiError(
        400,
        `Payment method '${paymentMethod}' is not supported. Only '${ORDER_CONFIG.PAYMENT_METHODS.COD}' (Cash on Delivery) is currently supported.`,
        "PAYMENT_METHOD_NOT_SUPPORTED"
      );
    }

    // 2. Read user's cart
    const cart = await this.cartRepo.getOrCreateCart(userId);
    const cartItems = cart.items || [];
    if (cartItems.length === 0) {
      throw new ApiError(400, "Your cart is empty. Add items before placing an order.", "CART_EMPTY");
    }

    // 3. Verify user's delivery address
    const address = await this.addressRepo.findById(addressId, userId);
    if (!address) {
      throw new ApiError(404, "Delivery address not found or does not belong to you.", "ADDRESS_NOT_FOUND");
    }

    // 4. Stock validation & product verification
    const outOfStockItems = [];
    const verifiedItems = [];

    for (const item of cartItems) {
      const product = await this.orderRepo.findProduct(item.productId);
      if (!product || !product.inStock || product.countInStock < item.quantity) {
        outOfStockItems.push({
          productId: item.productId,
          name: item.product?.name || product?.name || "Item",
          requestedQuantity: item.quantity,
          availableStock: product?.countInStock || 0,
        });
      } else {
        verifiedItems.push({
          cartItem: item,
          product,
        });
      }
    }

    if (outOfStockItems.length > 0) {
      const names = outOfStockItems.map((o) => o.name).join(", ");
      throw new ApiError(
        409,
        `Some items in your cart are out of stock or have insufficient quantity: ${names}`,
        "OUT_OF_STOCK",
        outOfStockItems
      );
    }

    // 5. Determine storeId (cart items store: if all items from single store, storeId; else null for mixed)
    const storeIds = new Set(verifiedItems.map((v) => v.product.storeId).filter(Boolean));
    const storeId = storeIds.size === 1 ? Array.from(storeIds)[0] : null;

    // 6. Compute financial values
    let subtotal = 0;
    for (const v of verifiedItems) {
      const price = Number(v.product.price);
      subtotal += price * v.cartItem.quantity;
    }
    subtotal = Math.round(subtotal * 100) / 100;

    // 7. Validate coupon and calculate discount
    let discount = 0;
    let couponToRedeem = null;

    if (cart.appliedCouponCode) {
      const coupon = await this.couponRepo.findByCode(cart.appliedCouponCode);
      if (coupon && coupon.isActive) {
        const now = new Date();
        const isNotExpired = !coupon.expiresAt || new Date(coupon.expiresAt) > now;
        const isStarted = !coupon.startsAt || new Date(coupon.startsAt) <= now;
        const meetsMinOrder = subtotal >= Number(coupon.minOrderValue || 0);

        let limitReached = false;
        if (coupon.usageLimit != null) {
          const totalUses = await this.couponRepo.countTotalRedemptions(coupon.id);
          if (totalUses >= coupon.usageLimit) limitReached = true;
        }
        if (coupon.perUserLimit != null) {
          const userUses = await this.couponRepo.countUserRedemptions(coupon.id, userId);
          if (userUses >= coupon.perUserLimit) limitReached = true;
        }

        if (isNotExpired && isStarted && meetsMinOrder && !limitReached) {
          if (coupon.discountType === "PERCENT") {
            const rawDiscount = Math.round(subtotal * (Number(coupon.discountValue) / 100) * 100) / 100;
            discount = coupon.maxDiscount
              ? Math.min(rawDiscount, Number(coupon.maxDiscount))
              : rawDiscount;
          } else {
            discount = Math.min(subtotal, Number(coupon.discountValue));
          }
          discount = Math.round(discount * 100) / 100;
          couponToRedeem = coupon;
        }
      }
    }

    const deliveryFee =
      subtotal >= ORDER_CONFIG.FREE_DELIVERY_ABOVE ? 0 : ORDER_CONFIG.DELIVERY_FEE;
    const tax = ORDER_CONFIG.TAX;
    const total = Math.max(0, Math.round((subtotal - discount + deliveryFee + tax) * 100) / 100);

    // 8. Snapshot address
    const addressSnapshot = {
      id: address.id,
      label: address.label || "Home",
      fullName: address.fullName,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2 || null,
      landmark: address.landmark || null,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    };

    const orderNumber = await this.generateOrderNumber();
    const placedAt = new Date();
    const estimatedDeliveryAt = new Date(
      placedAt.getTime() + ORDER_CONFIG.ESTIMATED_DELIVERY_MINUTES * 60 * 1000
    );

    // 9. Prepare order items snapshot
    const itemsData = verifiedItems.map(({ cartItem, product }) => {
      const unitPrice = Number(product.price);
      const lineTotal = Math.round(unitPrice * cartItem.quantity * 100) / 100;
      return {
        productId: product.id,
        nameSnapshot: product.name,
        imageSnapshot: product.primaryImageUrl || null,
        unitPriceSnapshot: unitPrice,
        mrpSnapshot: product.mrp ? Number(product.mrp) : null,
        unit: product.unit || "1 unit",
        quantity: cartItem.quantity,
        lineTotal,
      };
    });

    const orderData = {
      orderNumber,
      userId,
      storeId,
      status: ORDER_CONFIG.STATUSES.PLACED,
      paymentMethod: ORDER_CONFIG.PAYMENT_METHODS.COD,
      paymentStatus: ORDER_CONFIG.PAYMENT_STATUSES.PENDING,
      subtotal,
      discount,
      deliveryFee,
      tax,
      total,
      couponCode: couponToRedeem?.code || null,
      addressSnapshot,
      notes: notes || null,
      placedAt,
      estimatedDeliveryAt,
    };

    const eventData = {
      status: ORDER_CONFIG.STATUSES.PLACED,
      note: "Order placed successfully via Cash on Delivery",
    };

    const redemptionData = couponToRedeem
      ? { couponId: couponToRedeem.id, userId }
      : null;

    // 10. Execute transaction: create order, decrement stocks, clear cart
    const createdOrder = await this.orderRepo.executeTransaction(async (tx) => {
      const order = await this.orderRepo.createOrder(
        { orderData, itemsData, eventData, redemptionData },
        tx
      );

      // Decrement product inventory
      for (const v of verifiedItems) {
        await this.orderRepo.decrementProductStock(v.product.id, v.cartItem.quantity, tx);
      }

      // Clear user cart and reset applied coupon
      await this.cartRepo.clearCart(cart.id);
      await this.cartRepo.updateAppliedCoupon(cart.id, null, tx);

      return order;
    });

    return this.formatOrderResponse(createdOrder);
  }

  async getOrders(userId, { status, page = 1, limit = 10 }) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const { orders, total } = await this.orderRepo.findUserOrders(userId, {
      status,
      skip,
      take: limitNum,
    });

    return {
      orders: orders.map((o) => this.formatOrderResponse(o)),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  }

  async getOrderById(userId, orderIdOrNumber) {
    const order = await this.orderRepo.findUserOrderByIdOrNumber(orderIdOrNumber, userId);
    if (!order) {
      throw new ApiError(404, "Order not found", "NOT_FOUND");
    }
    return this.formatOrderResponse(order);
  }

  async cancelOrder(userId, orderIdOrNumber, reason) {
    const order = await this.orderRepo.findUserOrderByIdOrNumber(orderIdOrNumber, userId);
    if (!order) {
      throw new ApiError(404, "Order not found", "NOT_FOUND");
    }

    if (
      order.status !== ORDER_CONFIG.STATUSES.PLACED &&
      order.status !== ORDER_CONFIG.STATUSES.CONFIRMED
    ) {
      throw new ApiError(
        409,
        `Order cannot be cancelled in its current status (${order.status}). Cancellation is only permitted when order is PLACED or CONFIRMED.`,
        "ORDER_NOT_CANCELLABLE"
      );
    }

    const cancelReason = reason || "Cancelled by customer";
    const cancelledAt = new Date();

    const updatedOrder = await this.orderRepo.executeTransaction(async (tx) => {
      const updated = await this.orderRepo.updateOrderStatus(
        order.id,
        {
          status: ORDER_CONFIG.STATUSES.CANCELLED,
          cancelReason,
          cancelledAt,
          note: `Order cancelled by customer. Reason: ${cancelReason}`,
        },
        tx
      );

      // Restore inventory stock for all order items
      const items = order.items || [];
      for (const item of items) {
        if (item.productId) {
          await this.orderRepo.incrementProductStock(item.productId, item.quantity, tx);
        }
      }

      // Restore coupon redemption if one was used
      await this.couponRepo.deleteRedemptionByOrderId(order.id, tx);

      return updated;
    });

    return this.formatOrderResponse(updatedOrder);
  }

  async reorder(userId, orderIdOrNumber) {
    const order = await this.orderRepo.findUserOrderByIdOrNumber(orderIdOrNumber, userId);
    if (!order) {
      throw new ApiError(404, "Order not found", "NOT_FOUND");
    }

    const cart = await this.cartRepo.getOrCreateCart(userId);
    const items = order.items || [];
    const reorderedItems = [];
    const skippedItems = [];

    for (const item of items) {
      if (!item.productId) {
        skippedItems.push({
          name: item.nameSnapshot,
          reason: "Product no longer available in catalog",
        });
        continue;
      }

      const product = await this.orderRepo.findProduct(item.productId);
      if (!product || !product.isActive) {
        skippedItems.push({
          productId: item.productId,
          name: item.nameSnapshot,
          reason: "Product is no longer available",
        });
      } else if (!product.inStock || product.countInStock <= 0) {
        skippedItems.push({
          productId: item.productId,
          name: item.nameSnapshot,
          reason: "Product is currently out of stock",
        });
      } else {
        const qtyToAdd = Math.min(item.quantity, product.countInStock, 20);
        await this.cartRepo.addItem(cart.id, product.id, qtyToAdd);
        reorderedItems.push({
          productId: product.id,
          name: product.name,
          quantity: qtyToAdd,
          price: Number(product.price),
        });
      }
    }

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      reorderedItems,
      skippedItems,
      message:
        reorderedItems.length > 0
          ? `${reorderedItems.length} item(s) re-added to your cart.`
          : "None of the items from this order are currently available.",
    };
  }

  async trackOrder(userId, orderIdOrNumber) {
    const order = await this.orderRepo.findUserOrderByIdOrNumber(orderIdOrNumber, userId);
    if (!order) {
      throw new ApiError(404, "Order not found", "NOT_FOUND");
    }

    const statusTimeline = (order.statusEvents || []).map((ev) => ({
      status: ev.status,
      note: ev.note,
      createdAt: ev.createdAt,
    }));

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      placedAt: order.placedAt,
      deliveredAt: order.deliveredAt || null,
      cancelledAt: order.cancelledAt || null,
      estimatedDeliveryAt: order.estimatedDeliveryAt || null,
      statusTimeline,
      deliveryAddress: order.addressSnapshot,
      rider: null, // As specified: live GPS/rider data omitted (null/absent)
    };
  }
}
