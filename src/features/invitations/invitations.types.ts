export interface Invitation {
  _id: string;
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetInvitationsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface InvitationsPagination {
  itemsPerPage?: number;
  currentPage?: number;
  totalItems?: number;
  totalPages?: number;
}

export interface InvitationsListResponse {
  invitations?: Invitation[];
  pagination?: InvitationsPagination;
  page?: number;
  limit?: number;
  total?: number;
  totalCount?: number;
  totalPages?: number;
}

export interface InvitationsListResult {
  invitations: Invitation[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface InvitationUploadError {
  row: number;
  reason: string;
}

export interface InvitationUploadResult {
  total: number;
  sent: number;
  skipped: number;
  errors: InvitationUploadError[];
}
