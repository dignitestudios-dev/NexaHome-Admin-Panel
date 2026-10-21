export type CategoryRequestStatus = "pending" | "rejected" | "fulfilled";

export interface CategoryRequestUser {
  _id?: string;
  name?: string;
  email?: string;
  contactEmail?: string;
  phone?: string;
  companyName?: string | null;
  role?: string;
}

export interface CategoryRequest {
  _id: string;
  user: CategoryRequestUser | null;
  text: string;
  status: CategoryRequestStatus | string;
  processedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryRequestsPagination {
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export interface CategoryRequestsApiResponse {
  success: boolean;
  message?: string;
  data: {
    requests: CategoryRequest[];
  };
  pagination?: CategoryRequestsPagination;
}

export interface GetCategoryRequestsParams {
  page?: number;
  limit?: number;
  status?: CategoryRequestStatus;
  search?: string;
}

export interface UpdateCategoryRequestStatusPayload {
  id: string;
  status: "rejected" | "fulfilled";
}

export interface CategoryRequestsListResult {
  requests: CategoryRequest[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
