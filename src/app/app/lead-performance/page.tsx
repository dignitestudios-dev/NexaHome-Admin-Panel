"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import DataTable from "./_components/data-table";

// Icons
import { Clock, LayoutPanelLeft, UserRound, Filter } from "lucide-react";
import { LucideIcon } from "lucide-react";

/* ================= TYPES ================= */

type StatItem = {
  title: string;
  value: string;
  icon: LucideIcon;
};

type CategoryRow = {
  category: string;
  total: number;
  active: number;
};

/* ================= DATA ================= */

const stats: StatItem[] = [
  { title: "Avg Response Time", value: "56,879", icon: Clock },
  { title: "Avg Responses Per Lead", value: "56,879", icon: LayoutPanelLeft },
  { title: "Total Leads Purchased", value: "56,879", icon: UserRound },
];

const tableData: CategoryRow[] = [
  { category: "Window Cleaning", total: 98, active: 56 },
  { category: "Plumbing Services", total: 87, active: 61 },
  { category: "Electrical Services", total: 76, active: 49 },
  { category: "Handyman Services", total: 65, active: 42 },
  { category: "Pest Control", total: 59, active: 38 },
  { category: "Appliance Repair", total: 52, active: 33 },
  { category: "Roofing Services", total: 48, active: 29 },
  { category: "Pressure Washing", total: 41, active: 25 },
  { category: "Gutter Services", total: 36, active: 21 },
  { category: "Painting Services", total: 30, active: 18 },
];

/* ================= COMPONENTS ================= */

const PerformanceFilter = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button className="bg-[#005864] hover:bg-[#004750] text-white w-10 h-10 p-0 rounded-lg shadow-sm focus-visible:ring-0 transition-colors">
        <Filter size={18} />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      align="end"
      className="w-48 rounded-xl border-none shadow-lg"
    >
      <DropdownMenuItem>All Categories</DropdownMenuItem>
      <DropdownMenuItem>Highest Active</DropdownMenuItem>
      <DropdownMenuItem>Lowest Active</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

/* ================= PAGE ================= */

export default function LeadPerformancePage() {
  return (
    <div className="min-h-screen font-sans">
      
      {/* Title */}
      <h1 className="text-[32px] font-bold text-[#1A1A1A] mb-10 tracking-tight">
        Lead Performance Analytics
      </h1>

      {/* Stats */}
      <div className="flex flex-wrap gap-6 mb-12 ">
      {stats.map((item, i) => (
        <Card
          key={i}
          className="w-[270px] h-[100px] border-none shadow-none rounded-[24px] bg-white flex items-center"
        >
          <CardContent className="p-4 flex items-center gap-4 w-full">
            
            {/* Icon Container - Matching the soft rounded square look */}
            <div className="bg-[#EAF1F2] w-[68px] h-[68px] rounded-[24px] flex items-center justify-center shrink-0">
              <item.icon
                className="text-[#00515C] fill-[#00515C]/10" 
                size={32}
                strokeWidth={2}
              />
            </div>

            {/* Text Section - Forced to single line */}
            <div className="flex flex-col justify-center min-w-0">
              <p className="text-[13px] font-medium text-[#333333] whitespace-nowrap overflow-hidden text-ellipsis">
                {item.title}
              </p>
              <h2 className="text-[28px] font-bold text-black leading-none whitespace-nowrap">
                {item.value}
              </h2>
            </div>

          </CardContent>
        </Card>
      ))}
    </div>
  

      {/* Section Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-[26px] font-bold text-[#1A1A1A]">
          Experts Signed Up Per Category
        </h2>

        <PerformanceFilter />
      </div>

      {/* Table */}
      <DataTable/>

    </div>
  );
}
