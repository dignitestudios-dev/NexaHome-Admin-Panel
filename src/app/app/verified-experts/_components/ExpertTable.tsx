"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Pagination from "@/components/global/pagination";
import { useExperts } from "@/features/experts/experts.hooks";
import type { Expert, ExpertStatusFilter } from "@/features/experts/experts.types";
import { formatDate } from "@/lib/date";
import { ExpertFilter } from "./ExpertFilter";
import { X } from "lucide-react";

const EXPERTS_PER_PAGE = 10;

function getInitials(name?: string) {
  if (!name) return "NA";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getProfileImageUrl(expert: Expert) {
  if (!expert.profilePicture) return undefined;
  if (typeof expert.profilePicture === "string") return expert.profilePicture;
  return expert.profilePicture.location ?? undefined;
}

function hasVerifiedBadge(expert: Expert) {
  return Boolean(expert.isBadgeActive);
}

function getCompanyName(expert: Expert) {
  return expert.companyName?.trim() || expert.name?.trim() || "—";
}

export const ExpertTable = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ExpertStatusFilter>("all");

  const isBadgeActive =
    statusFilter === "active" ? true : statusFilter === "inactive" ? false : undefined;

  const { data, isLoading, isError, error } = useExperts(
    page,
    EXPERTS_PER_PAGE,
    isBadgeActive
  );
  const experts = data?.experts ?? [];
  const totalPages = data?.totalPages ?? 1;

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          {statusFilter !== "all" && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EFF7F8] text-[#005864] text-xs font-semibold rounded-full border border-[#E1ECEE]">
              <span>Status: {statusFilter === "active" ? "Active" : "Inactive"}</span>
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className="hover:text-red-500 transition-colors cursor-pointer"
                title="Clear filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ExpertFilter value={statusFilter} onChange={setStatusFilter} />
        </div>
      </div>
      <div className="rounded-3xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="font-light">
              <TableHead className="rounded-l-3xl">Company Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Badge Purchased Date</TableHead>
              <TableHead className="rounded-r-3xl">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isError ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-red-600">
                  ⚠ {(error as Error)?.message ?? "Failed to load experts."}
                </TableCell>
              </TableRow>
            ) : isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    <span className="ml-2">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : experts.length ? (
              experts.map((expert) => {
                const status = expert.isBadgeActive ? "Active" : "Inactive";
                const companyName = getCompanyName(expert);

                return (
                  <TableRow key={expert._id} className="font-normal">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={getProfileImageUrl(expert)}
                            alt={companyName}
                          />
                          <AvatarFallback className="bg-[#212121] text-white font-medium text-[12px]">
                            {getInitials(companyName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="flex items-center gap-1.5">
                          {companyName}
                          {hasVerifiedBadge(expert) ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src="/asset/badge.png"
                              alt="Verified badge"
                              className="h-5 w-5 shrink-0 object-contain"
                            />
                          ) : null}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{expert.email}</TableCell>
                    <TableCell>{formatDate(expert.joinDate)}</TableCell>
                    <TableCell>{formatDate(expert.badgePurchaseDate)}</TableCell>
                    <TableCell>
                      <span
                        className={
                          status === "Active"
                            ? "text-[#16BC4E]"
                            : "text-[#FF0000]"
                        }
                      >
                        {status}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
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

      {!isLoading && !isError && experts.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </>
  );
};
