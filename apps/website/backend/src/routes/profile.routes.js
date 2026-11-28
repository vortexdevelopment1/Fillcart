import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { validate } from "../middlewares/validate.js";
import { updateProfileSchema } from "../validators/profile.validator.js";

export const profileRouter = Router();

// All profile endpoints require customer authentication
profileRouter.use(requireAuth);

profileRouter.get("/", getProfile);
profileRouter.patch("/", validate(updateProfileSchema), updateProfile);
