import { API } from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/api/error";
import type {
  CategorySubscription,
  CategorySubscriptionsListResponse,
  CategorySubscriptionsListResult,
  GetCategorySubscriptionsParams,
} from "./category-subscriptions.types";

export const categorySubscriptionsApi = {
  getSubscriptions: async ({
    page = 1,
    limit = 10,
    search,
    status,
  }: GetCategorySubscriptionsParams = {}): Promise<CategorySubscriptionsListResult> => {
    try {
      const params: Record<string, string | number> = {
        page,
        limit,
        status: status ?? "all",
      };
      if (search?.trim()) params.search = search.trim();

      const { data } = await API.get("/admin/categories/subscriptions", {
        params,
      });
      const payload = (data?.data ?? data) as CategorySubscriptionsListResponse;
      const subscriptions = payload?.subscriptions ?? [];
      const total =
        payload?.total ?? payload?.totalCount ?? subscriptions.length;
      const totalPages =
        payload?.totalPages ?? Math.max(1, Math.ceil(total / limit));

      return {
        subscriptions,
        page: payload?.page ?? page,
        limit: payload?.limit ?? limit,
        total,
        totalPages,
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};

export function getSubscriptionCompanyName(
  subscription: CategorySubscription
): string {
  if (subscription.user && typeof subscription.user === "object") {
    const companyName = subscription.user.companyName?.trim();
    if (companyName) return companyName;
  }
  if (subscription.userName?.trim()) return subscription.userName.trim();
  if (subscription.name?.trim()) return subscription.name.trim();
  return "—";
}

export function getSubscriptionUserId(
  subscription: CategorySubscription
): string | null {
  if (subscription.user && typeof subscription.user === "object") {
    return subscription.user._id ?? null;
  }
  if (typeof subscription.user === "string" && subscription.user.trim()) {
    return subscription.user.trim();
  }
  return null;
}

export function getSubscriptionCategoryName(
  subscription: CategorySubscription
): string {
  if (subscription.plan) return subscription.plan;
  if (subscription.categoryName) return subscription.categoryName;
  if (subscription.categoryPurchased) return subscription.categoryPurchased;
  if (subscription.category && typeof subscription.category === "object") {
    return subscription.category.name ?? "—";
  }
  if (typeof subscription.category === "string") return subscription.category;
  return "—";
}

export function getSubscriptionPurchaseDate(
  subscription: CategorySubscription
): string | undefined {
  return subscription.purchaseDate ?? subscription.createdAt;
}

export function formatSubscriptionStatus(status?: string) {
  if (!status) return "—";
  const normalized = status.toLowerCase();
  if (normalized === "active") return "Active";
  if (normalized === "canceled" || normalized === "cancelled") return "Inactive";
  if (normalized === "inactive") return "Inactive";
  return status.charAt(0).toUpperCase() + status.slice(1);
}
