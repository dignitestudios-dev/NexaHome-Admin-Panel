import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProviderVerifications,
  fetchProviderVerificationDetails,
  updateProviderVerificationStatus,
} from "./provider-verifications.api";
import { ProviderVerificationStatus } from "./provider-verifications.types";

export const useProviderVerifications = (
  page: number,
  limit: number,
  search: string,
  status: ProviderVerificationStatus
) => {
  return useQuery({
    queryKey: ["providerVerifications", page, limit, search, status],
    queryFn: () => fetchProviderVerifications(page, limit, status, search),
    placeholderData: (previousData) => previousData,
  });
};

export const useProviderVerificationDetails = (providerId: string | null) => {
  return useQuery({
    queryKey: ["providerVerificationDetails", providerId],
    queryFn: () => {
      if (!providerId) throw new Error("Provider ID is required");
      return fetchProviderVerificationDetails(providerId);
    },
    enabled: !!providerId,
  });
};

export const useUpdateProviderVerificationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProviderVerificationStatus,
    onSuccess: (data, variables) => {
      // Invalidate verifications list
      queryClient.invalidateQueries({ queryKey: ["providerVerifications"] });
      // Invalidate specific detail query
      queryClient.invalidateQueries({
        queryKey: ["providerVerificationDetails", variables.providerId],
      });
    },
  });
};
