import { useQuery } from "@tanstack/react-query";
import { jobsActivityApi } from "./jobs-activity.api";
import type { GetJobsActivityParams } from "./jobs-activity.types";

export const jobsActivityKeys = {
  all: ["jobs-activity"] as const,
  list: (params: GetJobsActivityParams) =>
    ["jobs-activity", "list", params] as const,
};

export function useJobsActivity(params: GetJobsActivityParams) {
  const { page = 1, limit = 10, status } = params;

  return useQuery({
    queryKey: jobsActivityKeys.list({ page, limit, status }),
    queryFn: () => jobsActivityApi.getJobsActivity({ page, limit, status }),
  });
}
