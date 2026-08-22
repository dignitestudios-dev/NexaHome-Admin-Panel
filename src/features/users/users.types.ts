export interface UserCategory {
  _id?: string;
  name?: string;
  slug?: string;
}

export type UserSelectedCategory = string | UserCategory;

export interface UserProfilePicture {
  _id: string;
  fileName: string;
  key: string;
  mimetype: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  email: string;
  role: string;
  name: string;
  profilePicture: UserProfilePicture | string | null;
  isDeactivatedByAdmin: boolean;
  selectedCategories: UserSelectedCategory[];
  joinDate: string;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatusFilter;
  userType?: UserTypeFilter;
}

export type UserStatusFilter = "all" | "active" | "inactive";

export type UserTypeFilter = "all" | "user" | "service-provider" | "partner";

export interface UsersPagination {
  itemsPerPage?: number;
  currentPage?: number;
  totalItems?: number;
  totalPages?: number;
}

export interface UsersListResult {
  users: User[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UsersListResponse {
  success?: boolean;
  message?: string;
  data?: {
    users?: User[];
  };
  pagination?: UsersPagination;
  users?: User[];
  page?: number;
  limit?: number;
  total?: number;
  totalCount?: number;
  totalPages?: number;
}

export interface UserDetailStats {
  totalJobsPosted: number;
  completedJobs: number;
  activeJobs: number;
  totalSpent: number;
}

export interface ProviderDetailStats {
  leadPurchases: number;
  jobsCompleted: number;
  revenue: number;
  walletCredits: number;
}

export interface PartnerDetailStats {
  usersReferredCount: number;
  homeownersReferredCount: number;
  providersReferredCount: number;
  jobsPosted: number;
  revenueGenerated: number;
  linkReferralsCount: number;
  totalCommissionEarned: number;
  totalCommissionPaid: number;
  pendingCommission: number;
}

export interface UserDetailResponse {
  message: string;
  data: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    profilePicture?: UserProfilePicture | string | null;
    role: string;
    isDeactivatedByAdmin: boolean;
    addresses?: any[];
    stats?: UserDetailStats;
    recentJobs?: any[];
    referredByPartner?: any;
    createdAt: string;
    updatedAt: string;
    [key: string]: any;
  }
}

export interface ProviderDetailResponse {
  message: string;
  data: {
    _id: string;
    name: string;
    companyName?: string;
    email: string;
    phone?: string;
    profilePicture?: UserProfilePicture | string | null;
    role: string;
    isDeactivatedByAdmin: boolean;
    identityStatus?: string;
    overview?: string;
    averageRating?: number;
    totalReviews?: number;
    documents?: any;
    portfolioMedia?: any[];
    addresses?: any[];
    badgeSubscription?: any;
    serviceSubscription?: any;
    stats?: ProviderDetailStats;
    createdAt: string;
    updatedAt: string;
    [key: string]: any;
  }
}

export interface PartnerDetailResponse {
  message: string;
  data: {
    _id: string;
    name: string;
    companyName?: string;
    email: string;
    phone?: string;
    profilePicture?: UserProfilePicture | string | null;
    role: string;
    isDeactivatedByAdmin: boolean;
    referralCode?: string;
    isPartnerApproved?: boolean;
    isPartnerActive?: boolean;
    banks?: any[];
    stats?: PartnerDetailStats;
    recentReferredUsers?: any[];
    createdAt: string;
    updatedAt: string;
    [key: string]: any;
  }
}

export type AnyUserDetail = UserDetailResponse["data"] | ProviderDetailResponse["data"] | PartnerDetailResponse["data"];
