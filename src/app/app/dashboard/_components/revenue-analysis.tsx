import React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

// Months
const months = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
]

// Generate smooth dataset
const data = months.map((month, i) => ({
  name: month,
  revenue: Math.sin(i * 0.5) * 200 + 400,
}))

const RevenueAnalysis = () => {
  return (
    <Card className="lg:col-span-2 rounded-[40px] border-none shadow-sm h-[450px] p-8">
      
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-xl font-bold text-[#1A1A1A]">
          Revenue Analysis
        </CardTitle>

        <Select defaultValue="monthly">
          <SelectTrigger className="w-[120px] h-8 text-xs font-bold bg-[#F4F9F9] border-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      {/* Chart */}
      <CardContent className="h-[320px] px-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            
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
              cursor={{ fill: "rgba(15,163,163,0.1)" }}
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
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default RevenueAnalysis