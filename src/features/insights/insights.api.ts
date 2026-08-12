import { API } from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/api/error";
import type {
  ReferralTopCategory,
  ReferralTopCategoriesResponse,
  ReferralTopHomeowner,
  ReferralTopHomeownersResponse,
  TopCategoriesByExpertsResponse,
  TopCategoriesByExpertsResult,
  GetTopCategoriesByExpertsParams,
  InsightsListParams,
  LeadPerformanceStats,
  LeadPerformanceStatsResponse,
  TopExpert,
  TopHomeowner,
  TopJob,
  TopLocation,
} from "./insights.types";

function appendLocationParams(
  params: Record<string, string | number>,
  city?: string,
  zipCode?: string
) {
  if (city?.trim()) params.city = city.trim();
  if (zipCode?.trim()) params.zipCode = zipCode.trim();
  return params;
}

export const insightsApi = {
  getTopJobs: async ({
    limit = 10,
    search,
    city,
    zipCode,
  }: InsightsListParams = {}): Promise<TopJob[]> => {
    try {
      const params: Record<string, string | number> = { limit };
      if (search?.trim()) params.search = search.trim();
      appendLocationParams(params, city, zipCode);

      const { data } = await API.get("/admin/insights/top-jobs", { params });
      const payload = data?.data ?? data;
      return (payload?.jobs ?? []) as TopJob[];
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  getTopLocations: async ({
    limit = 10,
    search,
    city,
    zipCode,
  }: InsightsListParams = {}): Promise<TopLocation[]> => {
    try {
      const params: Record<string, string | number> = { limit };
      // API expects `search` (not `city`) for location filtering
      const searchValue = search?.trim() || city?.trim();
      if (searchValue) params.search = searchValue;
      if (zipCode?.trim()) params.zipCode = zipCode.trim();

      const { data } = await API.get("/admin/insights/top-locations", { params });
      const payload = data?.data ?? data;
      return (payload?.locations ?? []) as TopLocation[];
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  getTopHomeowners: async ({
    limit = 10,
    search,
    city,
    zipCode,
  }: InsightsListParams = {}): Promise<TopHomeowner[]> => {
    try {
      const params: Record<string, string | number> = { limit };
      if (search?.trim()) params.search = search.trim();
      appendLocationParams(params, city, zipCode);

      const { data } = await API.get("/admin/insights/top-homeowners", { params });
      const payload = data?.data ?? data;
      return (payload?.homeowners ?? []) as TopHomeowner[];
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  getTopExperts: async ({
    limit = 10,
    search,
    city,
    zipCode,
  }: InsightsListParams = {}): Promise<TopExpert[]> => {
    try {
      const params: Record<string, string | number> = { limit };
      if (search?.trim()) params.search = search.trim();
      appendLocationParams(params, city, zipCode);

      const { data } = await API.get("/admin/insights/top-experts", { params });
      const payload = data?.data ?? data;
      return (payload?.experts ?? []) as TopExpert[];
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  getTopCategoriesByExperts: async ({
    page = 1,
    limit = 10,
    search,
    city,
    zipCode,
  }: GetTopCategoriesByExpertsParams = {}): Promise<TopCategoriesByExpertsResult> => {
    try {
      const params: Record<string, string | number> = { page, limit };
      if (search?.trim()) params.search = search.trim();
      appendLocationParams(params, city, zipCode);

      const { data } = await API.get<TopCategoriesByExpertsResponse>(
        "/admin/insights/top-categories-by-experts",
        { params }
      );

      const categories =
        data?.data?.categories ?? data?.categories ?? [];
      const pagination = data?.pagination;
      const total = pagination?.totalItems ?? categories.length;
      const totalPages =
        pagination?.totalPages ?? Math.max(1, Math.ceil(total / limit));

      return {
        categories,
        page: pagination?.currentPage ?? page,
        limit: pagination?.itemsPerPage ?? limit,
        total,
        totalPages,
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  getLeadPerformance: async (filters?: {
    city?: string;
    zipCode?: string;
  }): Promise<LeadPerformanceStats> => {
    try {
      const params: Record<string, string> = {};
      if (filters?.city?.trim()) params.city = filters.city.trim();
      if (filters?.zipCode?.trim()) params.zipCode = filters.zipCode.trim();

      const { data } = await API.get("/admin/insights/lead-performance", {
        params,
      });
      const payload = (data?.data ?? data) as LeadPerformanceStats;
      return {
        categoriesWithExperts: payload?.categoriesWithExperts ?? 0,
        topCategoryExpertsCount: payload?.topCategoryExpertsCount ?? 0,
        totalLeadsPurchased: payload?.totalLeadsPurchased ?? 0,
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  getReferralTopCategories: async (): Promise<ReferralTopCategory[]> => {
    try {
      const { data } = await API.get("/admin/insights/referral/top-categories");
      const payload = (data?.data ?? data) as ReferralTopCategoriesResponse;
      return payload?.categories ?? [];
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  getReferralTopHomeowners: async (): Promise<ReferralTopHomeowner[]> => {
    try {
      const { data } = await API.get("/admin/insights/referral/top-homeowners");
      if (Array.isArray(data)) return data as ReferralTopHomeowner[];
      if (Array.isArray(data?.data)) return data.data as ReferralTopHomeowner[];
      const payload = (data?.data ?? data) as ReferralTopHomeownersResponse;
      return payload?.homeowners ?? [];
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};

export function getReferralCategoryName(category: ReferralTopCategory): string {
  return category.categoryName ?? "—";
}

export function getReferralJobsPosted(category: ReferralTopCategory): number {
  return category.jobsPosted ?? 0;
}

export function getReferralJobsCompleted(category: ReferralTopCategory): number {
  return category.jobsCompleted ?? 0;
}

export function getReferralExpertsCount(category: ReferralTopCategory): number {
  return category.expertsCount ?? 0;
}

export function getReferralCategoryKey(category: ReferralTopCategory): string {
  return category.categoryId;
}

export function getReferralHomeownerImageUrl(
  homeowner: ReferralTopHomeowner
): string | undefined {
  if (!homeowner.profilePicture) return undefined;
  if (typeof homeowner.profilePicture === "string") {
    return homeowner.profilePicture;
  }
  return homeowner.profilePicture.location ?? undefined;
}

export function getReferralHomeownerInitials(name?: string) {
  if (!name?.trim()) return "NA";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function getReferralHomeownerName(homeowner: ReferralTopHomeowner): string {
  return homeowner.homeownerName ?? "—";
}

export function getReferralHomeownerRevenue(homeowner: ReferralTopHomeowner): number {
  return homeowner.revenueGenerated ?? 0;
}

export function formatReferralHomeownerRevenue(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatReferralRank(index: number) {
  return String(index + 1).padStart(2, "0");
}
