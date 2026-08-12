"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
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
import { usePartners } from "@/features/partners/partners.hooks";
import {
  formatPartnerRevenue,
  formatPartnerStatus,
  getPartnerDisplayName,
  getPartnerInitials,
  getPartnerProfileImageUrl,
  getPartnerReferralCode,
  isPartnerActive,
} from "@/features/partners/partners.api";
import type { Partner } from "@/features/partners/partners.types";
import { EditPartnerModal } from "./edit-partner-modal";

const PAGE_SIZE = 10;
const actionButtonClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors";

export function PartnersTable({ search = "" }: { search?: string }) {
  const [page, setPage] = useState(1);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  const { data, isLoading, isError, error } = usePartners({
    page,
    limit: PAGE_SIZE,
    search,
  });

  const partners = data?.partners ?? [];
  const totalPages = data?.totalPages ?? 1;

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div>
      <div className="rounded-3xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="font-light">
              <TableHead className="rounded-l-3xl">Partner Name</TableHead>
              <TableHead>Referral Code</TableHead>
              <TableHead className="text-center">Users Referred Count</TableHead>
              <TableHead className="text-center">Link Referrals Count</TableHead>
              <TableHead>Jobs Posted</TableHead>
              <TableHead>Partner Commission</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="rounded-r-3xl text-center">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
                    <span className="ml-2">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-red-600">
                  {(error as Error)?.message ?? "Failed to load partners."}
                </TableCell>
              </TableRow>
            ) : partners.length ? (
              partners.map((partner) => {
                const partnerName = getPartnerDisplayName(partner);
                const isActive = isPartnerActive(partner.status);

                return (
                  <TableRow key={partner.partnerId}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={getPartnerProfileImageUrl(partner)}
                            alt={partnerName}
                          />
                          <AvatarFallback className="bg-[#212121] text-white font-medium text-[12px]">
                            {getPartnerInitials(partner.partnerName)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{partnerName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getPartnerReferralCode(partner)}</TableCell>
                    <TableCell className="text-center">
                      {partner.usersReferredCount}
                    </TableCell>
                    <TableCell className="text-center">
                      {partner.linkReferralsCount ?? 0}
                    </TableCell>
                    <TableCell>{partner.jobsPosted}</TableCell>
                    <TableCell>
                      {formatPartnerRevenue(partner.revenueGenerated)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-medium ${
                          isActive ? "text-[#16BC4E]" : "text-[#FF0000]"
                        }`}
                      >
                        {formatPartnerStatus(partner.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setEditingPartner(partner)}
                          className={`${actionButtonClass} bg-[#FFF7ED] text-[#C2410C] hover:bg-[#FFEDD5]`}
                          aria-label={`Edit ${partnerName}`}
                        >
                          <Pencil size={17} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No partners found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && !isError && partners.length > 0 ? (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      ) : null}

      <EditPartnerModal
        open={!!editingPartner}
        partner={editingPartner}
        onClose={() => setEditingPartner(null)}
      />
    </div>
  );
}
