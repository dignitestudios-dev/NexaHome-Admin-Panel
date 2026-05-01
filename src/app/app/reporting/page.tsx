"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "./_components/data-table";
import { ReportingFilters } from "./_components/reporting-filters";
import { useDownloadUsersReport } from "@/features/reports/reports.hooks";
import type { ReportDateFilters } from "@/features/reports/reports.types";

export default function ReportingPage() {
  const [filters, setFilters] = useState<ReportDateFilters>({});
  const [page, setPage] = useState(1);
  const [exportError, setExportError] = useState("");
  const downloadReport = useDownloadUsersReport();

  useEffect(() => {
    setPage(1);
  }, [filters.startDate, filters.endDate]);

  const handleExport = () => {
    setExportError("");
    downloadReport.mutate(filters, {
      onError: (error) => {
        setExportError(error.message || "Failed to export report.");
      },
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between my-6">
        <h1 className="heading">Reporting & Data Export</h1>
        <div className="flex items-center gap-2">
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

      {exportError ? (
        <p className="mb-4 text-sm text-red-600">{exportError}</p>
      ) : null}

      <DataTable
        page={page}
        startDate={filters.startDate}
        endDate={filters.endDate}
        onPageChange={setPage}
      />
    </div>
  );
}
