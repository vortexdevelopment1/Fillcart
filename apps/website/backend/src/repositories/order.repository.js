import { randomUUID } from "node:crypto";
import { prisma } from "../db/prisma.js";

// In-memory fallback stores when migration has not yet generated models
const fallbackOrders = new Map();
const fallbackOrderItems = new Map();
const fallbackStatusEvents = new Map();

export class OrderRepository {
  async executeTransaction(fn) {
    if (prisma.$transaction) {
      return prisma.$transaction(fn);
    }
    return fn(null);
  }

  async findProduct(identifier, tx = null) {
    const client = tx || prisma;
    return client.product.findFirst({
      where: {
        isActive: true,
        OR: [{ id: identifier }, { slug: identifier }],
      },
      include: {
        store: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  async findAddress(addressId, userId, tx = null) {
    const client = tx || prisma;
    if (client.address) {
      return client.address.findFirst({
        where: { id: addressId, userId },
      });
    }

    // In-memory fallback address check
    return null;
  }

  async createOrder({ orderData, itemsData, eventData, redemptionData }, tx = null) {
    const client = tx || prisma;

    if (client.order) {
      const order = await client.order.create({
        data: {
          ...orderData,
          items: {
            create: itemsData,
          },
          statusEvents: {
            create: [eventData],
          },
        },
        include: {
          items: true,
          statusEvents: true,
          store: { select: { id: true, name: true, slug: true } },
        },
      });

      if (redemptionData && client.couponRedemption) {
        await client.couponRedemption.create({
          data: {
            couponId: redemptionData.couponId,
            userId: redemptionData.userId,
            orderId: order.id,
          },
        });
      }

      return order;
    }

    // In-memory fallback
    const orderId = orderData.id || randomUUID();
    const createdOrder = {
      ...orderData,
      id: orderId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    fallbackOrders.set(orderId, createdOrder);

    const createdItems = itemsData.map((item) => {
      const itemId = randomUUID();
      const rec = { ...item, id: itemId, orderId };
      fallbackOrderItems.set(itemId, rec);
      return rec;
    });

    const createdEvent = {
      ...eventData,
      id: randomUUID(),
      orderId,
      createdAt: new Date(),
    };
    fallbackStatusEvents.set(createdEvent.id, createdEvent);

    return {
      ...createdOrder,
      items: createdItems,
      statusEvents: [createdEvent],
    };
  }

  async decrementProductStock(productId, quantity, tx = null) {
    const client = tx || prisma;
    if (client.product) {
      const product = await client.product.findUnique({
        where: { id: productId },
        select: { countInStock: true },
      });
      if (product) {
        const newStock = Math.max(0, product.countInStock - quantity);
        return client.product.update({
          where: { id: productId },
          data: {
            countInStock: newStock,
            inStock: newStock > 0,
          },
        });
      }
    }
  }

  async incrementProductStock(productId, quantity, tx = null) {
    const client = tx || prisma;
    if (client.product) {
      const product = await client.product.findUnique({
        where: { id: productId },
        select: { countInStock: true },
      });
      if (product) {
        const newStock = product.countInStock + quantity;
        return client.product.update({
          where: { id: productId },
          data: {
            countInStock: newStock,
            inStock: true,
          },
        });
      }
    }
  }

  async findUserOrders(userId, { status, skip = 0, take = 10 }) {
    if (prisma.order) {
      const where = { userId };
      if (status) {
        where.status = status;
      }

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          include: {
            items: true,
            statusEvents: {
              orderBy: { createdAt: "asc" },
            },
            store: { select: { id: true, name: true, slug: true } },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take,
        }),
        prisma.order.count({ where }),
      ]);

      return { orders, total };
    }

    // In-memory fallback
    let list = Array.from(fallbackOrders.values()).filter((o) => o.userId === userId);
    if (status) {
      list = list.filter((o) => o.status === status);
    }
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const total = list.length;
    const paginated = list.slice(skip, skip + take).map((order) => {
      const items = Array.from(fallbackOrderItems.values()).filter((i) => i.orderId === order.id);
      const statusEvents = Array.from(fallbackStatusEvents.values())
        .filter((e) => e.orderId === order.id)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      return { ...order, items, statusEvents };
    });

    return { orders: paginated, total };
  }

  async findUserOrderByIdOrNumber(orderIdOrNumber, userId) {
    if (prisma.order) {
      return prisma.order.findFirst({
        where: {
          userId,
          OR: [{ id: orderIdOrNumber }, { orderNumber: orderIdOrNumber }],
        },
        include: {
          items: true,
          statusEvents: {
            orderBy: { createdAt: "asc" },
          },
          store: { select: { id: true, name: true, slug: true } },
        },
      });
    }

    // In-memory fallback
    for (const order of fallbackOrders.values()) {
      if (
        (order.id === orderIdOrNumber || order.orderNumber === orderIdOrNumber) &&
        order.userId === userId
      ) {
        const items = Array.from(fallbackOrderItems.values()).filter((i) => i.orderId === order.id);
        const statusEvents = Array.from(fallbackStatusEvents.values())
          .filter((e) => e.orderId === order.id)
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        return { ...order, items, statusEvents };
      }
    }
    return null;
  }

  async updateOrderStatus(orderId, { status, cancelReason = null, cancelledAt = null, note = null }, tx = null) {
    const client = tx || prisma;
    const eventNote = note || `Order status updated to ${status}`;

    if (client.order) {
      const updated = await client.order.update({
        where: { id: orderId },
        data: {
          status,
          cancelReason,
          cancelledAt,
          statusEvents: {
            create: {
              status,
              note: eventNote,
            },
          },
        },
        include: {
          items: true,
          statusEvents: {
            orderBy: { createdAt: "asc" },
          },
          store: { select: { id: true, name: true, slug: true } },
        },
      });
      return updated;
    }

    // In-memory fallback
    const order = fallbackOrders.get(orderId);
    if (order) {
      order.status = status;
      if (cancelReason) order.cancelReason = cancelReason;
      if (cancelledAt) order.cancelledAt = cancelledAt;
      order.updatedAt = new Date();

      const newEvent = {
        id: randomUUID(),
        orderId,
        status,
        note: eventNote,
        createdAt: new Date(),
      };
      fallbackStatusEvents.set(newEvent.id, newEvent);

      const items = Array.from(fallbackOrderItems.values()).filter((i) => i.orderId === order.id);
      const statusEvents = Array.from(fallbackStatusEvents.values())
        .filter((e) => e.orderId === order.id)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      return { ...order, items, statusEvents };
    }
    return null;
  }

  static clearFallback() {
    fallbackOrders.clear();
    fallbackOrderItems.clear();
    fallbackStatusEvents.clear();
  }
}
