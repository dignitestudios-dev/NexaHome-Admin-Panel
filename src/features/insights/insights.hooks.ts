import { useQuery } from "@tanstack/react-query";
import { insightsApi } from "./insights.api";

export function useTopJobs(limit = 10, search?: string) {
  const normalizedSearch = search?.trim() ?? "";

  return useQuery({
    queryKey: ["insights", "top-jobs", limit, normalizedSearch],
    queryFn: () =>
      insightsApi.getTopJobs({
        limit,
        search: normalizedSearch || undefined,
      }),
  });
}

export function useTopLocations(limit = 10, search?: string) {
  const normalizedSearch = search?.trim() ?? "";

  return useQuery({
    queryKey: ["insights", "top-locations", limit, normalizedSearch],
    queryFn: () =>
      insightsApi.getTopLocations({
        limit,
        search: normalizedSearch || undefined,
      }),
  });
}

export function useTopHomeowners(limit = 10, search?: string) {
  const normalizedSearch = search?.trim() ?? "";

  return useQuery({
    queryKey: ["insights", "top-homeowners", limit, normalizedSearch],
    queryFn: () =>
      insightsApi.getTopHomeowners({
        limit,
        search: normalizedSearch || undefined,
      }),
  });
}

export function useTopExperts(limit = 10, search?: string) {
  const normalizedSearch = search?.trim() ?? "";

  return useQuery({
    queryKey: ["insights", "top-experts", limit, normalizedSearch],
    queryFn: () =>
      insightsApi.getTopExperts({
        limit,
        search: normalizedSearch || undefined,
      }),
  });
}

export function useTopCategoriesByExperts(
  {
    page = 1,
    limit = 10,
    search,
  }: { page?: number; limit?: number; search?: string } = {},
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
    ],
    queryFn: () =>
      insightsApi.getTopCategoriesByExperts({
        page,
        limit,
        search: normalizedSearch || undefined,
      }),
    enabled,
  });
}

export function useLeadPerformance() {
  return useQuery({
    queryKey: ["insights", "lead-performance"],
    queryFn: () => insightsApi.getLeadPerformance(),
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
