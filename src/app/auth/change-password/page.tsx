"use client";

import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/lib/schemas/auth.schema";
import { z } from "zod";
import { PasswordUpdatedModal } from "./_components/passwordupdatemodal";
import { useUpdatePassword } from "@/features/auth/auth.hooks";
import { clearResetFlow, getResetToken } from "@/lib/auth-session";
import { useRouter } from "next/navigation";


type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export default function ChangePasswordPage() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const updatePassword = useUpdatePassword();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordSchema) => {
    updatePassword.mutate(
      { resetToken: getResetToken(), password: data.password },
      {
        onSuccess: () => {
          clearResetFlow();
          setPasswordUpdated(true);

          setTimeout(() => {
            router.push("/auth/login");
          }, 3000);
        },
      }
    );
  };

  return (
    <div className="relative flex w-full min-h-screen">

      {/* Back Button */}
      <button
        type="button"
        onClick={() => router.push("/auth/forgot-password")}
        className="absolute top-8 left-8 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-[#F0F5F6] text-[#181818] hover:bg-[#e2eced] transition"
        aria-label="Go back"
      >
        <ArrowLeft size={20} />
      </button>

      {/* ─── RIGHT PANEL ─── */}
      <div className="flex-1 bg-white flex items-center justify-center px-8 py-16">

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-[388px]"
        >

          {/* Heading */}
          <div className="text-center mb-9">
            <h1 className="text-[28px] font-bold text-[#1C1C1C]">
              Create New Password
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Enter a new password to reset your account
            </p>
          </div>

          {/* New Password */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-[#1C1C1C]">
              New Password
            </label>

            <div className="relative mt-1">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                {...register("password")}
                className="w-full h-12 bg-gray-100 rounded-xl px-4 pr-10 text-sm outline-none focus:bg-white border border-transparent focus:border-[#005864]"
              />

              <button
                type="button"
                onClick={() => setShowNewPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.password && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-600 px-4 py-2 rounded-md text-sm mt-2">
                ⚠ {errors.password.message}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-[#1C1C1C]">
              Confirm Password
            </label>

            <div className="relative mt-1">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                {...register("confirmPassword")}
                className="w-full h-12 bg-gray-100 rounded-xl px-4 pr-10 text-sm outline-none focus:bg-white border border-transparent focus:border-[#005864]"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.confirmPassword && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-600 px-4 py-2 rounded-md text-sm mt-2">
                ⚠ {errors.confirmPassword.message}
              </div>
            )}
          </div>

          {/* API error */}
          {updatePassword.isError && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-600 px-4 py-2 rounded-md text-sm mb-4">
              ⚠ {(updatePassword.error as Error)?.message ?? "Could not update password."}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={updatePassword.isPending}
            className="w-full h-12 bg-[#005864] text-white font-semibold rounded-xl disabled:opacity-60"
          >
            {updatePassword.isPending ? "Updating..." : "Update Password"}
          </button>

        </form>
      </div>
      <PasswordUpdatedModal
        open={passwordUpdated}
        onClose={() => setPasswordUpdated(false)}
    
      />
    </div>
  );
}