import { randomUUID } from "node:crypto";
import { prisma } from "../db/prisma.js";

// In-memory fallback stores when migration has not yet generated models
const fallbackCarts = new Map();
const fallbackCartItems = new Map();

export class CartRepository {
  async findProduct(identifier) {
    return prisma.product.findFirst({
      where: {
        isActive: true,
        OR: [{ id: identifier }, { slug: identifier }],
      },
      include: {
        store: { select: { id: true, name: true, slug: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  async getOrCreateCart(userId) {
    if (prisma.cart) {
      let cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  store: { select: { id: true, name: true, slug: true } },
                },
              },
            },
            orderBy: { createdAt: "asc" },
          },
        },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId },
          include: {
            items: {
              include: {
                product: {
                  include: {
                    store: { select: { id: true, name: true, slug: true } },
                  },
                },
              },
            },
          },
        });
      }

      return cart;
    }

    // In-memory fallback
    if (!fallbackCarts.has(userId)) {
      fallbackCarts.set(userId, { id: randomUUID(), userId, createdAt: new Date(), updatedAt: new Date() });
    }
    const cart = fallbackCarts.get(userId);
    const rawItems = Array.from(fallbackCartItems.values()).filter((item) => item.cartId === cart.id);
    const items = await Promise.all(
      rawItems.map(async (item) => {
        const product = await this.findProduct(item.productId);
        return { ...item, product };
      })
    );
    return { ...cart, items };
  }

  async addItem(cartId, productId, quantity) {
    if (prisma.cartItem) {
      return prisma.cartItem.upsert({
        where: { cartId_productId: { cartId, productId } },
        update: {
          quantity: { increment: quantity },
        },
        create: {
          cartId,
          productId,
          quantity,
        },
        include: {
          product: {
            include: {
              store: { select: { id: true, name: true, slug: true } },
            },
          },
        },
      });
    }

    // In-memory fallback
    const key = `${cartId}_${productId}`;
    let item = fallbackCartItems.get(key);
    if (item) {
      item.quantity = Math.min(20, item.quantity + quantity);
    } else {
      item = {
        id: randomUUID(),
        cartId,
        productId,
        quantity: Math.min(20, quantity),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      fallbackCartItems.set(key, item);
    }
    return item;
  }

  async updateItemQuantity(itemId, cartId, quantity) {
    if (prisma.cartItem) {
      if (quantity === 0) {
        await prisma.cartItem.deleteMany({
          where: { id: itemId, cartId },
        });
        return null;
      }

      return prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
        include: {
          product: {
            include: {
              store: { select: { id: true, name: true, slug: true } },
            },
          },
        },
      });
    }

    // In-memory fallback
    for (const [key, item] of fallbackCartItems.entries()) {
      if (item.id === itemId && item.cartId === cartId) {
        if (quantity === 0) {
          fallbackCartItems.delete(key);
          return null;
        }
        item.quantity = quantity;
        return item;
      }
    }
    return null;
  }

  async removeItem(itemId, cartId) {
    if (prisma.cartItem) {
      return prisma.cartItem.deleteMany({
        where: { id: itemId, cartId },
      });
    }

    // In-memory fallback
    for (const [key, item] of fallbackCartItems.entries()) {
      if (item.id === itemId && item.cartId === cartId) {
        fallbackCartItems.delete(key);
        return { count: 1 };
      }
    }
    return { count: 0 };
  }

  async clearCart(cartId) {
    if (prisma.cartItem) {
      return prisma.cartItem.deleteMany({
        where: { cartId },
      });
    }

    // In-memory fallback
    for (const [key, item] of fallbackCartItems.entries()) {
      if (item.cartId === cartId) {
        fallbackCartItems.delete(key);
      }
    }
    return { count: 1 };
  }
}
