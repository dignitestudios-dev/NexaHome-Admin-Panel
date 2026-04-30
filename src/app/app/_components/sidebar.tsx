"use client";

import {
  LayoutDashboard,
  BarChart3,
  DollarSign,
  LineChart,
  Map,
  Package,
  BadgeCheck,
  Users,
  FileText,
  Folder,
  Handshake,
  Megaphone,
  TableProperties,
  ArrowUpToLine,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    link: "/app/dashboard",
  },
  {
    label: "Performance Intelligence",
    icon: BarChart3,
    link: "/app/performance-intelligence",
  },
  {
    label: "Revenue & Monetization",
    icon: DollarSign,
    link: "/app/revenue-monetization",
  },
  {
    label: "Performance Analytics",
    icon: LineChart,
    link: "/app/performance-analytics",
  },
  {
    label: "Category & Location Insights",
    icon: Map,
    link: "/app/category-location",
  },
  {
    label: "Adv. Category Package",
    icon: Package,
    link: "/app/category-package",
  },
  {
    label: "Verified Experts",
    icon: BadgeCheck,
    link: "/app/verified-experts",
  },
  { label: "User Management", icon: Users, link: "/app/user-management" },
  { label: "Reporting", icon: FileText, link: "/app/reporting" },
  { label: "Categories", icon: Folder, link: "/app/categories" },
  {
    label: "Partner & Referral Management",
    icon: Handshake,
    link: "/app/referral-management",
  },
  {
    label: "Advertising Management",
    icon: Megaphone,
    link: "/app/advertising-management",
  },
  {
    label: "Partner Dashboard",
    icon: TableProperties,
    link: "/app/partner-dashboard",
  },
  { label: "CSV Upload", icon: ArrowUpToLine, link: "/app/csv-upload" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen overflow-y-auto w-[300px] bg-[#004D54] text-white flex flex-col p-6 shadow-xl hide-scrollbar">
      {/* Logo Section */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="relative w-10 h-10">
          {/* Custom SVG to match the L-shape logo in the image */}
          <svg
            viewBox="0 0 40 40"
            className="w-full h-full fill-none stroke-[#D4E815]"
            strokeWidth="4"
          >
            <path d="M8 15V32H28" strokeLinecap="square" />
            <path d="M18 8L32 22" strokeLinecap="square" />
            <path d="M32 22V32" strokeLinecap="square" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">NexaHome</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col gap-1">
        {menu.map((item, i) => {
          const Icon = item.icon;
          const isActive = pathname === item.link;
          return (
            <Link
              key={i}
              href={item.link}
              className={`flex items-center gap-2 px-4 py-3.5 rounded-full cursor-pointer transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-[#00A299] to-[#40B480] text-white shadow-lg"
                  : "hover:bg-white/5 text-gray-100/90"
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
              <span
                className={`text-[14px] ${isActive ? "font-normal" : "font-normal"}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
