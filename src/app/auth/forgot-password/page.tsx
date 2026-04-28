"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/lib/schemas/auth.schema";
import { z } from "zod";

type ForgotFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotFormData) => {
    console.log("FORGOT PASSWORD:", data);

    // redirect example
    window.location.href = "/auth/verify-otp";
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md relative mx-auto h-full flex flex-col justify-center"
    >
      {/* Back Button */}
      <Link
        href="/auth/login"
        className="absolute top-20 -left-20 text-[#181818]"
      >
        <ArrowLeft size={20} />
      </Link>

      {/* Heading */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Forgot Password?
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Lost your password? Enter your email below, and we’ll send you a verification code.
        </p>
      </div>

      {/* Email */}
      <div className="mb-2">
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

      {/* Button */}
      <Button
        type="submit"
        className="w-full h-12 bg-[#005864] rounded-xl hover:opacity-90 active:scale-95"
      >
        Continue
      </Button>
    </form>
  );
}