import { useQuery } from "@tanstack/react-query";
import { categorySubscriptionsApi } from "./category-subscriptions.api";
import type { GetCategorySubscriptionsParams } from "./category-subscriptions.types";

export const categorySubscriptionKeys = {
  all: ["category-subscriptions"] as const,
  list: (params: GetCategorySubscriptionsParams) =>
    ["category-subscriptions", "list", params] as const,
};

export function useCategorySubscriptions(
  params: GetCategorySubscriptionsParams = {}
) {
  const { page = 1, limit = 10, search, status } = params;

  return useQuery({
    queryKey: categorySubscriptionKeys.list({ page, limit, search, status }),
    queryFn: () =>
      categorySubscriptionsApi.getSubscriptions({ page, limit, search, status }),
  });
}
