"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MdTrendingUp, MdVerified } from "react-icons/md";
import { IoPeopleOutline } from "react-icons/io5";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import {
  formatRevenueAmount,
  getChartYAxisMax,
  getYearlyChartData,
  getYearlyChartYAxisMax,
} from "@/features/revenue-monetization/revenue-monetization.api";
import { useRevenueMonetization } from "@/features/revenue-monetization/revenue-monetization.hooks";
import { useDashboardFilters } from "@/components/global/filter-context";
import type { RevenueMonetizationGroupBy } from "@/features/revenue-monetization/revenue-monetization.types";

const GROUP_BY_LABELS: Record<RevenueMonetizationGroupBy, string> = {
  week: "Weekly",
  month: "Monthly",
  year: "Yearly",
};

export default function RevenueDashboard() {
  const [groupBy, setGroupBy] = useState<RevenueMonetizationGroupBy>("month");
  const { debouncedCity, debouncedZipCode } = useDashboardFilters();
  const { data, isLoading, isError, error } = useRevenueMonetization(groupBy, {
    city: debouncedCity,
    zipCode: debouncedZipCode,
  });

  const chartData = data?.series ?? [];
  const summary = data?.summary;
  const isYearlyView = groupBy === "year";
  const yearlyChartData = useMemo(
    () => (isYearlyView ? getYearlyChartData(chartData) : []),
    [chartData, isYearlyView]
  );
  const yAxisMax = useMemo(
    () =>
      isYearlyView
        ? getYearlyChartYAxisMax(yearlyChartData)
        : getChartYAxisMax(chartData),
    [chartData, isYearlyView, yearlyChartData]
  );

  const tooltipFormatter = (value: unknown, name: unknown) => {
    const labels: Record<string, string> = {
      ads: "Ads Revenue",
      leads: "Leads Revenue",
      pkg: "Category Package",
      badge: "Trusted Expert Badge Revenue",
    };
    const amount = Number(value) || 0;
    const key = String(name);
    return [`$${amount}`, labels[key] ?? key];
  };

  const axisTickStyle = { fill: "#9CA3AF", fontSize: 11, fontWeight: 500 };

  const stats = [
    {
      title: "Total Revenue by Ads",
      value: formatRevenueAmount(summary?.totalAdsRevenue ?? 0),
      icon: MdTrendingUp,
    },
    {
      title: "Total Revenue by Leads",
      value: formatRevenueAmount(summary?.totalLeadsRevenue ?? 0),
      icon: IoPeopleOutline,
    },
    {
      title: "Adv. Category Package",
      value: formatRevenueAmount(summary?.totalCategoryRevenue ?? 0),
      icon: RiMoneyDollarCircleLine,
    },
    {
      title: "Trusted Expert Badge Revenue",
      value: formatRevenueAmount(summary?.totalTrustedExpertBadgeRevenue ?? 0),
      icon: MdVerified,
    },
  ];

  return (
    <div className="min-h-screen font-sans">
      <h1 className="text-[28px] font-bold text-[#1A1A1A] mb-8">
        Revenue and Monetization
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item, i) => (
          <Card
            key={i}
            className="border-none shadow-none rounded-[24px] bg-white"
          >
            <CardContent className="p-5 flex items-center gap-4">
              <div className="bg-[#00586417] p-3 rounded-2xl shadow-sm text-[#005864] flex items-center justify-center shrink-0">
                <item.icon size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium mb-0.5 truncate">{item.title}</p>
                <h2 className="text-2xl font-semibold text-[#1A1A1A] tracking-tight truncate">
                  {isLoading ? "..." : item.value}
                </h2>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-[32px] border-none shadow-sm bg-white p-8">
        <div className="flex justify-between items-start mb-8 gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">
              Revenue Overview
            </h2>
            <div className="flex flex-wrap gap-6">
              {isYearlyView ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#0A6270] rounded-[3px]" />
                  <span className="text-[11px] font-medium text-gray-500">
                    Total Revenue
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#0A6270] rounded-[3px]" />
                    <span className="text-[11px] font-medium text-gray-500">
                      Total Revenue by Ads
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#E67E22] rounded-[3px]" />
                    <span className="text-[11px] font-medium text-gray-500">
                      Total Revenue by Leads
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#D980FA] rounded-[3px]" />
                    <span className="text-[11px] font-medium text-gray-500">
                      Adv. Category Package
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#10B981] rounded-[3px]" />
                    <span className="text-[11px] font-medium text-gray-500">
                      Trusted Expert Badge
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <Select
            value={groupBy}
            onValueChange={(value) =>
              setGroupBy(value as RevenueMonetizationGroupBy)
            }
          >
            <SelectTrigger className="w-[130px] h-9 text-[11px] font-bold bg-[#F4F9F9] border-none">
              <SelectValue>{GROUP_BY_LABELS[groupBy]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="h-[400px] w-full">
          {isError ? (
            <div className="h-full flex items-center justify-center text-red-600 text-sm">
              ⚠ {(error as Error)?.message ?? "Failed to load revenue data."}
            </div>
          ) : isLoading ? (
            <div className="h-full flex items-center justify-center text-sm text-gray-400">
              Loading...
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-gray-400">
              No revenue data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {isYearlyView ? (
                <BarChart
                  data={yearlyChartData}
                  margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
                  barCategoryGap="55%"
                >
                  <CartesianGrid vertical={false} stroke="#F0F0F0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={axisTickStyle}
                    dy={10}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={axisTickStyle}
                    width={56}
                    domain={[0, yAxisMax]}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.04)" }}
                    formatter={(value) => [`$${Number(value) || 0}`, "Total Revenue"]}
                  />
                  <Bar
                    dataKey="revenue"
                    name="revenue"
                    fill="#0A6270"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={72}
                  />
                </BarChart>
              ) : (
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
                >
                  <CartesianGrid vertical={false} stroke="#F0F0F0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={axisTickStyle}
                    dy={10}
                    interval="preserveStartEnd"
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={axisTickStyle}
                    width={56}
                    domain={[0, yAxisMax]}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    cursor={{ stroke: "#EEE" }}
                    formatter={tooltipFormatter}
                  />

                  <Line
                    type="monotone"
                    dataKey="ads"
                    stroke="#0A6270"
                    strokeWidth={2}
                    strokeDasharray="8 5"
                    dot={false}
                    activeDot={{ r: 4 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="leads"
                    stroke="#E67E22"
                    strokeWidth={2}
                    strokeDasharray="8 5"
                    dot={false}
                    activeDot={{ r: 4 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="pkg"
                    stroke="#D980FA"
                    strokeWidth={2}
                    strokeDasharray="8 5"
                    dot={false}
                    activeDot={{ r: 4 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="badge"
                    stroke="#10B981"
                    strokeWidth={2}
                    strokeDasharray="8 5"
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
      </Card>
    </div>
  );
}
