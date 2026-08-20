import { API } from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/api/error";
import type {
  GetReportIssuesParams,
  GetReportIssuesResponse,
  ReportIssue,
  ReportIssuesListResult,
  ReportIssueStatus,
} from "./report-issues.types";

function buildReportIssueParams({
  page,
  limit,
  search,
  status,
}: GetReportIssuesParams = {}) {
  const params: Record<string, string | number> = {};
  if (page != null) params.page = page;
  if (limit != null) params.limit = limit;
  if (search?.trim()) params.search = search.trim();
  if (status?.trim()) params.status = status.trim();
  return params;
}

export const reportIssuesApi = {
  getReportIssues: async (
    params: GetReportIssuesParams = {}
  ): Promise<ReportIssuesListResult> => {
    try {
      const { data } = await API.get("/report-issue", {
        params: buildReportIssueParams(params),
      });

      const payload = (data?.data ?? data) as GetReportIssuesResponse;
      const rows = payload.issues ?? [];
      const pagination = payload.pagination;

      const limit = pagination?.itemsPerPage ?? payload?.limit ?? params.limit ?? 10;
      const total =
        pagination?.totalItems ??
        payload?.totalCount ??
        payload?.total ??
        rows.length;
      
      const totalPages =
        pagination?.totalPages ??
        payload?.totalPages ??
        Math.max(1, Math.ceil(total / limit));

      return {
        rows,
        page: pagination?.currentPage ?? payload?.page ?? params.page ?? 1,
        limit,
        total,
        totalPages,
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  getReportIssueById: async (id: string): Promise<ReportIssue> => {
    try {
      const { data } = await API.get(`/report-issue/${id}`);
      return (data?.data ?? data) as ReportIssue;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  updateReportIssueStatus: async (
    id: string,
    status: ReportIssueStatus
  ): Promise<ReportIssue> => {
    try {
      const { data } = await API.patch(`/report-issue/${id}`, { status });
      return (data?.data ?? data) as ReportIssue;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};

export function normalizeReportIssueTab(tab: string | null): ReportIssueStatus {
  const normalized = tab?.trim().toLowerCase();
  if (normalized === "in_progress") return "in_progress";
  if (normalized === "resolved") return "resolved";
  return "pending"; // default
}
