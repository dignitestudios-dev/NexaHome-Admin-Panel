"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye } from "lucide-react";
import { useProviderVerifications } from "@/features/provider-verifications/provider-verifications.hooks";
import type { ProviderVerification, ProviderVerificationStatus } from "@/features/provider-verifications/provider-verifications.types";
import { formatDate } from "@/lib/date";
import Pagination from "@/components/global/pagination";
import { ProviderVerificationDetailsModal } from "./provider-verification-details-modal";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 10;

function getInitials(name?: string) {
  if (!name) return "NA";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export const ProviderVerificationsTable = ({
  search = "",
  status = "all",
}: {
  search?: string;
  status?: ProviderVerificationStatus;
}) => {
  const [page, setPage] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState<ProviderVerification | null>(null);

  useEffect(() => {
    setPage(1);
  }, [search, status]);

  const { data, isLoading, isFetching, isError, error } = useProviderVerifications(
    page,
    ITEMS_PER_PAGE,
    search,
    status
  );

  const verifications = data?.data?.providers ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  return (
    <>
      <div className="rounded-3xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="font-light">
              <TableHead className="rounded-l-3xl">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="rounded-r-3xl text-center">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isError ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-red-600">
                  ⚠ {(error as Error)?.message ?? "Failed to load verifications."}
                </TableCell>
              </TableRow>
            ) : isLoading || isFetching ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005864]" />
                    <span className="ml-2">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : verifications.length ? (
              verifications.map((item) => {
                return (
                  <TableRow
                    key={item._id}
                    className="font-normal hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-[#212121] text-white font-medium text-[12px]">
                            {getInitials(item.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{item.name}</span>
                      </div>
                    </TableCell>

                    <TableCell>{item.email}</TableCell>
                    
                    <TableCell>{item.companyName || "—"}</TableCell>

                    <TableCell>
                      {formatDate(item.createdAt)}
                    </TableCell>

                    <TableCell>
                      <span className={cn(
                        "font-medium capitalize",
                        item.identityStatus === "approved" ? "text-emerald-600" :
                        item.identityStatus === "rejected" ? "text-red-600" :
                        item.identityStatus === "pending" ? "text-amber-600" :
                        "text-slate-600"
                      )}>
                        {item.identityStatus.replace("-", " ")}
                      </span>
                    </TableCell>

                    <TableCell className="text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedProvider(item)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#F0F5F6] text-[#005864] hover:bg-[#e2eced] transition"
                        aria-label={`View ${item.name}`}
                      >
                        <Eye size={18} />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No verifications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && !isError && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}

      <ProviderVerificationDetailsModal
        open={!!selectedProvider}
        provider={selectedProvider}
        onClose={() => setSelectedProvider(null)}
      />
    </>
  );
};
