import { WishlistRepository } from "../repositories/wishlist.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { formatProduct, serialize } from "../utils/serialize.js";

export class WishlistService {
  constructor() {
    this.wishlistRepo = new WishlistRepository();
  }

  async getWishlist(userId) {
    const rawItems = await this.wishlistRepo.getItems(userId);
    return rawItems.map((item) => {
      const s = serialize(item);
      return {
        id: s.id,
        userId: s.userId,
        productId: s.productId,
        product: formatProduct(s.product),
        createdAt: s.createdAt,
      };
    });
  }

  async addItem(userId, { productId, slug }) {
    const identifier = productId || slug;
    const product = await this.wishlistRepo.findProduct(identifier);
    if (!product) {
      throw new ApiError(404, "Product not found", "NOT_FOUND");
    }

    const item = await this.wishlistRepo.addItem(userId, product.id);
    const s = serialize(item);
    return {
      id: s.id,
      userId: s.userId,
      productId: s.productId,
      product: formatProduct(s.product || product),
      createdAt: s.createdAt,
    };
  }

  async removeItem(userId, identifier) {
    let resolvedProductId = identifier;
    const product = await this.wishlistRepo.findProduct(identifier);
    if (product) {
      resolvedProductId = product.id;
    }

    await this.wishlistRepo.removeItem(userId, resolvedProductId);
    return { message: "Product removed from wishlist" };
  }
}
