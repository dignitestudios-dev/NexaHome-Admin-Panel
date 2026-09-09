import { useQuery } from "@tanstack/react-query";
import { expertsApi } from "./experts.api";

export const expertKeys = {
  all: ["experts"] as const,
  list: (page: number, limit: number, isBadgeActive?: boolean) =>
    ["experts", "list", page, limit, isBadgeActive] as const,
  detail: (id: string) => ["experts", "detail", id] as const,
};

export function useExperts(
  page = 1,
  limit = 10,
  isBadgeActive?: boolean
) {
  return useQuery({
    queryKey: expertKeys.list(page, limit, isBadgeActive),
    queryFn: () => expertsApi.getExperts({ page, limit, isBadgeActive }),
  });
}

export function useExpert(expertId: string, enabled = true) {
  return useQuery({
    queryKey: expertKeys.detail(expertId),
    queryFn: () => expertsApi.getExpertById(expertId),
    enabled: enabled && Boolean(expertId),
  });
}
