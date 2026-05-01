import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

type Category = {
  name: string;
  value: string;
  percentage: number;
  color?: string;
  gradient?: string;
};

const categories: Category[] = [
  {
    name: "Window Cleaning",
    value: "10,000",
    percentage: 100,
    color: "#004D4D",
  },
  {
    name: "Power Washing",
    value: "8,000",
    percentage: 80,
    color: "#005864",
  },
  {
    name: "Soft Washing",
    value: "6,000",
    percentage: 65,
    gradient:
      "bg-gradient-to-r from-[#0FA3A3]/20 via-[#0FA3A3]/60 to-[#0FA3A3]",
  },
  {
    name: "Glass Repair",
    value: "4,000",
    percentage: 40,
    color: "#0FA3A3",
  },
  {
    name: "Roof Cleaning",
    value: "10,000",
    percentage: 100,
    color: "#004D4D",
  },
  {
    name: "Gutter Cleaning",
    value: "10,000",
    percentage: 100,
    color: "#004D4D",
  },
];

const PopularCategories: React.FC = () => {
  return (
    <Card className="rounded-[40px] border-none shadow-sm pt-8 pb-4">
      <CardHeader>
        <CardTitle className="text-[16px] font-bold">
          Popular Categories
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {categories.map((cat, i) => (
          <div key={i} className="space-y-2">
            {/* Header */}
            <div className="flex justify-between items-center font-bold">
              <div className="flex items-center gap-3 text-[#1A1A1A]">
                <span className="w-6 h-6 bg-[#004D4D] text-white text-[10px] flex items-center justify-center rounded-md font-black">
                  {i + 1}
                </span>
                <span className="text-[12px] font-medium">{cat.name}</span>
              </div>

              <span className="text-[12px] font-semibold text-gray-500">
                {cat.value}
              </span>
            </div>

            {/* Progress Bar Wrapper */}
            <div className="relative">
              <Progress value={cat.percentage} className="h-2 bg-[#E6EEEE]" />

              {/* Custom fill (to support gradient like your design) */}
              <div
                className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-500 ${
                  cat.gradient || ""
                }`}
                style={{
                  width: `${cat.percentage}%`,
                  backgroundColor: cat.gradient ? undefined : cat.color,
                }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PopularCategories;
