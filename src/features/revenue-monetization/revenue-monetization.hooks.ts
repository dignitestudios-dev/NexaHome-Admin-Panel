import { useQuery } from "@tanstack/react-query";
import { revenueMonetizationApi } from "./revenue-monetization.api";
import type {
  RevenueMonetizationFilterParams,
  RevenueMonetizationGroupBy,
} from "./revenue-monetization.types";

export const revenueMonetizationKeys = {
  all: ["revenue-monetization"] as const,
  detail: (
    groupBy: RevenueMonetizationGroupBy,
    filters?: RevenueMonetizationFilterParams
  ) =>
    [
      "revenue-monetization",
      groupBy,
      filters?.city,
      filters?.zipCode,
    ] as const,
};

export function useRevenueMonetization(
  groupBy: RevenueMonetizationGroupBy,
  filters?: RevenueMonetizationFilterParams
) {
  return useQuery({
    queryKey: revenueMonetizationKeys.detail(groupBy, filters),
    queryFn: () =>
      revenueMonetizationApi.getRevenueMonetization(groupBy, filters),
  });
}
