import type { Response, NextFunction } from "express";
import type { AdminAuthRequest } from "../../middleware/admin-auth.middleware.js";
import type { ReportsService } from "../services/reports.service.js";

export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  public getSalesReports = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const period = (req.query.period as string) || "30d";
      const result = await this.reportsService.getSalesReports(period);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public getVendorReports = async (
    _req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.reportsService.getVendorReports();
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public getRiderReports = async (
    _req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.reportsService.getRiderReports();
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
