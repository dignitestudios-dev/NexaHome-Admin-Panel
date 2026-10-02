import { API } from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/api/error";
import type {
  CategoryRequest,
  CategoryRequestStatus,
  CategoryRequestsListResult,
  GetCategoryRequestsParams,
  UpdateCategoryRequestStatusPayload,
} from "./category-requests.types";

export const CATEGORY_REQUEST_TABS: { label: string; value: CategoryRequestStatus }[] = [
  { label: "Pending", value: "pending" },
  { label: "Fulfilled", value: "fulfilled" },
  { label: "Rejected", value: "rejected" },
];

export function normalizeCategoryRequestTab(
  tab: string | null | undefined
): CategoryRequestStatus {
  const normalized = tab?.trim().toLowerCase();
  if (normalized === "fulfilled") return "fulfilled";
  if (normalized === "rejected") return "rejected";
  return "pending";
}

export const categoryRequestsApi = {
  getRequests: async ({
    page = 1,
    limit = 10,
    status = "pending",
    search,
  }: GetCategoryRequestsParams = {}): Promise<CategoryRequestsListResult> => {
    try {
      const params: Record<string, string | number> = {
        page,
        limit,
        status,
      };
      if (search?.trim()) {
        params.search = search.trim();
      }

      const { data } = await API.get("/request", { params });
      
      const requestsData = data?.data;
      const requests: CategoryRequest[] = Array.isArray(requestsData?.requests)
        ? requestsData.requests
        : Array.isArray(requestsData)
        ? requestsData
        : Array.isArray(data?.requests)
        ? data.requests
        : [];

      const pagination = data?.pagination ?? requestsData?.pagination;

      const total =
        pagination?.totalItems ??
        pagination?.total ??
        pagination?.totalCount ??
        requests.length;

      const totalPages =
        pagination?.totalPages ??
        Math.max(1, Math.ceil(total / limit));

      const currentPage =
        pagination?.currentPage ??
        pagination?.page ??
        page;

      return {
        requests,
        page: currentPage,
        limit: pagination?.itemsPerPage ?? limit,
        total,
        totalPages,
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  updateRequestStatus: async ({
    id,
    status,
  }: UpdateCategoryRequestStatusPayload): Promise<CategoryRequest> => {
    try {
      const { data } = await API.patch(`/request/${id}/status`, { status });
      const payload = data?.data ?? data;
      return (payload?.request ?? payload) as CategoryRequest;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};

export function getCategoryRequestStatusColor(
  status: string
): {
  badge: string;
  dot: string;
} {
  const norm = status?.trim().toLowerCase();
  if (norm === "fulfilled") {
    return {
      badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20",
      dot: "bg-emerald-600",
    };
  }
  if (norm === "rejected") {
    return {
      badge: "bg-red-50 text-red-700 ring-1 ring-red-600/20",
      dot: "bg-red-600",
    };
  }
  return {
    badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20",
    dot: "bg-amber-600",
  };
}
