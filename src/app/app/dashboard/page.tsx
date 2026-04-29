"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Briefcase,
  TrendingUp,
  Star,
  ChevronRight,
  TrendingUp as TrendingIcon,
  ChevronDown,
} from "lucide-react";

const stats = [
  { title: "Total Users", value: "56,879", icon: Users },
  { title: "Total Experts", value: "56,879", icon: Users },
  { title: "Total Jobs Posted", value: "56,879", icon: Briefcase },
  { title: "Total Revenue", value: "56,879", icon: TrendingUp },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen   font-sans">
      <h1 className="text-[36px] font-bold text-[#1A1A1A] mb-6">Dashboard</h1>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((item, i) => (
          <Card
            key={i}
            className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white"
          >
            <CardContent className="p-0">
              <div className="p-4 flex items-center gap-5">
                <div className="bg-[#E6EEEE] p-5 rounded-2xl">
                  <item.icon
                    className="w-8 h-8 text-[#004D4D]"
                    strokeWidth={2.5}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    {item.title}
                  </p>
                  <h2 className="text-2xl font-black text-[#1A1A1A] tracking-tight">
                    {item.value}
                  </h2>
                </div>
              </div>
              <div className="bg-[#005864] py-3 px-12 flex items-center gap-2 text-white font-medium text-sm">
                <TrendingIcon className="w-4 h-4" />
                12 increase this month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Insights Section */}
        <Card className="lg:col-span-2 rounded-[40px] border-none shadow-sm bg-white overflow-hidden h-[400px]">
          <CardContent className="p-0 flex h-full">
            <div className="flex-[3] p-10 flex flex-col justify-between">
              <h2 className="text-xl font-bold text-[#1A1A1A]">
                User Insights
              </h2>
              <div className="flex items-center gap-4">
                {[
                  { label: "Active Users", val: "68%" },
                  { label: "Repeat Homeowners", val: "68%" },
                  { label: "Completed Jobs", val: "68%" },
                ].map((chart, idx) => (
                  <div key={idx} className="flex-1 flex flex-col">
                    <div className="flex items-center justify-center py-6">
                      <div className="relative w-28 h-28">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="56"
                            cy="56"
                            r="48"
                            stroke="#F1F4F4"
                            strokeWidth="14"
                            fill="none"
                          />
                          <circle
                            cx="56"
                            cy="56"
                            r="48"
                            stroke="#005763"
                            strokeWidth="14"
                            fill="none"
                            strokeDasharray="301.6"
                            strokeDashoffset="96.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="bg-[#F4F9F9] rounded-[24px] p-4 text-center">
                      <p className="text-[12px] font-semibold text-gray-600 mb-1 leading-tight">
                        {chart.label}
                      </p>
                      <p className="text-2xl font-black text-[#005763]">
                        {chart.val}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Average Rating Block */}
            <div className="flex-1 bg-gradient-to-br from-[#005864] to-[#0A4D45] p-5 m-3 rounded-[35px] flex flex-col items-center justify-between">
              <div className="relative w-32 h-32 mt-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="white"
                    strokeWidth="12"
                    fill="none"
                    className="opacity-20"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="white"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray="326.7"
                    strokeDashoffset="80"
                    strokeLinecap="round"
                    className="opacity-40"
                  />
                </svg>
              </div>
              <div className="w-full bg-white/10 rounded-[28px] py-5 flex flex-col items-center border border-white/5">
                <p className="text-xs font-medium text-white/80 mb-1">
                  Average Rating
                </p>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-[#FFB800] text-[#FFB800]" />
                  <span className="text-3xl font-black text-white italic">
                    4.7
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Growth Tracking */}
        <Card className="rounded-[40px] border-none shadow-sm bg-white p-8 h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#1A1A1A]">
              Growth Tracking
            </h2>
            <div className="bg-[#F4F9F9] px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold text-gray-500">
              Monthly <ChevronDown className="w-4 h-4" />
            </div>
          </div>
          <div className="flex gap-4 mb-8">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
              <div className="w-3 h-3 bg-[#005864] rounded-sm" /> Users
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
              <div className="w-3 h-3 bg-[#C8E015] rounded-sm" /> Experts
            </div>
          </div>
          <div className="flex-1 flex items-end justify-between px-2 gap-3 pb-2 border-b border-gray-50 relative">
            <div className="absolute left-0 bottom-10 w-full border-t border-gray-50" />
            <div className="absolute left-0 bottom-20 w-full border-t border-gray-50" />
            <div className="absolute left-0 bottom-30 w-full border-t border-gray-50" />

            {[
              { u: 40, e: 25, m: "Jan" },
              { u: 70, e: 45, m: "Feb" },
              { u: 20, e: 30, m: "Jan" },
              { u: 95, e: 75, m: "Feb" },
              { u: 40, e: 25, m: "Jan" },
              { u: 70, e: 50, m: "Feb" },
            ].map((d, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-3 h-full justify-end z-10"
              >
                <div className="flex gap-1.5 items-end h-full w-full justify-center">
                  <div
                    className="w-3 bg-[#005864] rounded-full"
                    style={{ height: `${d.u}%` }}
                  />
                  <div
                    className="w-3 bg-[#C8E015] rounded-full"
                    style={{ height: `${d.e}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-gray-400">
                  {d.m}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Revenue Analysis Chart */}
        <Card className="lg:col-span-2 rounded-[40px] border-none shadow-sm bg-white p-10 h-[450px] relative overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-bold">Revenue Analysis</h2>
            <div className="bg-[#F4F9F9] px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold text-gray-500">
              Monthly <ChevronDown className="w-4 h-4" />
            </div>
          </div>
          <div className="flex h-[280px]">
            {/* Y-Axis labels */}
            <div className="flex flex-col justify-between text-[10px] font-bold text-gray-400 pb-8 pr-4">
              <span>$600</span>
              <span>$500</span>
              <span>$400</span>
              <span>$300</span>
              <span>$200</span>
              <span>$100</span>
              <span>$0</span>
            </div>
            {/* Bar Chart Area */}
            <div className="flex-1 flex items-end gap-[2px] pb-8 relative">
              {Array.from({ length: 60 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-[#0FA3A3]/20 via-[#0FA3A3]/60 to-[#0FA3A3] rounded-t-[1px]"
                  style={{
                    height: `${Math.sin(i * 0.2) * 20 + 40 + (i % 8) * 4}%`,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-between px-10 text-[10px] font-bold text-gray-400">
            {[
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "July",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </Card>

        {/* Popular Categories */}
        <Card className="rounded-[40px] border-none shadow-sm bg-white p-8">
          <h2 className="text-xl font-bold ">Popular Categories</h2>
          <div className="space-y-6">
            {[
              {
                name: "Window Cleaning",
                val: "10,000",
                width: "100%",
                color: "#004D4D",
              },
              {
                name: "Power Washing",
                val: "8,000",
                width: "80%",
                color: "#005864",
              },
              {
                name: "Soft Washing",
                val: "6,000",
                width: "65%",
                gradient:
                  "bg-gradient-to-r from-[#0FA3A3]/20 via-[#0FA3A3]/60 to-[#0FA3A3]",
              },
              {
                name: "Window Cleaning",
                val: "4,000",
                width: "40%",
                color: "#0FA3A3",
              },
              {
                name: "Power Washing",
                val: "10,000",
                width: "100%",
                color: "#004D4D",
              },
              {
                name: "Soft Washing",
                val: "10,000",
                width: "100%",
                color: "#004D4D",
              },
            ].map((cat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center font-bold">
                  <div className="flex items-center gap-3 text-[#1A1A1A]">
                    <span className="w-6 h-6 bg-[#004D4D] text-white text-[10px] flex items-center justify-center rounded-md font-black">
                      {i + 1}
                    </span>
                    <span className="text-sm font-bold">{cat.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{cat.val}</span>
                </div>
                <div className="w-full bg-[#E6EEEE] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${cat.gradient || ""}`}
                    style={{ width: cat.width, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
