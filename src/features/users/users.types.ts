export interface UserCategory {
  _id?: string;
  name?: string;
  slug?: string;
}

export type UserSelectedCategory = string | UserCategory;

export interface UserProfilePicture {
  _id: string;
  fileName: string;
  key: string;
  mimetype: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  email: string;
  role: string;
  name: string;
  profilePicture: UserProfilePicture | string | null;
  isDeactivatedByAdmin: boolean;
  selectedCategories: UserSelectedCategory[];
  joinDate: string;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface UsersPagination {
  itemsPerPage?: number;
  currentPage?: number;
  totalItems?: number;
  totalPages?: number;
}

export interface UsersListResult {
  users: User[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UsersListResponse {
  success?: boolean;
  message?: string;
  data?: {
    users?: User[];
  };
  pagination?: UsersPagination;
  users?: User[];
  page?: number;
  limit?: number;
  total?: number;
  totalCount?: number;
  totalPages?: number;
}
