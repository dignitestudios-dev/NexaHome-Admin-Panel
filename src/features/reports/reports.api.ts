import { API } from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/api/error";
import type {
  GetReportsUsersParams,
  ReportDateFilters,
  ReportUser,
  ReportsUsersListResponse,
  ReportsUsersListResult,
} from "./reports.types";

function getFilenameFromDisposition(disposition?: string) {
  if (!disposition) return null;

  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1].replace(/['"]/g, ""));
  }

  const filenameMatch = disposition.match(/filename="?([^";]+)"?/i);
  return filenameMatch?.[1] ?? null;
}

function triggerFileDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

function buildReportParams({
  page,
  limit,
  startDate,
  endDate,
}: GetReportsUsersParams = {}) {
  const params: Record<string, string | number> = {};
  if (page != null) params.page = page;
  if (limit != null) params.limit = limit;
  if (startDate?.trim()) params.startDate = startDate.trim();
  if (endDate?.trim()) params.endDate = endDate.trim();
  return params;
}

export const reportsApi = {
  getUsersReport: async ({
    page = 1,
    limit = 10,
    startDate,
    endDate,
  }: GetReportsUsersParams = {}): Promise<ReportsUsersListResult> => {
    try {
      const { data } = await API.get("/admin/reports/users", {
        params: buildReportParams({ page, limit, startDate, endDate }),
      });
      const payload = (data?.data ?? data) as ReportsUsersListResponse;
      const users = payload?.users ?? payload?.reports ?? [];
      const pagination = payload?.pagination;

      const total =
        pagination?.totalItems ??
        payload?.total ??
        payload?.totalCount ??
        users.length;
      const totalPages =
        pagination?.totalPages ??
        payload?.totalPages ??
        Math.max(1, Math.ceil(total / limit));

      return {
        users,
        page: pagination?.currentPage ?? payload?.page ?? page,
        limit: pagination?.itemsPerPage ?? payload?.limit ?? limit,
        total,
        totalPages,
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  downloadUsersReport: async ({
    startDate,
    endDate,
  }: ReportDateFilters = {}): Promise<void> => {
    try {
      const response = await API.get("/admin/reports/users/download", {
        params: buildReportParams({ startDate, endDate }),
        responseType: "blob",
      });

      const blob = response.data as Blob;
      const filename =
        getFilenameFromDisposition(
          response.headers["content-disposition"] as string | undefined
        ) ?? "users-report.xlsx";

      triggerFileDownload(blob, filename);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};

export function getReportProfileImageUrl(
  user: ReportUser
): string | undefined {
  if (!user.profilePicture) return undefined;
  if (typeof user.profilePicture === "string") return user.profilePicture;
  return user.profilePicture.location ?? undefined;
}

export function getReportUserInitials(userName?: string) {
  if (!userName?.trim()) return "NA";
  return userName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatReportRevenue(value: number): string {
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function formatReportStatus(status?: string) {
  if (!status) return "—";
  const normalized = status.toLowerCase();
  if (normalized === "active") return "Active";
  if (normalized === "inactive") return "Inactive";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function getReportStatusColor(status?: string) {
  const normalized = status?.toLowerCase();
  if (normalized === "active") return "text-[#16BC4E]";
  if (normalized === "inactive") return "text-[#FF0000]";
  return "text-slate-600";
}
