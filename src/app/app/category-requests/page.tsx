"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/global/search-input";
import { CategoryRequestsTable } from "./_components/category-requests-table";
import {
  CATEGORY_REQUEST_TABS,
  normalizeCategoryRequestTab,
} from "@/features/category-requests/category-requests.api";
import type { CategoryRequestStatus } from "@/features/category-requests/category-requests.types";

function CategoryRequestsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeTab = normalizeCategoryRequestTab(
    searchParams.get("status") || searchParams.get("tab")
  );

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(
    searchParams.get("search")?.trim() ?? ""
  );
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, debouncedSearch]);

  const handleTabChange = (tab: CategoryRequestStatus) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", tab);
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="heading text-[#1C1C1C] tracking-tight">Category Requests</h1>
        {/* <div className="flex items-center gap-2">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search requests..."
          />
        </div> */}
      </div>

      {/* Tabs */}
      <div className="flex justify-between py-1">
        <div className="inline-flex items-center bg-white rounded-[12px] p-1.5 gap-1 border border-slate-200/80 shadow-xs">
          {CATEGORY_REQUEST_TABS.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <Button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                variant="ghost"
                className={`h-10 min-w-[130px] rounded-[9px] font-medium text-sm transition ${
                  isActive
                    ? "bg-[#005864] text-white hover:bg-[#004450] hover:text-white shadow-xs"
                    : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="relative z-10">
        <CategoryRequestsTable
          status={activeTab}
          page={page}
          search={debouncedSearch}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

export default function CategoryRequestsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#005864]" />
        </div>
      }
    >
      <CategoryRequestsContent />
    </Suspense>
  );
}
