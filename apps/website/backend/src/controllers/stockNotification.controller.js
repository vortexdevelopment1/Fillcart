import { StockNotificationService } from "../services/stockNotification.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const stockNotificationService = new StockNotificationService();

export const subscribeToStockNotification = asyncHandler(async (req, res) => {
  const { slugOrId } = req.validated.params;
  const { email, phone } = req.validated.body || {};
  const userId = req.user?.id || null;

  const result = await stockNotificationService.subscribeToRestock({
    slugOrId,
    userId,
    email,
    phone,
  });

  if (result.isDuplicate) {
    return res.status(200).json({
      success: true,
      message: "Already subscribed for restock notifications",
      data: result.notification,
    });
  }

  return res.status(201).json({
    success: true,
    message: "Subscribed for restock notifications successfully",
    data: result.notification,
  });
});

export const unsubscribeFromStockNotification = asyncHandler(async (req, res) => {
  const { slugOrId } = req.validated.params;
  const userId = req.user.id;

  await stockNotificationService.unsubscribeFromRestock({
    slugOrId,
    userId,
  });

  res.json({
    success: true,
    message: "Restock notification subscription removed successfully",
  });
});
