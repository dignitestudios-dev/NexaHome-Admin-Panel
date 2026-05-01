import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { paymentApi } from "./payment.api";
import type { CreatePaymentPayload, PaymentListParams } from "./payment.types";

// Centralized query keys so invalidation stays consistent.
export const paymentKeys = {
  all: ["payments"] as const,
  list: (params: PaymentListParams) =>
    [...paymentKeys.all, "list", params] as const,
  detail: (id: string) => [...paymentKeys.all, "detail", id] as const,
};

export function usePayments(params: PaymentListParams) {
  return useQuery({
    queryKey: paymentKeys.list(params),
    queryFn: () => paymentApi.getPayments(params),
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: paymentKeys.detail(id),
    queryFn: () => paymentApi.getPaymentById(id),
    enabled: Boolean(id),
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePaymentPayload) =>
      paymentApi.createPayment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
    },
  });
}

export function useRefundPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => paymentApi.refundPayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
    },
  });
}
