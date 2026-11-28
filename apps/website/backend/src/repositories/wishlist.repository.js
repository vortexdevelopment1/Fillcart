import { randomUUID } from "node:crypto";
import { prisma } from "../db/prisma.js";

const fallbackWishlist = new Map();

export class WishlistRepository {
  async findProduct(identifier) {
    return prisma.product.findFirst({
      where: {
        isActive: true,
        OR: [{ id: identifier }, { slug: identifier }],
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        store: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  async getItems(userId) {
    if (prisma.wishlistItem) {
      return prisma.wishlistItem.findMany({
        where: { userId },
        include: {
          product: {
            include: {
              category: { select: { id: true, name: true, slug: true } },
              store: { select: { id: true, name: true, slug: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return Array.from(fallbackWishlist.values()).filter((item) => item.userId === userId);
  }

  async addItem(userId, productId) {
    if (prisma.wishlistItem) {
      return prisma.wishlistItem.upsert({
        where: { userId_productId: { userId, productId } },
        update: {},
        create: { userId, productId },
        include: {
          product: {
            include: {
              category: { select: { id: true, name: true, slug: true } },
              store: { select: { id: true, name: true, slug: true } },
            },
          },
        },
      });
    }

    const key = `${userId}_${productId}`;
    if (!fallbackWishlist.has(key)) {
      fallbackWishlist.set(key, { id: randomUUID(), userId, productId, createdAt: new Date() });
    }
    return fallbackWishlist.get(key);
  }

  async removeItem(userId, productId) {
    if (prisma.wishlistItem) {
      return prisma.wishlistItem.deleteMany({
        where: { userId, productId },
      });
    }

    const key = `${userId}_${productId}`;
    const existed = fallbackWishlist.delete(key);
    return { count: existed ? 1 : 0 };
  }
}
