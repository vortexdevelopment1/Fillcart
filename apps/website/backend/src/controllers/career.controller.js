import { CareerService } from "../services/career.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const careerService = new CareerService();

export const getCareerOpenings = asyncHandler(async (req, res) => {
  const query = req.validated?.query || {};
  const data = careerService.getOpenings(query);

  res.status(200).json({
    success: true,
    data,
  });
});

export const createCareerApplication = asyncHandler(async (req, res) => {
  const data = await careerService.submitApplication(req.validated.body);

  res.status(201).json({
    success: true,
    data,
  });
});
