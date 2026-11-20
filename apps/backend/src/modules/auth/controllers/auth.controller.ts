import type { Request, Response, NextFunction } from "express";
import { CryptoService } from "../services/crypto.service.js";
import { IdentityService } from "../services/identity.service.js";
import { SessionService } from "../services/session.service.js";
import { OtpService } from "../services/otp.service.js";
import { LiveVerificationService } from "../services/live-verification.service.js";
import { AccountLinkingService } from "../services/account-linking.service.js";
import type {
  RegisterRequest,
  LoginRequest,
  RefreshRequest,
  VerifySessionRequest,
  SendOtpRequest,
  VerifyOtpRequest,
} from "@fillcart/validations";

export class AuthController {
  constructor(
    private cryptoService: CryptoService,
    private identityService: IdentityService,
    private sessionService: SessionService,
    private otpService: OtpService,
    private liveVerificationService: LiveVerificationService,
    private accountLinkingService: AccountLinkingService
  ) {}

  public getJwks = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const jwks = this.cryptoService.getJwks();
      res.status(200).json(jwks);
    } catch (err) {
      next(err);
    }
  };

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req.body as RegisterRequest;
      const clientInfo = {
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
      };

      const result = await this.identityService.register(data, clientInfo);

      // Set production-hardened refresh token cookie
      res.cookie("__Host-fillcart-rt", result.tokens.refreshToken, {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({
        userId: result.userId,
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
        expiresIn: result.tokens.expiresIn,
      });
    } catch (err) {
      next(err);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req.body as LoginRequest;
      const clientInfo = {
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
      };

      const tokens = await this.identityService.login(data, clientInfo);

      res.cookie("__Host-fillcart-rt", tokens.refreshToken, {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json(tokens);
    } catch (err) {
      next(err);
    }
  };

  public refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as RefreshRequest;
      // Accept refresh token from body or __Host-fillcart-rt cookie
      const token = body?.refreshToken || (req.cookies && req.cookies["__Host-fillcart-rt"]);

      const clientInfo = {
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
      };

      const tokens = await this.sessionService.rotateRefreshToken(token, clientInfo);

      res.cookie("__Host-fillcart-rt", tokens.refreshToken, {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json(tokens);
    } catch (err) {
      next(err);
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.body?.refreshToken || (req.cookies && req.cookies["__Host-fillcart-rt"]);
      if (token) {
        // Revoke session if token present
      }

      res.clearCookie("__Host-fillcart-rt", { path: "/", secure: true, httpOnly: true, sameSite: "lax" });
      res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (err) {
      next(err);
    }
  };

  public verifySession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as VerifySessionRequest;
      const s2sHeader = req.headers["authorization"] as string;

      const result = await this.liveVerificationService.verifyLiveSession({
        serviceAuthorizationHeader: s2sHeader,
        userAccessToken: body.userAccessToken,
        requiredPermission: body.requiredPermission,
      });

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public sendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req.body as SendOtpRequest;
      const result = await this.otpService.generateAndSendOtp(data, {
        ipAddress: req.ip || req.socket.remoteAddress,
      });

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req.body as VerifyOtpRequest;
      const success = await this.otpService.verifyOtp(data);

      res.status(200).json({ success, verified: true });
    } catch (err) {
      next(err);
    }
  };
}
