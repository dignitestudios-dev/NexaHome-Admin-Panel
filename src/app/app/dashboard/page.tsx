"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Briefcase,
  DollarSign,
  UserCheck,
  Star,
} from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "56,879",
    icon: Users,
  },
  {
    title: "Total Experts",
    value: "56,879",
    icon: UserCheck,
  },
  {
    title: "Total Jobs Posted",
    value: "56,879",
    icon: Briefcase,
  },
  {
    title: "Total Revenue",
    value: "56,879",
    icon: DollarSign,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Heading */}
      <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((item, i) => {
          const Icon = item.icon;
          return (
            <Card key={i} className="rounded-2xl shadow-sm">
              <CardContent className="p-5 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <Icon className="w-5 h-5 text-teal-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{item.title}</p>
                    <h2 className="text-xl font-semibold">
                      {item.value}
                    </h2>
                  </div>
                </div>

                <div className="bg-teal-800 text-white text-xs rounded-full px-3 py-1 w-fit">
                  ↗ 12 increase this month
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* User Insights */}
        <Card className="col-span-2 rounded-2xl">
          <CardContent className="p-6">
            <h2 className="font-semibold mb-6">User Insights</h2>

            <div className="flex items-center justify-between">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 rounded-full border-[10px] border-teal-700 border-t-gray-200" />
                  <p className="text-sm text-gray-600">
                    {i === 0
                      ? "Active Users"
                      : i === 1
                      ? "Repeat Homeowners"
                      : "Completed Jobs"}
                  </p>
                  <span className="font-semibold text-lg">68%</span>
                </div>
              ))}

              {/* Rating */}
              <div className="bg-teal-800 text-white rounded-2xl p-6 flex flex-col items-center justify-center">
                <p className="text-sm">Average Rating</p>
                <div className="flex items-center gap-1 text-xl font-semibold mt-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  4.7
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Growth Tracking */}
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4">Growth Tracking</h2>

            <div className="flex items-end gap-4 h-[200px]">
              {[100, 240, 60, 350, 110, 230].map((val, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div
                    className="w-4 bg-teal-700 rounded"
                    style={{ height: `${val / 2}px` }}
                  />
                  <div
                    className="w-4 bg-lime-400 rounded"
                    style={{ height: `${val / 3}px` }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Revenue */}
        <Card className="col-span-2 rounded-2xl">
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4">Revenue Analysis</h2>

            <div className="flex items-end gap-1 h-[200px]">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 bg-teal-600 rounded"
                  style={{
                    height: `${Math.random() * 150 + 20}px`,
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card className="rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold">Popular Categories</h2>

            {[
              { name: "Window Cleaning", value: "10,000" },
              { name: "Power Washing", value: "8,000" },
              { name: "Soft Washing", value: "6,000" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span>
                    {i + 1}. {item.name}
                  </span>
                  <span>{item.value}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-teal-700 rounded-full"
                    style={{ width: `${80 - i * 20}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}