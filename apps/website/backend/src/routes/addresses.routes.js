import { Router } from "express";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/address.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { validate } from "../middlewares/validate.js";
import {
  createAddressSchema,
  updateAddressSchema,
  addressIdParamSchema,
} from "../validators/address.validator.js";

export const addressRouter = Router();

// All address endpoints require customer authentication
addressRouter.use(requireAuth);

addressRouter.get("/", getAddresses);
addressRouter.post("/", validate(createAddressSchema), createAddress);
addressRouter.patch("/:id", validate(updateAddressSchema), updateAddress);
addressRouter.delete("/:id", validate(addressIdParamSchema), deleteAddress);
addressRouter.patch("/:id/default", validate(addressIdParamSchema), setDefaultAddress);
