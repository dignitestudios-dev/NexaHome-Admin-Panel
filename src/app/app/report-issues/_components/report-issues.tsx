"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/global/search-input";
import DataTable from "./data-table";
import { normalizeReportIssueTab } from "@/features/report-issues/report-issues.api";
import {
  REPORT_ISSUE_TABS,
  type ReportIssueStatus,
} from "@/features/report-issues/report-issues.types";

export default function ReportIssues() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const activeTab = normalizeReportIssueTab(searchParams.get("status") || searchParams.get("tab"));
  
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

  const handleTabChange = (tab: ReportIssueStatus) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", tab);
    params.delete("page"); // reset page on tab change
    router.push(`?${params.toString()}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between my-6">
        <h1 className="heading">Reported Issues</h1>
        <div className="flex items-center gap-2">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search issues..."
          />
        </div>
      </div>

      <div className="flex justify-between py-2 mb-4">
        <div className="inline-flex items-center bg-white rounded-[10px] p-1 gap-1">
          {REPORT_ISSUE_TABS.map((tab) => (
            <Button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`w-[152px] ${
                activeTab !== tab.value ? "bg-white text-[#181818CC]" : ""
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      <DataTable
        status={activeTab}
        page={page}
        search={debouncedSearch}
        onPageChange={setPage}
      />
    </div>
  );
}
