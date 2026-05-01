"use client";

import SearchInput from "@/components/global/search-input";
import DataTable from "./_components/data-table";
import { JobsFilters } from "./_components/jobs-filters";

export default function CategoryPackage() {
  return (
    <div>
      <div className="flex justify-between items-center pb-6">
        <h1 className="heading">Advanced Category Package</h1>
        <div className="flex items-center gap-2">
          <SearchInput />
          <JobsFilters />
        </div>
      </div>
      <DataTable />
    </div>
  );
}
