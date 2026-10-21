import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryRequestsApi } from "./category-requests.api";
import type {
  GetCategoryRequestsParams,
  UpdateCategoryRequestStatusPayload,
} from "./category-requests.types";

export const categoryRequestKeys = {
  all: ["category-requests"] as const,
  list: (params: GetCategoryRequestsParams) =>
    ["category-requests", "list", params] as const,
};

export function useCategoryRequests(params: GetCategoryRequestsParams = {}) {
  const { page = 1, limit = 10, status = "pending", search } = params;

  return useQuery({
    queryKey: categoryRequestKeys.list({ page, limit, status, search }),
    queryFn: () =>
      categoryRequestsApi.getRequests({ page, limit, status, search }),
  });
}

export function useUpdateCategoryRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCategoryRequestStatusPayload) =>
      categoryRequestsApi.updateRequestStatus(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryRequestKeys.all });
    },
  });
}
