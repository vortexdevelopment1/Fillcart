import { HomeService } from "../services/home.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const homeService = new HomeService();

export const getHome = asyncHandler(async (_req, res) => {
  const data = await homeService.getHomeData();
  res.json({
    success: true,
    data,
  });
});
