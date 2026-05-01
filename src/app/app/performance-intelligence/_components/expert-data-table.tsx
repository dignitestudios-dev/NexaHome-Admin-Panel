"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTopExperts } from "@/features/insights/insights.hooks";

function formatRank(index: number) {
  return String(index + 1).padStart(2, "0");
}

function formatRevenue(value?: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

export default function ExpertDataTable({ search = "" }: { search?: string }) {
  const { data: experts = [], isLoading, isError, error } =
    useTopExperts(10, search);

  return (
    <div className="">
      <div className=" rounded-3xl overflow-hidden ">
        <Table className="">
          {/* HEADER */}
          <TableHeader className="  ">
            <TableRow className="">
              <TableHead className=" rounded-l-3xl   ">Rank</TableHead>
              <TableHead className="   ">Company Name</TableHead>
              <TableHead className="  ">Leads Purchased</TableHead>
              <TableHead className="  ">Jobs Completed</TableHead>
              <TableHead className=" rounded-r-3xl ">Total Revenue</TableHead>
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody className="">
            {isError ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-red-600">
                  ⚠ {(error as Error)?.message ?? "Failed to load experts."}
                </TableCell>
              </TableRow>
            ) : isLoading ? (
              <TableRow className="">
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : experts.length ? (
              experts.map((expert, index) => (
                <TableRow key={expert.userId} className="">
                  <TableCell className="font-medium">
                    {formatRank(index)}
                  </TableCell>

                  <TableCell className="capitalize">
                    {expert.companyName?.trim() ||
                      expert.userName?.trim() ||
                      "------"}
                  </TableCell>

                  <TableCell>{expert.leadPurchases}</TableCell>

                  <TableCell>{expert.jobsCompleted}</TableCell>

                  <TableCell className="font-semibold">
                    {formatRevenue(expert.revenue)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No experts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
