import type { Metadata } from "next";
// import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AppProviders } from "@/lib/providers/app-providers";

// const inter = Inter({subsets:['latin'],variable:'--font-sans'});
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
  adjustFontFallback: true,
});

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: {
    default: "NexaHome Admin Panel",
    template: "%s | NexaHome Admin",
  },
  description:
    "NexaHome Admin Panel — manage users, experts, jobs, revenue, and platform performance from a single dashboard.",
  icons: {
    icon: "/asset/favicon.png",
    shortcut: "/asset/favicon.png",
    apple: "/asset/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        plusJakartaSans.variable,
        plusJakartaSans.className
      )}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
