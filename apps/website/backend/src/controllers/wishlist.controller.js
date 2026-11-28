import { WishlistService } from "../services/wishlist.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const wishlistService = new WishlistService();

export const getWishlist = asyncHandler(async (req, res) => {
  const data = await wishlistService.getWishlist(req.user.id);
  res.status(200).json({ success: true, data });
});

export const addWishlistItem = asyncHandler(async (req, res) => {
  const data = await wishlistService.addItem(req.user.id, req.validated.body);
  res.status(201).json({ success: true, data });
});

export const removeWishlistItem = asyncHandler(async (req, res) => {
  const { productId } = req.validated.params;
  const data = await wishlistService.removeItem(req.user.id, productId);
  res.status(200).json({ success: true, data });
});
