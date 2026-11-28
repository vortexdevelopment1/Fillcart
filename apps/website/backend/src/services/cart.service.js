import { CartRepository } from "../repositories/cart.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { formatProduct, serialize } from "../utils/serialize.js";

export class CartService {
  constructor() {
    this.cartRepo = new CartRepository();
  }

  formatCartResponse(cart) {
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

    return {
      id: rawCart.id,
      userId: rawCart.userId,
      items,
      subtotal: Math.round(subtotal * 100) / 100,
      totalItems,
      createdAt: rawCart.createdAt,
      updatedAt: rawCart.updatedAt,
    };
  }

  async getCart(userId) {
    const cart = await this.cartRepo.getOrCreateCart(userId);
    return this.formatCartResponse(cart);
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
