"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Briefcase,
  UserStar,
  User,
} from "lucide-react";

import { useDashboardSummary } from "@/features/dashboard/dashboard.hooks";
import type { MetricStat } from "@/features/dashboard/dashboard.types";

type StatConfig = {
  title: string;
  icon: React.ElementType;
  key: "totalUsers" | "totalExperts" | "totalJobsPosted" | "totalRevenue";
  isCurrency?: boolean;
};

const statsConfig: StatConfig[] = [
  { title: "Total Users", icon: User, key: "totalUsers" },
  { title: "Total Experts", icon: UserStar, key: "totalExperts" },
  { title: "Total Jobs Posted", icon: Briefcase, key: "totalJobsPosted" },
  { title: "Total Revenue", icon: TrendingUp, key: "totalRevenue", isCurrency: true },
];

function formatValue(value: number, isCurrency?: boolean) {
  const formatted = new Intl.NumberFormat("en-US").format(value);
  return isCurrency ? `$ ${formatted}` : formatted;
}

function normalizeGrowthPercent(value?: number) {
  if (value == null || Number.isNaN(value) || !Number.isFinite(value)) {
    return 0;
  }
  return value;
}

function formatTrend(stat?: MetricStat) {
  if (!stat) return "0% increase this month";

  const pct = normalizeGrowthPercent(stat.increasePercentThisMonth);
  const direction = pct < 0 ? "decrease" : "increase";
  return `${Math.abs(pct)}% ${direction} this month`;
}

const Metrics = () => {
  const { data, isLoading, isError, error } = useDashboardSummary();

  if (isError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-600 px-4 py-3 rounded-md text-sm mb-8">
        ⚠ {(error as Error)?.message ?? "Failed to load dashboard summary."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {statsConfig.map((item) => {
        const Icon = item.icon;
        const stat = data?.[item.key];
        const isNegative =
          normalizeGrowthPercent(stat?.increasePercentThisMonth) < 0;
        const TrendIcon = isNegative ? TrendingDown : TrendingUp;

        return (
          <div
            key={item.key}
            className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white"
          >
            <div className="p-0">
              {/* Top Section */}
              <div className="p-4 flex items-center gap-5">
                <div className="bg-[#E6EEEE] p-5 rounded-2xl">
                  <Icon className="w-8 h-8 text-[#004D4D]" strokeWidth={2.5} />
                </div>

                <div>
                  <p className="text-[13px] font-medium ">{item.title}</p>
                  {isLoading ? (
                    <div className="h-8 w-20 bg-gray-100 rounded-md animate-pulse mt-1" />
                  ) : (
                    <h2 className="text-[26px] font-semibold tracking-tight">
                      {formatValue(stat?.value ?? 0, item.isCurrency)}
                    </h2>
                  )}
                </div>
              </div>

              {/* Bottom Section */}
              <div className="bg-[#005864] py-3 px-8 flex items-center gap-2 text-white font-light text-[13px]">
                <TrendIcon className="w-5 h-5" />
                {isLoading ? "Loading..." : formatTrend(stat)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Metrics;
