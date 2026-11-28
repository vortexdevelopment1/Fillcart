import { PartnerService } from "../services/partner.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const partnerService = new PartnerService();

export const createVendorApplication = asyncHandler(async (req, res) => {
  const data = await partnerService.submitVendorApplication(req.validated.body);

  res.status(201).json({
    success: true,
    data,
  });
});

export const createRiderApplication = asyncHandler(async (req, res) => {
  const data = await partnerService.submitRiderApplication(req.validated.body);

  res.status(201).json({
    success: true,
    data,
  });
});
