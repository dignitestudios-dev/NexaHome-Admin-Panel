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
import { Eye } from "lucide-react";
import EditAdModal from "./edit-ad-modal";
import Pagination from "@/components/global/pagination";
import { useAdvertisements } from "@/features/advertisements/advertisements.hooks";
import {
  formatAdvertisementStatus,
  getAdCategory,
  getAdDuration,
  getAdServiceProvider,
  getAdTargetLocation,
  getAdvertisementStatusColor,
} from "@/features/advertisements/advertisements.api";
import type {
  Advertisement,
  AdvertisementStatusFilter,
  AdvertisementTab,
} from "@/features/advertisements/advertisements.types";

type DailyAdsTableProps = {
  tab: AdvertisementTab;
  search?: string;
  status?: AdvertisementStatusFilter;
  page: number;
  onPageChange: (page: number) => void;
};

const actionButtonClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-full transition";

export default function DailyAdsTable({
  tab,
  search,
  status = "all",
  page,
  onPageChange,
}: DailyAdsTableProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);

  const { data, isLoading, isError, error } = useAdvertisements({
    tab,
    search,
    status,
    page,
    limit: 10,
  });

  const advertisements = data?.advertisements ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  const handleViewClick = (ad: Advertisement) => {
    setSelectedAd(ad);
    setEditModalOpen(true);
  };

  return (
    <div>
      <div className="rounded-3xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="rounded-l-3xl">Service Provider</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Target Location</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="rounded-r-3xl">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    <span className="ml-2">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-red-600">
                  {(error as Error)?.message ?? "Failed to load advertisements."}
                </TableCell>
              </TableRow>
            ) : advertisements.length ? (
              advertisements.map((ad) => (
                <TableRow key={ad._id}>
                  <TableCell className="capitalize">
                    {getAdServiceProvider(ad)}
                  </TableCell>
                  <TableCell>{getAdCategory(ad)}</TableCell>
                  <TableCell>{getAdTargetLocation(ad)}</TableCell>
                  <TableCell>{getAdDuration(ad)}</TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${getAdvertisementStatusColor(ad.status)}`}
                    >
                      {formatAdvertisementStatus(ad.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleViewClick(ad)}
                        className={`${actionButtonClass} bg-[#F0F5F6] text-[#005864] hover:bg-[#e2eced]`}
                        aria-label="Manage ad"
                        title="Manage / Edit Ad"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No advertisements found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <EditAdModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        ad={selectedAd}
      />

      {!isLoading && !isError && advertisements.length > 0 ? (
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
