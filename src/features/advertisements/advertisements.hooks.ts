import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { advertisementsApi } from "./advertisements.api";
import type {
  CreateAdvertisementPayload,
  GetAdvertisementsParams,
  UpdateAdvertisementPayload,
} from "./advertisements.types";

export const advertisementKeys = {
  all: ["advertisements"] as const,
  list: (params: GetAdvertisementsParams) =>
    ["advertisements", "list", params] as const,
};

export function useAdvertisements(params: GetAdvertisementsParams = {}) {
  const { tab = "daily", search, status = "all", page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: advertisementKeys.list({ tab, search, status, page, limit }),
    queryFn: () =>
      advertisementsApi.getAdvertisements({ tab, search, status, page, limit }),
  });
}

export function useCreateAdvertisement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdvertisementPayload) =>
      advertisementsApi.createAdvertisement(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: advertisementKeys.all });
    },
  });
}

export function useUpdateAdvertisement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateAdvertisementPayload) =>
      advertisementsApi.updateAdvertisement(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: advertisementKeys.all });
    },
  });
}
