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

import { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";

 

export function LeadFilter() {
  const [selected, setSelected] = useState<string[]>([]);
  const [minRequests, setMinRequests] = useState("");
  const [maxRequests, setMaxRequests] = useState("");

  const ALL_CATEGORIES = [
    "Greater New - Orleans Area",
    "Greater New - Orleans Area",
    "Greater New - Orleans Area",
    "Greater New - Orleans Area",
    "Greater New - Orleans Area",
  ];

  const toggleCategory = (cat: string) => {
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleApply = () => {
    console.log({ selected });
  };

  const handleClearAll = () => setSelected([]);

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
  <Button className="bg-[#005864] hover:bg-[#004750] text-white w-10 h-10 p-0 rounded-lg shadow-sm focus-visible:ring-0 transition-colors">
    <FaFilter className="w-[18px] h-[18px]" />
  </Button>
</DrawerTrigger>

      <DrawerContent className="overflow-hidden">
        <DrawerHeader>
          <DrawerTitle className="heading">Filters</DrawerTitle>
          <DrawerClose asChild>
            {/* MUST be exactly one element here */}
            <Button className="absolute top-4 right-4">
              <CgClose className="w-[22px] h-[22px] text-white" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="p-4">
          <div className="flex justify-between mb-4">
            <span className="text-[20px] font-semibold">Area/Location</span>
            <button
              onClick={handleClearAll}
              className="text-[#005864] underline"
            >
              Clear all
            </button>
          </div>

          <div className="flex flex-col gap-3 mb-4">
            {ALL_CATEGORIES.map((cat, index) => (
              <label
                key={index}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox
                  checked={selected.includes(cat)}
                  onCheckedChange={() => toggleCategory(cat)}
                  className="w-[24px] h-[24px] rounded-[4px] border border-[#181818CC]"
                />
                {cat}
              </label>
            ))}
            <button className="text-[#005864] font-semibold mb-2 text-start">
              See more...
            </button>

            <p className="text-[20px] font-medium mb-1">Requests</p>
            <div className="w-[360px] flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minRequests}
                onChange={(e) => setMinRequests(e.target.value)}
                className="w-full h-10 bg-gray-100 rounded-xl px-2 outline-none"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxRequests}
                onChange={(e) => setMaxRequests(e.target.value)}
                className="w-full h-10 bg-gray-100 rounded-xl px-2 outline-none"
              />
            </div>
          </div>
        </div>

        <DrawerFooter className="w-[200px] mx-auto flex justify-center">
          <Button variant="outline" className="w-full">
            Cancel
          </Button>
          <DrawerClose asChild>
            {/* MUST be exactly one element here */}
            <Button onClick={handleApply} className="w-full">
              Apply
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

 