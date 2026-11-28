import { CartRepository } from "../repositories/cart.repository.js";
import { CouponRepository } from "../repositories/coupon.repository.js";
import { ORDER_CONFIG } from "../config/orderConfig.js";
import { ApiError } from "../utils/ApiError.js";
import { formatProduct, serialize } from "../utils/serialize.js";

export class CartService {
  constructor() {
    this.cartRepo = new CartRepository();
    this.couponRepo = new CouponRepository();
  }

  async formatCartResponse(cart, userId) {
    const rawCart = serialize(cart);
    const items = (rawCart.items || []).map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      product: formatProduct(item.product),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    let subtotal = 0;
    let totalItems = 0;

    for (const it of items) {
      const price = Number(it.product?.price || 0);
      subtotal += price * it.quantity;
      totalItems += it.quantity;
    }

    subtotal = Math.round(subtotal * 100) / 100;

    let discount = 0;
    let appliedCoupon = null;
    let appliedCouponCode = rawCart.appliedCouponCode || null;

    if (appliedCouponCode && subtotal > 0) {
      const coupon = await this.couponRepo.findByCode(appliedCouponCode);
      if (coupon && coupon.isActive) {
        const now = new Date();
        const isNotExpired = !coupon.expiresAt || new Date(coupon.expiresAt) > now;
        const isStarted = !coupon.startsAt || new Date(coupon.startsAt) <= now;
        const meetsMinOrder = subtotal >= Number(coupon.minOrderValue || 0);

        if (isNotExpired && isStarted && meetsMinOrder) {
          if (coupon.discountType === "PERCENT") {
            const rawDiscount = Math.round(subtotal * (Number(coupon.discountValue) / 100) * 100) / 100;
            discount = coupon.maxDiscount
              ? Math.min(rawDiscount, Number(coupon.maxDiscount))
              : rawDiscount;
          } else {
            discount = Math.min(subtotal, Number(coupon.discountValue));
          }
          discount = Math.round(discount * 100) / 100;
          appliedCoupon = {
            code: coupon.code,
            description: coupon.description,
            discountType: coupon.discountType,
            discountValue: Number(coupon.discountValue),
            maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : null,
          };
        } else {
          // Coupon is no longer eligible (e.g. items removed or expired)
          appliedCouponCode = null;
          await this.cartRepo.updateAppliedCoupon(rawCart.id, null);
        }
      } else {
        appliedCouponCode = null;
        await this.cartRepo.updateAppliedCoupon(rawCart.id, null);
      }
    } else if (appliedCouponCode && subtotal === 0) {
      appliedCouponCode = null;
      await this.cartRepo.updateAppliedCoupon(rawCart.id, null);
    }

    const deliveryFee =
      subtotal === 0
        ? 0
        : subtotal >= ORDER_CONFIG.FREE_DELIVERY_ABOVE
        ? 0
        : ORDER_CONFIG.DELIVERY_FEE;

    const tax = subtotal === 0 ? 0 : ORDER_CONFIG.TAX;
    const total = Math.max(0, Math.round((subtotal - discount + deliveryFee + tax) * 100) / 100);

    return {
      id: rawCart.id,
      userId: rawCart.userId,
      items,
      subtotal,
      totalItems,
      appliedCouponCode,
      discount,
      deliveryFee,
      tax,
      total,
      appliedCoupon,
      createdAt: rawCart.createdAt,
      updatedAt: rawCart.updatedAt,
    };
  }

  async getCart(userId) {
    const cart = await this.cartRepo.getOrCreateCart(userId);
    return this.formatCartResponse(cart, userId);
  }

  async addItem(userId, { productId, slug, quantity = 1 }) {
    const identifier = productId || slug;
    const product = await this.cartRepo.findProduct(identifier);
    if (!product) {
      throw new ApiError(404, "Product not found", "NOT_FOUND");
    }

    const cart = await this.cartRepo.getOrCreateCart(userId);
    await this.cartRepo.addItem(cart.id, product.id, quantity);

    return this.getCart(userId);
  }

  async updateItem(userId, itemId, quantity) {
    const cart = await this.cartRepo.getOrCreateCart(userId);
    const item = (cart.items || []).find((i) => i.id === itemId);
    if (!item) {
      throw new ApiError(404, "Cart item not found in your cart", "NOT_FOUND");
    }

    await this.cartRepo.updateItemQuantity(itemId, cart.id, quantity);
    return this.getCart(userId);
  }

  async removeItem(userId, itemId) {
    const cart = await this.cartRepo.getOrCreateCart(userId);
    const item = (cart.items || []).find((i) => i.id === itemId);
    if (!item) {
      throw new ApiError(404, "Cart item not found in your cart", "NOT_FOUND");
    }

    await this.cartRepo.removeItem(itemId, cart.id);
    return { message: "Item removed from cart" };
  }

  async clearCart(userId) {
    const cart = await this.cartRepo.getOrCreateCart(userId);
    await this.cartRepo.clearCart(cart.id);
    return { message: "Cart cleared successfully" };
  }

  async mergeCart(userId, items) {
    const cart = await this.cartRepo.getOrCreateCart(userId);

    for (const it of items) {
      const identifier = it.productId || it.slug;
      if (!identifier) continue;

      const product = await this.cartRepo.findProduct(identifier);
      if (!product) continue;

      const qty = Math.min(20, Math.max(1, it.quantity || 1));
      await this.cartRepo.addItem(cart.id, product.id, qty);
    }

    return this.getCart(userId);
  }
}
