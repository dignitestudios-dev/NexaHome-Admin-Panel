import { API } from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/api/error";
import type {
  CategoriesListResponse,
  CategoriesListResult,
  Category,
  CreateCategoryPayload,
  GetCategoriesParams,
  UpdateCategoryPayload,
} from "./categories.types";

const MAX_CATEGORY_ICON_SIZE_BYTES = 2 * 1024 * 1024;
export const MAX_CATEGORY_NAME_LENGTH = 40;
export const MAX_CATEGORY_CREDITS_DIGITS = 6;
export const MAX_CATEGORY_CREDITS = 999_999;
const ALLOWED_CATEGORY_ICON_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
]);
const ALLOWED_CATEGORY_ICON_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp"]);

export function validateCategoryIcon(file: File): string | null {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (file.type === "image/gif" || extension === "gif") {
    return "Only PNG, JPEG, or WEBP image formats are allowed.";
  }

  const hasAllowedType =
    ALLOWED_CATEGORY_ICON_TYPES.has(file.type) ||
    ALLOWED_CATEGORY_ICON_EXTENSIONS.has(extension);

  if (!hasAllowedType) {
    return "Only PNG, JPEG, or WEBP image formats are allowed.";
  }

  if (file.size > MAX_CATEGORY_ICON_SIZE_BYTES) {
    return "Image must be 2MB or smaller.";
  }

  return null;
}

export function validateCategoryName(name: string): string | null {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return "Category name is required.";
  }

  if (trimmedName.length > MAX_CATEGORY_NAME_LENGTH) {
    return `Category name must be ${MAX_CATEGORY_NAME_LENGTH} characters or less.`;
  }

  // Reject input consisting only of special characters or symbols
  if (!/[\p{L}\p{N}]/u.test(trimmedName)) {
    return "Category name cannot consist of special characters only.";
  }

  // Must contain at least one letter
  if (!/\p{L}/u.test(trimmedName)) {
    return "Category name must contain at least one letter.";
  }

  if (trimmedName.length < 2) {
    return "Category name must be at least 2 characters.";
  }

  // Allow letters, numbers, spaces, and standard service category symbols: & - / ' , . ( )
  const VALID_CATEGORY_NAME_REGEX = /^[\p{L}\p{N}\s&/'.,()\-]+$/u;
  if (!VALID_CATEGORY_NAME_REGEX.test(trimmedName)) {
    return "Category name contains invalid characters. Only letters, numbers, spaces, and basic symbols (&, -, ', /, ,, ., ()) are allowed.";
  }

  return null;
}

export function validateCategoryCredits(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "This field is required.";

  const number = Number(trimmed);
  if (!Number.isFinite(number) || !Number.isInteger(number)) {
    return "Must be a whole number.";
  }
  if (number < 1) {
    return "Must be at least 1.";
  }
  if (number > MAX_CATEGORY_CREDITS) {
    return `Must be ${MAX_CATEGORY_CREDITS.toLocaleString("en-US")} or less.`;
  }

  return null;
}

function sortCategoriesAlphabetically(categories: Category[]): Category[] {
  return [...categories].sort((a, b) =>
    (a.name ?? "").localeCompare(b.name ?? "", undefined, {
      sensitivity: "base",
    })
  );
}

export const categoriesApi = {
  getCategories: async ({
    page = 1,
    limit = 10,
    search,
    status = "all",
  }: GetCategoriesParams = {}): Promise<CategoriesListResult> => {
    try {
      const params: Record<string, string | number> = {
        page,
        limit,
        status: status || "all",
      };
      if (search?.trim()) params.search = search.trim();

      const { data } = await API.get("/admin/categories", { params });
      const payload = (data?.data ?? data) as CategoriesListResponse;
      const categories = sortCategoriesAlphabetically(payload?.categories ?? []);
      const pagination = payload?.pagination;

      const total =
        pagination?.totalItems ??
        payload?.total ??
        payload?.totalCount ??
        categories.length;
      const totalPages =
        pagination?.totalPages ??
        payload?.totalPages ??
        Math.max(1, Math.ceil(total / limit));

      return {
        categories,
        page: pagination?.currentPage ?? payload?.page ?? page,
        limit: pagination?.itemsPerPage ?? payload?.limit ?? limit,
        total,
        totalPages,
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  getCategoryById: async (id: string): Promise<Category> => {
    try {
      const { data } = await API.get(`/admin/categories/${id}`);
      const payload = data?.data ?? data;
      return (payload?.category ?? payload) as Category;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  createCategory: async ({
    name,
    description,
    icon,
    oneTimeCredits,
    recurringCredits,
    primary_phrases,
    alternate_keywords,
    related_search_phrases,
    relatedCategories,
  }: CreateCategoryPayload): Promise<Category> => {
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      if (description?.trim()) {
        formData.append("description", description.trim());
      }
      formData.append("oneTimeCredits", String(oneTimeCredits));
      formData.append("recurringCredits", String(recurringCredits));
      formData.append("icon", icon);

      const { data } = await API.post("/admin/categories", formData);
      const payload = data?.data ?? data;
      let category = (payload?.category ?? payload) as Category;

      // If array fields are provided, update category via JSON to guarantee array types
      const hasExtraFields =
        (primary_phrases && primary_phrases.length > 0) ||
        (alternate_keywords && alternate_keywords.length > 0) ||
        (related_search_phrases && related_search_phrases.length > 0) ||
        (relatedCategories && relatedCategories.length > 0);

      if (hasExtraFields && category?._id) {
        const patchData: Record<string, unknown> = {
          name: name.trim(),
        };
        if (primary_phrases !== undefined) patchData.primary_phrases = primary_phrases;
        if (alternate_keywords !== undefined) patchData.alternate_keywords = alternate_keywords;
        if (related_search_phrases !== undefined) patchData.related_search_phrases = related_search_phrases;
        if (relatedCategories !== undefined) patchData.relatedCategories = relatedCategories;

        const updateRes = await API.patch(`/admin/categories/${category._id}`, patchData);
        const updatePayload = updateRes?.data?.data ?? updateRes?.data;
        if (updatePayload?.category || updatePayload?._id) {
          category = (updatePayload?.category ?? updatePayload) as Category;
        }
      }

      return category;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  updateCategory: async ({
    id,
    name,
    description,
    icon,
    oneTimeCredits,
    recurringCredits,
    dollarPrice,
    isActive,
    primary_phrases,
    alternate_keywords,
    related_search_phrases,
    relatedCategories,
  }: UpdateCategoryPayload): Promise<Category> => {
    try {
      // If no new icon is uploaded, send pure JSON to preserve array structure (even for 1 item)
      if (!icon) {
        const jsonPayload: Record<string, unknown> = {
          name: name.trim(),
          isactive: isActive,
          isActive: isActive,
        };
        if (description?.trim()) jsonPayload.description = description.trim();
        if (oneTimeCredits != null) jsonPayload.oneTimeCredits = oneTimeCredits;
        if (recurringCredits != null) jsonPayload.recurringCredits = recurringCredits;
        if (dollarPrice != null) {
          jsonPayload.dollarPrice = dollarPrice;
          jsonPayload.price = dollarPrice;
        }
        if (primary_phrases !== undefined) jsonPayload.primary_phrases = primary_phrases;
        if (alternate_keywords !== undefined) jsonPayload.alternate_keywords = alternate_keywords;
        if (related_search_phrases !== undefined) jsonPayload.related_search_phrases = related_search_phrases;
        if (relatedCategories !== undefined) jsonPayload.relatedCategories = relatedCategories;

        const { data } = await API.patch(`/admin/categories/${id}`, jsonPayload);
        const payload = data?.data ?? data;
        return (payload?.category ?? payload) as Category;
      }

      // When icon file is uploaded, use FormData for the file and basic properties
      const formData = new FormData();
      formData.append("name", name.trim());
      if (description?.trim()) {
        formData.append("description", description.trim());
      }
      formData.append("icon", icon);
      if (oneTimeCredits != null) {
        formData.append("oneTimeCredits", String(oneTimeCredits));
      }
      if (recurringCredits != null) {
        formData.append("recurringCredits", String(recurringCredits));
      }
      if (dollarPrice != null) {
        formData.append("dollarPrice", String(dollarPrice));
        formData.append("price", String(dollarPrice));
      }
      formData.append("isactive", String(isActive));
      formData.append("isActive", String(isActive));

      const { data } = await API.patch(`/admin/categories/${id}`, formData);
      const payload = data?.data ?? data;
      let updatedCategory = (payload?.category ?? payload) as Category;

      // Ensure array fields with any length (including 1) are cleanly updated via JSON
      const hasArrayFields =
        primary_phrases !== undefined ||
        alternate_keywords !== undefined ||
        related_search_phrases !== undefined ||
        relatedCategories !== undefined;

      if (hasArrayFields) {
        const arrayPayload: Record<string, unknown> = {
          name: name.trim(),
        };
        if (primary_phrases !== undefined) arrayPayload.primary_phrases = primary_phrases;
        if (alternate_keywords !== undefined) arrayPayload.alternate_keywords = alternate_keywords;
        if (related_search_phrases !== undefined) arrayPayload.related_search_phrases = related_search_phrases;
        if (relatedCategories !== undefined) arrayPayload.relatedCategories = relatedCategories;

        const arrayRes = await API.patch(`/admin/categories/${id}`, arrayPayload);
        const arrayResPayload = arrayRes?.data?.data ?? arrayRes?.data;
        if (arrayResPayload?.category || arrayResPayload?._id) {
          updatedCategory = (arrayResPayload?.category ?? arrayResPayload) as Category;
        }
      }

      return updatedCategory;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  deleteCategory: async (id: string): Promise<void> => {
    try {
      await API.delete(`/admin/categories/${id}`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};

export function formatCategoryPricing(pricing?: {
  oneTimeCredits?: number;
  recurringCredits?: number;
} | null) {
  return {
    oneTime:
      pricing?.oneTimeCredits != null ? String(pricing.oneTimeCredits) : "—",
    recurring:
      pricing?.recurringCredits != null ? String(pricing.recurringCredits) : "—",
  };
}
