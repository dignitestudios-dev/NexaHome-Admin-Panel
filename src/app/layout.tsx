import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AppProviders } from "@/lib/providers/app-providers";

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
    <html lang="en" className={cn("h-full antialiased font-sans")}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
