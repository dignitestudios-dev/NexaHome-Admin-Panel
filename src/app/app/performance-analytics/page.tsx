"use client";

import React, { useEffect, useState } from "react";
import SearchInput from "@/components/global/search-input";
import DataTable from "./_components/data-table";
import Stats from "./_components/stats";

/* ================= PAGE ================= */

export default function LeadPerformancePage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="min-h-screen font-sans">
      {/* Title */}
      <h1 className="heading">Lead Performance Analytics</h1>

      {/* Stats */}
      <div className="flex flex-wrap gap-6 my-6 ">
        <Stats />
      </div>

      {/* Section Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[24px] font-semibold text-[#1A1A1A]">
          Experts Signed Up Per Category
        </h2>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search category"
        />
      </div>

      {/* Table */}
      <DataTable search={debouncedSearch} />
    </div>
  );
}
