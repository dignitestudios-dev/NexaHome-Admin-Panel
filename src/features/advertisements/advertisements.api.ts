import { API } from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/api/error";
import type {
  Advertisement,
  AdvertisementTab,
  AdvertisementsListResponse,
  AdvertisementsListResult,
  CreateAdvertisementPayload,
  GetAdvertisementsParams,
} from "./advertisements.types";

function normalizeAdvertisementsList(
  raw: unknown
): { advertisements: Advertisement[]; pagination?: AdvertisementsListResponse["pagination"]; meta?: AdvertisementsListResponse } {
  if (Array.isArray(raw)) {
    return { advertisements: raw as Advertisement[] };
  }

  const payload = (raw ?? {}) as AdvertisementsListResponse;
  return {
    advertisements: payload.advertisements ?? payload.ads ?? [],
    pagination: payload.pagination,
    meta: payload,
  };
}

export const advertisementsApi = {
  getAdvertisements: async ({
    tab = "daily",
    search,
    status = "all",
    page = 1,
    limit = 10,
  }: GetAdvertisementsParams = {}): Promise<AdvertisementsListResult> => {
    try {
      const params: Record<string, string | number> = { tab, page, limit };
      if (search?.trim()) params.search = search.trim();
      if (status && status !== "all") params.status = status;

      const { data } = await API.get("/admin/advertisements", { params });
      const { advertisements, pagination, meta } = normalizeAdvertisementsList(
        data?.data ?? data
      );

      const total =
        pagination?.totalItems ??
        meta?.total ??
        meta?.totalCount ??
        advertisements.length;
      const totalPages =
        pagination?.totalPages ??
        meta?.totalPages ??
        Math.max(1, Math.ceil(total / limit));

      return {
        advertisements,
        page: pagination?.currentPage ?? meta?.page ?? page,
        limit: pagination?.itemsPerPage ?? meta?.limit ?? limit,
        total,
        totalPages,
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  createAdvertisement: async ({
    media,
    duration,
    categoryId,
    targetRadiusMiles,
    link,
    addressDetails,
  }: CreateAdvertisementPayload): Promise<Advertisement> => {
    try {
      const formData = new FormData();
      formData.append("media", media);
      formData.append("duration", duration);
      formData.append("categoryId", categoryId);
      formData.append("targetRadiusMiles", String(targetRadiusMiles));
      formData.append("link", link.trim());
      formData.append("addressDetails", JSON.stringify(addressDetails));

      const { data } = await API.post("/admin/advertisements", formData);
      const payload = data?.data ?? data;
      return (payload?.advertisement ?? payload) as Advertisement;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};

export const ADVERTISEMENT_DURATION_OPTIONS = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
] as const;

export function getAdServiceProvider(ad: Advertisement): string {
  if (!ad.serviceProvider) {
    return ad.isAdminAd ? "Admin" : "—";
  }
  if (typeof ad.serviceProvider === "string") return ad.serviceProvider;
  return ad.serviceProvider.name ?? "—";
}

export function getAdType(ad: Advertisement): string {
  return ad.adType ?? "—";
}

export function getAdCategory(ad: Advertisement): string {
  return ad.category?.name ?? "—";
}

export function getAdTargetLocation(ad: Advertisement): string {
  return ad.targetLocation?.trim() || "—";
}

export function formatAdDuration(duration?: string): string {
  if (!duration) return "—";
  const normalized = duration.trim().toLowerCase();
  if (normalized === "day") return "1 Day";
  if (normalized === "week") return "1 Week";
  if (normalized === "month") return "1 Month";
  return duration.charAt(0).toUpperCase() + duration.slice(1);
}

export function getAdDuration(ad: Advertisement): string {
  return formatAdDuration(ad.duration);
}

export function getAdMediaUrl(ad: Advertisement): string | undefined {
  return ad.media?.location;
}

export function isAdvertisementActive(
  status: Advertisement["status"] | undefined | null
): boolean {
  if (typeof status === "boolean") return status;
  if (typeof status === "string") {
    const normalized = status.trim().toLowerCase();
    return normalized === "active" || normalized === "true";
  }
  return false;
}

export function formatAdvertisementStatus(
  status: Advertisement["status"] | undefined | null
): string {
  if (status === undefined || status === null || status === "") return "—";
  return isAdvertisementActive(status) ? "Active" : "Inactive";
}

export function getAdvertisementStatusColor(
  status: Advertisement["status"] | undefined | null
): string {
  if (status === undefined || status === null || status === "") {
    return "text-slate-600";
  }
  return isAdvertisementActive(status) ? "text-[#16BC4E]" : "text-[#FF0000]";
}

export const ADVERTISEMENT_TABS = [
  { label: "Daily Ads", value: "daily" as AdvertisementTab },
  { label: "Weekly Ads", value: "weekly" as AdvertisementTab },
  { label: "Monthly Ads", value: "monthly" as AdvertisementTab },
  { label: "Admin Ads", value: "admin" as AdvertisementTab },
];

export function normalizeAdvertisementTab(tab: string | null): AdvertisementTab {
  const normalized = tab?.trim().toLowerCase();
  if (normalized === "daily" || normalized === "daily ads") return "daily";
  if (normalized === "weekly" || normalized === "weekly ads") return "weekly";
  if (normalized === "monthly" || normalized === "monthly ads") return "monthly";
  if (normalized === "admin" || normalized === "admin ads") return "admin";
  return "daily";
}
