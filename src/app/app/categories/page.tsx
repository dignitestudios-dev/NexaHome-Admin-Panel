"use client";

import { useState } from "react";
import SearchInput from "@/components/global/search-input";
import { CategoriesTable } from "./_components/categories-table";
import { AddCategoryModal } from "./_components/add-category-modal";
import { Button } from "@/components/ui/button";
import { CategoriesFilters } from "./_components/categories-filters";

const CategoriesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  type CategoryRow = {
    id: number;
    name: string;
    oneTimePricing: string;
    recurringPricing: string;
    date: string;
    status: "Active" | "Inactive";
  };

  const categoriesData: CategoryRow[] = [
    {
      id: 1,
      name: "Jack Martian",
      oneTimePricing: "$99.99",
      recurringPricing: "$149.99",
      date: "09/09/2025",
      status: "Active",
    },
    {
      id: 2,
      name: "Lila Hudson",
      oneTimePricing: "$89.99",
      recurringPricing: "$19.99",
      date: "01/01/2023",
      status: "Active",
    },
    {
      id: 3,
      name: "Lila Hudson",
      oneTimePricing: "$149.99",
      recurringPricing: "$19.99",
      date: "01/01/2023",
      status: "Inactive",
    },
  ];

  return (
    <div>
      <div className="flex justify-between py-4 relative">
        <h1 className="heading">Categories</h1>
        <div className="flex items-center gap-2">
          <SearchInput />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="w-[141px] h-[38px] bg-white border border-0 rounded-[12px] px-[10px] py-[10px] flex flex-row justify-center items-center gap-[10px] text-[#005864] font-semibold text-[14px] leading-[18px] hover:bg-white"
          >
            <span>+</span> Add Category
          </Button>
          <CategoriesFilters />
        </div>
      </div>
      <div className="relative z-10">
        <CategoriesTable data={categoriesData} />
      </div>
      <AddCategoryModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};

export default CategoriesPage;
