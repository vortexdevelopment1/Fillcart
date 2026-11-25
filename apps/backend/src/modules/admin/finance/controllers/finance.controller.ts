import type { Response, NextFunction } from "express";
import type { AdminAuthRequest } from "../../middleware/admin-auth.middleware.js";
import type { FinanceService } from "../services/finance.service.js";
import type {
  CreateCommissionRuleRequest,
  CreateCouponRequest,
} from "@fillcart/validations";

export class FinanceController {
  constructor(private financeService: FinanceService) {}

  public getOverview = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const period = (req.query.period as string) || "30d";
      const result = await this.financeService.getOverview(period);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public getSettlements = async (
    _req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.financeService.getSettlements();
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public processSettlement = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const adminUserId = req.adminUser?.id || "system";
      const result = await this.financeService.processSettlement(id, adminUserId);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public getCommissions = async (
    _req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.financeService.getCommissions();
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public createCommissionRule = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const payload = req.body as CreateCommissionRuleRequest;
      const result = await this.financeService.createCommissionRule(payload);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };

  public getCoupons = async (
    _req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.financeService.getCoupons();
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public createCoupon = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const payload = req.body as CreateCouponRequest;
      const result = await this.financeService.createCoupon(payload);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };

  public getTaxes = async (
    _req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.financeService.getTaxes();
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
