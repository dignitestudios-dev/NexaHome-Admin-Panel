"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Lucide Icons
import { Clock, BarChart3, Users, Filter } from "lucide-react";

// --- Mock Data ---
const stats = [
  { title: "Avg Response Time", value: "56,879", icon: Clock },
  { title: "Avg Responses Per Lead", value: "56,879", icon: BarChart3 },
  { title: "Total Leads Purchased", value: "56,879", icon: Users },
];

const tableData = [
  { category: "Window Cleaning", total: 98, active: 56 },
  { category: "Plumbing Services", total: 98, active: 56 },
  { category: "Electrical Services", total: 98, active: 56 },
  { category: "Handyman Services", total: 98, active: 56 },
  { category: "Pest Control", total: 98, active: 56 },
  { category: "Appliance Repair", total: 98, active: 56 },
  { category: "Roofing Services", total: 98, active: 56 },
  { category: "Pressure Washing", total: 98, active: 56 },
  { category: "Gutter Services", total: 98, active: 56 },
  { category: "Painting Services", total: 98, active: 56 },
  { category: "Outdoor Living", total: 98, active: 56 },
];

// --- Sub-component: Filter ---
const PerformanceFilter = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button className="bg-[#005864] hover:bg-[#004750] text-white w-10 h-10 p-0 rounded-lg shadow-sm focus-visible:ring-0">
        <Filter size={20} />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-48 rounded-xl border-none shadow-lg">
      <DropdownMenuItem className="cursor-pointer">All Categories</DropdownMenuItem>
      <DropdownMenuItem className="cursor-pointer">Highest Active</DropdownMenuItem>
      <DropdownMenuItem className="cursor-pointer">Lowest Active</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

// --- Sub-component: Separate Table ---
const CategoryTable = ({ data }) => (
  <div className="bg-white rounded-[32px] overflow-hidden shadow-sm">
    <Table>
      <TableHeader className="bg-gray-50">
        <TableRow className="hover:bg-transparent border-none">
          <TableHead className="px-10 py-6 text-[13px] font-bold text-[#1A1A1A] w-[50%]">Category</TableHead>
          <TableHead className="text-[13px] font-bold text-[#1A1A1A] text-center">Total Experts</TableHead>
          <TableHead className="px-10 text-[13px] font-bold text-[#1A1A1A] text-right">Active Experts</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index} className="border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors">
            <TableCell className="px-10 py-5 text-[14px] font-medium text-gray-700">{row.category}</TableCell>
            <TableCell className="text-[14px] font-semibold text-gray-700 text-center">{row.total}</TableCell>
            <TableCell className="px-10 text-[14px] font-semibold text-gray-700 text-right">{row.active}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

// --- Main Page ---
export default function LeadPerformancePage() {
  return (
    <div className="min-h-screen font-sans">
      {/* Title */}
      <h1 className="text-[32px] font-bold text-[#1A1A1A] mb-8">Lead Performance Analytics</h1>

      {/* Stats Grid */}
      <div className="flex flex-wrap gap-6 mb-10">
  {stats.map((item, i) => (
    <Card
      key={i}
      className="w-[250px] border-none shadow-none rounded-[28px] bg-[#E9F4F4]"
    >
      <CardContent className="p-5 flex items-center gap-5">
        <div className="bg-white w-[64px] h-[64px] rounded-[22px] shadow-sm flex items-center justify-center shrink-0">
          <item.icon className="text-[#005864]" size={28} />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-gray-500 mb-0.5 leading-tight  tracking-tight">
            {item.title}
          </p>
          <h2 className="text-[28px] font-bold text-[#1A1A1A] tracking-tight leading-none">
            {item.value}
          </h2>
        </div>
      </CardContent>
    </Card>
  ))}
</div>

      {/* Sub-heading and Filter */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[24px] font-bold text-[#1A1A1A]">Experts Signed Up Per Category</h2>
        <PerformanceFilter />
      </div>

      {/* Table Component */}
      <CategoryTable data={tableData} />
    </div>
  );
}