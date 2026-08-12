"use client";

import { useState, useRef } from "react";
import { Dialog, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Download,
  FileSpreadsheet,
  FileText,
  Info,
  Loader2,
  Mail,
  RotateCcw,
  Send,
  Upload,
  X,
} from "lucide-react";
import { useUploadInvitations } from "@/features/invitations/invitations.hooks";
import type { InvitationUploadError } from "@/features/invitations/invitations.types";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownloadTemplate?: () => void;
  isDownloadingTemplate?: boolean;
  onSuccess?: () => void;
}

const MAX_CSV_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export const AddCategoryModal = ({
  open,
  onOpenChange,
  onDownloadTemplate,
  isDownloadingTemplate,
  onSuccess,
}: UploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [uploadErrors, setUploadErrors] = useState<InvitationUploadError[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadInvitations = useUploadInvitations();
  const hasUploadFailure = !!submitError;

  const resetForm = () => {
    setFile(null);
    setSubmitError("");
    setUploadErrors([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleFile = (selectedFile: File) => {
    setSubmitError("");
    setUploadErrors([]);

    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      setSubmitError("Only CSV files are allowed.");
      return;
    }

    if (selectedFile.size > MAX_CSV_FILE_SIZE_BYTES) {
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      setSubmitError("File size must be 5MB or less.");
      return;
    }

    setFile(selectedFile);
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleAdd = async () => {
    if (!file) return;

    if (file.size > MAX_CSV_FILE_SIZE_BYTES) {
      setSubmitError("File size must be 5MB or less.");
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setSubmitError("");
    setUploadErrors([]);
    try {
      const result = await uploadInvitations.mutateAsync(file);

      if (result.sent === 0 && result.errors.length > 0) {
        setSubmitError(
          "Your CSV could not be uploaded. Please review the issues below and try again."
        );
        setUploadErrors(result.errors);
        return;
      }

      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to upload CSV file."
      );
    }
  };

  const handleUploadAgain = () => {
    setSubmitError("");
    setUploadErrors([]);
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm();
        onOpenChange(isOpen);
      }}
    >
      <DialogPortal>
        <DialogOverlay />

        <div className="fixed left-1/2 top-1/2 z-50 w-[min(620px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-2xl max-h-[92vh] flex flex-col">
          <button
            type="button"
            onClick={handleCancel}
            disabled={uploadInvitations.isPending}
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-60 z-10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="px-7 py-7 overflow-y-auto space-y-5">
            {/* Header */}
            <div className="pr-8">
              <h2 className="text-2xl font-semibold text-[#181818]">CSV Upload &amp; Invitation Setup</h2>
              <p className="mt-1 text-sm text-[#565656]">
                Upload your homeowner contact CSV to automatically dispatch invitation emails.
              </p>
            </div>

            {/* 1. Post-Upload Process Flow */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Info className="h-4 w-4 text-[#005864]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#005864]">
                  What happens after upload?
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-white border border-slate-100 shadow-2xs">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#005864]/10 text-[#005864] font-bold text-xs mb-1.5">
                    1
                  </div>
                  <span className="font-semibold text-slate-800">CSV Parsing</span>
                  <span className="text-slate-500 text-[11px] mt-0.5">Contacts are extracted and validated</span>
                </div>
                <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-white border border-slate-100 shadow-2xs">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#005864]/10 text-[#005864] font-bold text-xs mb-1.5">
                    2
                  </div>
                  <span className="font-semibold text-slate-800">Email Dispatch</span>
                  <span className="text-slate-500 text-[11px] mt-0.5">Automated invites are sent instantly</span>
                </div>
                <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-white border border-slate-100 shadow-2xs">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#005864]/10 text-[#005864] font-bold text-xs mb-1.5">
                    3
                  </div>
                  <span className="font-semibold text-slate-800">Registration</span>
                  <span className="text-slate-500 text-[11px] mt-0.5">Contacts activate account via link</span>
                </div>
              </div>
            </div>

            {/* 2. CSV File Format & Required Fields */}
            <div className="rounded-2xl border border-[#005864]/15 bg-[#F4F9F9]/70 p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-[#005864]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#005864]">
                    Required CSV File Information
                  </span>
                </div>
                {onDownloadTemplate ? (
                  <button
                    type="button"
                    onClick={onDownloadTemplate}
                    disabled={isDownloadingTemplate}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#005864] hover:underline disabled:opacity-50"
                  >
                    {isDownloadingTemplate ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Download className="h-3 w-3" />
                    )}
                    Sample Template
                  </button>
                ) : null}
              </div>

              <p className="text-xs text-slate-600 mb-2.5">
                Your CSV file must include a header row with the following fields to prevent upload errors:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-800">Name</span>
                    <span className="text-[10px] font-bold text-red-600 uppercase bg-red-50 px-1.5 py-0.5 rounded">Required</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Contact&apos;s full name (e.g. John Doe)</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-800">Email</span>
                    <span className="text-[10px] font-bold text-red-600 uppercase bg-red-50 px-1.5 py-0.5 rounded">Required</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Valid email (e.g. john@example.com)</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-800">Phone</span>
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">Optional</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Contact number (e.g. +1 555-0199)</p>
                </div>
              </div>
            </div>

            {/* 3. Invitation Email Preview */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-2xs">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-[#005864]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#005864]">
                  Invitation Email Preview
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                This email will be automatically sent to each contact listed in your CSV file:
              </p>

              <div className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-3.5 space-y-2 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-1 border-b border-slate-200/60 pb-2 text-slate-600">
                  <div>
                    <span className="font-semibold text-slate-700">From: </span>
                    <span>NexaHome Invitations &lt;no-reply@nexahome.com&gt;</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Subject: </span>
                    <span className="text-slate-800 font-medium">You&apos;re invited to join NexaHome!</span>
                  </div>
                </div>

                <div className="pt-1 text-slate-700 space-y-1.5 leading-relaxed">
                  <p className="font-medium text-slate-800">Hello [Contact Name],</p>
                  <p>
                    You have been invited to join NexaHome. Click the link below to get started and complete your homeowner account setup.
                  </p>
                </div>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#005864] px-3.5 py-1.5 text-[11px] font-semibold text-white shadow-2xs">
                    <Send className="h-3 w-3" />
                    Accept Invitation &amp; Join NexaHome
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Upload Zone */}
            <div
              className={`cursor-pointer rounded-2xl border-2 border-dashed p-5 text-center transition ${
                hasUploadFailure
                  ? "border-red-200 bg-red-50/40 hover:bg-red-50/60"
                  : "border-[#005864]/25 bg-[#F7FAFA] hover:bg-[#EFF5F6]"
              }`}
              onClick={() => !uploadInvitations.isPending && inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".csv"
                className="hidden"
                disabled={uploadInvitations.isPending}
                onChange={(e) =>
                  e.target.files?.[0] && handleFile(e.target.files[0])
                }
              />
              {file ? (
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xs">
                    <FileText className="h-6 w-6 text-[#005864]" />
                  </div>
                  <p className="max-w-full truncate font-medium text-[#181818] text-sm">
                    {file.name}
                  </p>
                  <p className="text-xs text-[#565656]">
                    {(file.size / 1024).toFixed(1)} KB — Click to select a different file
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xs">
                    <Upload className="h-6 w-6 text-[#005864]" />
                  </div>
                  <p className="font-medium text-[#181818] text-sm">Select CSV File</p>
                  <p className="text-xs text-[#565656]">
                    Click to browse your computer (Max file size: 5MB)
                  </p>
                </div>
              )}
            </div>

            {/* Upload Error Display */}
            {submitError ? (
              <div className="overflow-hidden rounded-2xl border border-red-200 bg-red-50">
                <div className="flex items-start gap-3 border-b border-red-100 px-4 py-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-red-700">
                      Upload not completed
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-red-600">
                      {submitError}
                    </p>
                  </div>
                </div>

                {uploadErrors.length ? (
                  <div className="max-h-36 overflow-y-auto px-4 py-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-red-700">
                      Issues found
                    </p>
                    <div className="space-y-2">
                      {uploadErrors.map((item, index) => (
                        <div
                          key={`${item.row}-${index}`}
                          className="flex items-start gap-3 rounded-xl border border-red-100 bg-white px-3 py-2"
                        >
                          <span className="shrink-0 rounded-md bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-700">
                            Row {item.row}
                          </span>
                          <p className="text-xs leading-relaxed text-[#565656]">
                            {item.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {uploadErrors.length ? (
                  <div className="border-t border-red-100 bg-white/70 px-4 py-2.5">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleUploadAgain}
                      className="h-9 w-full rounded-xl border-[#005864]/20 bg-white text-xs text-[#005864] hover:bg-[#005864]/5"
                    >
                      <RotateCcw className="mr-2 h-3.5 w-3.5" />
                      Try Uploading Again
                    </Button>
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                onClick={handleCancel}
                disabled={uploadInvitations.isPending}
                className="h-11 w-full sm:w-[150px] rounded-xl bg-[#005864]/10 text-[#005864] hover:bg-[#005864]/15"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleAdd}
                disabled={!file || uploadInvitations.isPending}
                className="h-11 w-full sm:w-[220px] rounded-xl"
              >
                {uploadInvitations.isPending ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading &amp; Sending...
                  </span>
                ) : (
                  "Upload & Send Invites"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogPortal>
    </Dialog>
  );
};
