"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/global/search-input";
import DataTable from "./data-table";
import { ReportingFilters } from "./reporting-filters";
import { normalizeReportTab } from "@/features/reports/reports.api";
import { useDownloadReport } from "@/features/reports/reports.hooks";
import {
  REPORT_TABS,
  type ReportDateFilters,
  type ReportTab,
} from "@/features/reports/reports.types";

export default function Reporting() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = normalizeReportTab(searchParams.get("tab"));
  const [filters, setFilters] = useState<ReportDateFilters>({});
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(
    searchParams.get("search")?.trim() ?? ""
  );
  const [page, setPage] = useState(1);
  const [exportError, setExportError] = useState("");
  const downloadReport = useDownloadReport();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, debouncedSearch, filters.startDate, filters.endDate]);

  const handleTabChange = (tab: ReportTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`?${params.toString()}`);
  };

  const handleExport = () => {
    setExportError("");
    downloadReport.mutate(
      {
        tab: activeTab,
        startDate: filters.startDate,
        endDate: filters.endDate,
        search: debouncedSearch || undefined,
      },
      {
        onError: (error) => {
          setExportError(error.message || "Failed to export report.");
        },
      }
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between my-6">
        <h1 className="heading">Reporting & Data Export</h1>
        <div className="flex items-center gap-2">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by name and email"
          />
          <Button
            className="w-[110px] h-[40px]"
            onClick={handleExport}
            disabled={downloadReport.isPending}
          >
            {downloadReport.isPending ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Export
              </span>
            ) : (
              "Export"
            )}
          </Button>
          <ReportingFilters
            value={filters}
            onApply={(nextFilters) => setFilters(nextFilters)}
          />
        </div>
      </div>

      <div className="flex justify-between py-2 mb-4">
        <div className="inline-flex items-center bg-white rounded-[10px] p-1 gap-1">
          {REPORT_TABS.map((tab) => (
            <Button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`w-[152px] ${
                activeTab !== tab.value && "bg-white text-[#181818CC]"
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {exportError ? (
        <p className="mb-4 text-sm text-red-600">{exportError}</p>
      ) : null}

      <DataTable
        tab={activeTab}
        page={page}
        search={debouncedSearch}
        startDate={filters.startDate}
        endDate={filters.endDate}
        onPageChange={setPage}
      />
    </div>
  );
}
