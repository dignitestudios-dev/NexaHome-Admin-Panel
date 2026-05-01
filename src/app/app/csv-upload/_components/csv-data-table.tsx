"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/global/pagination";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useInvitations } from "@/features/invitations/invitations.hooks";
import {
  getInvitationEmail,
  getInvitationInitials,
  getInvitationName,
  getInvitationPhone,
} from "@/features/invitations/invitations.api";

type CSVDataTableProps = {
  page: number;
  search?: string;
  onPageChange: (page: number) => void;
};

export default function CSVDataTable({
  page,
  search,
  onPageChange,
}: CSVDataTableProps) {
  const { data, isLoading, isError, error } = useInvitations({
    page,
    limit: 10,
    search,
  });

  const invitations = data?.invitations ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  return (
    <div>
      <div className="overflow-hidden rounded-3xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="rounded-l-3xl">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="rounded-r-3xl">Phone</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
                    <span className="ml-2">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-red-600">
                  {(error as Error)?.message ?? "Failed to load invitations."}
                </TableCell>
              </TableRow>
            ) : invitations.length ? (
              invitations.map((invitation) => {
                const name = getInvitationName(invitation);

                return (
                  <TableRow key={invitation._id}>
                    <TableCell className="capitalize">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-[#212121] text-[12px] font-medium text-white">
                            {getInvitationInitials(name)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getInvitationEmail(invitation)}</TableCell>
                    <TableCell className="font-semibold">
                      {getInvitationPhone(invitation)}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No invitations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && !isError && invitations.length > 0 ? (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      ) : null}
    </div>
  );
}
