export interface PartnerSummary {
  totalPartners: number;
  usersAddedViaReferral: number;
  jobsPostedViaReferral: number;
  revenueViaReferral: number;
}

export interface PartnerSummaryResponse {
  success?: boolean;
  message?: string;
  data?: PartnerSummary;
}

export interface PartnerProfilePicture {
  _id: string;
  fileName: string;
  key: string;
  mimetype: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface Partner {
  partnerId: string;
  partnerName: string | null;
  email?: string;
  profilePicture?: PartnerProfilePicture | string | null;
  referralCode: string | null;
  usersReferredCount: number;
  jobsPosted: number;
  revenueGenerated: number;
  status: string;
}

export type PartnerStatus = "active" | "inactive";

export interface UpdatePartnerStatusPayload {
  partnerId: string;
  status: PartnerStatus;
}

export interface GetPartnersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PartnersPagination {
  itemsPerPage?: number;
  currentPage?: number;
  totalItems?: number;
  totalPages?: number;
}

export interface PartnersListResponse {
  success?: boolean;
  message?: string;
  data?: {
    partners?: Partner[];
  };
  pagination?: PartnersPagination;
}

export interface PartnersListResult {
  partners: Partner[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
