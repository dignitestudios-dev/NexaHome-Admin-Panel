"use client";

import { useState } from "react";
import Pagination from "@/components/global/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import {
  formatSubscriptionStatus,
  getSubscriptionCategoryName,
  getSubscriptionCompanyName,
  getSubscriptionPurchaseDate,
  getSubscriptionUserId,
} from "@/features/category-subscriptions/category-subscriptions.api";
import { useCategorySubscriptions } from "@/features/category-subscriptions/category-subscriptions.hooks";
import type { SubscriptionStatusFilter } from "@/features/category-subscriptions/category-subscriptions.types";
import { formatDate } from "@/lib/date";
import { ExpertDetailsModal } from "./expert-details-modal";

type DataTableProps = {
  page: number;
  search: string;
  status?: SubscriptionStatusFilter;
  onPageChange: (page: number) => void;
};

const ITEMS_PER_PAGE = 10;

const actionButtonClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-full transition";

function getStatusColor(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "active") return "text-[#16BC4E]";
  if (
    normalized === "canceled" ||
    normalized === "cancelled" ||
    normalized === "inactive"
  ) {
    return "text-[#FF0000]";
  }
  return "text-slate-600";
}

export default function DataTable({
  page,
  search,
  status,
  onPageChange,
}: DataTableProps) {
  const [selectedExpertId, setSelectedExpertId] = useState<string | null>(null);
  const [selectedPurchaseDate, setSelectedPurchaseDate] = useState<
    string | null
  >(null);

  const { data, isLoading, isError, error } = useCategorySubscriptions({
    page,
    limit: ITEMS_PER_PAGE,
    search: search || undefined,
    status,
  });

  const subscriptions = data?.subscriptions ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  return (
    <>
      <div>
        <div className="rounded-3xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="rounded-l-3xl">Company Name</TableHead>
                <TableHead>Category Purchased</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="rounded-r-3xl text-center">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isError ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-red-600"
                  >
                    ⚠{" "}
                    {(error as Error)?.message ??
                      "Failed to load subscriptions."}
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
              ) : subscriptions.length ? (
                subscriptions.map((subscription) => {
                  const displayStatus = formatSubscriptionStatus(
                    subscription.status
                  );
                  const expertId = getSubscriptionUserId(subscription);

                  return (
                    <TableRow key={subscription._id}>
                      <TableCell className="font-medium">
                        {getSubscriptionCompanyName(subscription)}
                      </TableCell>
                      <TableCell className="capitalize">
                        {getSubscriptionCategoryName(subscription)}
                      </TableCell>
                      <TableCell>
                        {formatDate(getSubscriptionPurchaseDate(subscription))}
                      </TableCell>
                      <TableCell
                        className={`font-semibold ${getStatusColor(subscription.status)}`}
                      >
                        {displayStatus}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <button
                            type="button"
                            disabled={!expertId}
                            onClick={() => {
                              if (!expertId) return;
                              setSelectedExpertId(expertId);
                              setSelectedPurchaseDate(
                                getSubscriptionPurchaseDate(subscription) ?? null
                              );
                            }}
                            className={`${actionButtonClass} bg-[#F0F5F6] text-[#005864] hover:bg-[#e2eced] disabled:cursor-not-allowed disabled:opacity-50`}
                            aria-label={`View ${getSubscriptionCompanyName(subscription)}`}
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No category subscriptions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {!isLoading && !isError && subscriptions.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          )}
        </div>
      </div>

      <ExpertDetailsModal
        open={!!selectedExpertId}
        expertId={selectedExpertId}
        purchaseDate={selectedPurchaseDate}
        onClose={() => {
          setSelectedExpertId(null);
          setSelectedPurchaseDate(null);
        }}
      />
    </>
  );
}
