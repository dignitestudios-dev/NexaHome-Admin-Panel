import { API } from "@/lib/axios";
import {
  ProviderVerification,
  ProviderVerificationsResponse,
  ProviderVerificationStatus,
  ProviderVerificationDetailsResponse,
} from "./provider-verifications.types";

export const fetchProviderVerifications = async (
  page = 1,
  limit = 10,
  status: ProviderVerificationStatus = "all",
  search = ""
): Promise<ProviderVerificationsResponse> => {
  const params: Record<string, string | number> = { page, limit };

  if (status && status !== "all") {
    params.status = status;
  }
  if (search) {
    params.search = search;
  }

  const { data } = await API.get<ProviderVerificationsResponse>("/admin/providers/verifications?status=pending", {
    params,
  });
  return data;
};

export const fetchProviderVerificationDetails = async (
  providerId: string
): Promise<ProviderVerification> => {
  const { data } = await API.get<ProviderVerificationDetailsResponse>(
    `/admin/providers/verifications/${providerId}`
  );
  return data.data;
};

export const updateProviderVerificationStatus = async ({
  providerId,
  status,
  rejectReason,
}: {
  providerId: string;
  status: "approved" | "rejected";
  rejectReason?: string;
}): Promise<ProviderVerification> => {
  const { data } = await API.patch<{ success: boolean; message: string; data: ProviderVerification }>(
    `/admin/providers/verifications/${providerId}/status`,
    {
      status,
      ...(status === "rejected" && rejectReason ? { rejectReason } : {}),
    }
  );
  return data.data;
};
