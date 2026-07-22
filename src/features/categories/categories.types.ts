export interface CategoryPricing {
  dollarPrice?: number;
  oneTimeCredits?: number;
  recurringCredits?: number;
}

export interface CategoryIcon {
  _id: string;
  filename?: string;
  key?: string;
  location?: string;
  mimetype?: string;
  slug?: string;
  size?: number;
  uploadedByModel?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  credits: number | null;
  pricing?: CategoryPricing | null;
  icon?: CategoryIcon | null;
  isActive?: boolean | "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesPagination {
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export interface CategoriesListResponse {
  categories: Category[];
  pagination?: CategoriesPagination;
  page?: number;
  limit?: number;
  total?: number;
  totalCount?: number;
  totalPages?: number;
}

export type CategoryStatusFilter = "all" | "active" | "inactive";

export interface GetCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: CategoryStatusFilter;
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
  icon: File;
  oneTimeCredits: number;
  recurringCredits: number;
}

export interface UpdateCategoryPayload {
  id: string;
  name: string;
  description?: string;
  icon?: File;
  oneTimeCredits?: number;
  recurringCredits?: number;
  dollarPrice?: number;
  isActive: boolean;
}

export interface CategoriesListResult {
  categories: Category[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
