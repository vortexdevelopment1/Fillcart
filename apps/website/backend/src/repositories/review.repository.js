import { randomUUID } from "node:crypto";
import { prisma } from "../db/prisma.js";

// In-memory fallback store when migration has not yet generated models
const fallbackReviews = new Map();

export class ReviewRepository {
  async findProduct(slugOrId) {
    if (!slugOrId) return null;
    return prisma.product.findFirst({
      where: {
        isActive: true,
        OR: [{ id: slugOrId }, { slug: slugOrId }],
      },
      select: {
        id: true,
        slug: true,
        name: true,
        price: true,
        primaryImageUrl: true,
      },
    });
  }

  async findReviewByUserAndProduct(productId, userId) {
    if (prisma.productReview) {
      return prisma.productReview.findUnique({
        where: {
          productId_userId: { productId, userId },
        },
      });
    }

    const key = `${productId}_${userId}`;
    return fallbackReviews.get(key) || null;
  }

  async checkVerifiedPurchase(productId, userId) {
    if (prisma.orderItem && prisma.order) {
      const deliveredItem = await prisma.orderItem.findFirst({
        where: {
          productId,
          order: {
            userId,
            status: "DELIVERED",
          },
        },
      });
      return Boolean(deliveredItem);
    }
    return false;
  }

  async getUserFullName(userId) {
    if (prisma.customerProfile) {
      const profile = await prisma.customerProfile.findUnique({
        where: { userId },
        select: { fullName: true },
      });
      return profile?.fullName || null;
    }
    return null;
  }

  async findProductReviews(productId, { sort = "recent", skip = 0, take = 10 }) {
    let orderBy = { createdAt: "desc" };
    if (sort === "rating_desc") {
      orderBy = { rating: "desc" };
    } else if (sort === "rating_asc") {
      orderBy = { rating: "asc" };
    }

    if (prisma.productReview) {
      const [reviews, total] = await Promise.all([
        prisma.productReview.findMany({
          where: { productId },
          orderBy,
          skip,
          take,
        }),
        prisma.productReview.count({
          where: { productId },
        }),
      ]);

      return { reviews, total };
    }

    // In-memory fallback
    const all = Array.from(fallbackReviews.values()).filter((r) => r.productId === productId);
    if (sort === "rating_desc") {
      all.sort((a, b) => b.rating - a.rating);
    } else if (sort === "rating_asc") {
      all.sort((a, b) => a.rating - b.rating);
    } else {
      all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const total = all.length;
    const paginated = all.slice(skip, skip + take);
    return { reviews: paginated, total };
  }

  async getRatingSummary(productId) {
    if (prisma.productReview) {
      const reviews = await prisma.productReview.findMany({
        where: { productId },
        select: { rating: true },
      });

      const count = reviews.length;
      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let sum = 0;

      for (const r of reviews) {
        sum += r.rating;
        if (distribution[r.rating] !== undefined) {
          distribution[r.rating]++;
        }
      }

      const average = count > 0 ? Math.round((sum / count) * 10) / 10 : 0;
      return { average, count, distribution };
    }

    // In-memory fallback
    const reviews = Array.from(fallbackReviews.values()).filter((r) => r.productId === productId);
    const count = reviews.length;
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;

    for (const r of reviews) {
      sum += r.rating;
      if (distribution[r.rating] !== undefined) {
        distribution[r.rating]++;
      }
    }

    const average = count > 0 ? Math.round((sum / count) * 10) / 10 : 0;
    return { average, count, distribution };
  }

  async createReview(data) {
    if (prisma.productReview) {
      return prisma.productReview.create({
        data,
      });
    }

    const key = `${data.productId}_${data.userId}`;
    const created = {
      id: randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    fallbackReviews.set(key, created);
    return created;
  }

  async updateReview(id, data) {
    if (prisma.productReview) {
      return prisma.productReview.update({
        where: { id },
        data,
      });
    }

    for (const [key, rev] of fallbackReviews.entries()) {
      if (rev.id === id) {
        const updated = {
          ...rev,
          ...data,
          updatedAt: new Date(),
        };
        fallbackReviews.set(key, updated);
        return updated;
      }
    }
    return null;
  }

  async deleteReview(id) {
    if (prisma.productReview) {
      return prisma.productReview.delete({
        where: { id },
      });
    }

    for (const [key, rev] of fallbackReviews.entries()) {
      if (rev.id === id) {
        fallbackReviews.delete(key);
        return { count: 1 };
      }
    }
    return { count: 0 };
  }

  static clearFallback() {
    fallbackReviews.clear();
  }
}
