import { axiosInstance } from './api/axiosInstance';
import { API_PATHS } from './api/apiPaths';

export interface AuditLogEntry {
  id: string;
  userId: string | null;
  action: string;
  details: {
    status: 'SUCCESS' | 'FAILURE';
    error?: string;
    payload?: any;
    [key: string]: any;
  } | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user: {
    id: string;
    email: string;
    username: string;
  } | null;
}

export interface PaginatedAuditLogs {
  data: AuditLogEntry[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetAuditLogsParams {
  page?: number;
  limit?: number;
  action?: string;
  status?: string;
  userId?: string;
}

export const auditLogService = {
  async getAuditLogs(params: GetAuditLogsParams): Promise<PaginatedAuditLogs> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.action) query.append('action', params.action);
    if (params.status) query.append('status', params.status);
    if (params.userId) query.append('userId', params.userId);

    const response = await axiosInstance.get<PaginatedAuditLogs>(
      `${API_PATHS.AUDIT.GET_LOGS}?${query.toString()}`
    );

    return response.data;
  },
};
