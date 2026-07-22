"use client";

import React from "react";
import { ClipboardList, Grid2x2, TrendingUp } from "lucide-react";
import { useLeadPerformance } from "@/features/insights/insights.hooks";
import { useDashboardFilters } from "@/components/global/filter-context";

type StatItem = {
  title: string;
  value: number;
  icon: React.ElementType;
};

const statConfig: StatItem[] = [
  { title: "Categories With Experts", value: 0, icon: Grid2x2 },
  { title: "Top Category Experts", value: 0, icon: TrendingUp },
  { title: "Total Leads Purchased", value: 0, icon: ClipboardList },
];

const Stats = () => {
  const { debouncedCity, debouncedZipCode } = useDashboardFilters();
  const { data, isLoading, isError } = useLeadPerformance({
    city: debouncedCity,
    zipCode: debouncedZipCode,
  });

  const apiStats: StatItem[] = [
    {
      title: statConfig[0].title,
      value: data?.categoriesWithExperts ?? 0,
      icon: statConfig[0].icon,
    },
    {
      title: statConfig[1].title,
      value: data?.topCategoryExpertsCount ?? 0,
      icon: statConfig[1].icon,
    },
    {
      title: statConfig[2].title,
      value: data?.totalLeadsPurchased ?? 0,
      icon: statConfig[2].icon,
    },
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {apiStats.map((item, i) => {
        const Icon = item.icon;

        return (
          <div
            key={i}
            className="w-[270px] h-[100px] border-none shadow-none rounded-[24px] bg-white flex items-center"
          >
            <div className="p-4 flex items-center gap-4 w-full">
              <div className="bg-[#EAF1F2] w-[68px] h-[68px] rounded-[24px] flex items-center justify-center shrink-0">
                <Icon
                  className="text-[#00515C] fill-[#00515C]/10"
                  size={32}
                  strokeWidth={2}
                />
              </div>

              <div className="flex flex-col justify-center min-w-0">
                <p className="text-[13px] font-medium text-[#333333] whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.title}
                </p>
                <h2 className="text-[28px] font-semibold text-black leading-none whitespace-nowrap">
                  {isLoading ? "..." : isError ? "—" : item.value.toLocaleString()}
                </h2>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Stats;
