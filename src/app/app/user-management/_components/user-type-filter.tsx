"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { CgClose } from "react-icons/cg";
import { FaFilter } from "react-icons/fa";
import type { UserTypeFilter } from "@/features/users/users.types";

const TYPE_OPTIONS: { label: string; value: UserTypeFilter }[] = [
  { label: "All", value: "all" },
  { label: "User", value: "user" },
  { label: "Service Provider", value: "service-provider" },
  { label: "Partner", value: "partner" },
];

type UserTypeFilterProps = {
  value?: UserTypeFilter;
  onApply: (status: UserTypeFilter) => void;
};

export function UserTypeFilter({
  value = "all",
  onApply,
}: UserTypeFilterProps) {
  const [selected, setSelected] = useState<UserTypeFilter>(value);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleClearAll = () => setSelected("all");
  const handleApply = () => onApply(selected);

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button className="w-[44px] h-[44px]">
          <FaFilter className="w-[22px] h-[22px] text-white" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="overflow-hidden">
        <DrawerHeader>
          <DrawerTitle className="heading">Filters</DrawerTitle>
          <DrawerClose asChild>
            <Button className="absolute top-4 right-4">
              <CgClose className="w-[22px] h-[22px] text-white" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="p-4">
          <div className="mb-4 flex justify-between">
            <span className="text-[20px] font-semibold">User Type</span>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[#005864] underline"
            >
              Clear all
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {TYPE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-3"
              >
                <input
                  type="radio"
                  name="user-type"
                  checked={selected === option.value}
                  onChange={() => setSelected(option.value)}
                  className="h-4 w-4 accent-[#005864]"
                />
                <span className="text-[16px]">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <DrawerFooter className="flex w-full justify-center bg-[#F8F8F8]">
          <DrawerClose asChild>
            <Button variant="outline" className="flex-1">
              Cancel
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button onClick={handleApply} className="flex-1">
              Apply
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

