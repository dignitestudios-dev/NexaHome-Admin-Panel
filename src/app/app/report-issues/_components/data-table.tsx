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
import { Eye } from "lucide-react";
import { useReportIssues, useUpdateReportIssueStatus } from "@/features/report-issues/report-issues.hooks";
import type { ReportIssueStatus, ReportIssue } from "@/features/report-issues/report-issues.types";

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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Issue Details</DialogTitle>
            <DialogDescription>
              Reported on {viewIssue?.reportedDate ? new Date(viewIssue.reportedDate).toLocaleString() : "—"}
            </DialogDescription>
          </DialogHeader>

          {viewIssue && (
            <div className="grid gap-6 py-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-500">Title</span>
                <p className="text-base font-semibold break-all">{viewIssue.title}</p>
              </div>

              <div className="flex flex-col gap-1 overflow-hidden">
                <span className="text-sm font-medium text-gray-500">Description</span>
                <div className="p-4 break-all bg-gray-50 rounded-lg max-h-60 overflow-y-auto whitespace-pre-wrap text-sm">
                  {viewIssue.description}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-500">Reported By</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{viewIssue.user?.name}</span>
                    <span className="text-sm text-gray-500">{viewIssue.user?.email}</span>
                    <span className="text-sm text-gray-500">{viewIssue.user?.phone}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-500">Role</span>
                  <span className="capitalize">{viewIssue.role?.replace("-", " ") || "—"}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-500">Status</span>
                  <span className="capitalize font-medium text-primary">
                    {viewIssue.status?.replace("_", " ")}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {status === "pending" && (
                    <Button
                      variant="default"
                      className="bg-[#004D54] hover:bg-[#004D54]/90"
                      disabled={processingId === viewIssue._id}
                      onClick={() => handleUpdateStatus(viewIssue._id, "in_progress")}
                    >
                      {processingId === viewIssue._id ? "Updating..." : "Start Progress"}
                    </Button>
                  )}
                  {status === "in_progress" && (
                    <Button
                      variant="default"
                      className="bg-[#004D54] hover:bg-[#004D54]/90"
                      disabled={processingId === viewIssue._id}
                      onClick={() => handleUpdateStatus(viewIssue._id, "resolved")}
                    >
                      {processingId === viewIssue._id ? "Updating..." : "Resolve"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
