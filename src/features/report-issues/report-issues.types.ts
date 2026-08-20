export type ReportIssueStatus = "pending" | "in_progress" | "resolved";

export interface ReportIssueUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface ReportIssue {
  _id: string;
  user: ReportIssueUser;
  role: string;
  title: string;
  description: string;
  status: ReportIssueStatus;
  reportedDate: string;
  resolvedDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReportIssuePagination {
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export interface GetReportIssuesResponse {
  issues?: ReportIssue[];
  pagination?: ReportIssuePagination;
  page?: number;
  limit?: number;
  total?: number;
  totalCount?: number;
  totalPages?: number;
}

export interface GetReportIssuesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ReportIssueStatus;
}

export interface ReportIssuesListResult {
  rows: ReportIssue[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const REPORT_ISSUE_TABS: { label: string; value: ReportIssueStatus }[] = [
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
];
