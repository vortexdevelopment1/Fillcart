import { FaqService } from "../services/faq.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const faqService = new FaqService();

export const getFaqs = asyncHandler(async (req, res) => {
  const query = req.validated?.query || {};
  const data = faqService.getFaqs(query);

  res.status(200).json({
    success: true,
    data,
  });
});
