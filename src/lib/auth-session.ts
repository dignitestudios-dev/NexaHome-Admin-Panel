const AUTH_TOKEN_KEY = "token";

// Cookie-based auth token storage (works client-side).
export function getAuthTokenCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${AUTH_TOKEN_KEY}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export function setAuthTokenCookie(token: string, days = 7): void {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${AUTH_TOKEN_KEY}=${encodeURIComponent(
    token
  )}; expires=${expires}; path=/; SameSite=Lax`;
}

export function clearAuthTokenCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

/* ---------------- FORGOT-PASSWORD FLOW ---------------- */
// Temp values shared across forgot → verify-otp → change-password pages.
const RESET_EMAIL_KEY = "reset_email";
const RESET_TOKEN_KEY = "reset_token";

export function setResetEmail(email: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(RESET_EMAIL_KEY, email);
}

export function getResetEmail(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(RESET_EMAIL_KEY) ?? "";
}

export function setResetToken(token: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(RESET_TOKEN_KEY, token);
}

export function getResetToken(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(RESET_TOKEN_KEY) ?? "";
}

export function clearResetFlow(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(RESET_EMAIL_KEY);
  sessionStorage.removeItem(RESET_TOKEN_KEY);
}
