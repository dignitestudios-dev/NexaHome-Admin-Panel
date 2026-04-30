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

import { PartnerState } from "./_components/partner-state";
import { useRouter, useSearchParams } from "next/navigation";

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



/* ================= PAGE ================= */

export default function LeadPerformancePage() {
   const tabs = ["Top Jobs", "Top Areas"];
    const searchParams = useSearchParams();
    const router = useRouter();
    const activeTab = searchParams.get("tab") || "Top Jobs";
    
    const handleTabChange = (tab: string) => {
    router.push(`?tab=${tab}`);
  };
  const renderTable = (tab: string) => {
      switch (tab) {
        case "Top Jobs":
          return <div><DataTable /></div>;
  
        case "Top Areas":
          return <div><DataTable /></div>;
      }
    };
  return (
    <div className="min-h-screen font-sans">
      
      {/* Title */}
      <h1 className="heading">
        Partner Dashboard Overview
      </h1>

      {/* Stats */}
    
<PartnerState />
      {/* Section Header */}
     
        <h2 className="text-[26px] font-bold text-[#1A1A1A]">
         Category & Experts Insights
        </h2>

       <div
          className="inline-flex items-center bg-white rounded-[10px] p-1 gap-1 shadow-sm"
          
        >
          {tabs.map((tab, i) => (
            <Button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`
            w-[152px] ${activeTab !== tab && "bg-white text-[#181818CC]"}
            
          `}
            >
              {tab}
            </Button>
          ))}
        </div>
     

      {/* Table */}
      {renderTable(activeTab)}

    </div>
  );
}
