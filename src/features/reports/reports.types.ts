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

export interface ReportsPagination {
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export interface ReportsUsersListResponse {
  users?: ReportUser[];
  reports?: ReportUser[];
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

export interface GetReportsUsersParams extends ReportDateFilters {
  page?: number;
  limit?: number;
}

export interface ReportsUsersListResult {
  users: ReportUser[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
