import { CouponRepository } from "../repositories/coupon.repository.js";
import { CartRepository } from "../repositories/cart.repository.js";
import { CartService } from "./cart.service.js";
import { ApiError } from "../utils/ApiError.js";

export class CouponService {
  constructor() {
    this.couponRepo = new CouponRepository();
    this.cartRepo = new CartRepository();
    this.cartService = new CartService();
  }

  async applyCoupon(userId, rawCode) {
    if (!rawCode || typeof rawCode !== "string") {
      throw new ApiError(400, "Coupon code is required", "COUPON_INVALID");
    }

    const code = rawCode.trim().toUpperCase();
    const cart = await this.cartRepo.getOrCreateCart(userId);
    const items = cart.items || [];

    if (items.length === 0) {
      throw new ApiError(400, "Your cart is empty. Add items before applying a coupon.", "CART_EMPTY");
    }

    // Compute subtotal
    let subtotal = 0;
    for (const it of items) {
      const price = Number(it.product?.price || 0);
      subtotal += price * it.quantity;
    }
    subtotal = Math.round(subtotal * 100) / 100;

    const coupon = await this.couponRepo.findByCode(code);
    if (!coupon || !coupon.isActive) {
      throw new ApiError(400, "Invalid coupon code.", "COUPON_INVALID");
    }

    const now = new Date();
    if (coupon.startsAt && new Date(coupon.startsAt) > now) {
      throw new ApiError(400, "This coupon has not started yet.", "COUPON_INVALID");
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) <= now) {
      throw new ApiError(400, "This coupon has expired.", "COUPON_EXPIRED");
    }

    // Check usage limits
    if (coupon.usageLimit != null) {
      const totalUses = await this.couponRepo.countTotalRedemptions(coupon.id);
      if (totalUses >= coupon.usageLimit) {
        throw new ApiError(400, "Coupon usage limit reached.", "COUPON_LIMIT_REACHED");
      }
    }

    if (coupon.perUserLimit != null) {
      const userUses = await this.couponRepo.countUserRedemptions(coupon.id, userId);
      if (userUses >= coupon.perUserLimit) {
        throw new ApiError(
          400,
          `You have already redeemed this coupon the maximum allowed times (${coupon.perUserLimit}).`,
          "COUPON_LIMIT_REACHED"
        );
      }
    }

    // Check minimum order value
    const minOrder = Number(coupon.minOrderValue || 0);
    if (subtotal < minOrder) {
      throw new ApiError(
        400,
        `Minimum order value for coupon ${coupon.code} is ₹${minOrder}. Add ₹${minOrder - subtotal} more to your cart.`,
        "COUPON_MIN_ORDER"
      );
    }

    // Attach to cart
    await this.cartRepo.updateAppliedCoupon(cart.id, coupon.code);

    // Return full updated cart
    return this.cartService.getCart(userId);
  }

  async removeCoupon(userId) {
    const cart = await this.cartRepo.getOrCreateCart(userId);
    await this.cartRepo.updateAppliedCoupon(cart.id, null);
    return this.cartService.getCart(userId);
  }
}
