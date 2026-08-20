import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reportIssuesApi } from "./report-issues.api";
import type {
  GetReportIssuesParams,
  ReportIssueStatus,
} from "./report-issues.types";

export const REPORT_ISSUES_QUERY_KEYS = {
  all: ["report-issues"] as const,
  lists: () => [...REPORT_ISSUES_QUERY_KEYS.all, "list"] as const,
  list: (params: GetReportIssuesParams) =>
    [...REPORT_ISSUES_QUERY_KEYS.lists(), params] as const,
  details: () => [...REPORT_ISSUES_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...REPORT_ISSUES_QUERY_KEYS.details(), id] as const,
};

export function useReportIssues(params: GetReportIssuesParams) {
  return useQuery({
    queryKey: REPORT_ISSUES_QUERY_KEYS.list(params),
    queryFn: () => reportIssuesApi.getReportIssues(params),
  });
}

export function useReportIssue(id: string) {
  return useQuery({
    queryKey: REPORT_ISSUES_QUERY_KEYS.detail(id),
    queryFn: () => reportIssuesApi.getReportIssueById(id),
    enabled: !!id,
  });
}

export function useUpdateReportIssueStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: ReportIssueStatus;
    }) => reportIssuesApi.updateReportIssueStatus(id, status),
    onSuccess: (_, variables) => {
      // Invalidate both lists and specific detail
      queryClient.invalidateQueries({
        queryKey: REPORT_ISSUES_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: REPORT_ISSUES_QUERY_KEYS.detail(variables.id),
      });
    },
  });
}
