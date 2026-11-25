import type { Response, NextFunction } from "express";
import type { AdminAuthRequest } from "../../middleware/admin-auth.middleware.js";
import type { DashboardService } from "../services/dashboard.service.js";

export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  public getSummary = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const period = (req.query.period as string) || "30d";
      const summary = await this.dashboardService.getSummary(period);
      res.status(200).json({ success: true, data: summary });
    } catch (err) {
      next(err);
    }
  };
}
