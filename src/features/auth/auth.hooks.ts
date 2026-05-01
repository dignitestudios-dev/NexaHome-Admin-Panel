import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "./auth.api";
import {
  clearAuthTokenCookie,
  setAuthTokenCookie,
  setResetToken,
} from "@/lib/auth-session";
import type {
  ForgotPasswordPayload,
  LoginPayload,
  UpdatePasswordPayload,
  VerifyOtpPayload,
} from "./auth.types";

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      // Save token so the axios interceptor attaches it to future requests.
      if (data?.token) {
        setAuthTokenCookie(data.token);
      }
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      authApi.forgotPassword(payload),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => authApi.verifyOtp(payload),
    onSuccess: (data) => {
      // Keep the resetToken for the change-password step.
      if (data?.resetToken) {
        setResetToken(data.resetToken);
      }
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (payload: UpdatePasswordPayload) =>
      authApi.updatePassword(payload),
  });
}

// Logged-in admin profile (for the header).
export function useMe() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authApi.getMe(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => authApi.updateProfile(formData),
    onSuccess: () => {
      // Refresh header + profile data.
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.logout(),
    // Clear local session + cache whether the API succeeds or not.
    onSettled: () => {
      clearAuthTokenCookie();
      queryClient.clear();
    },
  });
}
