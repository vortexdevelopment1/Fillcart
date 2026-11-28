import { ProfileService } from "../services/profile.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const profileService = new ProfileService();

export const getProfile = asyncHandler(async (req, res) => {
  const data = await profileService.getProfile(req.user.id);
  res.status(200).json({ success: true, data });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const data = await profileService.updateProfile(req.user.id, req.validated.body);
  res.status(200).json({ success: true, data });
});
