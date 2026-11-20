"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CheckCircle2,
  Mail,
  Star,
  Users,
  Briefcase,
  Building2,
  User,
} from "lucide-react";
import type {
  AppliedProvider,
  JobActivityItem,
} from "@/features/jobs-activity/jobs-activity.types";
import { getPersonInitials } from "@/features/jobs-activity/jobs-activity.api";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";

interface AppliedProvidersModalProps {
  open: boolean;
  job: JobActivityItem | null;
  onClose: () => void;
}

function getProviderImageUrl(provider: AppliedProvider): string | undefined {
  if (!provider.profilePicture) return undefined;
  if (typeof provider.profilePicture === "string") return provider.profilePicture;
  return provider.profilePicture.location ?? undefined;
}

function getProviderDisplayName(provider: AppliedProvider): string {
  return (
    provider.companyName?.trim() ||
    provider.name?.trim() ||
    provider.email?.trim() ||
    "Unnamed Provider"
  );
}

export function AppliedProvidersModal({
  open,
  job,
  onClose,
}: AppliedProvidersModalProps) {
  if (!job) return null;

  const appliedProviders = job.appliedProviders ?? [];
  const totalApplied = appliedProviders.length;
  const selectedCount = appliedProviders.filter(
    (p) =>
      p.isSelected ||
      (job.vendorAssigned?._id && job.vendorAssigned._id === p._id)
  ).length;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="w-full sm:max-w-[780px] p-0 gap-0 overflow-hidden rounded-[24px] bg-white border border-slate-200/90 shadow-2xl">
        {/* Header */}
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-teal-50/30 px-7 py-5">
          <DialogHeader className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#005864]/10 text-[#005864]">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <DialogTitle className="text-xl font-bold tracking-tight text-[#1A1A1A]">
                    Applied Providers
                  </DialogTitle>
                  <span className="inline-flex items-center rounded-full bg-[#005864]/10 px-3 py-0.5 text-xs font-semibold text-[#005864] ring-1 ring-inset ring-[#005864]/20">
                    {job.jobId}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Category:{" "}
                  <span className="font-semibold text-slate-700">
                    {job.jobCategory || "—"}
                  </span>
                  <span className="mx-1.5 text-slate-300">•</span>
                  <span>
                    {totalApplied} Provider{totalApplied === 1 ? "" : "s"} Applied
                  </span>
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Content Body */}
        <div className="max-h-[62vh] overflow-y-auto overflow-x-hidden p-6 space-y-4">
          {totalApplied === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
                <Users className="h-7 w-7" />
              </div>
              <p className="font-semibold text-slate-800 text-base">
                No Applied Providers
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No service providers have applied for this job yet.
              </p>
            </div>
          ) : (
            appliedProviders.map((provider) => {
              const isSelected =
                !!provider.isSelected ||
                (!!job.vendorAssigned?._id &&
                  job.vendorAssigned._id === provider._id);
              const displayName = getProviderDisplayName(provider);
              const hasCompany = !!provider.companyName?.trim();
              const contactPerson =
                hasCompany && provider.name?.trim() ? provider.name.trim() : null;
              const imageUrl = getProviderImageUrl(provider);

              return (
                <div
                  key={provider._id}
                  className={cn(
                    "group relative rounded-2xl border p-5 transition-all duration-200",
                    isSelected
                      ? "border-[#005864] bg-[#F2F8F9] shadow-sm ring-1 ring-[#005864]/30"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
                  )}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Left: Avatar & Info */}
                    <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                      <Avatar className="h-14 w-14 rounded-2xl border-2 border-white shadow-xs ring-2 ring-slate-100 shrink-0 overflow-hidden">
                        <AvatarImage
                          src={imageUrl}
                          alt={displayName}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-[#005864] text-white text-sm font-bold">
                          {getPersonInitials(displayName)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-[#1A1A1A] text-base leading-tight truncate">
                            {displayName}
                          </h4>
                          {hasCompany && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                              <Building2 className="h-3 w-3 text-slate-400" />
                              Company
                            </span>
                          )}
                        </div>

                        {contactPerson && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span>Contact: {contactPerson}</span>
                          </div>
                        )}

                        {/* Metadata Pills */}
                        <div className="flex flex-wrap items-center gap-2 pt-0.5">
                          {provider.email && (
                            <div className="inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-2.5 py-1 text-xs text-slate-600 border border-slate-200/70 shadow-2xs">
                              <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[200px] sm:max-w-none">
                                {provider.email}
                              </span>
                            </div>
                          )}

                          {/* Rating & Reviews */}
                          <div className="inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-800 border border-slate-200/70 shadow-2xs">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                            <span>
                              {typeof provider.averageRating === "number"
                                ? provider.averageRating.toFixed(1)
                                : "0.0"}
                            </span>
                            <span className="font-normal text-slate-500">
                              ({provider.totalReviews ?? 0}{" "}
                              {provider.totalReviews === 1 ? "review" : "reviews"})
                            </span>
                          </div>

                          {/* Applied Date */}
                          {provider.appliedAt && (
                            <div className="inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-2.5 py-1 text-xs text-slate-500 border border-slate-200/70 shadow-2xs">
                              <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              <span>Applied: {formatDate(provider.appliedAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Selected Status Badge */}
                    <div className="shrink-0 pt-2 sm:pt-0 self-start sm:self-center">
                      {isSelected ? (
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#005864] px-4 py-1.5 text-xs font-semibold text-white shadow-sm ring-2 ring-[#005864]/20">
                          <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                          <span>Selected Provider</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 border border-slate-200/60">
                          <span>Applicant</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-7 py-4 flex items-center justify-between bg-slate-50/70">
          <div className="text-xs text-slate-500">
            {selectedCount > 0 ? (
              <span className="font-medium text-[#005864]">
                ✓ 1 Selected Provider
              </span>
            ) : (
              <span>No provider selected</span>
            )}
            <span className="mx-1.5 text-slate-300">•</span>
            <span>{totalApplied} total applicant{totalApplied === 1 ? "" : "s"}</span>
          </div>

          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl px-6 h-9 text-xs font-semibold text-slate-700 hover:bg-slate-100 border-slate-200 bg-white shadow-xs"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default AppliedProvidersModal;
