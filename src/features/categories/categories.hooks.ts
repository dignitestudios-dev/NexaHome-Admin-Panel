import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "./categories.api";
import type {
  CategoriesListResult,
  Category,
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
  const { page = 1, limit = 10, search, status = "all" } = params;

  return useQuery({
    queryKey: categoryKeys.list({ page, limit, search, status }),
    queryFn: () =>
      categoriesApi.getCategories({ page, limit, search, status }),
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

function applyCategoryPatch(
  category: Category,
  variables: UpdateCategoryPayload,
  serverCategory?: Category
): Category {
  return {
    ...category,
    ...serverCategory,
    name: serverCategory?.name ?? variables.name,
    isActive: serverCategory?.isActive ?? variables.isActive,
    icon: serverCategory?.icon ?? category.icon,
  };
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCategoryPayload) =>
      categoriesApi.updateCategory(payload),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: categoryKeys.all });

      const previousLists = queryClient.getQueriesData<CategoriesListResult>({
        queryKey: categoryKeys.all,
      });
      const previousDetail = queryClient.getQueryData<Category>(
        categoryKeys.detail(variables.id)
      );

      queryClient.setQueriesData<CategoriesListResult>(
        { queryKey: categoryKeys.all },
        (old) => {
          if (!old?.categories) return old;
          return {
            ...old,
            categories: old.categories.map((item) =>
              item._id === variables.id
                ? applyCategoryPatch(item, variables)
                : item
            ),
          };
        }
      );

      if (previousDetail) {
        queryClient.setQueryData<Category>(
          categoryKeys.detail(variables.id),
          applyCategoryPatch(previousDetail, variables)
        );
      }

      return { previousLists, previousDetail };
    },
    onError: (_error, variables, context) => {
      context?.previousLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      if (context?.previousDetail) {
        queryClient.setQueryData(
          categoryKeys.detail(variables.id),
          context.previousDetail
        );
      }
    },
    onSuccess: (updatedCategory, variables) => {
      queryClient.setQueriesData<CategoriesListResult>(
        { queryKey: categoryKeys.all },
        (old) => {
          if (!old?.categories) return old;
          return {
            ...old,
            categories: old.categories.map((item) =>
              item._id === variables.id
                ? applyCategoryPatch(item, variables, updatedCategory)
                : item
            ),
          };
        }
      );
      queryClient.setQueryData<Category>(
        categoryKeys.detail(variables.id),
        (old) =>
          old
            ? applyCategoryPatch(old, variables, updatedCategory)
            : updatedCategory
      );
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(variables.id),
      });
    },
  });
}
