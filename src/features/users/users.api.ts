import { API } from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/api/error";
import type {
  GetUsersParams,
  User,
  UsersListResponse,
  UsersListResult,
} from "./users.types";

export const usersApi = {
  getUsers: async ({
    page = 1,
    limit = 10,
    search,
  }: GetUsersParams = {}): Promise<UsersListResult> => {
    try {
      const params: Record<string, string | number> = { page, limit };
      if (search?.trim()) params.search = search.trim();

      const { data } = await API.get<UsersListResponse>("/admin/users", {
        params,
      });

      const users = data?.data?.users ?? data?.users ?? [];
      const pagination = data?.pagination;

      const total = pagination?.totalItems ?? users.length;

      const totalPages =
        pagination?.totalPages ?? Math.max(1, Math.ceil(total / limit));

      return {
        users,
        page: pagination?.currentPage ?? page,
        limit: pagination?.itemsPerPage ?? limit,
        total,
        totalPages,
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  toggleUserDeactivate: async (id: string): Promise<User> => {
    try {
      const { data } = await API.patch(`/admin/users/${id}/deactivate`);
      const payload = data?.data ?? data;
      return (payload?.user ?? payload) as User;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};
