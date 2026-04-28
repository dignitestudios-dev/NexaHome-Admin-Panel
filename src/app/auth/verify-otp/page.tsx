"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema } from "@/lib/schemas/auth.schema";
import { z } from "zod";

type OtpFormData = z.infer<typeof otpSchema>;

export default function VerificationPage() {
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const {
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const otp = watch("otp");

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const current = otp.split("");
    current[index] = value.slice(-1);

    const newOtp = current.join("").padEnd(5, "");
    setValue("otp", newOtp);

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    const otpArray = otp.split("");

    if (e.key === "Backspace") {
      e.preventDefault();

      if (otpArray[index]) {
        // clear current
        otpArray[index] = "";
        setValue("otp", otpArray.join(""));
      } else if (index > 0) {
        // move back + clear previous
        otpArray[index - 1] = "";
        setValue("otp", otpArray.join(""));

        inputRefs.current[index - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmitOtp = (data: OtpFormData) => {
    console.log("OTP SUBMIT:", data);
    window.location.href = "/auth/change-password";
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((p) => p - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  return (
    <form
      onSubmit={handleSubmit(handleSubmitOtp)}
      className="w-full min-h-screen flex items-center justify-center px-6"
    >
      <div className="w-full max-w-md text-center">
        <h1 className="text-[36px] font-semibold text-[#181818]">
          Verification
        </h1>

        <p className="text-[16px] text-gray-500 mt-2">
          Enter the code sent to{" "}
          <span className="text-[#005864]">lucasbenjamin@gmail.com</span>
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-4 mt-8">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                value={otp[i] || ""}
                type="text"
                maxLength={1}
                inputMode="numeric"
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-16 h-16 text-center text-xl font-semibold rounded-2xl bg-gray-50 border border-[#005864] text-[#005864]"
              />
            ))}
        </div>

        {/* Error */}
        {errors.otp && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-600 px-4 py-2 rounded-md text-sm mt-2">
            ⚠ {errors.otp.message}
          </div>
        )}

        <p className="text-[16px] text-gray-500 mt-5">
          Didn’t receive code?{" "}
          <button
            type="button"
            disabled={timer > 0}
            className={`text-[#005864] ${
              timer > 0 ? "opacity-50 cursor-not-allowed" : "hover:underline"
            }`}
          >
            {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
          </button>
        </p>

        <Button
          type="submit"
          className="w-full h-14 mt-8 bg-[#005864] rounded-xl"
        >
          Verify
        </Button>
      </div>
    </form>
  );
}
