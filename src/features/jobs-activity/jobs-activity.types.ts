export type JobActivityStatus =
  | "pending"
  | "accepted"
  | "completed"
  | "rejected"
  | "cancelled";

export interface JobActivityProfilePicture {
  location?: string;
  fileName?: string;
  filename?: string;
}

export interface JobActivityPerson {
  _id?: string;
  name?: string;
  userName?: string;
  email?: string;
  profilePicture?: JobActivityProfilePicture | string | null;
  avatar?: string;
}

export interface JobActivityItem {
  _id: string;
  jobId: string;
  jobCategory: string;
  postedBy: JobActivityPerson | null;
  vendorAssigned: JobActivityPerson | null;
  status: JobActivityStatus | string;
  datePosted: string;
}

export interface JobsActivityPagination {
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export interface JobsActivityListResponse {
  jobs?: JobActivityItem[];
  activities?: JobActivityItem[];
  pagination?: JobsActivityPagination;
  page?: number;
  limit?: number;
  total?: number;
  totalCount?: number;
  totalPages?: number;
}

export interface GetJobsActivityParams {
  page?: number;
  limit?: number;
  status: JobActivityStatus;
}

export interface JobsActivityListResult {
  jobs: JobActivityItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
