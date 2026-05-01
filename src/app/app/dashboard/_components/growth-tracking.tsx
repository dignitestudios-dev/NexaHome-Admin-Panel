import React from "react";
import { ChevronDown } from "lucide-react";

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

const growthData = [
  { month: "Jan", users: 40, experts: 20 },
  { month: "Feb", users: 55, experts: 30 },
  { month: "Mar", users: 70, experts: 45 },
  { month: "Apr", users: 60, experts: 35 },
  { month: "May", users: 80, experts: 50 },
  { month: "Jun", users: 75, experts: 48 },
];

const GrowthTracking = () => {
  return (
    <Card className="rounded-[40px] py-6 border-none shadow-sm h-[400px] flex flex-col">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-[16px] font-bold">Growth Tracking</CardTitle>

        <Select defaultValue="monthly">
          <SelectTrigger className="w-[120px] h-8 text-xs font-bold bg-[#EFF7F8] border-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
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
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={growthData} barGap={6}>
              {/* Grid (matches your subtle lines) */}
              <CartesianGrid vertical={false} stroke="#F3F4F6" />

              <XAxis
                dataKey="month"
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
        </div>
      </CardContent>
    </Card>
  );
};

export default GrowthTracking;
