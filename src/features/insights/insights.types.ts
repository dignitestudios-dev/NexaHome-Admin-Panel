export interface TopJob {
  categoryId: string;
  jobCategory: string;
  totalRequests: number;
  revenueGenerated: number;
}

export interface TopJobsResponse {
  jobs: TopJob[];
}

export interface InsightsListParams {
  limit?: number;
  search?: string;
  city?: string;
  zipCode?: string;
}

export interface TopLocation {
  city?: string;
  zipCode?: string;
  zip?: string;
  state?: string;
  name?: string;
  location?: string;
  totalJobs: number;
  revenue: number;
}

export interface TopLocationsResponse {
  locations: TopLocation[];
}

export interface InsightsProfilePicture {
  _id: string;
  fileName: string;
  key: string;
  mimetype: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface TopHomeowner {
  userId: string;
  name: string;
  profilePicture: InsightsProfilePicture | null;
  jobsPosted: number;
  totalSpend: number;
}

export interface TopHomeownersResponse {
  homeowners: TopHomeowner[];
}

export interface TopExpert {
  userId: string;
  userName: string | null;
  companyName?: string | null;
  leadPurchases: number;
  jobsCompleted: number;
  revenue: number;
}

export interface TopExpertsResponse {
  experts: TopExpert[];
}

export interface TopCategoryByExperts {
  categoryId: string;
  name: string;
  slug: string;
  expertsCount: number;
}

export interface TopCategoriesByExpertsResponse {
  success?: boolean;
  message?: string;
  data?: {
    categories?: TopCategoryByExperts[];
  };
  categories?: TopCategoryByExperts[];
  pagination?: {
    itemsPerPage?: number;
    currentPage?: number;
    totalItems?: number;
    totalPages?: number;
  };
}

export interface GetTopCategoriesByExpertsParams {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  zipCode?: string;
}

export interface TopCategoriesByExpertsResult {
  categories: TopCategoryByExperts[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LeadPerformanceStats {
  categoriesWithExperts: number;
  topCategoryExpertsCount: number;
  totalLeadsPurchased: number;
}

export interface LeadPerformanceStatsResponse {
  success?: boolean;
  message?: string;
  data?: LeadPerformanceStats;
}

export interface ReferralTopCategory {
  categoryId: string;
  categoryName: string;
  jobsPosted: number;
  jobsCompleted: number;
  expertsCount: number;
}

export interface ReferralTopCategoriesResponse {
  categories?: ReferralTopCategory[];
}

export interface ReferralTopHomeowner {
  userId: string;
  homeownerName: string;
  profilePicture?: InsightsProfilePicture | string | null;
  registrationDate: string;
  jobsPosted: number;
  revenueGenerated: number;
}

export interface ReferralTopHomeownersResponse {
  homeowners?: ReferralTopHomeowner[];
}
