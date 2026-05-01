import { useMutation, useQuery } from "@tanstack/react-query";
import { reportsApi } from "./reports.api";
import type {
  GetReportsUsersParams,
  ReportDateFilters,
} from "./reports.types";

export const reportKeys = {
  all: ["reports"] as const,
  users: (params: GetReportsUsersParams) =>
    ["reports", "users", params] as const,
};

export function useReportsUsers(params: GetReportsUsersParams = {}) {
  const { page = 1, limit = 10, startDate, endDate } = params;

  return useQuery({
    queryKey: reportKeys.users({ page, limit, startDate, endDate }),
    queryFn: () =>
      reportsApi.getUsersReport({ page, limit, startDate, endDate }),
  });
}

export function useDownloadUsersReport() {
  return useMutation({
    mutationFn: (filters: ReportDateFilters = {}) =>
      reportsApi.downloadUsersReport(filters),
  });
}
