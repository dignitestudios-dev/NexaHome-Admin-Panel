export type SubscriptionStatusFilter = "active" | "canceled" | "all";

export interface CategorySubscriptionUser {
  _id?: string;
  name?: string;
  companyName?: string;
  email?: string;
}

export interface CategorySubscriptionCategory {
  _id?: string;
  name?: string;
}

export interface CategorySubscription {
  _id: string;
  user?: CategorySubscriptionUser | string;
  plan?: string;
  userName?: string;
  name?: string;
  category?: CategorySubscriptionCategory | string;
  categoryName?: string;
  categoryPurchased?: string;
  purchaseDate?: string;
  createdAt?: string;
  status: string;
}

export interface GetCategorySubscriptionsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: SubscriptionStatusFilter;
}

export interface CategorySubscriptionsListResponse {
  subscriptions?: CategorySubscription[];
  page?: number;
  limit?: number;
  total?: number;
  totalCount?: number;
  totalPages?: number;
}

export interface CategorySubscriptionsListResult {
  subscriptions: CategorySubscription[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
