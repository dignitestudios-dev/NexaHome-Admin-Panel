import { API } from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/api/error";
import type {
  Admin,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  UpdatePasswordPayload,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from "./auth.types";

export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    try {
      const { data } = await API.post("/admin/auth/login", payload);
      // Handle both wrapped ({ data: {...} }) and flat responses.
      return (data?.data ?? data) as LoginResponse;
    } catch (error) {
      // Re-throw with the API's message (e.g. "Invalid email or password").
      throw new Error(getApiErrorMessage(error));
    }
  },

  forgotPassword: async (payload: ForgotPasswordPayload): Promise<void> => {
    try {
      await API.post("/admin/auth/forgot", payload);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  verifyOtp: async (payload: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
    try {
      const { data } = await API.post("/admin/auth/verify-otp", payload);
      return (data?.data ?? data) as VerifyOtpResponse;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  updatePassword: async (payload: UpdatePasswordPayload): Promise<void> => {
    try {
      await API.post("/admin/auth/update-password", payload);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  getMe: async (): Promise<Admin> => {
    try {
      const { data } = await API.get("/admin/auth/me");
      // Unwrap { data: { admin } } / { data } / flat shapes.
      const payload = data?.data ?? data;
      return (payload?.admin ?? payload) as Admin;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  updateProfile: async (formData: FormData): Promise<Admin> => {
    try {
      const { data } = await API.post("/admin/auth/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const payload = data?.data ?? data;
      return (payload?.admin ?? payload) as Admin;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  logout: async (): Promise<void> => {
    try {
      await API.post("/admin/auth/logout");
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};
