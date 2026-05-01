import { API } from "@/lib/axios";
import type {
  CreatePaymentPayload,
  Payment,
  PaymentListParams,
  PaymentListResponse,
} from "./payment.types";

export const paymentApi = {
  getPayments: async (
    params: PaymentListParams
  ): Promise<PaymentListResponse> => {
    const { data } = await API.get<PaymentListResponse>("/payments", {
      params,
    });
    return data;
  },

  getPaymentById: async (id: string): Promise<Payment> => {
    const { data } = await API.get<Payment>(`/payments/${id}`);
    return data;
  },

  createPayment: async (payload: CreatePaymentPayload): Promise<Payment> => {
    const { data } = await API.post<Payment>("/payments", payload);
    return data;
  },

  refundPayment: async (id: string): Promise<Payment> => {
    const { data } = await API.post<Payment>(`/payments/${id}/refund`);
    return data;
  },
};
