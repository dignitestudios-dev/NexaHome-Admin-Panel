import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "./dashboard.api";
import type { RevenueGroupBy } from "./dashboard.types";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: () => dashboardApi.getSummary(),
  });
}

export function useDashboardInsights() {
  return useQuery({
    queryKey: ["dashboard", "insights"],
    queryFn: () => dashboardApi.getInsights(),
  });
}

export function usePopularCategories() {
  return useQuery({
    queryKey: ["dashboard", "popular-categories"],
    queryFn: () => dashboardApi.getPopularCategories(),
  });
}

export function useRevenueAnalysis(groupBy: RevenueGroupBy) {
  return useQuery({
    queryKey: ["dashboard", "revenue-analysis", groupBy],
    queryFn: () => dashboardApi.getRevenueAnalysis(groupBy),
  });
}

export function useGrowthTracking(groupBy: RevenueGroupBy) {
  return useQuery({
    queryKey: ["dashboard", "growth-tracking", groupBy],
    queryFn: () => dashboardApi.getGrowthTracking(groupBy),
  });
}
