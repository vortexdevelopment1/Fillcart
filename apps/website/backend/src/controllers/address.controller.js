import { AddressService } from "../services/address.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addressService = new AddressService();

export const getAddresses = asyncHandler(async (req, res) => {
  const data = await addressService.getAddresses(req.user.id);
  res.status(200).json({ success: true, data });
});

export const createAddress = asyncHandler(async (req, res) => {
  const data = await addressService.createAddress(req.user.id, req.validated.body);
  res.status(201).json({ success: true, data });
});

export const updateAddress = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const data = await addressService.updateAddress(id, req.user.id, req.validated.body);
  res.status(200).json({ success: true, data });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const data = await addressService.deleteAddress(id, req.user.id);
  res.status(200).json({ success: true, data });
});

export const setDefaultAddress = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const data = await addressService.setDefault(id, req.user.id);
  res.status(200).json({ success: true, data });
});
