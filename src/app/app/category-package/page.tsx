"use client";

import { useEffect, useState } from "react";
import SearchInput from "@/components/global/search-input";
import DataTable from "./_components/data-table";
import { SubscriptionStatusFilter } from "./_components/subscription-status-filter";
import type { SubscriptionStatusFilter as StatusFilter } from "@/features/category-subscriptions/category-subscriptions.types";

import { AlertTriangle, Lock } from "lucide-react";

export default function CategoryPackage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-2">
        <h1 className="heading">Advanced Category Package</h1>
      </div>

      {/* Disabled Notification Banner */}
      <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-800 shadow-sm">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
          <Lock className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold">Feature Temporarily Disabled</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Ad Packages are currently placeholder packages and have been disabled until actual pricing becomes available. Purchasing or modifying packages is temporarily unavailable.
          </p>
        </div>
      </div>

      {/* Disabled / Greyed-out Section Container */}
      <div className="opacity-50 pointer-events-none select-none cursor-not-allowed filter grayscale-[30%]">
        <div className="flex justify-between items-center pb-6">
          <div className="flex items-center gap-2">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search"
            />
            <SubscriptionStatusFilter
              value={status}
              onApply={(nextStatus) => setStatus(nextStatus)}
            />
          </div>
        </div>

        <DataTable
          page={page}
          search={debouncedSearch}
          status={status}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
