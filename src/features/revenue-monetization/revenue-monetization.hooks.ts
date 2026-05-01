import { useQuery } from "@tanstack/react-query";
import { revenueMonetizationApi } from "./revenue-monetization.api";
import type { RevenueMonetizationGroupBy } from "./revenue-monetization.types";

export const revenueMonetizationKeys = {
  all: ["revenue-monetization"] as const,
  detail: (groupBy: RevenueMonetizationGroupBy) =>
    ["revenue-monetization", groupBy] as const,
};

export function useRevenueMonetization(groupBy: RevenueMonetizationGroupBy) {
  return useQuery({
    queryKey: revenueMonetizationKeys.detail(groupBy),
    queryFn: () => revenueMonetizationApi.getRevenueMonetization(groupBy),
  });
}
