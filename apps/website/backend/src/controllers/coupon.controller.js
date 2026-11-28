import { CouponService } from "../services/coupon.service.js";

const couponService = new CouponService();

export async function applyCoupon(req, res, next) {
  try {
    const cart = await couponService.applyCoupon(req.user.id, req.body.code);
    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (err) {
    next(err);
  }
}

export async function removeCoupon(req, res, next) {
  try {
    const cart = await couponService.removeCoupon(req.user.id);
    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (err) {
    next(err);
  }
}
