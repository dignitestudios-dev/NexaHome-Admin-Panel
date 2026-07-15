import { API } from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/api/error";
import type {
  GetReportsParams,
  ReportDateFilters,
  ReportProfilePicture,
  ReportRow,
  ReportTab,
  ReportsListResult,
  ReportsUsersListResponse,
} from "./reports.types";

const REPORT_ENDPOINTS: Record<ReportTab, string> = {
  users: "/admin/reports/users",
  partners: "/admin/reports/partners",
  providers: "/admin/reports/providers",
};

const REPORT_DOWNLOAD_ROLES: Record<ReportTab, string> = {
  users: "user",
  partners: "partner",
  providers: "service-provider",
};

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
  search,
}: GetReportsParams = {}) {
  const params: Record<string, string | number> = {};
  if (page != null) params.page = page;
  if (limit != null) params.limit = limit;
  if (startDate?.trim()) params.startDate = startDate.trim();
  if (endDate?.trim()) params.endDate = endDate.trim();
  if (search?.trim()) params.search = search.trim();
  return params;
}

function asRecord(value: unknown): Record<string, unknown> {
  return (value ?? {}) as Record<string, unknown>;
}

function pickString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function pickNumber(...values: unknown[]) {
  for (const value of values) {
    const number = Number(value);
    if (Number.isFinite(number)) return number;
  }
  return 0;
}

function getMetricCount(item: Record<string, unknown>, tab: ReportTab) {
  if (tab === "providers") {
    return pickNumber(item.completedJobsCount, item.jobsCompleted, item.jobsCount);
  }
  if (tab === "partners") {
    return pickNumber(
      item.usersAddedViaReferral,
      item.referrals,
      item.referralCount
    );
  }
  return pickNumber(item.jobsPosted, item.totalJobs, item.jobsCount);
}

function normalizeReportRow(raw: unknown, tab: ReportTab): ReportRow {
  const item = asRecord(raw);
  const profilePicture = (item.profilePicture ??
    null) as ReportProfilePicture | string | null;

  return {
    id: pickString(
      item.userId,
      item.partnerId,
      item.providerId,
      item.expertId,
      item._id,
      item.id
    ),
    name:
      pickString(
        item.companyName,
        item.partnerName,
        item.userName,
        item.name,
        item.providerName
      ) || "—",
    email: pickString(item.email) || "—",
    profilePicture,
    joinDate: pickString(item.joinDate, item.createdAt, item.joinedAt),
    metricCount: getMetricCount(item, tab),
    revenueGenerated: pickNumber(
      item.revenueGenerated,
      item.revenue,
      item.totalRevenue
    ),
    status: pickString(item.status) || undefined,
  };
}

function extractRows(
  payload: ReportsUsersListResponse,
  tab: ReportTab
): unknown[] {
  if (tab === "users") {
    return payload.users ?? payload.reports ?? [];
  }
  if (tab === "partners") {
    return payload.partners ?? payload.reports ?? [];
  }
  return payload.providers ?? payload.reports ?? [];
}

async function getReportsList({
  tab = "users",
  page = 1,
  limit = 10,
  startDate,
  endDate,
  search,
}: GetReportsParams = {}): Promise<ReportsListResult> {
  try {
    const { data } = await API.get(REPORT_ENDPOINTS[tab], {
      params: buildReportParams({ page, limit, startDate, endDate, search }),
    });
    const payload = (data?.data ?? data) as ReportsUsersListResponse;
    const rows = extractRows(payload, tab).map((row) =>
      normalizeReportRow(row, tab)
    );
    const pagination = payload?.pagination;

    const total =
      pagination?.totalItems ??
      payload?.total ??
      payload?.totalCount ??
      rows.length;
    const totalPages =
      pagination?.totalPages ??
      payload?.totalPages ??
      Math.max(1, Math.ceil(total / limit));

    return {
      rows,
      page: pagination?.currentPage ?? payload?.page ?? page,
      limit: pagination?.itemsPerPage ?? payload?.limit ?? limit,
      total,
      totalPages,
    };
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export const reportsApi = {
  getReport: getReportsList,

  getUsersReport: (params: GetReportsParams = {}) =>
    getReportsList({ ...params, tab: "users" }),

  getPartnersReport: (params: GetReportsParams = {}) =>
    getReportsList({ ...params, tab: "partners" }),

  getProvidersReport: (params: GetReportsParams = {}) =>
    getReportsList({ ...params, tab: "providers" }),

  downloadReport: async ({
    tab = "users",
    startDate,
    endDate,
    search,
  }: GetReportsParams = {}): Promise<void> => {
    try {
      const response = await API.get("/admin/reports/download", {
        params: {
          role: REPORT_DOWNLOAD_ROLES[tab],
          ...buildReportParams({ startDate, endDate, search }),
        },
        responseType: "blob",
      });

      const blob = response.data as Blob;
      const filename =
        getFilenameFromDisposition(
          response.headers["content-disposition"] as string | undefined
        ) ?? `${tab}-report.xlsx`;

      triggerFileDownload(blob, filename);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  downloadUsersReport: async (filters: ReportDateFilters = {}) => {
    return reportsApi.downloadReport({ ...filters, tab: "users" });
  },
};

export function getReportProfileImageUrl(
  row: Pick<ReportRow, "profilePicture">
): string | undefined {
  if (!row.profilePicture) return undefined;
  if (typeof row.profilePicture === "string") return row.profilePicture;
  return row.profilePicture.location ?? undefined;
}

export function getReportUserInitials(name?: string) {
  if (!name?.trim()) return "NA";
  return name
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

export function getReportNameColumnLabel(tab: ReportTab) {
  if (tab === "partners") return "Partner Name";
  if (tab === "providers") return "Company Name";
  return "User Name";
}

export function getReportMetricColumnLabel(tab: ReportTab) {
  if (tab === "partners") return "Referrals";
  if (tab === "providers") return "Completed Jobs";
  return "Job Post";
}

export function normalizeReportTab(tab: string | null): ReportTab {
  const normalized = tab?.trim().toLowerCase();
  if (normalized === "partners" || normalized === "partner") return "partners";
  if (
    normalized === "providers" ||
    normalized === "provider" ||
    normalized === "service-providers"
  ) {
    return "providers";
  }
  return "users";
}
