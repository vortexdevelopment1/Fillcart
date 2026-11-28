import { OfferService } from "../services/offer.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const offerService = new OfferService();

export const getOffers = asyncHandler(async (req, res) => {
  const offers = await offerService.getOffers({
    type: req.validated?.query?.type,
  });

  res.json({
    success: true,
    data: offers,
  });
});
