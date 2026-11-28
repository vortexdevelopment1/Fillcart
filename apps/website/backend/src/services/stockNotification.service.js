import { StockNotificationRepository } from "../repositories/stockNotification.repository.js";
import { ApiError } from "../utils/ApiError.js";

export class StockNotificationService {
  constructor() {
    this.stockRepo = new StockNotificationRepository();
  }

  async subscribeToRestock({ slugOrId, userId, email, phone }) {
    const product = await this.stockRepo.findProductBySlugOrId(slugOrId);

    if (!product) {
      throw new ApiError(404, "Product not found", "PRODUCT_NOT_FOUND");
    }

    // Check if product is in stock
    const isInStock = product.inStock === true && product.countInStock > 0;
    if (isInStock) {
      throw new ApiError(409, "Product is currently in stock", "PRODUCT_IN_STOCK");
    }

    const cleanEmail = email?.trim() || null;
    const cleanPhone = phone?.trim() || null;

    // Contact requirement check for unauthenticated callers
    if (!userId && !cleanEmail && !cleanPhone) {
      throw new ApiError(
        400,
        "Email or phone number is required to subscribe for restock notifications",
        "NOTIFICATION_CONTACT_REQUIRED"
      );
    }

    // Check for existing pending subscription (idempotent duplicate prevention)
    const existing = await this.stockRepo.findPendingNotification({
      productId: product.id,
      userId,
      email: cleanEmail,
      phone: cleanPhone,
    });

    if (existing) {
      return {
        isDuplicate: true,
        notification: existing,
      };
    }

    const notification = await this.stockRepo.createNotification({
      productId: product.id,
      userId,
      email: cleanEmail,
      phone: cleanPhone,
    });

    return {
      isDuplicate: false,
      notification,
    };
  }

  async unsubscribeFromRestock({ slugOrId, userId }) {
    const product = await this.stockRepo.findProductBySlugOrId(slugOrId);

    if (!product) {
      throw new ApiError(404, "Product not found", "PRODUCT_NOT_FOUND");
    }

    const deleted = await this.stockRepo.deleteUserNotification({
      productId: product.id,
      userId,
    });

    if (!deleted) {
      throw new ApiError(
        404,
        "No active restock notification subscription found for this product",
        "NOTIFICATION_NOT_FOUND"
      );
    }

    return deleted;
  }
}
