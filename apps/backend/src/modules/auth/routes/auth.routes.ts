import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validateRequest } from "../../../middleware/validate-request.js";
import {
  registerRequestSchema,
  loginRequestSchema,
  sendOtpRequestSchema,
  verifyOtpRequestSchema,
} from "@fillcart/validations";

export function createAuthRouter(controller: AuthController): Router {
  const router = Router();

  // 1. Public Authentication Endpoints
  router.post("/register", validateRequest({ body: registerRequestSchema }), controller.register);
  router.post("/login", validateRequest({ body: loginRequestSchema }), controller.login);
  router.post("/refresh", controller.refresh);
  router.post("/logout", controller.logout);

  // 2. OTP Endpoints (MSG91-backed)
  router.post("/otp/send", validateRequest({ body: sendOtpRequestSchema }), controller.sendOtp);
  router.post("/otp/verify", validateRequest({ body: verifyOtpRequestSchema }), controller.verifyOtp);

  return router;
}
