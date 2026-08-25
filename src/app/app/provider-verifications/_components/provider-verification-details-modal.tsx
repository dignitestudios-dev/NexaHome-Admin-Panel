"use client";

import { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Loader2,
  Mail,
  X,
  Phone,
  Building,
  CheckCircle2,
  AlertCircle,
  FileText
} from "lucide-react";
import { useProviderVerificationDetails, useUpdateProviderVerificationStatus } from "@/features/provider-verifications/provider-verifications.hooks";
import type { ProviderVerification } from "@/features/provider-verifications/provider-verifications.types";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";

type ProviderVerificationDetailsModalProps = {
  open: boolean;
  provider: ProviderVerification | null;
  onClose: () => void;
};

function getInitials(name?: string) {
  if (!name) return "NA";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function ProviderVerificationDetailsModal({
  open,
  provider,
  onClose,
}: ProviderVerificationDetailsModalProps) {
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  // In this case we already have all the data in the provider object from the list,
  // but if we want to fetch details just to be sure we have the latest:
  const { data: detailData, isLoading: isDetailLoading } = useProviderVerificationDetails(
    open ? provider?._id ?? null : null
  );

  const { mutate: updateStatus, isPending: isUpdating } = useUpdateProviderVerificationStatus();

  if (!provider) return null;

  // Use detailed data if available, otherwise fallback to the list data
  const data = detailData || provider;

  const handleApprove = () => {
    updateStatus(
      { providerId: data._id, status: "approved" },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert("Please provide a rejection reason.");
      return;
    }
    updateStatus(
      { providerId: data._id, status: "rejected", rejectReason },
      {
        onSuccess: () => {
          setIsRejecting(false);
          setRejectReason("");
          onClose();
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setIsRejecting(false);
          setRejectReason("");
          onClose();
        }
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="flex w-[min(920px,calc(100vw-2rem))] max-h-[92vh] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl p-0 sm:max-w-none gap-0"
      >
        <div className="flex h-full flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 shrink-0">
            <DialogHeader className="space-y-0">
              <DialogTitle className="text-[22px] font-semibold text-slate-900">
                Provider Verification Details
              </DialogTitle>
            </DialogHeader>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-[72px] w-[72px] ring-2 ring-slate-100">
                  <AvatarImage src={data.profilePicture?.location} alt={data.name} />
                  <AvatarFallback className="bg-slate-800 text-lg font-semibold text-white">
                    {getInitials(data.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-[22px] font-semibold text-slate-900">
                    {data.name}
                  </h2>
                  <span className={cn(
                    "mt-1 inline-flex rounded-md px-2.5 py-1 text-[12px] font-medium ring-1 capitalize",
                    data.identityStatus === "approved" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" :
                    data.identityStatus === "rejected" ? "bg-red-50 text-red-700 ring-red-200" :
                    data.identityStatus === "pending" ? "bg-amber-50 text-amber-700 ring-amber-200" :
                    "bg-slate-50 text-slate-700 ring-slate-200"
                  )}>
                    {data.identityStatus.replace("-", " ")}
                  </span>
                </div>
              </div>
            </div>

            {data.identityStatus === "rejected" && data.identityRejectReason && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-red-800">Rejection Reason</h4>
                  <p className="mt-1 text-sm text-red-700">{data.identityRejectReason}</p>
                </div>
              </div>
            )}

            {/* Basic Info */}
            <div className="mb-5 overflow-hidden rounded-xl border border-slate-200">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <h3 className="text-sm font-semibold text-slate-800">Basic Information</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                <div className="flex items-start gap-3 border-b border-r border-slate-200 p-4">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <div className="min-w-0">
                    <p className="text-[13px] text-slate-500">Email</p>
                    <p className="mt-0.5 break-all text-[14px] font-medium text-slate-900">{data.email || "—"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 border-b border-r border-slate-200 p-4">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <div className="min-w-0">
                    <p className="text-[13px] text-slate-500">Phone</p>
                    <p className="mt-0.5 break-all text-[14px] font-medium text-slate-900">{data.phone || "—"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 border-b border-r border-slate-200 p-4">
                  <Building className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <div className="min-w-0">
                    <p className="text-[13px] text-slate-500">Company Name</p>
                    <p className="mt-0.5 break-all text-[14px] font-medium text-slate-900">{data.companyName || "—"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 border-b border-r border-slate-200 p-4">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <div className="min-w-0">
                    <p className="text-[13px] text-slate-500">Created At</p>
                    <p className="mt-0.5 break-all text-[14px] font-medium text-slate-900">{formatDate(data.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Progress */}
            <div className="mb-5 overflow-hidden rounded-xl border border-slate-200">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <h3 className="text-sm font-semibold text-slate-800">Application Progress</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-start gap-3 border-b border-r border-slate-200 p-4">
                  <CheckCircle2 className={cn("mt-0.5 h-4 w-4 shrink-0", data.isProfileCompleted ? "text-emerald-500" : "text-slate-300")} />
                  <div className="min-w-0">
                    <p className="text-[13px] text-slate-500">Profile Completed</p>
                    <p className="mt-0.5 break-all text-[14px] font-medium text-slate-900">{data.isProfileCompleted ? "Yes" : "No"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 border-b border-r border-slate-200 p-4">
                  <CheckCircle2 className={cn("mt-0.5 h-4 w-4 shrink-0", data.businessDocsSubmitted ? "text-emerald-500" : "text-slate-300")} />
                  <div className="min-w-0">
                    <p className="text-[13px] text-slate-500">Business Docs</p>
                    <p className="mt-0.5 break-all text-[14px] font-medium text-slate-900">{data.businessDocsSubmitted ? "Submitted" : "Missing"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 border-b border-r border-slate-200 p-4">
                  <CheckCircle2 className={cn("mt-0.5 h-4 w-4 shrink-0", data.portfolioMediaUploaded ? "text-emerald-500" : "text-slate-300")} />
                  <div className="min-w-0">
                    <p className="text-[13px] text-slate-500">Portfolio Uploaded</p>
                    <p className="mt-0.5 break-all text-[14px] font-medium text-slate-900">{data.portfolioMediaUploaded ? "Yes" : "No"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="mb-5 overflow-hidden rounded-xl border border-slate-200">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <h3 className="text-sm font-semibold text-slate-800">Identity Documents</h3>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/50">
                {!data.idCard?.front && !data.idCard?.back ? (
                   <div className="col-span-full py-6 text-center text-sm text-slate-500">
                     No ID card documents provided.
                   </div>
                ) : (
                  <>
                    {data.idCard.front && (
                      <div className="flex flex-col gap-2 border border-slate-200 rounded-lg p-3 bg-white shadow-sm">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[#005864]" />
                          <p className="text-sm font-semibold text-slate-800">ID Card (Front)</p>
                        </div>
                        <a href={data.idCard.front.location} target="_blank" rel="noreferrer" className="block w-full h-32 mt-2 rounded overflow-hidden border border-slate-100 hover:opacity-80 transition">
                          <img src={data.idCard.front.location} alt="ID Front" className="w-full h-full object-cover" />
                        </a>
                      </div>
                    )}
                    {data.idCard.back && (
                      <div className="flex flex-col gap-2 border border-slate-200 rounded-lg p-3 bg-white shadow-sm">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[#005864]" />
                          <p className="text-sm font-semibold text-slate-800">ID Card (Back)</p>
                        </div>
                        <a href={data.idCard.back.location} target="_blank" rel="noreferrer" className="block w-full h-32 mt-2 rounded overflow-hidden border border-slate-100 hover:opacity-80 transition">
                          <img src={data.idCard.back.location} alt="ID Back" className="w-full h-full object-cover" />
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {isDetailLoading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              </div>
            )}

            {/* Actions for Pending */}
            {data.identityStatus === "pending" && (
              <div className="mt-6 pt-4 border-t border-slate-200">
                {isRejecting ? (
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium text-slate-700">Reason for Rejection</label>
                    <textarea 
                      className="w-full border border-slate-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#005864]"
                      rows={3}
                      placeholder="e.g. Document image is blurred and expiry date is not visible"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <div className="flex justify-end gap-3 mt-2">
                      <Button variant="outline" onClick={() => setIsRejecting(false)} disabled={isUpdating}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleReject} disabled={isUpdating}>
                        {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Confirm Reject
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end gap-4">
                    <Button variant="destructive" onClick={() => setIsRejecting(true)} disabled={isUpdating}>
                      Reject
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleApprove} disabled={isUpdating}>
                      {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
