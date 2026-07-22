"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTopHomeowners } from "@/features/insights/insights.hooks";
import { useDashboardFilters } from "@/components/global/filter-context";

function formatRank(index: number) {
  return String(index + 1).padStart(2, "0");
}

function getInitials(name?: string) {
  if (!name) return "NA";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function HomeOwnersDataTable({ search = "" }: { search?: string }) {
  const { debouncedCity, debouncedZipCode } = useDashboardFilters();
  const { data: homeowners = [], isLoading, isError, error } =
    useTopHomeowners(10, search, debouncedCity, debouncedZipCode);

  return (
    <div className="">
      <div className=" rounded-3xl overflow-hidden ">
        <Table className="">
          {/* HEADER */}
          <TableHeader className="  ">
            <TableRow className="">
              <TableHead className=" rounded-l-3xl   ">Rank</TableHead>
              <TableHead className="   ">User Name</TableHead>
              <TableHead className=" rounded-r-3xl ">Total Jobs Posted</TableHead>
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody className="">
            {isError ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-red-600">
                  ⚠ {(error as Error)?.message ?? "Failed to load homeowners."}
                </TableCell>
              </TableRow>
            ) : isLoading ? (
              <TableRow className="">
                <TableCell colSpan={3} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : homeowners.length ? (
              homeowners.map((homeowner, index) => (
                <TableRow key={homeowner.userId} className="">
                  <TableCell className="font-medium">
                    {formatRank(index)}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3 capitalize">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={homeowner.profilePicture?.location ?? undefined}
                        />
                        <AvatarFallback className="text-xs bg-[#00586417] text-[#005864]">
                          {getInitials(homeowner.name)}
                        </AvatarFallback>
                      </Avatar>
                      {homeowner.name}
                    </div>
                  </TableCell>

                  <TableCell>{homeowner.jobsPosted}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No homeowners found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
