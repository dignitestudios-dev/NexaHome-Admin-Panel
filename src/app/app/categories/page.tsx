"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import SearchInput from "@/components/global/search-input";
import { CategoriesTable } from "./_components/categories-table";
import { AddCategoryModal } from "./_components/add-category-modal";
import { Button } from "@/components/ui/button";

const CategoriesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  return (
    <div>
      {successMessage ? (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 shadow-lg">
          <CheckCircle2 size={18} />
          {successMessage}
        </div>
      ) : null}
      <div className="flex justify-between py-4 relative">
        <h1 className="heading">Categories</h1>
        <div className="flex items-center gap-2">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="w-[141px] h-[38px] bg-white border cursor-pointer border-0 shadow-none rounded-[12px] px-[10px] py-[10px] flex flex-row justify-center items-center gap-[10px] text-[#005864] font-semibold text-[14px] leading-[18px] hover:bg-white"
          >
            <span>+</span> Add Category
          </Button>
        </div>
      </div>
      <div className="relative z-10">
        <CategoriesTable
          page={page}
          search={debouncedSearch}
          status="all"
          onPageChange={setPage}
        />
      </div>
      <AddCategoryModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={() => {
          setPage(1);
          setSuccessMessage("Category added successfully.");
        }}
      />
    </div>
  );
};

export default CategoriesPage;
