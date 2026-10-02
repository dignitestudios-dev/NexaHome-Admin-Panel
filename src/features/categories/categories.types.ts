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

export interface RelatedCategoryItem {
  _id: string;
  name: string;
  slug?: string;
  icon?: string | CategoryIcon | null;
}

export interface Category {
  _id: string;
  id?: string;
  name: string;
  slug?: string;
  description?: string | null;
  credits: number | null;
  pricing?: CategoryPricing | null;
  icon?: CategoryIcon | null;
  conversionRate?: number;
  isActive?: boolean | "active" | "inactive";
  allowedProviders?: unknown[];
  primary_phrases?: string[];
  alternate_keywords?: string[];
  related_search_phrases?: string[];
  relatedCategories?: (RelatedCategoryItem | string)[];
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
  primary_phrases?: string[];
  alternate_keywords?: string[];
  related_search_phrases?: string[];
  relatedCategories?: string[];
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
  primary_phrases?: string[];
  alternate_keywords?: string[];
  related_search_phrases?: string[];
  relatedCategories?: string[];
}

export interface CategoriesListResult {
  categories: Category[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

