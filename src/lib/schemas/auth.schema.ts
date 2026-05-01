import { z } from "zod";

/* ---------------- EMAIL ---------------- */
export const emailSchema = z.string().min(1, "Email is required").email("Invalid email");


/* ---------------- PASSWORD ---------------- */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .refine((val) => /[A-Z]/.test(val), {
    message: "Must contain 1 uppercase letter",
  })
  .refine((val) => /[!@#$%^&*]/.test(val), {
    message: "Must contain 1 special character",
  });


/* ---------------- LOGIN ---------------- */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string(),
});


/* ---------------- FORGOT PASSWORD ---------------- */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});


/* ---------------- OTP ---------------- */
export const otpSchema = z.object({
  otp: z.string().length(5, "OTP must be 5 digits"),
});


/* ---------------- RESET PASSWORD ---------------- */
export const resetPasswordSchema = z
  .object({
    password: z.string().trim(),
    confirmPassword: z.string().trim(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
      return;
    }

    const result = passwordSchema.safeParse(data.password);
    if (!result.success) {
      for (const issue of result.error.issues) {
        ctx.addIssue({ ...issue, path: ["password"] });
      }
    }
  });