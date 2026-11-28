import { ReviewService } from "../services/review.service.js";

const reviewService = new ReviewService();

export async function getProductReviews(req, res, next) {
  try {
    const result = await reviewService.getProductReviews(
      req.params.slugOrId,
      req.query
    );
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

export async function createReview(req, res, next) {
  try {
    const review = await reviewService.createReview(
      req.params.slugOrId,
      req.user.id,
      req.body
    );
    return res.status(201).json({
      success: true,
      data: review,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateMyReview(req, res, next) {
  try {
    const review = await reviewService.updateMyReview(
      req.params.slugOrId,
      req.user.id,
      req.body
    );
    return res.status(200).json({
      success: true,
      data: review,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteMyReview(req, res, next) {
  try {
    const result = await reviewService.deleteMyReview(
      req.params.slugOrId,
      req.user.id
    );
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}
