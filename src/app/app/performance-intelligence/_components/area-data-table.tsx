"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTopLocations } from "@/features/insights/insights.hooks";
import { useDashboardFilters } from "@/components/global/filter-context";
import type { TopLocation } from "@/features/insights/insights.types";

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

function formatLocationName(location: TopLocation) {
  const cityName = location.city || location.name || location.state || "—";
  const zip = location.zipCode || location.zip;
  return zip ? `${cityName} - ${zip}` : cityName;
}

export default function AreaDataTable({ search = "" }: { search?: string }) {
  const { debouncedCity, debouncedZipCode } = useDashboardFilters();
  const { data: locations = [], isLoading, isError, error } =
    useTopLocations(10, search, debouncedCity, debouncedZipCode);

  return (
    <div className="">
      <div className=" rounded-3xl overflow-hidden ">
        <Table className="">
          {/* HEADER */}
          <TableHeader className="  ">
            <TableRow className="">
              <TableHead className=" rounded-l-3xl   ">Rank</TableHead>
              <TableHead className="   ">Area/Location</TableHead>
              <TableHead className="  ">Total Jobs</TableHead>
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
                  ⚠ {(error as Error)?.message ?? "Failed to load top areas."}
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
            ) : locations.length ? (
              locations.map((location, index) => (
                <TableRow key={location.city || location.state || index} className="">
                  <TableCell className="font-medium">{formatRank(index)}</TableCell>
                  <TableCell className="capitalize">{formatLocationName(location)}</TableCell>
                  <TableCell>{location.totalJobs}</TableCell>
                  <TableCell className="font-semibold">
                    {formatRevenue(location.revenue)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No locations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
