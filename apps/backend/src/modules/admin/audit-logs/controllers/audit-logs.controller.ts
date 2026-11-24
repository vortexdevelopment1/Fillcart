import type { Response, NextFunction } from "express";
import type { AdminAuthRequest } from "../../middleware/admin-auth.middleware.js";
import type { AuditLogsService } from "../services/audit-logs.service.js";
import type { GetAuditLogsQuery } from "@fillcart/validations";

export class AuditLogsController {
  constructor(private auditLogsService: AuditLogsService) {}

  public getAuditLogs = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const query = req.query as unknown as GetAuditLogsQuery;
      const result = await this.auditLogsService.getAuditLogs(query);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
