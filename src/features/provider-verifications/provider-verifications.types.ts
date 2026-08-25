export type ProviderVerificationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "not-provided"
  | "resubmission"
  | "all";

export interface FileDocument {
  _id: string;
  fileName: string;
  key: string;
  mimetype: string;
  location: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProviderVerification {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  profilePicture: FileDocument | null;
  identityStatus: Exclude<ProviderVerificationStatus, "all">;
  identityRejectReason: string | null;
  idCard: {
    front: FileDocument | null;
    back: FileDocument | null;
  };
  isProfileCompleted: boolean;
  businessDocsSubmitted: boolean;
  portfolioMediaUploaded: boolean;
  createdAt: string; 
  updatedAt: string;
}

export interface ProviderVerificationsResponse {
  success: boolean;
  message: string;
  data: {
    providers: ProviderVerification[];
  };
  pagination: {
    itemsPerPage: number;
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface ProviderVerificationDetailsResponse {
  success: boolean;
  message: string;
  data: ProviderVerification;
}
