import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { partnersApi } from "./partners.api";
import type { GetPartnersParams } from "./partners.types";

export const partnerKeys = {
  all: ["partners"] as const,
  summary: ["partners", "summary"] as const,
  list: (page: number, limit: number, search?: string) =>
    ["partners", "list", page, limit, search ?? ""] as const,
};

export function usePartnerSummary() {
  return useQuery({
    queryKey: partnerKeys.summary,
    queryFn: () => partnersApi.getSummary(),
  });
}

export function usePartners(params: GetPartnersParams = {}) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const search = params.search ?? "";

  return useQuery({
    queryKey: partnerKeys.list(page, limit, search),
    queryFn: () => partnersApi.getPartners({ page, limit, search }),
  });
}

export function useUpdatePartnerStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: partnersApi.updatePartnerStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnerKeys.all });
    },
  });
}
