import { API } from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/api/error";
import type {
  GetPartnersParams,
  Partner,
  PartnerStatus,
  PartnerSummary,
  PartnerSummaryResponse,
  PartnersListResponse,
  PartnersListResult,
  UpdatePartnerStatusPayload,
} from "./partners.types";

export const partnersApi = {
  getSummary: async (): Promise<PartnerSummary> => {
    try {
      const { data } = await API.get<PartnerSummaryResponse>(
        "/admin/partners/summary"
      );
      const payload = (data?.data ?? data) as PartnerSummary;
      return {
        totalPartners: payload?.totalPartners ?? 0,
        usersAddedViaReferral: payload?.usersAddedViaReferral ?? 0,
        jobsPostedViaReferral: payload?.jobsPostedViaReferral ?? 0,
        revenueViaReferral: payload?.revenueViaReferral ?? 0,
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  getPartners: async ({
    page = 1,
    limit = 10,
    search,
  }: GetPartnersParams = {}): Promise<PartnersListResult> => {
    try {
      const { data } = await API.get<PartnersListResponse>("/admin/partners", {
        params: { page, limit, ...(search?.trim() ? { search } : {}) },
      });

      const partners = data?.data?.partners ?? [];
      const pagination = data?.pagination;

      const total =
        pagination?.totalItems ??
        partners.length;

      const totalPages =
        pagination?.totalPages ??
        Math.max(1, Math.ceil(total / limit));

      return {
        partners,
        page: pagination?.currentPage ?? page,
        limit: pagination?.itemsPerPage ?? limit,
        total,
        totalPages,
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  updatePartnerStatus: async ({
    partnerId,
    status,
  }: UpdatePartnerStatusPayload): Promise<void> => {
    try {
      await API.patch(`/admin/partners/${partnerId}/status`, { status });
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};

export function formatPartnerCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatPartnerRevenue(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function getPartnerDisplayName(partner: Partner) {
  return partner.partnerName?.trim() || "—";
}

export function getPartnerReferralCode(partner: Partner) {
  return partner.referralCode?.trim() || "—";
}

export function getPartnerInitials(name?: string | null) {
  if (!name?.trim()) return "NA";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function getPartnerProfileImageUrl(partner: Partner) {
  if (!partner.profilePicture) return undefined;
  if (typeof partner.profilePicture === "string") return partner.profilePicture;
  return partner.profilePicture.location ?? undefined;
}

export function formatPartnerStatus(status?: string) {
  if (!status) return "—";

  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

export function isPartnerActive(status?: string) {
  return status?.toLowerCase() === "active";
}

export function getToggledPartnerStatus(status?: string): PartnerStatus {
  return isPartnerActive(status) ? "inactive" : "active";
}
