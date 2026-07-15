import { useMutation, useQuery } from "@tanstack/react-query";
import { reportsApi } from "./reports.api";
import type { GetReportsParams, ReportTab } from "./reports.types";

export const reportKeys = {
  all: ["reports"] as const,
  list: (tab: ReportTab, params: GetReportsParams) =>
    ["reports", tab, params] as const,
};

export function useReports(params: GetReportsParams = {}) {
  const {
    tab = "users",
    page = 1,
    limit = 10,
    startDate,
    endDate,
    search,
  } = params;
  const normalizedSearch = search?.trim() ?? "";

  return useQuery({
    queryKey: reportKeys.list(tab, {
      page,
      limit,
      startDate,
      endDate,
      search: normalizedSearch || undefined,
    }),
    queryFn: () =>
      reportsApi.getReport({
        tab,
        page,
        limit,
        startDate,
        endDate,
        search: normalizedSearch || undefined,
      }),
  });
}

/** @deprecated Prefer useReports */
export function useReportsUsers(params: GetReportsParams = {}) {
  return useReports({ ...params, tab: "users" });
}

export function useDownloadReport() {
  return useMutation({
    mutationFn: (params: GetReportsParams = {}) =>
      reportsApi.downloadReport(params),
  });
}

/** @deprecated Prefer useDownloadReport */
export function useDownloadUsersReport() {
  return useMutation({
    mutationFn: (filters: GetReportsParams = {}) =>
      reportsApi.downloadReport({ ...filters, tab: "users" }),
  });
}
