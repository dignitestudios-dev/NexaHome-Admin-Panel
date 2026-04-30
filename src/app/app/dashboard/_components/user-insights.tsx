import React from "react";
import { Star, ChevronDown } from "lucide-react";

const insightsData = [
  { label: "Active Users", value: 68 },
  { label: "Repeat Homeowners", value: 68 },
  { label: "Completed Jobs", value: 68 },
];

const growthData = [
  { users: 40, experts: 25, month: "Jan" },
  { users: 70, experts: 45, month: "Feb" },
  { users: 20, experts: 30, month: "Mar" },
  { users: 95, experts: 75, month: "Apr" },
  { users: 40, experts: 25, month: "May" },
  { users: 70, experts: 50, month: "Jun" },
];

const UserInsights: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* User Insights */}
      <div className="lg:col-span-2 rounded-[40px] border-none shadow-sm bg-white overflow-hidden h-[400px] flex">
        <div className="flex-[3] p-10 flex flex-col justify-between">
          <h2 className="text-xl font-bold text-[#1A1A1A]">
            User Insights
          </h2>

          <div className="flex items-center gap-4">
            {insightsData.map((item, idx) => {
              const circumference = 2 * Math.PI * 48;
              const offset =
                circumference - (item.value / 100) * circumference;

              return (
                <div key={idx} className="flex-1 flex flex-col">
                  {/* Circle Chart */}
                  <div className="flex items-center justify-center py-6">
                    <div className="relative w-28 h-28">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="56"
                          cy="56"
                          r="48"
                          stroke="#EFEFEF" // New lighter light gray
                          strokeWidth="12"
                          fill="none"
                        />
                        <circle
                          cx="56"
                          cy="56"
                          r="48"
                          stroke="#065662" // New slightly different green
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={circumference}
                          strokeDashoffset={offset}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Label */}
                  <div className="bg-[#EFF7F8] rounded-[24px] p-4 text-center">
                    <p className="text-[12px] font-semibold text-gray-600 mb-1 leading-tight">
                      {item.label}
                    </p>
                    <p className="text-2xl font-black text-[#065662]">
                      {item.value}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rating Block */}
        <div className="flex-1 bg-gradient-to-br from-[#065662] to-[#0A4D45] p-5 m-3 rounded-[35px] flex flex-col items-center justify-between">
          <div className="relative w-32 h-32 mt-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="52"
                stroke="white"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="52"
                stroke="white"
                strokeWidth="12"
                fill="none"
                strokeDasharray="326.7"
                strokeDashoffset="80"
                strokeLinecap="round"
                className="opacity-40"
              />
            </svg>
          </div>

          <div className="w-full bg-white/10 rounded-[28px] py-5 flex flex-col items-center border border-white/5">
            <p className="text-xs font-medium text-white/80 mb-1">
              Average Rating
            </p>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-[#FFD700] text-[#FFD700]" /> {/* New gold color */}
              <span className="text-3xl font-black text-white italic">
                4.7
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Tracking */}
      <div className="rounded-[40px] border-none shadow-sm bg-white p-8 h-[400px] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#1A1A1A]">
            Growth Tracking
          </h2>

          <div className="bg-[#EFF7F8] px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold text-gray-500">
            Monthly <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
            <div className="w-3 h-3 bg-[#065662] rounded-sm" /> Users
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
            <div className="w-3 h-3 bg-[#CDE01A] rounded-sm" /> Experts {/* New expert color */}
          </div>
        </div>

        {/* Bars */}
        <div className="flex-1 flex items-end justify-between px-2 gap-3 pb-2 border-b border-gray-50 relative">
          {/* Grid Lines */}
          <div className="absolute left-0 bottom-10 w-full border-t border-gray-50" />
          <div className="absolute left-0 bottom-20 w-full border-t border-gray-50" />
          <div className="absolute left-0 bottom-30 w-full border-t border-gray-50" />

          {growthData.map((d, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-3 h-full justify-end z-10"
            >
              <div className="flex gap-1.5 items-end h-full w-full justify-center">
                <div
                  className="w-3 bg-[#065662] rounded-full"
                  style={{ height: `${d.users}%` }}
                />
                <div
                  className="w-3 bg-[#CDE01A] rounded-full" // New expert color
                  style={{ height: `${d.experts}%` }}
                />
              </div>

              <span className="text-[10px] font-bold text-gray-400">
                {d.month}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserInsights;