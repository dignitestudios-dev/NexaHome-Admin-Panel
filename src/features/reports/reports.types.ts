export type ReportTab = "users" | "partners" | "providers";

export interface ReportProfilePicture {
  _id?: string;
  fileName?: string;
  filename?: string;
  key?: string;
  location?: string;
  mimetype?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReportUser {
  userId: string;
  userName: string;
  email: string;
  profilePicture: ReportProfilePicture | string | null;
  joinDate: string;
  jobsPosted: number;
  revenueGenerated: number;
  status: string;
}

/** Normalized row used by all report tabs */
export interface ReportRow {
  id: string;
  name: string;
  email: string;
  profilePicture: ReportProfilePicture | string | null;
  joinDate: string;
  metricCount: number;
  revenueGenerated: number;
  status?: string;
}

export interface ReportsPagination {
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export interface ReportsUsersListResponse {
  users?: ReportUser[];
  partners?: Record<string, unknown>[];
  providers?: Record<string, unknown>[];
  reports?: ReportUser[] | Record<string, unknown>[];
  pagination?: ReportsPagination;
  page?: number;
  limit?: number;
  total?: number;
  totalCount?: number;
  totalPages?: number;
}

export interface ReportDateFilters {
  startDate?: string;
  endDate?: string;
}

export interface GetReportsParams extends ReportDateFilters {
  page?: number;
  limit?: number;
  search?: string;
  tab?: ReportTab;
}

/** @deprecated Prefer GetReportsParams */
export type GetReportsUsersParams = GetReportsParams;

export interface ReportsListResult {
  rows: ReportRow[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** @deprecated Prefer ReportsListResult */
export interface ReportsUsersListResult {
  users: ReportUser[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const REPORT_TABS: { label: string; value: ReportTab }[] = [
  { label: "Users", value: "users" },
  { label: "Partners", value: "partners" },
  { label: "Providers", value: "providers" },
];
