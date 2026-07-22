"use client";

import { useState, useRef } from "react";
import { Dialog, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  FileText,
  Loader2,
  Mail,
  RotateCcw,
  Upload,
  X,
} from "lucide-react";
import { useUploadInvitations } from "@/features/invitations/invitations.hooks";
import type { InvitationUploadError } from "@/features/invitations/invitations.types";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const MAX_CSV_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export const AddCategoryModal = ({
  open,
  onOpenChange,
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

        <div className="fixed left-1/2 top-1/2 z-50 w-[min(520px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-2xl max-h-[92vh] flex flex-col">
          <button
            type="button"
            onClick={handleCancel}
            disabled={uploadInvitations.isPending}
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-60 z-10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="px-8 py-8 overflow-y-auto">
            <div className="mb-5 pr-8">
              <h2 className="text-2xl font-semibold text-[#181818]">CSV Upload</h2>
              <p className="mt-1 text-sm text-[#565656]">
                Upload a CSV file to send homeowner invitations. Maximum file
                size: 5MB.
              </p>
            </div>

            {/* Email Preview Section */}
            <div className="mb-5 rounded-2xl border border-[#005864]/15 bg-[#F4F9F9] p-4 text-left">
              <div className="flex items-center gap-2 mb-1.5">
                <Mail className="h-4 w-4 text-[#005864]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#005864]">
                  Invitation Email Preview
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                When you upload your contacts, they will receive this invitation.
              </p>
              
              <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2 text-xs shadow-xs">
                <div className="border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-700">Subject: </span>
                  <span className="text-slate-600">You&apos;re invited to join NexaHome!</span>
                </div>
                <p className="text-slate-600 leading-relaxed pt-1">
                  Hello,
                  <br />
                  You have been invited to join NexaHome. Click the link below to get started and access your home services platform.
                </p>
                <div className="pt-2">
                  <span className="inline-block rounded-lg bg-[#005864] px-3 py-1.5 text-[11px] font-medium text-white shadow-xs">
                    Accept Invitation
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition ${
                hasUploadFailure
                  ? "border-red-200 bg-red-50/40 hover:bg-red-50/60"
                  : "border-[#005864]/20 bg-[#F7FAFA] hover:bg-[#EFF5F6]"
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
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <FileText className="h-7 w-7 text-[#005864]" />
                  </div>
                  <p className="max-w-full truncate font-medium text-[#181818]">
                    {file.name}
                  </p>
                  <p className="text-xs text-[#565656]">Click to change file</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <Upload className="h-7 w-7 text-[#005864]" />
                  </div>
                  <p className="font-medium text-[#181818]">Upload CSV</p>
                  <p className="text-sm text-[#565656]">Click to browse your file</p>
                </div>
              )}
            </div>

            {submitError ? (
              <div className="mt-5 overflow-hidden rounded-2xl border border-red-200 bg-red-50">
                <div className="flex items-start gap-3 border-b border-red-100 px-4 py-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-red-700">
                      Upload not completed
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-red-600">
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
                          className="flex items-start gap-3 rounded-xl border border-red-100 bg-white px-3 py-2.5"
                        >
                          <span className="shrink-0 rounded-md bg-red-100 px-2 py-1 text-[11px] font-bold text-red-700">
                            Row {item.row}
                          </span>
                          <p className="text-sm leading-relaxed text-[#565656]">
                            {item.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {uploadErrors.length ? (
                  <div className="border-t border-red-100 bg-white/70 px-4 py-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleUploadAgain}
                      className="h-10 w-full rounded-xl border-[#005864]/20 bg-white text-[#005864] hover:bg-[#005864]/5"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Upload again
                    </Button>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="mt-6 flex justify-center gap-3">
              <Button
                type="button"
                onClick={handleCancel}
                disabled={uploadInvitations.isPending}
                className="h-11 w-[200px] rounded-xl bg-[#005864]/10 text-[#005864] hover:bg-[#005864]/15"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleAdd}
                disabled={!file || uploadInvitations.isPending}
                className="h-11 w-[200px] rounded-xl"
              >
                {uploadInvitations.isPending ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </span>
                ) : (
                  "Upload"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
