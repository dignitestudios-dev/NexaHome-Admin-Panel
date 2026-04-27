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
  ArrowUpToLine
} from "lucide-react";

const menu = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Performance Intelligence", icon: BarChart3 },
  { label: "Revenue & Monetization", icon: DollarSign },
  { label: "Performance Analytics", icon: LineChart },
  { label: "Category & Location Insights", icon: Map },
  { label: "Adv. Category Package", icon: Package },
  { label: "Verified Experts", icon: BadgeCheck },
  { label: "User Management", icon: Users },
  { label: "Reporting", icon: FileText },
  { label: "Categories", icon: Folder },
  { label: "Partner & Referral Management", icon: Handshake },
  { label: "Advertising Management", icon: Megaphone },
  { label: "Partner Dashboard", icon: TableProperties },
  { label: "CSV Upload", icon: ArrowUpToLine },
];

export default function Sidebar() {
  return (
    <aside className="min-h-screen w-[260px] bg-[#004D54] text-white flex flex-col p-6 shadow-xl">
      {/* Logo Section */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="relative w-10 h-10">
            {/* Custom SVG to match the L-shape logo in the image */}
          <svg viewBox="0 0 40 40" className="w-full h-full fill-none stroke-[#D4E815]" strokeWidth="4">
            <path d="M8 15V32H28" strokeLinecap="square"/>
            <path d="M18 8L32 22" strokeLinecap="square"/>
            <path d="M32 22V32" strokeLinecap="square"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">NexaHome</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col gap-1">
        {menu.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className={`flex items-center gap-4 px-5 py-3.5 rounded-full cursor-pointer transition-all duration-200 ${
                item.active
                  ? "bg-gradient-to-r from-[#00A299] to-[#40B480] text-white shadow-lg"
                  : "hover:bg-white/5 text-gray-100/90"
              }`}
            >
              <Icon size={20} strokeWidth={item.active ? 2.5 : 2} />
              <span className={`text-[14px] ${item.active ? "font-bold" : "font-medium"}`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}