"use client";

import SearchInput from "@/components/global/search-input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { AddCategoryModal } from "./_components/upload-modal";
import CSVDataTable from "./_components/csv-data-table";
import { SuccessModal } from "@/components/global/success-modal";
import {
  useDownloadInvitationTemplate,
} from "@/features/invitations/invitations.hooks";

export default function CSVUpload() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const downloadTemplate = useDownloadInvitationTemplate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleDownloadTemplate = () => {
    setDownloadError("");
    downloadTemplate.mutate(undefined, {
      onError: (error) => {
        setDownloadError(error.message || "Failed to download CSV template.");
      },
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <h1 className="heading">CSV Upload</h1>
        <div className="flex items-center gap-2">
          <SearchInput value={search} onChange={setSearch} placeholder="Search" />
          <Button
            onClick={handleDownloadTemplate}
            disabled={downloadTemplate.isPending}
            className="px-6"
          >
            {downloadTemplate.isPending ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Downloading...
              </span>
            ) : (
              "CSV Template"
            )}
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="px-6">
            CSV Upload
          </Button>
        </div>
      </div>

      {downloadError ? (
        <p className="pb-2 text-right text-sm text-red-600">{downloadError}</p>
      ) : null}

      <AddCategoryModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onDownloadTemplate={handleDownloadTemplate}
        isDownloadingTemplate={downloadTemplate.isPending}
        onSuccess={() => {
          setIsSuccess(true);
          setPage(1);
        }}
      />
      <SuccessModal
        isOpen={isSuccess}
        onClose={() => setIsSuccess(false)}
        onApprove={() => {}}
      />
      <CSVDataTable
        page={page}
        search={debouncedSearch}
        onPageChange={setPage}
      />
    </div>
  );
}
