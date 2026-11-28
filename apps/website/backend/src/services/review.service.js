import { ReviewRepository } from "../repositories/review.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { serialize } from "../utils/serialize.js";

export class ReviewService {
  constructor() {
    this.reviewRepo = new ReviewRepository();
  }

  async getProductReviews(slugOrId, { page = 1, limit = 10, sort = "recent" }) {
    const product = await this.reviewRepo.findProduct(slugOrId);
    if (!product) {
      throw new ApiError(404, "Product not found", "NOT_FOUND");
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [{ reviews, total }, summary] = await Promise.all([
      this.reviewRepo.findProductReviews(product.id, { sort, skip, take: limitNum }),
      this.reviewRepo.getRatingSummary(product.id),
    ]);

    return {
      items: serialize(reviews),
      summary,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  }

  async createReview(slugOrId, userId, data) {
    const product = await this.reviewRepo.findProduct(slugOrId);
    if (!product) {
      throw new ApiError(404, "Product not found", "NOT_FOUND");
    }

    // 1. One review per user per product check
    const existing = await this.reviewRepo.findReviewByUserAndProduct(product.id, userId);
    if (existing) {
      throw new ApiError(
        409,
        "You have already reviewed this product. You can update your existing review.",
        "REVIEW_EXISTS"
      );
    }

    // 2. Check if verified purchase (delivered order)
    const isVerifiedPurchase = await this.reviewRepo.checkVerifiedPurchase(product.id, userId);

    // 3. Resolve reviewer display name (body > customer_profiles.fullName > 'Fillcart Customer')
    let displayName = data.displayName?.trim();
    if (!displayName) {
      const profileName = await this.reviewRepo.getUserFullName(userId);
      displayName = profileName || "Fillcart Customer";
    }

    const created = await this.reviewRepo.createReview({
      productId: product.id,
      userId,
      displayName,
      rating: parseInt(data.rating, 10),
      title: data.title ? data.title.trim() : null,
      comment: data.comment.trim(),
      isVerifiedPurchase,
    });

    return serialize(created);
  }

  async updateMyReview(slugOrId, userId, data) {
    const product = await this.reviewRepo.findProduct(slugOrId);
    if (!product) {
      throw new ApiError(404, "Product not found", "NOT_FOUND");
    }

    const existing = await this.reviewRepo.findReviewByUserAndProduct(product.id, userId);
    if (!existing) {
      throw new ApiError(404, "Review not found", "NOT_FOUND");
    }

    const updatePayload = {};
    if (data.rating !== undefined) updatePayload.rating = parseInt(data.rating, 10);
    if (data.title !== undefined) updatePayload.title = data.title ? data.title.trim() : null;
    if (data.comment !== undefined) updatePayload.comment = data.comment.trim();
    if (data.displayName !== undefined) updatePayload.displayName = data.displayName.trim();

    const updated = await this.reviewRepo.updateReview(existing.id, updatePayload);
    return serialize(updated);
  }

  async deleteMyReview(slugOrId, userId) {
    const product = await this.reviewRepo.findProduct(slugOrId);
    if (!product) {
      throw new ApiError(404, "Product not found", "NOT_FOUND");
    }

    const existing = await this.reviewRepo.findReviewByUserAndProduct(product.id, userId);
    if (!existing) {
      throw new ApiError(404, "Review not found", "NOT_FOUND");
    }

    await this.reviewRepo.deleteReview(existing.id);
    return { message: "Review deleted successfully" };
  }
}
