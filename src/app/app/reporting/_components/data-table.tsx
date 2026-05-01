"use client";

import Pagination from "@/components/global/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatReportRevenue,
  getReportProfileImageUrl,
  getReportUserInitials,
} from "@/features/reports/reports.api";
import { useReportsUsers } from "@/features/reports/reports.hooks";
import { formatDate } from "@/lib/date";

type DataTableProps = {
  page: number;
  startDate?: string;
  endDate?: string;
  onPageChange: (page: number) => void;
};

const ITEMS_PER_PAGE = 10;

export default function DataTable({
  page,
  startDate,
  endDate,
  onPageChange,
}: DataTableProps) {
  const { data, isLoading, isError, error } = useReportsUsers({
    page,
    limit: ITEMS_PER_PAGE,
    startDate,
    endDate,
  });

  const users = data?.users ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  return (
    <div>
      <div className="rounded-3xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="rounded-l-3xl">User Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Job Post</TableHead>
              <TableHead className="rounded-r-3xl">Revenue Generated</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isError ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-red-600">
                  ⚠ {(error as Error)?.message ?? "Failed to load reports."}
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
            ) : users.length ? (
              users.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-10 w-10 rounded-full">
                        <AvatarImage
                          src={getReportProfileImageUrl(user)}
                          alt={user.userName}
                          className="object-cover"
                        />
                        <AvatarFallback className="rounded-full bg-[#005864] text-white text-[11px] font-medium">
                          {getReportUserInitials(user.userName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.userName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{formatDate(user.joinDate)}</TableCell>
                  <TableCell>{user.jobsPosted}</TableCell>
                  <TableCell>
                    {formatReportRevenue(user.revenueGenerated)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No reports found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {!isLoading && !isError && users.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </div>
    </div>
  );
}
