"use client";

import Metrics from "./_components/metrics";
import UserInsights from "./_components/user-insights";
import RevenueAnalysis from "./_components/revenue-analysis";
import PopularCategories from "./_components/popular-categories";
import GrowthTracking from "./_components/growth-tracking";
import { useMe } from "@/features/auth/auth.hooks";
import { formatWelcomeGreeting } from "@/lib/utils";

export default function DashboardPage() {
  const { data: admin } = useMe();
  const welcomeText = formatWelcomeGreeting(admin?.name);

  return (
    <div className="min-h-screen font-sans">
      {/* Page Title & Welcome Greeting */}
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="heading">{welcomeText}</h1>
        <p className="text-sm text-gray-500">
          Overview of platform activity, revenues, and key metrics.
        </p>
      </div>

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
  );
}
