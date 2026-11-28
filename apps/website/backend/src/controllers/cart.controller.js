import { CartService } from "../services/cart.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const cartService = new CartService();

export const getCart = asyncHandler(async (req, res) => {
  const data = await cartService.getCart(req.user.id);
  res.status(200).json({ success: true, data });
});

export const addCartItem = asyncHandler(async (req, res) => {
  const data = await cartService.addItem(req.user.id, req.validated.body);
  res.status(200).json({ success: true, data });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.validated.params;
  const { quantity } = req.validated.body;
  const data = await cartService.updateItem(req.user.id, itemId, quantity);
  res.status(200).json({ success: true, data });
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.validated.params;
  const data = await cartService.removeItem(req.user.id, itemId);
  res.status(200).json({ success: true, data });
});

export const clearCart = asyncHandler(async (req, res) => {
  const data = await cartService.clearCart(req.user.id);
  res.status(200).json({ success: true, data });
});

export const mergeCart = asyncHandler(async (req, res) => {
  const { items } = req.validated.body;
  const data = await cartService.mergeCart(req.user.id, items);
  res.status(200).json({ success: true, data });
});
