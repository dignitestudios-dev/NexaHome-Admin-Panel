"use client";

import { Card, CardContent } from "@/components/ui/card";

import Metrics from "./_components/metrics";
import UserInsights from "./_components/user-insights";
import RevenueAnalysis from "./_components/revenue-analysis";
import PopularCategories from "./_components/popular-categories";



export default function DashboardPage() {
  return (
    <div className="min-h-screen   font-sans">
      <h1 className="text-[36px] font-bold text-[#1A1A1A] mb-6">Dashboard</h1>

      {/* Top Metrics Row */}
      <Metrics />

      <UserInsights />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Revenue Analysis Chart */}
        <RevenueAnalysis />

        {/* Popular Categories */}
       <PopularCategories/>
      </div>
    </div>
  );
}
