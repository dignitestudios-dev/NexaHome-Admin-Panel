export type JobActivityStatus =
  | "pending"
  | "accepted"
  | "completed"
  | "rejected"
  | "cancelled";

export interface JobActivityProfilePicture {
  _id?: string;
  fileName?: string;
  key?: string;
  mimetype?: string;
  location?: string;
  filename?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppliedProvider {
  _id: string;
  name?: string;
  companyName?: string;
  email?: string;
  profilePicture?: JobActivityProfilePicture | string | null;
  averageRating?: number;
  totalReviews?: number;
  appliedAt?: string;
  isSelected?: boolean;
}

export interface JobActivityPerson {
  _id?: string;
  name?: string;
  companyName?: string | null;
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
  appliedProviders?: AppliedProvider[];
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
