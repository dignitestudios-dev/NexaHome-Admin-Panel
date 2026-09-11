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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Mail,
  Phone,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useReportIssues, useUpdateReportIssueStatus } from "@/features/report-issues/report-issues.hooks";
import type { ReportIssueStatus, ReportIssue } from "@/features/report-issues/report-issues.types";
import { cn } from "@/lib/utils";

function getInitials(name?: string) {
  if (!name?.trim()) return "U";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const normalizeStatus = (status?: string) => status?.toLowerCase().replace("-", "_");

const getStatusBadgeClass = (status?: string) => {
  const s = normalizeStatus(status);
  switch (s) {
    case "pending":
      return "bg-red-100 text-red-700 border border-red-200";
    case "in_progress":
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    case "resolved":
      return "bg-green-100 text-green-800 border border-green-200";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-200";
  }
};

const getStatusDotClass = (status?: string) => {
  const s = normalizeStatus(status);
  switch (s) {
    case "pending":
      return "bg-red-500";
    case "in_progress":
      return "bg-yellow-500";
    case "resolved":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

type DataTableProps = {
  status: ReportIssueStatus;
  page: number;
  search?: string;
  onPageChange: (page: number) => void;
};

const ITEMS_PER_PAGE = 10;

export default function DataTable({
  status,
  page,
  search,
  onPageChange,
}: DataTableProps) {
  const { data, isLoading, isError, error } = useReportIssues({
    status,
    page,
    limit: ITEMS_PER_PAGE,
    search,
  });

  const updateStatus = useUpdateReportIssueStatus();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [viewIssue, setViewIssue] = useState<ReportIssue | null>(null);

  const rows = data?.rows ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  const handleUpdateStatus = async (id: string, newStatus: ReportIssueStatus) => {
    setProcessingId(id);
    try {
      await updateStatus.mutateAsync({ id, status: newStatus });
      setViewIssue(null);
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div>
      <div className="rounded-3xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="rounded-l-3xl">User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="max-w-[300px]">Issue</TableHead>
              <TableHead>Reported Date</TableHead>
              <TableHead className="rounded-r-3xl">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isError ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-red-600">
                  ⚠ {(error as Error)?.message ?? "Failed to load issues."}
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
            ) : rows.length ? (
              rows.map((row: ReportIssue) => (
                <TableRow key={row._id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-[#181818]">
                        {row.user?.name || "—"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {row.user?.email || "—"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">
                    {row.role?.replace("-", " ") || "—"}
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm truncate" title={row.title}>
                        {row.title || "—"}
                      </span>
                      <span className="text-xs text-gray-500 line-clamp-2" title={row.description}>
                        {row.description || "—"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(row.reportedDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setViewIssue(row)}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No issues found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {!isLoading && !isError && rows.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </div>

      <Dialog open={!!viewIssue} onOpenChange={(open) => !open && setViewIssue(null)}>
        <DialogContent
          showCloseButton={false}
          className="flex w-[min(640px,calc(100vw-2rem))] max-h-[90vh] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl p-0 sm:max-w-none gap-0"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 shrink-0">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-3">
                <DialogTitle className="text-xl font-semibold text-slate-900">
                  Issue Details
                </DialogTitle>
                {viewIssue && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize",
                      getStatusBadgeClass(viewIssue.status)
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        getStatusDotClass(viewIssue.status)
                      )}
                    />
                    {viewIssue.status?.replace("_", " ")}
                  </span>
                )}
              </div>
              <DialogDescription className="text-xs text-slate-500">
                Reported on{" "}
                {viewIssue?.reportedDate
                  ? new Date(viewIssue.reportedDate).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "—"}
              </DialogDescription>
            </div>

            <button
              type="button"
              onClick={() => setViewIssue(null)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {viewIssue && (
            <>
              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                {/* Issue Content Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2.5">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-[#004D54]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#004D54]">
                      Reported Issue
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-slate-900 leading-snug break-words">
                    {viewIssue.title}
                  </h3>

                  <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-words max-h-52 overflow-y-auto">
                    {viewIssue.description}
                  </div>
                </div>

                {/* User & Role Details Card */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Reporter Information
                  </span>

                  <div className="flex items-start gap-3.5 mt-4">
                    <Avatar className="h-11 w-11 ring-2 ring-slate-100 shrink-0">
                      <AvatarFallback className="bg-[#004D54] text-sm font-semibold text-white">
                        {getInitials(viewIssue.user?.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">
                          {viewIssue.user?.name || "—"}
                        </span>
                        <span className="inline-flex rounded-md bg-[#004D54]/10 px-2 py-0.5 text-[11px] font-medium text-[#004D54] capitalize">
                          {viewIssue.role?.replace("-", " ") || "User"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-4 pt-1 text-xs text-slate-600">
                        {viewIssue.user?.email && (
                          <div className="flex items-center gap-2 truncate">
                            <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                            <span className="truncate">{viewIssue.user.email}</span>
                          </div>
                        )}
                        {viewIssue.user?.phone && (
                          <div className="flex items-center gap-2 truncate">
                            <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                            <span>{viewIssue.user.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 truncate sm:col-span-2">
                          <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          <span>
                            Reported on{" "}
                            {viewIssue.reportedDate
                              ? new Date(viewIssue.reportedDate).toLocaleString(undefined, {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })
                              : "—"}
                          </span>
                        </div>
                        {viewIssue.resolvedDate && (
                          <div className="flex items-center gap-2 truncate sm:col-span-2 text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                            <span>
                              Resolved on{" "}
                              {new Date(viewIssue.resolvedDate).toLocaleString(undefined, {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/70 px-6 py-4 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">Status:</span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize",
                      getStatusBadgeClass(viewIssue.status)
                    )}
                  >
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full",
                        getStatusDotClass(viewIssue.status)
                      )}
                    />
                    {viewIssue.status?.replace("_", " ")}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setViewIssue(null)}
                    className="h-10 rounded-xl border-slate-200 px-4 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Close
                  </Button>

                  {viewIssue.status === "pending" && (
                    <Button
                      variant="default"
                      className="h-10 rounded-xl bg-[#004D54] px-4 text-xs font-medium text-white hover:bg-[#004D54]/90 inline-flex items-center gap-1.5"
                      disabled={processingId === viewIssue._id}
                      onClick={() => handleUpdateStatus(viewIssue._id, "in_progress")}
                    >
                      <Clock className="h-3.5 w-3.5" />
                      {processingId === viewIssue._id ? "Updating..." : "Start Progress"}
                    </Button>
                  )}

                  {viewIssue.status === "in_progress" && (
                    <Button
                      variant="default"
                      className="h-10 rounded-xl bg-[#004D54] px-4 text-xs font-medium text-white hover:bg-[#004D54]/90 inline-flex items-center gap-1.5"
                      disabled={processingId === viewIssue._id}
                      onClick={() => handleUpdateStatus(viewIssue._id, "resolved")}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {processingId === viewIssue._id ? "Updating..." : "Resolve Issue"}
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
