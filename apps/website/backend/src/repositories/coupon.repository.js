import { randomUUID } from "node:crypto";
import { prisma } from "../db/prisma.js";

// In-memory fallback stores when migration has not yet generated models
const fallbackCoupons = new Map();
const fallbackRedemptions = new Map();

export class CouponRepository {
  async findByCode(rawCode) {
    if (!rawCode) return null;
    const code = rawCode.trim().toUpperCase();

    if (prisma.coupon) {
      return prisma.coupon.findUnique({
        where: { code },
      });
    }

    return fallbackCoupons.get(code) || null;
  }

  async countUserRedemptions(couponId, userId) {
    if (prisma.couponRedemption) {
      return prisma.couponRedemption.count({
        where: { couponId, userId },
      });
    }

    return Array.from(fallbackRedemptions.values()).filter(
      (r) => r.couponId === couponId && r.userId === userId
    ).length;
  }

  async countTotalRedemptions(couponId) {
    if (prisma.couponRedemption) {
      return prisma.couponRedemption.count({
        where: { couponId },
      });
    }

    return Array.from(fallbackRedemptions.values()).filter(
      (r) => r.couponId === couponId
    ).length;
  }

  async createRedemption(couponId, userId, orderId, tx = null) {
    const client = tx || prisma;
    if (client.couponRedemption) {
      return client.couponRedemption.create({
        data: {
          couponId,
          userId,
          orderId,
        },
      });
    }

    const rec = {
      id: randomUUID(),
      couponId,
      userId,
      orderId,
      createdAt: new Date(),
    };
    fallbackRedemptions.set(orderId, rec);
    return rec;
  }

  async deleteRedemptionByOrderId(orderId, tx = null) {
    const client = tx || prisma;
    if (client.couponRedemption) {
      return client.couponRedemption.deleteMany({
        where: { orderId },
      });
    }

    fallbackRedemptions.delete(orderId);
    return { count: 1 };
  }

  // Memory fallback test helpers
  static seedFallbackCoupon(couponData) {
    const code = couponData.code.toUpperCase();
    fallbackCoupons.set(code, {
      id: couponData.id || randomUUID(),
      code,
      description: couponData.description || null,
      discountType: couponData.discountType,
      discountValue: couponData.discountValue,
      minOrderValue: couponData.minOrderValue || 0,
      maxDiscount: couponData.maxDiscount || null,
      startsAt: couponData.startsAt || null,
      expiresAt: couponData.expiresAt || null,
      usageLimit: couponData.usageLimit || null,
      perUserLimit: couponData.perUserLimit || 1,
      isActive: couponData.isActive !== false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static clearFallback() {
    fallbackCoupons.clear();
    fallbackRedemptions.clear();
  }
}
