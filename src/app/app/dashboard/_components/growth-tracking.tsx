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
  CartesianGrid,
} from "recharts";

import { useGrowthTracking } from "@/features/dashboard/dashboard.hooks";
import { useDashboardFilters } from "@/components/global/filter-context";
import type { RevenueGroupBy } from "@/features/dashboard/dashboard.types";

const GrowthTracking = () => {
  const [groupBy, setGroupBy] = useState<RevenueGroupBy>("month");
  const { debouncedCity, debouncedZipCode } = useDashboardFilters();
  const { data, isLoading, isError, error } = useGrowthTracking(groupBy, {
    city: debouncedCity,
    zipCode: debouncedZipCode,
  });

  const chartData = data ?? [];

  return (
    <Card className="rounded-[40px] py-6 border-none shadow-sm h-[400px] flex flex-col">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-[16px] font-bold">Growth Tracking</CardTitle>

        <Select
          value={groupBy}
          onValueChange={(value) => setGroupBy(value as RevenueGroupBy)}
        >
          <SelectTrigger className="w-[120px] h-8 text-xs font-bold bg-[#EFF7F8] border-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Weekly</SelectItem>
            <SelectItem value="month">Monthly</SelectItem>
            <SelectItem value="year">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {/* Legend */}
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
            <div className="w-3 h-3 bg-[#065662] rounded-sm" /> Users
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
            <div className="w-3 h-3 bg-[#CDE01A] rounded-sm" /> Experts
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1">
          {isError ? (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-600 px-4 py-2 rounded-md text-sm">
              ⚠ {(error as Error)?.message ?? "Failed to load growth tracking."}
            </div>
          ) : isLoading ? (
            <div className="h-full w-full flex items-center justify-center text-sm text-gray-400">
              Loading...
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center text-sm text-gray-400">
              No growth data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={6}>
                <CartesianGrid vertical={false} stroke="#F3F4F6" />

                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis hide />

                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.03)" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    fontSize: "12px",
                  }}
                />

                {/* Users */}
                <Bar
                  dataKey="users"
                  fill="#065662"
                  radius={[10, 10, 0, 0]}
                  barSize={10}
                />

                {/* Experts */}
                <Bar
                  dataKey="experts"
                  fill="#CDE01A"
                  radius={[10, 10, 0, 0]}
                  barSize={10}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GrowthTracking;
