import { API } from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/api/error";
import type {
  ExpertDetail,
  ExpertsListResponse,
  ExpertsListResult,
  GetExpertsParams,
} from "./experts.types";

export const expertsApi = {
  getExperts: async ({
    page = 1,
    limit = 10,
  }: GetExpertsParams = {}): Promise<ExpertsListResult> => {
    try {
      const { data } = await API.get("/admin/experts", {
        params: { page, limit },
      });
      const payload = (data?.data ?? data) as ExpertsListResponse;
      const experts = payload?.experts ?? [];
      const total = payload?.total ?? payload?.totalCount ?? experts.length;
      const totalPages =
        payload?.totalPages ?? Math.max(1, Math.ceil(total / limit));

      return {
        experts,
        page: payload?.page ?? page,
        limit: payload?.limit ?? limit,
        total,
        totalPages,
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  getExpertById: async (expertId: string): Promise<ExpertDetail> => {
    try {
      const { data } = await API.get(`/admin/experts/${expertId}`);
      const payload = data?.data ?? data;
      return (payload?.expert ?? payload?.user ?? payload) as ExpertDetail;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};
