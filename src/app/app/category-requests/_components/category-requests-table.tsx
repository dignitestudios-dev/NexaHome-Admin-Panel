"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, Eye, MessageSquare, X } from "lucide-react";
import Pagination from "@/components/global/pagination";
import {
  useCategoryRequests,
  useUpdateCategoryRequestStatus,
} from "@/features/category-requests/category-requests.hooks";
import { getCategoryRequestStatusColor } from "@/features/category-requests/category-requests.api";
import type {
  CategoryRequest,
  CategoryRequestStatus,
} from "@/features/category-requests/category-requests.types";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import { CategoryRequestDetailsModal } from "./category-request-details-modal";
import { CategoryRequestActionModal } from "./category-request-action-modal";

interface CategoryRequestsTableProps {
  status: CategoryRequestStatus;
  page: number;
  search: string;
  onPageChange: (page: number) => void;
}

const ITEMS_PER_PAGE = 10;

const actionButtonClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-full transition";

function getInitials(name?: string) {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function CategoryRequestsTable({
  status,
  page,
  search,
  onPageChange,
}: CategoryRequestsTableProps) {
  const [selectedRequest, setSelectedRequest] = useState<CategoryRequest | null>(
    null
  );
  const [actionTarget, setActionTarget] = useState<{
    request: CategoryRequest;
    action: "fulfilled" | "rejected";
  } | null>(null);

  const { data, isLoading, isError, error } = useCategoryRequests({
    page,
    limit: ITEMS_PER_PAGE,
    status,
    search: search || undefined,
  });

  const updateStatus = useUpdateCategoryRequestStatus();

  const requests = data?.requests ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  const handleConfirmAction = () => {
    if (!actionTarget) return;

    updateStatus.mutate(
      {
        id: actionTarget.request._id,
        status: actionTarget.action,
      },
      {
        onSuccess: () => {
          setActionTarget(null);
          if (selectedRequest?._id === actionTarget.request._id) {
            setSelectedRequest(null);
          }
        },
      }
    );
  };

  return (
    <>
      <div className="rounded-3xl overflow-hidden bg-white shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="font-light">
              <TableHead className="rounded-l-3xl">Requested By</TableHead>
              <TableHead>Request Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="rounded-r-3xl text-center">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isError ? (
              <TableRow>
                <TableCell colSpan={5} className="h-28 text-center text-red-600">
                  ⚠ {(error as Error)?.message ?? "Failed to load category requests."}
                </TableCell>
              </TableRow>
            ) : isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-28 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005864]" />
                    <span className="ml-2 text-sm text-slate-500">
                      Loading requests...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : requests.length > 0 ? (
              requests.map((request) => {
                const user = request.user;
                const statusColor = getCategoryRequestStatusColor(request.status);
                const userEmail = user?.email || user?.contactEmail;
                const isPending = request.status === "pending";

                return (
                  <TableRow
                    key={request._id}
                    className="font-normal hover:bg-slate-50 transition-colors"
                  >
                    {/* User */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 rounded-lg border border-slate-200">
                          <AvatarFallback className="rounded-lg bg-[#005864] text-white text-xs font-medium">
                            {getInitials(user?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-slate-900 text-sm">
                            {user?.name || "Unknown User"}
                          </span>
                          {userEmail ? (
                            <span className="text-xs text-slate-500 truncate max-w-[200px]">
                              {userEmail}
                            </span>
                          ) : null}
                          {user?.phone ? (
                            <span className="text-[11px] text-slate-400">
                              {user.phone}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </TableCell>

                    {/* Request Message */}
                    <TableCell className="max-w-[340px]">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-[#005864] mt-0.5 shrink-0 opacity-70" />
                        <span className="line-clamp-2 text-sm text-slate-700 font-normal">
                          {request.text || "—"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider",
                          statusColor.badge
                        )}
                      >
                        <span
                          className={cn("h-1.5 w-1.5 rounded-full", statusColor.dot)}
                        />
                        {request.status}
                      </span>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-slate-600 text-sm whitespace-nowrap">
                      <div>{formatDate(request.createdAt)}</div>
                      {request.processedAt ? (
                        <div className="text-[11px] text-slate-400">
                          Processed: {formatDate(request.processedAt)}
                        </div>
                      ) : null}
                    </TableCell>

                    {/* Action */}
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        {isPending ? (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                setActionTarget({
                                  request,
                                  action: "fulfilled",
                                })
                              }
                              className={`${actionButtonClass} bg-emerald-50 text-emerald-600 hover:bg-emerald-100`}
                              title="Fulfill Request"
                              aria-label="Fulfill Request"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setActionTarget({
                                  request,
                                  action: "rejected",
                                })
                              }
                              className={`${actionButtonClass} bg-red-50 text-red-600 hover:bg-red-100`}
                              title="Reject Request"
                              aria-label="Reject Request"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => setSelectedRequest(request)}
                          className={`${actionButtonClass} bg-[#F0F5F6] text-[#005864] hover:bg-[#e2eced]`}
                          aria-label={`View request from ${user?.name ?? "User"}`}
                          title="View Details"
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
                <TableCell
                  colSpan={5}
                  className="h-28 text-center text-slate-500 text-sm"
                >
                  No {status} category requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && !isError && requests.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}

      {/* Details Modal */}
      <CategoryRequestDetailsModal
        open={Boolean(selectedRequest)}
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onFulfill={(req) => {
          setActionTarget({ request: req, action: "fulfilled" });
        }}
        onReject={(req) => {
          setActionTarget({ request: req, action: "rejected" });
        }}
      />

      {/* Action Confirmation Modal */}
      <CategoryRequestActionModal
        open={Boolean(actionTarget)}
        request={actionTarget?.request ?? null}
        action={actionTarget?.action ?? null}
        isLoading={updateStatus.isPending}
        onClose={() => setActionTarget(null)}
        onConfirm={handleConfirmAction}
      />
    </>
  );
}
