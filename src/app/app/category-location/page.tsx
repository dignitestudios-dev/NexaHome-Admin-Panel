// "use client"

// import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { ChartConfig, ChartContainer } from "@/components/ui/chart";
// import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";

// // Data Structure definitions
// interface CategoryData {
//   rank: number;
//   name: string;
//   count: number;
// }

// interface TopAreaData {
//   area: string;
//   totalJobs: number;
//   demand: number;
// }

// // 1. Data Definitions (Static, based on the image)
// const categoryStats: CategoryData[] = [
//   { rank: 1, name: "Pressure Washing", count: 10000 },
//   { rank: 1, name: "Outdoor Living", count: 10000 },
//   { rank: 1, name: "Pest Control", count: 10000 },
//   { rank: 1, name: "Painting Services", count: 10000 },
//   { rank: 1, name: "Gutter Services", count: 10000 },
//   { rank: 1, name: "Window Cleaning", count: 10000 },
// ];

// const barChartData = [
//   { rank: 1, name: "David Mike", count: 4.5 },
//   { rank: 2, name: "Michael Alex", count: 2.8 },
//   { rank: 3, name: "Mike Smith", count: 5.6 },
//   { rank: 4, name: "Jackson John", count: 3.5 },
//   { rank: 5, name: "Alex John", count: 1.5 },
// ];

// const topAreaData: TopAreaData[] = [
//   { area: "ABC Area", totalJobs: 98, demand: 45897 },
//   { area: "ABC Area", totalJobs: 98, demand: 45897 },
//   { area: "ABC Area", totalJobs: 98, demand: 45897 },
//   { area: "ABC Area", totalJobs: 98, demand: 45897 },
//   { area: "ABC Area", totalJobs: 98, demand: 45897 },
// ];

// // Formatting functions
// const formatCount = (count: number) => count.toLocaleString();
// const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

// // 2. Main Dashboard Component
// const InsightsDashboard = () => {
//   return (
//     <div className="space-y-12 ">
//       <h1 className="text-3xl font-bold text-[#1A1A1A]">Category & Location Insights</h1>

//       {/* Top Row: Categories and Bar Chart */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Popular Categories Card */}
//         <Card className="border-none shadow-none rounded-[28px] bg-white p-6">
//           <CardHeader className="p-0 mb-6 flex flex-row items-center justify-between">
//             <CardTitle className="text-xl font-semibold text-[#1A1A1A]">Popular Categories</CardTitle>
//             <p className="text-sm font-medium text-[#1A1A1A]">Lead Count</p>
//           </CardHeader>
//           <CardContent className="p-0 space-y-2.5">
//             {categoryStats.map((item, index) => (
//               <div key={index} className="space-y-1.5">
//                 <div className="flex justify-between items-center text-sm font-medium">
//                   <div className="flex items-center gap-3">
//                     <span className="w-6 h-6 flex items-center justify-center rounded-sm bg-[#00515C] text-white text-xs font-bold">
//                       {item.rank}
//                     </span>
//                     <span className="text-[#333333]">{item.name}</span>
//                   </div>
//                   <span className="text-[#00515C]">{formatCount(item.count)}</span>
//                 </div>
//                 {/* Visual Bar representation */}
//                 <div className="h-4 w-full bg-[#D1E6E9] rounded-full overflow-hidden relative">
//                     <div className="absolute inset-0 h-full w-full bg-[#00515C]" style={{opacity: 0.85}}></div>
//                 </div>
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         {/* Experts Per Category Chart Card */}
//         <Card className="border-none shadow-none rounded-[28px] bg-white p-6">
//           <CardHeader className="p-0 mb-6">
//             <CardTitle className="text-xl font-semibold text-[#1A1A1A]">Experts Per Category</CardTitle>
//           </CardHeader>
//           <CardContent className="p-0">
//             <ChartContainer config={{ count: { label: "Count", color: "hsl(var(--primary))" } }} className="h-[280px] w-full">
//                 <BarChart data={barChartData} margin={{ top: 20, right: 0, left: -20, bottom: -10 }}>
//                     <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e0e0e0" />
//                     <XAxis dataKey="rank" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#777" }} />
//                     <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#777" }} domain={[0, 6]} ticks={[0, 1, 2, 3, 4, 5, 6]} />
//                     <Bar dataKey="count" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} barSize={20} />
//                     {/* Define the vertical gradient */}
//                     <defs>
//                         <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
//                             <stop offset="0%" stopColor="#00515C" />
//                             <stop offset="100%" stopColor="#00A7BA" />
//                         </linearGradient>
//                     </defs>
//                 </BarChart>
//             </ChartContainer>
//             {/* Custom Legend - Expert Names */}
//             <div className="flex justify-between items-center text-xs text-[#777] font-medium pt-3 px-12">
//                 {barChartData.map((expert, idx) => (
//                     <p key={idx} className="whitespace-nowrap">{expert.name}</p>
//                 ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Bottom Table: Top Areas */}
//       <div className="space-y-6">
//         <div className="flex justify-between items-end">
//           <h2 className="text-2xl font-semibold text-[#1A1A1A]">Top Areas By Job Activity</h2>
//           <a href="#" className="text-sm font-semibold text-[#00515C] hover:underline">View All</a>
//         </div>

//         <div className="rounded-[28px] bg-white overflow-hidden p-6">
//           <Table>
//             <TableHeader>
//               <TableRow className="border-none hover:bg-transparent">
//                 <TableHead className="w-[45%] text-[#666666] font-medium text-sm pl-4">Area</TableHead>
//                 <TableHead className="w-[30%] text-[#666666] font-medium text-sm">Total Jobs</TableHead>
//                 <TableHead className="w-[25%] text-right text-[#666666] font-medium text-sm pr-4">Category Demand</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {topAreaData.map((row, index) => (
//                 <TableRow key={index} className="border-b border-[#EDEDED] last:border-b-0">
//                   <TableCell className="font-medium text-sm text-[#1A1A1A] py-5 pl-4">{row.area}</TableCell>
//                   <TableCell className="text-sm text-[#1A1A1A] py-5">{row.totalJobs}</TableCell>
//                   <TableCell className="text-right text-sm text-[#1A1A1A] py-5 pr-4">{formatCurrency(row.demand)}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InsightsDashboard;

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { DataTable } from "./_components/data-table";

const categoryStats = [
  { rank: 1, name: "Pressure Washing", count: 10000 },
  { rank: 1, name: "Outdoor Living", count: 10000 },
  { rank: 1, name: "Pest Control", count: 10000 },
  { rank: 1, name: "Painting Services", count: 10000 },
  { rank: 1, name: "Gutter Services", count: 10000 },
  { rank: 1, name: "Window Cleaning", count: 10000 },
];

const barChartData = [
  { rank: "1", name: "David", count: 5.6 },
  { rank: "2", name: "Michael", count: 4.8 },
  { rank: "3", name: "Mike", count: 4.2 },
  { rank: "4", name: "Max", count: 3.9 },
  { rank: "5", name: "David", count: 3.2 },
  { rank: "6", name: "Mike", count: 2.5 },
];

const tableData = Array(5).fill({
  area: "ABC Area",
  totalJobs: 98,
  demand: 45897,
});

export default function InsightsPage() {
  return (
    <div className=" space-y-6  min-h-screen">
      <h1 className="text-3xl font-bold text-[#1A1A1A]">
        Category & Location Insights
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Categories */}
        <Card className="border-none shadow-none rounded-[32px] bg-white p-6">
          <CardHeader className="p-0  flex flex-row items-center justify-between">
            <CardTitle className="text-[16px] font-bold">
              Popular Categories
            </CardTitle>
            <span className="text-[13px] font-bold text-[#1A1A1A]">
              Lead Count
            </span>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            {categoryStats.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center text-[13px] font-semibold">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 flex items-center justify-center rounded-md bg-[#00515C] text-white text-[10px]">
                      {item.rank}
                    </span>
                    <span className="text-[#333333]">{item.name}</span>
                  </div>
                  <span className="text-[#00707E]">
                    {item.count.toLocaleString()}
                  </span>
                </div>
                <div className="h-[14px] w-full bg-gradient-to-r from-[#00515C] to-[#00A7BA] rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Experts Chart */}
        <Card className="border-none shadow-none rounded-[28px] bg-white p-6">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-[16px] font-bold text-[#1A1A1A]">
              Experts Per Category
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ChartContainer
              config={{
                count: { label: "Count", color: "hsl(var(--primary))" },
              }}
              className="h-[280px] w-full"
            >
              <BarChart
                data={barChartData}
                margin={{ top: 20, right: 0, left: -20, bottom: -10 }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="#e0e0e0"
                />
                <XAxis
                  dataKey="rank"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#777" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#777" }}
                  domain={[0, 6]}
                  ticks={[0, 1, 2, 3, 4, 5, 6]}
                />
                <Bar
                  dataKey="count"
                  fill="url(#colorGradient)"
                  radius={[8, 8, 0, 0]}
                  barSize={20}
                />
                {/* Define the vertical gradient */}{" "}
                <defs>
                  <linearGradient
                    id="colorGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#00515C" />
                    <stop offset="100%" stopColor="#00A7BA" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ChartContainer>{" "}
            {/* Custom Legend - Expert Names */}
            <div className="flex justify-between items-center text-xs text-[#777] font-medium pt-3 px-12">
              {barChartData.map((expert, idx) => (
                <p key={idx} className="whitespace-nowrap">
                  {expert.name}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Separated Table Component Call */}
      <DataTable data={tableData} />
    </div>
  );
}
