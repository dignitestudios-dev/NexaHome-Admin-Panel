import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "./categories.api";
import type {
  CreateCategoryPayload,
  GetCategoriesParams,
  UpdateCategoryPayload,
} from "./categories.types";

export const categoryKeys = {
  all: ["categories"] as const,
  list: (params: GetCategoriesParams) => ["categories", "list", params] as const,
  detail: (id: string) => ["categories", "detail", id] as const,
};

export function useCategories(params: GetCategoriesParams = {}) {
  const { page = 1, limit = 10, search } = params;

  return useQuery({
    queryKey: categoryKeys.list({ page, limit, search }),
    queryFn: () => categoriesApi.getCategories({ page, limit, search }),
  });
}

export function useCategory(id: string, enabled = true) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoriesApi.getCategoryById(id),
    enabled: enabled && Boolean(id),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      categoriesApi.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCategoryPayload) =>
      categoriesApi.updateCategory(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(variables.id),
      });
    },
  });
}
