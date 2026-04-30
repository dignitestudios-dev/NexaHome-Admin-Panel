"use client"

import Metrics from "./_components/metrics"
import UserInsights from "./_components/user-insights"
import RevenueAnalysis from "./_components/revenue-analysis"
import PopularCategories from "./_components/popular-categories"
import GrowthTracking from "./_components/growth-tracking"

export default function DashboardPage() {
  return (
    <div className="min-h-screen font-sans">
      
      {/* Page Title */}
      <h1 className="text-[32px] lg:text-[36px] font-bold text-[#1A1A1A] mb-6">
        Dashboard
      </h1>

      {/* Metrics */}
      <Metrics />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">

        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <UserInsights />
          <RevenueAnalysis />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-8">
          <GrowthTracking />
          <PopularCategories />
        </div>

      </div>
    </div>
  )
}