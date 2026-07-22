import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatWelcomeGreeting(name?: string | null): string {
  if (!name || !name.trim()) return "Welcome, Admin";
  return `Welcome, ${name.trim()}`;
}
