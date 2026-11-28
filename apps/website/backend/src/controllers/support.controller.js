import { SupportService } from "../services/support.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const supportService = new SupportService();

export const createSupportMessage = asyncHandler(async (req, res) => {
  const data = await supportService.submitSupportMessage(req.validated.body);

  res.status(201).json({
    success: true,
    data,
  });
});
