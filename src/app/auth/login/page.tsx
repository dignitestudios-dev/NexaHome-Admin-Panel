"use client";

import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

import { loginSchema } from "@/lib/schemas/auth.schema";
import { z } from "zod";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    console.log("LOGIN DATA:", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm mx-auto h-full flex flex-col justify-center"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back!
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter your details below to login.
        </p>
      </div>

      {/* Email */}
      <div className="mb-4 space-y-1">
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="mikesmith@gmail.com"
          className="h-12 rounded-xl bg-gray-100 focus:bg-white focus:border-[#005864]"
          {...register("email")}
        />
        {errors.email && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-600 px-4 py-2 rounded-md text-sm mt-2">
            ⚠ {errors.email.message}
          </div>
        )}
      </div>

      {/* Password */}
      <div className="mb-2 space-y-1">
        <Label>Password</Label>

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="h-12 pr-10 rounded-xl bg-gray-100 focus:bg-white focus:border-[#005864]"
            {...register("password")}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
          </button>
        </div>

        {errors.password && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-600 px-4 py-2 rounded-md text-sm mt-2">
            ⚠ {errors.password.message}
          </div>
        )}
      </div>

      {/* Forgot */}
      <div className="text-right mb-5">
        <Link
          href="/auth/forgot-password"
          className="text-sm text-[#005864] font-medium"
        >
          Forgot Password?
        </Link>
      </div>

      {/* Button */}
      <Button
        type="submit"
        className="w-full h-12 bg-[#005864] hover:opacity-90 active:scale-95 rounded-xl"
      >
        Continue
      </Button>
    </form>
  );
}