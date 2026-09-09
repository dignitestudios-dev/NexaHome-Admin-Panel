"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter, Check } from "lucide-react";
import type { ExpertStatusFilter } from "@/features/experts/experts.types";

interface ExpertFilterProps {
  value: ExpertStatusFilter;
  onChange: (value: ExpertStatusFilter) => void;
}

const FILTER_OPTIONS: { label: string; value: ExpertStatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export const ExpertFilter = ({ value, onChange }: ExpertFilterProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        className="relative bg-[#005864] hover:bg-[#004750] text-white w-[44px] h-[44px] p-0 rounded-[10px] shadow-sm focus-visible:ring-0 transition-colors"
        aria-label="Filter experts by status"
      >
        <Filter className="w-5 h-5" />
        {value !== "all" && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#16BC4E] rounded-full ring-2 ring-white" />
        )}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      className="w-40 rounded-2xl border border-gray-100 p-1.5 shadow-lg bg-white z-50"
    >
      {FILTER_OPTIONS.map((option) => {
        const isSelected = value === option.value;
        return (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`flex items-center justify-between px-3 py-2 text-sm rounded-xl cursor-pointer transition-colors ${
              isSelected
                ? "bg-[#EFF7F8] text-[#005864] font-semibold"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span>{option.label}</span>
            {isSelected && <Check className="w-4 h-4 text-[#005864]" />}
          </DropdownMenuItem>
        );
      })}
    </DropdownMenuContent>
  </DropdownMenu>
);

