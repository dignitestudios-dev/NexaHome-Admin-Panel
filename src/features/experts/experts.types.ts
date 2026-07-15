export interface ExpertProfilePicture {
  _id: string;
  fileName: string;
  key: string;
  mimetype: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpertCategory {
  _id?: string;
  name?: string;
}

export interface Expert {
  _id: string;
  email: string;
  name: string;
  companyName?: string | null;
  profilePicture: ExpertProfilePicture | string | null;
  joinDate: string;
  isEligibleForBadge: boolean;
  badgePurchaseDate: string | null;
  isBadgeActive: boolean;
}

export interface ExpertDetail {
  _id: string;
  email?: string;
  name?: string;
  companyName?: string;
  role?: string;
  isActive?: boolean;
  profilePicture?: ExpertProfilePicture | string | null;
  categories?: ExpertCategory[];
  selectedCategories?: ExpertCategory[];
  joinDate?: string;
  createdAt?: string;
  isEligibleForBadge?: boolean;
  badgePurchaseDate?: string | null;
  isBadgeActive?: boolean;
}

export interface ExpertsListResponse {
  experts: Expert[];
  page?: number;
  limit?: number;
  total?: number;
  totalCount?: number;
  totalPages?: number;
}

export interface GetExpertsParams {
  page?: number;
  limit?: number;
}

export interface ExpertsListResult {
  experts: Expert[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
