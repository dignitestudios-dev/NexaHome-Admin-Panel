"use client";

import { useEffect, useState } from "react";
import SearchInput from "@/components/global/search-input";
import DataTable from "./_components/data-table";
import { SubscriptionStatusFilter } from "./_components/subscription-status-filter";
import type { SubscriptionStatusFilter as StatusFilter } from "@/features/category-subscriptions/category-subscriptions.types";

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
    <div>
      <div className="flex justify-between items-center pb-6">
        <h1 className="heading">Advanced Category Package</h1>
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
  );
}
