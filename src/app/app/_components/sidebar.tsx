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
];

export default function Sidebar() {
  return (
    <aside className="h-screen w-[260px] bg-gradient-to-b from-teal-900 to-teal-700 text-white flex flex-col p-5 rounded-r-3xl">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10">
        <div className="w-8 h-8 border-4 border-lime-400 border-t-0 border-r-0 rotate-45" />
        <h1 className="text-xl font-semibold">NexaHome</h1>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2">
        {menu.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3 rounded-full cursor-pointer transition ${
                item.active
                  ? "bg-gradient-to-r from-teal-400 to-green-400 text-white"
                  : "hover:bg-white/10 text-gray-200"
              }`}
            >
              <Icon size={18} />
              <span className="text-sm">{item.label}</span>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}