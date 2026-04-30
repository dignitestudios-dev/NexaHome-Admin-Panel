import React from "react";
import { ChevronDown } from "lucide-react";

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Generate smooth fake dataset (you can replace with API later)
const generateBars = (count: number) => {
  return Array.from({ length: count }).map((_, i) => {
    return Math.sin(i * 0.2) * 20 + 40 + (i % 8) * 4;
  });
};

const barData = generateBars(60);

const RevenueAnalysis: React.FC = () => {
  return (
    <div className="lg:col-span-2 rounded-[40px] border-none shadow-sm bg-white p-10 h-[450px] relative overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-xl font-bold text-[#1A1A1A]">
          Revenue Analysis
        </h2>

        <div className="bg-[#F4F9F9] px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold text-gray-500">
          Monthly <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {/* Chart */}
      <div className="flex h-[280px]">
        
        {/* Y-Axis */}
        <div className="flex flex-col justify-between text-[10px] font-bold text-gray-400 pb-8 pr-4">
          <span>$600</span>
          <span>$500</span>
          <span>$400</span>
          <span>$300</span>
          <span>$200</span>
          <span>$100</span>
          <span>$0</span>
        </div>

        {/* Bars */}
        <div className="flex-1 flex items-end gap-[2px] pb-8 relative">
          {barData.map((height, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-[#0FA3A3]/20 via-[#0FA3A3]/60 to-[#0FA3A3] rounded-t-[2px] transition-all duration-300 hover:opacity-80"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>

      {/* X-Axis */}
      <div className="flex justify-between px-10 text-[10px] font-bold text-gray-400">
        {months.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
};

export default RevenueAnalysis;