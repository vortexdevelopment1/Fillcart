import { NewsletterService } from "../services/newsletter.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const newsletterService = new NewsletterService();

export const subscribeNewsletter = asyncHandler(async (req, res) => {
  const data = await newsletterService.subscribe(req.validated.body);

  res.status(201).json({
    success: true,
    data,
  });
});
