"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTopJobs } from "@/features/insights/insights.hooks";
import { useDashboardFilters } from "@/components/global/filter-context";

function formatRank(index: number) {
  return String(index + 1).padStart(2, "0");
}

function formatRevenue(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function JobsDataTable({ search = "" }: { search?: string }) {
  const { debouncedCity, debouncedZipCode } = useDashboardFilters();
  const { data: jobs = [], isLoading, isError, error } = useTopJobs(
    10,
    search,
    debouncedCity,
    debouncedZipCode
  );

  return (
    <div className="">
      <div className=" rounded-3xl overflow-hidden ">
        <Table className="">
          {/* HEADER */}
          <TableHeader className=" font-medium ">
            <TableRow className="">
              <TableHead className=" rounded-l-3xl   ">Rank</TableHead>
              <TableHead className="   ">Job Category</TableHead>
              <TableHead className="  ">Total Requests</TableHead>
              <TableHead className=" rounded-r-3xl ">
                Revenue Generated
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody className="">
            {isError ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-red-600">
                  ⚠ {(error as Error)?.message ?? "Failed to load top jobs."}
                </TableCell>
              </TableRow>
            ) : isLoading ? (
              <TableRow className="">
                <TableCell colSpan={4} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : jobs.length ? (
              jobs.map((job, index) => (
                <TableRow key={job.categoryId} className="font-normal">
                  <TableCell>{formatRank(index)}</TableCell>
                  <TableCell className="capitalize">{job.jobCategory}</TableCell>
                  <TableCell>{job.totalRequests}</TableCell>
                  <TableCell className="font-medium">
                    {formatRevenue(job.revenueGenerated)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No job categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
