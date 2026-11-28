import { OrderService } from "../services/order.service.js";

const orderService = new OrderService();

export async function createOrder(req, res, next) {
  try {
    const order = await orderService.createOrder(req.user.id, req.body);
    return res.status(201).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
}

export async function getOrders(req, res, next) {
  try {
    const result = await orderService.getOrders(req.user.id, req.query);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

export async function getOrderById(req, res, next) {
  try {
    const order = await orderService.getOrderById(req.user.id, req.params.orderId);
    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
}

export async function cancelOrder(req, res, next) {
  try {
    const order = await orderService.cancelOrder(
      req.user.id,
      req.params.orderId,
      req.body?.reason
    );
    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
}

export async function reorder(req, res, next) {
  try {
    const result = await orderService.reorder(req.user.id, req.params.orderId);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

export async function trackOrder(req, res, next) {
  try {
    const tracking = await orderService.trackOrder(req.user.id, req.params.orderId);
    return res.status(200).json({
      success: true,
      data: tracking,
    });
  } catch (err) {
    next(err);
  }
}
