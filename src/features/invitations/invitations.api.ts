import { API } from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/api/error";
import type {
  GetInvitationsParams,
  Invitation,
  InvitationUploadResult,
  InvitationsListResponse,
  InvitationsListResult,
} from "./invitations.types";

function getFilenameFromDisposition(disposition?: string) {
  if (!disposition) return null;

  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1].replace(/['"]/g, ""));
  }

  const filenameMatch = disposition.match(/filename="?([^";]+)"?/i);
  return filenameMatch?.[1] ?? null;
}

function triggerFileDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export const invitationsApi = {
  getInvitations: async ({
    page = 1,
    limit = 10,
    search,
  }: GetInvitationsParams = {}): Promise<InvitationsListResult> => {
    try {
      const params: Record<string, string | number> = { page, limit };
      if (search?.trim()) params.search = search.trim();

      const { data } = await API.get("/admin/invitations", { params });
      const raw = data?.data ?? data;
      const invitations = Array.isArray(raw)
        ? (raw as Invitation[])
        : ((raw as InvitationsListResponse)?.invitations ?? []);
      const payload = Array.isArray(raw)
        ? ({} as InvitationsListResponse)
        : ((raw as InvitationsListResponse) ?? {});
      const pagination = payload.pagination;

      const total =
        pagination?.totalItems ??
        payload.total ??
        payload.totalCount ??
        invitations.length;
      const totalPages =
        pagination?.totalPages ??
        payload.totalPages ??
        Math.max(1, Math.ceil(total / limit));

      return {
        invitations,
        page: pagination?.currentPage ?? payload.page ?? page,
        limit: pagination?.itemsPerPage ?? payload.limit ?? limit,
        total,
        totalPages,
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  downloadTemplate: async (): Promise<void> => {
    try {
      const response = await API.get("/admin/invitations/template", {
        responseType: "blob",
      });

      const blob = response.data as Blob;
      const filename =
        getFilenameFromDisposition(
          response.headers["content-disposition"] as string | undefined
        ) ?? "invitations-template.csv";

      triggerFileDownload(blob, filename);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  uploadInvitations: async (file: File): Promise<InvitationUploadResult> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await API.post("/admin/invitations/upload", formData);
      const payload = (data?.data ?? data) as Partial<InvitationUploadResult>;
      return {
        total: payload?.total ?? 0,
        sent: payload?.sent ?? 0,
        skipped: payload?.skipped ?? 0,
        errors: Array.isArray(payload?.errors) ? payload.errors : [],
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};

export function getInvitationName(invitation: Invitation): string {
  return invitation.name ?? invitation.fullName ?? "—";
}

export function getInvitationEmail(invitation: Invitation): string {
  return invitation.email ?? "—";
}

export function getInvitationPhone(invitation: Invitation): string {
  return invitation.phone ?? invitation.phoneNumber ?? "—";
}

export function getInvitationInitials(name?: string) {
  if (!name?.trim()) return "NA";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
