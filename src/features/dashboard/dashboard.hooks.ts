import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "./dashboard.api";
import type { DashboardFilterParams, RevenueGroupBy } from "./dashboard.types";

export function useDashboardSummary(filters?: DashboardFilterParams) {
  return useQuery({
    queryKey: ["dashboard", "summary", filters?.city, filters?.zipCode],
    queryFn: () => dashboardApi.getSummary(filters),
  });
}

export function useDashboardInsights(filters?: DashboardFilterParams) {
  return useQuery({
    queryKey: ["dashboard", "insights", filters?.city, filters?.zipCode],
    queryFn: () => dashboardApi.getInsights(filters),
  });
}

export function usePopularCategories(filters?: DashboardFilterParams) {
  return useQuery({
    queryKey: ["dashboard", "popular-categories", filters?.city, filters?.zipCode],
    queryFn: () => dashboardApi.getPopularCategories(filters),
  });
}

export function useRevenueAnalysis(
  groupBy: RevenueGroupBy,
  filters?: DashboardFilterParams
) {
  return useQuery({
    queryKey: ["dashboard", "revenue-analysis", groupBy, filters?.city, filters?.zipCode],
    queryFn: () => dashboardApi.getRevenueAnalysis(groupBy, filters),
  });
}

export function useGrowthTracking(
  groupBy: RevenueGroupBy,
  filters?: DashboardFilterParams
) {
  return useQuery({
    queryKey: ["dashboard", "growth-tracking", groupBy, filters?.city, filters?.zipCode],
    queryFn: () => dashboardApi.getGrowthTracking(groupBy, filters),
  });
}
