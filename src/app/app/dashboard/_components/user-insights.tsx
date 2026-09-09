"use client";

import React from "react";
import { Star, Users, RotateCcw, CheckCircle2, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";
import { useDashboardInsights } from "@/features/dashboard/dashboard.hooks";
import { useDashboardFilters } from "@/components/global/filter-context";

interface DonutProps {
  value: number;
  color?: string;
  bgColor?: string;
  size?: number;
  innerRadius?: string;
  outerRadius?: string;
  children?: React.ReactNode;
}

const Donut: React.FC<DonutProps> = ({
  value,
  color = "#005864",
  bgColor = "#E2ECEE",
  size = 80,
  innerRadius = "70%",
  outerRadius = "100%",
  children,
}) => {
  const safeValue = Math.min(Math.max(Number.isFinite(value) ? value : 0, 0), 100);
  const data = [{ value: safeValue }];

  return (
    <div
      className="relative shrink-0 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              dataKey="value"
              cornerRadius={size > 70 ? 4 : 2}
              fill={color}
              background={{ fill: bgColor }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          {children}
        </div>
      )}
    </div>
  );
};

const UserInsights: React.FC = () => {
  const { debouncedCity, debouncedZipCode } = useDashboardFilters();
  const { data, isLoading, isError, error } = useDashboardInsights({
    city: debouncedCity,
    zipCode: debouncedZipCode,
  });

  const activeUsersPercent = data?.activeUsersPercent ?? 0;
  const repeatHomeownersPercent = data?.repeatHomeownersPercent ?? 0;
  const completedJobsPercent = data?.completedJobsPercent ?? 0;
  const averageRating = data?.averageRating ?? 0;

  // Map 0-5 rating to 0-100 ring fill
  const ratingPercent = Math.min(Math.max((averageRating / 5) * 100, 0), 100);

  if (isError) {
    return (
      <Card className="rounded-[40px] border-none shadow-sm min-h-[400px] flex items-center justify-center p-8 bg-white">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-600 px-4 py-3 rounded-md text-sm">
          ⚠ {(error as Error)?.message ?? "Failed to load user insights."}
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-[40px] border-none shadow-sm min-h-[400px] lg:h-[400px] flex flex-col p-6 sm:p-7 w-full bg-white justify-between">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#005864]" />
          <h2 className="text-[16px] font-bold text-gray-900 tracking-tight">
            User Insights
          </h2>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF7F8] text-[#005864] text-[11px] font-semibold border border-[#E1ECEE]">
          <Sparkles className="w-3.5 h-3.5 text-[#005864]" />
          <span>Platform Overview</span>
        </div>
      </div>

      {/* BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 flex-1 min-h-0">
        {/* LEFT COLUMN: Asymmetrical Split */}
        <div className="md:col-span-7 flex flex-col gap-3.5 min-h-0">
          {/* BENTO CELL 1: Active Users (Primary Engagement Card) */}
          <div className="flex-1 bg-[#F5F9FA] hover:bg-[#EEF6F8] rounded-[24px] p-4 flex items-center justify-between border border-[#E1ECEE]/70 transition-all duration-300 group">
            <div className="flex flex-col justify-between h-full min-w-0 pr-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E6EEEE] flex items-center justify-center text-[#004D4D] group-hover:scale-105 transition-transform shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-gray-800 leading-none">
                    Active Users
                  </p>
                  <p className="text-[10px] font-medium text-gray-500 mt-0.5 truncate">
                    Platform Activity
                  </p>
                </div>
              </div>

              <div className="mt-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#005864] tracking-tight">
                    {isLoading ? "—" : `${activeUsersPercent}%`}
                  </span>
                  {!isLoading && data?.activeUsersRatio && (
                    <span className="text-[10px] font-bold text-[#005864] bg-white px-2 py-0.5 rounded-full border border-[#E1ECEE] shadow-xs">
                      {data.activeUsersRatio}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Monthly platform engagement
                </p>
              </div>
            </div>

            <Donut
              value={activeUsersPercent}
              size={80}
              color="#005864"
              bgColor="#E2ECEE"
            >
              <span className="text-xs font-black text-[#005864]">
                {isLoading ? "—" : `${activeUsersPercent}%`}
              </span>
            </Donut>
          </div>

          {/* SUB-GRID: Repeat Homeowners & Completed Jobs */}
          <div className="grid grid-cols-2 gap-3.5 flex-1 min-h-0">
            {/* BENTO CELL 2: Repeat Homeowners */}
            <div className="bg-[#F5F9FA] hover:bg-[#EEF6F8] rounded-[22px] p-3.5 flex flex-col justify-between border border-[#E1ECEE]/70 transition-all duration-300 group min-h-[110px]">
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-lg bg-[#E6EEEE] flex items-center justify-center text-[#004D4D] group-hover:scale-105 transition-transform shrink-0">
                  <RotateCcw className="w-3.5 h-3.5" />
                </div>
                {!isLoading && data?.repeatHomeownersRatio && (
                  <span className="text-[10px] font-bold text-[#005864] bg-white px-1.5 py-0.5 rounded-md border border-[#E1ECEE] shadow-xs truncate max-w-[80px]">
                    {data.repeatHomeownersRatio}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between mt-2 gap-2">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-gray-800 leading-tight">
                    Repeat
                    <br />
                    Homeowners
                  </p>
                  <span className="text-lg font-black text-[#005864] mt-1 block">
                    {isLoading ? "—" : `${repeatHomeownersPercent}%`}
                  </span>
                </div>
                <Donut
                  value={repeatHomeownersPercent}
                  size={52}
                  color="#005864"
                  bgColor="#E2ECEE"
                />
              </div>
            </div>

            {/* BENTO CELL 3: Completed Jobs */}
            <div className="bg-[#F5F9FA] hover:bg-[#EEF6F8] rounded-[22px] p-3.5 flex flex-col justify-between border border-[#E1ECEE]/70 transition-all duration-300 group min-h-[110px]">
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-lg bg-[#E6EEEE] flex items-center justify-center text-[#004D4D] group-hover:scale-105 transition-transform shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                {!isLoading && data?.completedJobsRatio && (
                  <span className="text-[10px] font-bold text-[#005864] bg-white px-1.5 py-0.5 rounded-md border border-[#E1ECEE] shadow-xs truncate max-w-[80px]">
                    {data.completedJobsRatio}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between mt-2 gap-2">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-gray-800 leading-tight">
                    Completed
                    <br />
                    Jobs
                  </p>
                  <span className="text-lg font-black text-[#005864] mt-1 block">
                    {isLoading ? "—" : `${completedJobsPercent}%`}
                  </span>
                </div>
                <Donut
                  value={completedJobsPercent}
                  size={52}
                  color="#005864"
                  bgColor="#E2ECEE"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: HERO BENTO CELL (Average Rating) */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#005864] via-[#044a54] to-[#023b43] text-white rounded-[26px] p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden shadow-sm">
          {/* Subtle Ambient Decorative Glows */}
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/5 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#00a299]/15 rounded-full blur-lg pointer-events-none" />

          {/* Top Bar */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-[#FFB800] border border-white/10">
                <Star className="w-4 h-4 fill-[#FFB800]" />
              </div>
              <span className="text-xs font-bold text-white/95">
                Average Rating
              </span>
            </div>
            <span className="text-[10px] font-semibold text-white/80 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
              Score
            </span>
          </div>

          {/* Center Radial Rating Meter */}
          <div className="flex flex-col items-center justify-center my-2 relative z-10">
            <Donut
              value={ratingPercent}
              size={114}
              color="#94B2B6"
              bgColor="rgba(255, 255, 255, 0.15)"
              innerRadius="72%"
              outerRadius="100%"
            >
              <div className="flex flex-col items-center leading-none">
                <span className="text-2xl font-black text-white tracking-tight">
                  {isLoading ? "—" : averageRating}
                </span>
                <span className="text-[10px] font-semibold text-white/70 mt-1">
                  / 5.0
                </span>
              </div>
            </Donut>
          </div>

          {/* Bottom Frosted Pill */}
          <div className="w-full bg-white/10 backdrop-blur-md rounded-[18px] py-2 px-3 flex items-center justify-between border border-white/10 relative z-10">
            <div>
              <p className="text-[11px] font-bold text-white leading-tight">
                Customer Satisfaction
              </p>
              <p className="text-[10px] text-white/70">Verified feedback</p>
            </div>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3 h-3 ${
                    s <= Math.round(averageRating)
                      ? "text-[#FFB800] fill-[#FFB800]"
                      : "text-white/30 fill-transparent"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UserInsights;
