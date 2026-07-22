import { useQuery } from "@tanstack/react-query";
import { insightsApi } from "./insights.api";

export function useTopJobs(
  limit = 10,
  search?: string,
  city?: string,
  zipCode?: string
) {
  const normalizedSearch = search?.trim() ?? "";

  return useQuery({
    queryKey: ["insights", "top-jobs", limit, normalizedSearch, city, zipCode],
    queryFn: () =>
      insightsApi.getTopJobs({
        limit,
        search: normalizedSearch || undefined,
        city,
        zipCode,
      }),
  });
}

export function useTopLocations(
  limit = 10,
  search?: string,
  city?: string,
  zipCode?: string
) {
  const normalizedSearch = search?.trim() ?? "";

  return useQuery({
    queryKey: ["insights", "top-locations", limit, normalizedSearch, city, zipCode],
    queryFn: () =>
      insightsApi.getTopLocations({
        limit,
        search: normalizedSearch || undefined,
        city,
        zipCode,
      }),
  });
}

export function useTopHomeowners(
  limit = 10,
  search?: string,
  city?: string,
  zipCode?: string
) {
  const normalizedSearch = search?.trim() ?? "";

  return useQuery({
    queryKey: ["insights", "top-homeowners", limit, normalizedSearch, city, zipCode],
    queryFn: () =>
      insightsApi.getTopHomeowners({
        limit,
        search: normalizedSearch || undefined,
        city,
        zipCode,
      }),
  });
}

export function useTopExperts(
  limit = 10,
  search?: string,
  city?: string,
  zipCode?: string
) {
  const normalizedSearch = search?.trim() ?? "";

  return useQuery({
    queryKey: ["insights", "top-experts", limit, normalizedSearch, city, zipCode],
    queryFn: () =>
      insightsApi.getTopExperts({
        limit,
        search: normalizedSearch || undefined,
        city,
        zipCode,
      }),
  });
}

export function useTopCategoriesByExperts(
  {
    page = 1,
    limit = 10,
    search,
    city,
    zipCode,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    city?: string;
    zipCode?: string;
  } = {},
  enabled = true
) {
  const normalizedSearch = search?.trim() ?? "";

  return useQuery({
    queryKey: [
      "insights",
      "top-categories-by-experts",
      page,
      limit,
      normalizedSearch,
      city,
      zipCode,
    ],
    queryFn: () =>
      insightsApi.getTopCategoriesByExperts({
        page,
        limit,
        search: normalizedSearch || undefined,
        city,
        zipCode,
      }),
    enabled,
  });
}

export function useLeadPerformance(filters?: { city?: string; zipCode?: string }) {
  return useQuery({
    queryKey: ["insights", "lead-performance", filters?.city, filters?.zipCode],
    queryFn: () => insightsApi.getLeadPerformance(filters),
  });
}

export function useReferralTopCategories(enabled = true) {
  return useQuery({
    queryKey: ["insights", "referral", "top-categories"],
    queryFn: () => insightsApi.getReferralTopCategories(),
    enabled,
  });
}

export function useReferralTopHomeowners(enabled = true) {
  return useQuery({
    queryKey: ["insights", "referral", "top-homeowners"],
    queryFn: () => insightsApi.getReferralTopHomeowners(),
    enabled,
  });
}
