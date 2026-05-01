import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PaymentListParams, PaymentStatus } from "./payment.types";

// Redux holds the client-side UI state (filters, selection, modal).
// The server data itself is owned by TanStack Query.
interface PaymentState {
  filters: PaymentListParams;
  selectedPaymentId: string | null;
  isCreateModalOpen: boolean;
}

const initialState: PaymentState = {
  filters: { page: 1, pageSize: 10 },
  selectedPaymentId: null,
  isCreateModalOpen: false,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.filters.page = action.payload;
    },
    setStatusFilter(state, action: PayloadAction<PaymentStatus | undefined>) {
      state.filters.status = action.payload;
      state.filters.page = 1;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
      state.filters.page = 1;
    },
    selectPayment(state, action: PayloadAction<string | null>) {
      state.selectedPaymentId = action.payload;
    },
    setCreateModalOpen(state, action: PayloadAction<boolean>) {
      state.isCreateModalOpen = action.payload;
    },
  },
});

export const {
  setPage,
  setStatusFilter,
  setSearch,
  selectPayment,
  setCreateModalOpen,
} = paymentSlice.actions;

export default paymentSlice.reducer;
