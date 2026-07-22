"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { useRevenueAnalysis } from "@/features/dashboard/dashboard.hooks";
import { useDashboardFilters } from "@/components/global/filter-context";
import type { RevenueGroupBy } from "@/features/dashboard/dashboard.types";

const RevenueAnalysis = () => {
  const [groupBy, setGroupBy] = useState<RevenueGroupBy>("month");
  const { debouncedCity, debouncedZipCode } = useDashboardFilters();
  const { data, isLoading, isError, error } = useRevenueAnalysis(groupBy, {
    city: debouncedCity,
    zipCode: debouncedZipCode,
  });

  const chartData = data ?? [];

  return (
    <Card className="lg:col-span-2 rounded-[40px] border-none shadow-sm h-[450px] px-2 py-8">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-[16px] font-bold">
          Revenue Analysis
        </CardTitle>

        <Select
          value={groupBy}
          onValueChange={(value) => setGroupBy(value as RevenueGroupBy)}
        >
          <SelectTrigger className="w-[120px] h-8 text-xs font-bold bg-[#F4F9F9] border-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Weekly</SelectItem>
            <SelectItem value="month">Monthly</SelectItem>
            <SelectItem value="year">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      {/* Chart */}
      <CardContent className="h-[320px] px-0">
        {isError ? (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-600 px-4 py-2 rounded-md text-sm mx-4">
            ⚠ {(error as Error)?.message ?? "Failed to load revenue analysis."}
          </div>
        ) : isLoading ? (
          <div className="h-full w-full flex items-center justify-center text-sm text-gray-400">
            Loading...
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-full w-full flex items-center justify-center text-sm text-gray-400">
            No revenue data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="28%">
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                cursor={{
                  fill: "rgba(15,163,163,0.1)",
                  stroke: "transparent",
                  strokeWidth: 0,
                }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  fontSize: "12px",
                }}
              />

              <Bar
                dataKey="revenue"
                radius={[4, 4, 0, 0]}
                fill="#0FA3A3"
                maxBarSize={36}
                activeBar={false}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueAnalysis;
