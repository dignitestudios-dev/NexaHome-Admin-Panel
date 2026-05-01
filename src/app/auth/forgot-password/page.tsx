"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/lib/schemas/auth.schema";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForgotPassword } from "@/features/auth/auth.hooks";
import { setResetEmail } from "@/lib/auth-session";

type ForgotFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const router = useRouter();
  const forgotPassword = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotFormData) => {
    forgotPassword.mutate(data, {
      onSuccess: () => {
        // Remember email for the OTP step, then move on.
        setResetEmail(data.email);
        router.push("/auth/verify-otp");
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-6"
    >
      {/* Back Button */}
      <Link
        href="/auth/login"
        className="absolute top-8 left-8 flex items-center justify-center w-10 h-10 rounded-full bg-[#F0F5F6] text-[#181818] hover:bg-[#e2eced] transition"
        aria-label="Go back"
      >
        <ArrowLeft size={20} />
      </Link>

      <div className="w-full max-w-md">

      {/* Heading */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Forgot Password?
        </h1>
        <p className="text-gray-500 mt-2 text-sm leading-6">
          Lost your password? Enter your email below, and we’ll send you a verification code.
        </p>
      </div>

      {/* Email */}
      <div className="mb-4">
        <Input
          type="email"
          placeholder="rayancooper@gmail.com"
          className="h-12 bg-gray-100 rounded-xl focus:bg-white focus:border-[#005864]"
          {...register("email")}
        />

        {/* Error UI (same style like login) */}
        {errors.email && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-600 px-4 py-2 rounded-md text-sm mt-2">
            ⚠ {errors.email.message}
          </div>
        )}
      </div>

      {/* API error */}
      {forgotPassword.isError && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-600 px-4 py-2 rounded-md text-sm mb-3">
          ⚠ {(forgotPassword.error as Error)?.message ?? "Something went wrong."}
        </div>
      )}

      {/* Button */}
      <Button
        type="submit"
        disabled={forgotPassword.isPending}
        className="w-full h-12 bg-[#005864] rounded-xl hover:opacity-90 active:scale-95 disabled:opacity-60"
      >
        {forgotPassword.isPending ? "Sending..." : "Continue"}
      </Button>

      </div>
    </form>
  );
}