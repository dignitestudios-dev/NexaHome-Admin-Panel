"use client";

import React from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";
import { useDashboardInsights } from "@/features/dashboard/dashboard.hooks";

const Donut = ({
  value,
  color = "#065662",
  bgColor = "#EFEFEF",
}: {
  value: number;
  color?: string;
  bgColor?: string;
}) => {
  const data = [{ value }];

  return (
    <div className="relative w-32 h-32">
      <div className="absolute inset-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="70%"
            outerRadius="100%"
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            {/* Fixed 0-100 domain so the value maps to an actual % of the ring */}
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              dataKey="value"
              cornerRadius={0}
              fill={color}
              background={{ fill: bgColor }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const UserInsights: React.FC = () => {
  const { data, isLoading, isError, error } = useDashboardInsights();

  const insightsData = [
    { label: "Active Users", value: data?.activeUsersPercent ?? 0 },
    { label: "Repeat Homeowners", value: data?.repeatHomeownersPercent ?? 0 },
    { label: "Completed Jobs", value: data?.completedJobsPercent ?? 0 },
  ];

  const averageRating = data?.averageRating ?? 0;
  // Map a 0-5 rating to a 0-100 ring fill.
  const ratingPercent = (averageRating / 5) * 100;

  return (
    <Card className="rounded-[40px] border-none shadow-sm h-[400px] flex flex-row overflow-hidden w-full bg-white">
      {/* LEFT SECTION */}
      <CardContent className="flex-1 p-8 flex flex-col justify-between min-w-0">
        <h2 className="text-[16px] font-bold">User Insights</h2>

        {isError ? (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-600 px-4 py-2 rounded-md text-sm">
            ⚠ {(error as Error)?.message ?? "Failed to load insights."}
          </div>
        ) : (
          <div className="flex items-center gap-2 w-full">
            {insightsData.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col min-w-0">
                {/* Donut */}
                <div className="flex justify-center py-4">
                  <Donut value={item.value} />
                </div>

                {/* Label */}
                <div className="bg-[#F0F5F6] rounded-[20px] px-2 py-4 text-center">
                  <p className="text-[11px] font-semibold text-gray-600 mb-0.5 leading-none whitespace-nowrap">
                    {item.label}
                  </p>
                  <p className="text-2xl font-black pt-1 text-[#065662]">
                    {isLoading ? "—" : `${item.value}%`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* RIGHT SECTION - Rating Sidebar */}
      <div className="flex-none w-[240px] bg-[#065662] p-5 m-2 rounded-[35px] flex flex-col items-center justify-between">
        {/* Rating Donut */}
        <div className="mt-6">
          <Donut value={ratingPercent} color="#94B2B6" bgColor="white" />
        </div>

        {/* Bottom Rating Box */}
        <div className="w-full bg-white/10 backdrop-blur-md rounded-[28px] py-6 flex flex-col items-center border border-white/10">
          <p className="text-xs text-white/80 mb-2">Average Rating</p>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-[#FFB800] text-[#FFB800]" />
            <span className="text-3xl font-bold text-white">
              {isLoading ? "—" : averageRating}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UserInsights;
