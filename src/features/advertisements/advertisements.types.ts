export type AdvertisementTab = "daily" | "weekly" | "monthly" | "admin";
export type AdvertisementDuration = "day" | "week" | "month";
export type AdvertisementStatusFilter = "all" | "active" | "inactive";

export interface AddressDetails {
  street: string;
  address: string;
  state: string;
  city: string;
  country: string;
  zipCode: string;
  lat: number;
  long: number;
}

export interface CreateAdvertisementPayload {
  media: File;
  duration: AdvertisementDuration;
  categoryId: string;
  targetRadiusMiles: number;
  link: string;
  addressDetails: AddressDetails;
}

export interface AdvertisementCategory {
  _id: string;
  name: string;
}

export interface AdvertisementMedia {
  _id: string;
  fileName?: string;
  key?: string;
  mimetype?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdvertisementServiceProvider {
  _id?: string;
  name?: string;
  email?: string;
}

export interface Advertisement {
  _id: string;
  serviceProvider: AdvertisementServiceProvider | string | null;
  adType: string;
  duration: string;
  category: AdvertisementCategory;
  targetLocation: string;
  targetRadiusMiles: number;
  status: boolean | string;
  startsAt: string;
  endsAt: string;
  link: string;
  media: AdvertisementMedia;
  isAdminAd: boolean;
  createdAt: string;
}

export interface GetAdvertisementsParams {
  tab?: AdvertisementTab;
  search?: string;
  status?: AdvertisementStatusFilter;
  page?: number;
  limit?: number;
}

export interface AdvertisementsPagination {
  itemsPerPage?: number;
  currentPage?: number;
  totalItems?: number;
  totalPages?: number;
}

export interface AdvertisementsListResponse {
  advertisements?: Advertisement[];
  ads?: Advertisement[];
  pagination?: AdvertisementsPagination;
  page?: number;
  limit?: number;
  total?: number;
  totalCount?: number;
  totalPages?: number;
}

export interface AdvertisementsListResult {
  advertisements: Advertisement[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
