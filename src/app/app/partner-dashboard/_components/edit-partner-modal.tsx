"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Briefcase, DollarSign, Loader2, Users, X } from "lucide-react";
import {
  formatPartnerRevenue,
  formatPartnerStatus,
  getPartnerDisplayName,
  getPartnerInitials,
  getPartnerProfileImageUrl,
  getPartnerReferralCode,
  isPartnerActive,
} from "@/features/partners/partners.api";
import type { Partner, PartnerStatus } from "@/features/partners/partners.types";
import { useUpdatePartnerStatus } from "@/features/partners/partners.hooks";
import { cn } from "@/lib/utils";

type EditPartnerModalProps = {
  open: boolean;
  partner: Partner | null;
  onClose: () => void;
};

function PartnerStatusToggle({
  isActive,
  disabled,
  onChange,
}: {
  isActive: boolean;
  disabled?: boolean;
  onChange: (status: PartnerStatus) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#005864]/10 bg-[#F7FAFA] px-5 py-4">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-[#181818]">Account Status</p>
        <p className="text-xs text-[#565656]">
          {isActive
            ? "Partner can access referral benefits and dashboard."
            : "Partner is temporarily disabled from referral activity."}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span
          className={cn(
            "text-xs font-semibold uppercase tracking-wide",
            !isActive ? "text-[#FF0000]" : "text-slate-400"
          )}
        >
          Inactive
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={isActive}
          aria-label={isActive ? "Set partner inactive" : "Set partner active"}
          disabled={disabled}
          onClick={() => onChange(isActive ? "inactive" : "active")}
          className={cn(
            "relative h-8 w-14 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60",
            isActive ? "bg-[#16BC4E]" : "bg-slate-300"
          )}
        >
          <span
            className={cn(
              "absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform",
              isActive ? "left-7" : "left-1"
            )}
          />
        </button>
        <span
          className={cn(
            "text-xs font-semibold uppercase tracking-wide",
            isActive ? "text-[#16BC4E]" : "text-slate-400"
          )}
        >
          Active
        </span>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[#005864]/10 text-[#005864]">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-[#181818]">{value}</p>
    </div>
  );
}

export function EditPartnerModal({ open, partner, onClose }: EditPartnerModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<PartnerStatus>("active");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const updatePartnerStatus = useUpdatePartnerStatus();

  useEffect(() => {
    if (!partner || !open) return;

    setSelectedStatus(isPartnerActive(partner.status) ? "active" : "inactive");
    setSubmitError(null);
  }, [partner, open]);

  if (!partner) return null;

  const partnerName = getPartnerDisplayName(partner);
  const referralCode = getPartnerReferralCode(partner);
  const currentStatus = isPartnerActive(partner.status) ? "active" : "inactive";
  const hasChanges = selectedStatus !== currentStatus;
  const isActive = selectedStatus === "active";

  const handleClose = () => {
    if (updatePartnerStatus.isPending) return;
    onClose();
  };

  const handleSave = async () => {
    if (!hasChanges) {
      handleClose();
      return;
    }

    setSubmitError(null);

    try {
      await updatePartnerStatus.mutateAsync({
        partnerId: partner.partnerId,
        status: selectedStatus,
      });
      onClose();
    } catch (error) {
      setSubmitError(
        (error as Error)?.message ?? "Failed to update partner status."
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <DialogPortal>
        <DialogOverlay />

        <div className="fixed left-1/2 top-1/2 z-50 flex w-[min(480px,calc(100vw-2rem))] max-h-[92vh] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="text-[22px] font-semibold text-slate-900">
                Edit Partner
              </DialogTitle>
              <p className="text-sm text-slate-500">
                Update partner status and review referral performance.
              </p>
            </DialogHeader>
            <button
              type="button"
              onClick={handleClose}
              disabled={updatePartnerStatus.isPending}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-60"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <Avatar className="h-14 w-14">
                <AvatarImage
                  src={getPartnerProfileImageUrl(partner)}
                  alt={partnerName}
                />
                <AvatarFallback className="bg-[#005864] text-base font-semibold text-white">
                  {getPartnerInitials(partner.partnerName)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-semibold text-[#181818]">
                  {partnerName}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#005864]/10 px-3 py-1 text-xs font-medium text-[#005864]">
                    Code: {referralCode}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      isPartnerActive(partner.status)
                        ? "bg-[#16BC4E]/10 text-[#16BC4E]"
                        : "bg-[#FF0000]/10 text-[#FF0000]"
                    )}
                  >
                    {formatPartnerStatus(partner.status)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <StatCard
                icon={Users}
                label="Users Referred"
                value={String(partner.usersReferredCount)}
              />
              <StatCard
                icon={Briefcase}
                label="Jobs Posted"
                value={String(partner.jobsPosted)}
              />
              <StatCard
                icon={DollarSign}
                label="Revenue"
                value={formatPartnerRevenue(partner.revenueGenerated)}
              />
            </div>

            <PartnerStatusToggle
              isActive={isActive}
              disabled={updatePartnerStatus.isPending}
              onChange={setSelectedStatus}
            />

            {submitError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {submitError}
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={updatePartnerStatus.isPending}
              className="h-10 min-w-[100px] rounded-lg border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={updatePartnerStatus.isPending}
              className="h-10 min-w-[140px] rounded-lg bg-[#005864] text-white hover:bg-[#004450]"
            >
              {updatePartnerStatus.isPending ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : hasChanges ? (
                "Save Changes"
              ) : (
                "Close"
              )}
            </Button>
          </div>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
