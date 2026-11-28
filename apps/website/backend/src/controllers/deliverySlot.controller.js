import { DeliverySlotService } from "../services/deliverySlot.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const deliverySlotService = new DeliverySlotService();

export const getDeliverySlots = asyncHandler(async (req, res) => {
  const days = req.validated?.query?.days ?? 2;
  const slots = await deliverySlotService.getDeliverySlots({ days });

  res.json({
    success: true,
    data: slots,
  });
});
