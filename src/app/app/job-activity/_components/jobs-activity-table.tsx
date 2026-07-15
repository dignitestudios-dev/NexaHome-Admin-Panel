"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/global/pagination";
import {
  formatJobActivityStatus,
  getJobActivityStatusColor,
  getJobCategory,
  getJobDatePosted,
  getJobStatus,
  getPersonImageUrl,
  getPersonInitials,
  getPersonName,
  getPostedBy,
  getVendorAssigned,
  getVendorDisplayName,
} from "@/features/jobs-activity/jobs-activity.api";
import { useJobsActivity } from "@/features/jobs-activity/jobs-activity.hooks";
import type { JobActivityStatus } from "@/features/jobs-activity/jobs-activity.types";
import { formatDate } from "@/lib/date";

type JobsActivityTableProps = {
  status: JobActivityStatus;
  page: number;
  onPageChange: (page: number) => void;
};

const ITEMS_PER_PAGE = 10;

function PersonCell({
  person,
  emptyLabel = "Not assigned",
  preferCompanyName = false,
}: {
  person: ReturnType<typeof getPostedBy>;
  emptyLabel?: string;
  preferCompanyName?: boolean;
}) {
  if (!person) {
    return <span className="text-slate-400">{emptyLabel}</span>;
  }

  const name = preferCompanyName
    ? getVendorDisplayName(person)
    : getPersonName(person);

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10 border-2 border-teal-100">
        <AvatarImage
          src={getPersonImageUrl(person)}
          alt={name}
          className="object-cover"
        />
        <AvatarFallback className="bg-[#005864] text-white text-[11px]">
          {getPersonInitials(name)}
        </AvatarFallback>
      </Avatar>
      <span className="font-medium text-[#1A1A1A]">{name}</span>
    </div>
  );
}

export default function JobsActivityTable({
  status,
  page,
  onPageChange,
}: JobsActivityTableProps) {
  const { data, isLoading, isError, error } = useJobsActivity({
    page,
    limit: ITEMS_PER_PAGE,
    status,
  });

  const jobs = data?.jobs ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  return (
    <div className="w-full">
      <div className="rounded-[24px] overflow-hidden">
        <Table>
          <TableHeader className="border-none">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="rounded-l-3xl px-6 py-6 font-semibold text-[#1A1A1A]">
                Job ID
              </TableHead>
              <TableHead className="py-6 font-semibold text-[#1A1A1A]">
                Job Category
              </TableHead>
              <TableHead className="py-6 font-semibold text-[#1A1A1A]">
                Posted By
              </TableHead>
              <TableHead className="py-6 font-semibold text-[#1A1A1A]">
                Vendor Assigned
              </TableHead>
              <TableHead className="py-6 font-semibold text-[#1A1A1A]">
                Job Status
              </TableHead>
              <TableHead className="rounded-r-3xl px-6 py-6 font-semibold text-[#1A1A1A]">
                Date Posted
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isError ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-red-600">
                  ⚠ {(error as Error)?.message ?? "Failed to load job activity."}
                </TableCell>
              </TableRow>
            ) : isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
                    <span className="ml-2">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : jobs.length ? (
              jobs.map((job) => {
                const postedBy = getPostedBy(job);
                const vendor = getVendorAssigned(job);
                const jobStatus = getJobStatus(job);

                return (
                  <TableRow
                    key={job._id}
                    className="border-b border-gray-100 hover:bg-gray-50/50"
                  >
                    <TableCell className="px-6 py-6 font-medium text-[#1A1A1A]">
                      {job.jobId}
                    </TableCell>
                    <TableCell className="py-6 text-[#1A1A1A]">
                      {getJobCategory(job)}
                    </TableCell>
                    <TableCell className="py-6">
                      <PersonCell person={postedBy} />
                    </TableCell>
                    <TableCell className="py-6">
                      <PersonCell person={vendor} preferCompanyName />
                    </TableCell>
                    <TableCell className="py-6 font-bold">
                      <span className={getJobActivityStatusColor(jobStatus)}>
                        {formatJobActivityStatus(jobStatus)}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-6 text-[#1A1A1A]">
                      {formatDate(getJobDatePosted(job))}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && !isError && jobs.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
