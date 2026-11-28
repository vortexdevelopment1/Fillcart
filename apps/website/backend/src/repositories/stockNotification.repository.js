import { prisma } from "../db/prisma.js";

export class StockNotificationRepository {
  async findProductBySlugOrId(slugOrId) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);

    return prisma.product.findFirst({
      where: isUuid
        ? { OR: [{ id: slugOrId }, { slug: slugOrId }] }
        : { slug: slugOrId },
    });
  }

  async findPendingNotification({ productId, userId, email, phone }) {
    const conditions = [];

    if (userId) {
      conditions.push({ userId });
    }
    if (email) {
      conditions.push({ email });
    }
    if (phone) {
      conditions.push({ phone });
    }

    if (conditions.length === 0) {
      return null;
    }

    return prisma.stockNotification.findFirst({
      where: {
        productId,
        status: "PENDING",
        OR: conditions,
      },
    });
  }

  async createNotification({ productId, userId, email, phone }) {
    return prisma.stockNotification.create({
      data: {
        productId,
        userId: userId || null,
        email: email || null,
        phone: phone || null,
        status: "PENDING",
      },
    });
  }

  async deleteUserNotification({ productId, userId }) {
    const existing = await prisma.stockNotification.findFirst({
      where: {
        productId,
        userId,
        status: "PENDING",
      },
    });

    if (!existing) {
      return null;
    }

    return prisma.stockNotification.delete({
      where: { id: existing.id },
    });
  }
}
