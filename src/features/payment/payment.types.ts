export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded";

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  customerName: string;
  createdAt: string;
}

export interface PaymentListResponse {
  data: Payment[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PaymentListParams {
  page?: number;
  pageSize?: number;
  status?: PaymentStatus;
  search?: string;
}

// Payload to start/create a payment.
export interface CreatePaymentPayload {
  amount: number;
  currency: string;
  customerName: string;
}
