import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invitationsApi } from "./invitations.api";
import type { GetInvitationsParams } from "./invitations.types";

export const invitationKeys = {
  all: ["invitations"] as const,
  list: (params: GetInvitationsParams) => ["invitations", "list", params] as const,
};

export function useInvitations(params: GetInvitationsParams = {}) {
  const { page = 1, limit = 10, search } = params;

  return useQuery({
    queryKey: invitationKeys.list({ page, limit, search }),
    queryFn: () => invitationsApi.getInvitations({ page, limit, search }),
  });
}

export function useDownloadInvitationTemplate() {
  return useMutation({
    mutationFn: () => invitationsApi.downloadTemplate(),
  });
}

export function useUploadInvitations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => invitationsApi.uploadInvitations(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.all });
    },
  });
}
