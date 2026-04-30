"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { CgClose } from "react-icons/cg";
import { FaFilter } from "react-icons/fa";

import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export function ReportingFilters() {
  const [selected, setSelected] = useState<string[]>([]);
  const ALL_CATEGORIES = [
    "Cleaning",
    "Plumbing",
    "Electrician",
    "Painting",
    "Gardening",
  ];
  const areas = ["Area 1", "Area 2", "Area 3"];
  const statusOptions = ["Active", "Inactive", "Pending Approval"];
  const [minRequests, setMinRequests] = useState("");
  const [maxRequests, setMaxRequests] = useState("");

  const toggleCategory = (cat: string) => {
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const handleApply = () => {
    console.log({
      selected,
    });
  };
  const handleClearAll = () => {
    setSelected([]);
  };

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button className="w-[40px] h-[40px]">
          <FaFilter className="w-[20px] h-[20px] text-white  " />
        </Button>
      </DrawerTrigger>
      <DrawerContent className=" overflow-hidden">
        <DrawerHeader>
          <DrawerTitle className="heading">Filters</DrawerTitle>
          <DrawerClose asChild>
            <Button className="absolute top-4 right-4">
              <CgClose className="w-[22px] h-[22px] text-white  " />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="p-4 overflow-y-auto overflow-x-hidden">
          <div className="flex justify-between mb-4">
            <span className="text-[20px] font-semibold">Category</span>

            <button
              onClick={handleClearAll}
              className="text-[#005864] underline"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-col gap-3 mb-4">
            {ALL_CATEGORIES.map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox
                  checked={selected.includes(cat)}
                  onCheckedChange={() => toggleCategory(cat)}
                  className="w-[24px] h-[24px] rounded-[4px] border border-[#181818CC] checked:bg-[#005864] checked:border-[#005864] checked:accent-[#005864]"
                />
                {cat}
              </label>
            ))}
            <button className="text-[#005864] font-semibold mb-2 text-start">
              See more...
            </button>
            <p className="text-[20px] font-medium mb-4">Areas</p>
            <div className="flex flex-col gap-3 mb-4">
              {areas.map((area) => (
                <label
                  key={area}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={selected.includes(area)}
                    onCheckedChange={() => toggleCategory(area)}
                    className="w-[24px] h-[24px] rounded-[4px] border border-[#181818CC] checked:bg-[#005864] checked:border-[#005864] checked:accent-[#005864]"
                  />
                  {area}
                </label>
              ))}
              <button className="text-[#005864] font-semibold mb-2 text-start">
                See more...
              </button>
            </div>
            <p className="text-[20px] font-medium mb-4">Status</p>
            <div className="flex flex-col gap-3 mb-4">
              {statusOptions.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={selected.includes(cat)}
                    onCheckedChange={() => toggleCategory(cat)}
                    className="w-[24px] h-[24px] rounded-[4px] border border-[#181818CC] checked:bg-[#005864] checked:border-[#005864] checked:accent-[#005864]"
                  />
                  {cat}
                </label>
              ))}
            </div>

            <p className="text-[20px] font-medium mb-1">Requests</p>

            <div className=" flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minRequests}
                onChange={(e) => setMinRequests(e.target.value)}
                className="flex-1 h-10 bg-gray-100 rounded-xl px-2 outline-none"
              />

              <input
                type="number"
                placeholder="Max"
                value={maxRequests}
                onChange={(e) => setMaxRequests(e.target.value)}
                className=" h-10 bg-gray-100 rounded-xl px-2 outline-none"
              />
            </div>
          </div>
        </div>

        <DrawerFooter className="w-full flex justify-center bg-[#F8F8F8]">
          <Button variant="outline" className="flex-1">
            Cancel
          </Button>
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
