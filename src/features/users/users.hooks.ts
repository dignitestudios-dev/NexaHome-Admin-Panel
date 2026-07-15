import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { usersApi } from "./users.api";
import type { User, UsersListResult, UserStatusFilter, UserTypeFilter } from "./users.types";

export const userKeys = {
  all: ["users"] as const,
  list: (
    page: number,
    limit: number,
    search: string,
    status: UserStatusFilter,
    userType: UserTypeFilter
  ) => ["users", "list", page, limit, search, status, userType] as const,
};

export function useUsers(
  page = 1,
  limit = 10,
  search?: string,
  status: UserStatusFilter = "all",
  userType: UserTypeFilter = "all"
) {
  const normalizedSearch = search?.trim() ?? "";

  return useQuery({
    queryKey: userKeys.list(page, limit, normalizedSearch, status, userType),
    queryFn: () =>
      usersApi.getUsers({
        page,
        limit,
        search: normalizedSearch || undefined,
        status,
        userType,
      }),
  });
}

type ToggleUserDeactivateVariables = {
  userId: string;
  currentUser: User;
};

export function useToggleUserDeactivate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, currentUser }: ToggleUserDeactivateVariables) => {
      const result = await usersApi.toggleUserDeactivate(userId);
      if (result?._id) return result;
      return {
        ...currentUser,
        isDeactivatedByAdmin: !currentUser.isDeactivatedByAdmin,
      };
    },
    onMutate: async ({ userId, currentUser }) => {
      await queryClient.cancelQueries({ queryKey: userKeys.all });

      const previousQueries = queryClient.getQueriesData<UsersListResult>({
        queryKey: userKeys.all,
      });

      const optimisticUser: User = {
        ...currentUser,
        isDeactivatedByAdmin: !currentUser.isDeactivatedByAdmin,
      };

      queryClient.setQueriesData<UsersListResult>(
        { queryKey: userKeys.all },
        (old) => {
          if (!old?.users) return old;
          return {
            ...old,
            users: old.users.map((user) =>
              user._id === userId ? optimisticUser : user
            ),
          };
        }
      );

      return { previousQueries, optimisticUser };
    },
    onError: (_error, _variables, context) => {
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSuccess: (updatedUser, { userId }) => {
      queryClient.setQueriesData<UsersListResult>(
        { queryKey: userKeys.all },
        (old) => {
          if (!old?.users) return old;
          return {
            ...old,
            users: old.users.map((user) =>
              user._id === userId ? { ...user, ...updatedUser } : user
            ),
          };
        }
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
