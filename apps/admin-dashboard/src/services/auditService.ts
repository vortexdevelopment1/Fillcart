import { ApiResponse } from './apiClient';
import { AuditLogEntry, initialAuditLogs } from '../data/auditData';
import { adminApi } from './adminApi';
import { mapBackendAuditLogToFrontend } from './adminMappers';

export const auditService = {
  // GET /api/v1/admin/audit-logs
  getAuditLogs: async (params?: {
    page?: number;
    limit?: number;
    targetType?: string;
    action?: string;
  }): Promise<ApiResponse<AuditLogEntry[]>> => {
    try {
      const res = await adminApi.getAuditLogs({
        page: params?.page || 1,
        limit: params?.limit || 50,
        targetType: params?.targetType,
        action: params?.action,
      });

      if (!res.items || res.items.length === 0) {
        return {
          success: true,
          data: initialAuditLogs,
        };
      }

      const mapped = res.items.map(mapBackendAuditLogToFrontend);
      return {
        success: true,
        data: mapped,
      };
    } catch {
      return {
        success: true,
        data: initialAuditLogs,
      };
    }
  },
};
