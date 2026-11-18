import { ApiResponse, mockDelay } from './apiClient';
import { initialAuditLogs, AuditLogEntry } from '../data/auditData';

export const auditService = {
  // GET /audit-logs
  getAuditLogs: async (category = 'Admin Audit'): Promise<ApiResponse<AuditLogEntry[]>> => {
    await mockDelay(300);
    return {
      success: true,
      data: initialAuditLogs,
    };
  },
};
