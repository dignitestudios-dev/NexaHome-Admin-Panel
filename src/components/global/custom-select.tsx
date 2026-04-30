// components/CustomSelect.tsx

"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

type Option = {
  label: string;
  value: string;
};

type CustomSelectProps = {
  value?: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
};

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select",
  className = "",
}: CustomSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <div
        className={`relative 
          w-full
          h-[48px]
          rounded-[12px]
          bg-[rgba(244,244,244,0.6)]
          text-[16px]
          font-normal
          text-[#959393]
          flex
          items-center
          cursor-pointer
          ${className}
        `}
      >
        <SelectTrigger className="w-full h-full border-0 px-4 shadow-none focus:ring-0 focus:ring-offset-0 [&>svg]:hidden rounded-[12px] bg-transparent">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        {/* Custom Arrow */}
        <ChevronDown
          size={18}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#005864] pointer-events-none"
        />
      </div>

      <SelectContent
        position="item-aligned"
        className="w-[var(--radix-select-trigger-width)] rounded-xl border-none shadow-md"
      >
        {options.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
