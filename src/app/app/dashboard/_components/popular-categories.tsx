"use client";

import React, { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { usePopularCategories } from "@/features/dashboard/dashboard.hooks";
import { cn } from "@/lib/utils";

const BAR_COLOR = "#005864";

const PopularCategories: React.FC = () => {
  const { data, isLoading, isError, error } = usePopularCategories();
  const [isHovering, setIsHovering] = useState(false);
  const categories = data?.categories ?? [];

  // Scale bars relative to the highest jobsCount.
  const maxJobs = categories.reduce(
    (max, cat) => Math.max(max, cat.jobsCount),
    0
  );

  return (
    <Card
      className="flex h-[450px] flex-col rounded-[40px] border-none shadow-sm pt-8 pb-4"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardHeader className="shrink-0">
        <CardTitle className="text-[16px] font-bold">
          Popular Categories
        </CardTitle>
      </CardHeader>

      <CardContent
        className={cn(
          "min-h-0 flex-1 space-y-6 overflow-y-auto",
          isHovering
            ? "popular-categories-scroll"
            : "popular-categories-scroll-hidden"
        )}
      >
        {isError && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-600 px-4 py-2 rounded-md text-sm">
            ⚠ {(error as Error)?.message ?? "Failed to load categories."}
          </div>
        )}

        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
              <div className="h-2 w-full bg-gray-100 rounded-full animate-pulse" />
            </div>
          ))}

        {!isLoading && !isError && categories.length === 0 && (
          <p className="text-sm text-gray-400">No categories found.</p>
        )}

        {!isLoading &&
          categories.map((cat, i) => {
            const percentage = maxJobs > 0 ? (cat.jobsCount / maxJobs) * 100 : 0;

            return (
              <div key={cat._id} className="space-y-2">
                <div className="flex justify-between items-center font-bold">
                  <div className="flex items-center gap-3 text-[#1A1A1A]">
                    <span className="w-6 h-6 bg-[#004D4D] text-white text-[10px] flex items-center justify-center rounded-md font-black">
                      {i + 1}
                    </span>
                    <span className="text-[12px] font-medium">{cat.name}</span>
                  </div>

                  <span className="text-[12px] font-semibold text-gray-500">
                    {cat.jobsCount}
                  </span>
                </div>

                <div className="relative">
                  <Progress value={percentage} className="h-2 bg-[#E6EEEE]" />

                  <div
                    className="absolute top-0 left-0 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: BAR_COLOR,
                    }}
                  />
                </div>
              </div>
            );
          })}
      </CardContent>
    </Card>
  );
};

export default PopularCategories;
