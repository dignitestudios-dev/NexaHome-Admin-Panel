"use client";

import type { ComponentType } from "react";
import {
  Dialog,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  CheckCircle2,
  ExternalLink,
  ImageIcon,
  MapPin,
  Megaphone,
  Radius,
  Tag,
  X,
} from "lucide-react";
import {
  formatAdDuration,
  formatAdvertisementStatus,
  getAdCategory,
  getAdServiceProvider,
  getAdTargetLocation,
  getAdvertisementStatusColor,
  isAdvertisementActive,
} from "@/features/advertisements/advertisements.api";
import type { Advertisement } from "@/features/advertisements/advertisements.types";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";

type EditAdModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ad?: Advertisement | null;
};

function InfoCell({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 border-b border-slate-200 p-3.5 last:border-b-0",
        className
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
      <div className="min-w-0">
        <p className="text-[12px] text-slate-500">{label}</p>
        <div className="mt-0.5 break-all text-[13px] font-medium text-slate-900">
          {value}
        </div>
      </div>
    </div>
  );
}

export default function EditAdModal({
  open,
  onOpenChange,
  ad,
}: EditAdModalProps) {
  if (!ad) return null;

  const isActive = isAdvertisementActive(ad.status);
  const mediaUrl = ad.media?.location;
  const statusLabel = formatAdvertisementStatus(ad.status);
  const statusColorClass = getAdvertisementStatusColor(ad.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />

        <div className="fixed left-1/2 top-1/2 z-50 flex w-[min(420px,calc(100vw-2rem))] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <DialogHeader className="space-y-0">
              <DialogTitle className="text-[18px] font-semibold text-slate-900">
                Ad Details
              </DialogTitle>
            </DialogHeader>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="overflow-hidden border-b border-slate-200 bg-slate-100">
              {mediaUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mediaUrl}
                  alt={ad.media?.fileName || "Ad media"}
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/3] w-full items-center justify-center text-slate-400">
                  <ImageIcon className="h-10 w-10" />
                </div>
              )}
            </div>

            <div className="space-y-4 px-5 py-4">
              <div>
                <h2 className="text-[18px] font-semibold text-slate-900">
                  {getAdServiceProvider(ad)}
                </h2>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {ad.isAdminAd ? (
                    <span className="inline-flex rounded-md bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700 ring-1 ring-violet-200">
                      Admin Ad
                    </span>
                  ) : null}
                  <span className="inline-flex rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700 ring-1 ring-sky-200">
                    {getAdCategory(ad)}
                  </span>
                </div>
              </div>

              <div
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-3.5 py-2.5",
                  isActive
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-red-200 bg-red-50"
                )}
              >
                <CheckCircle2
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive ? "text-emerald-600" : "text-red-500"
                  )}
                />
                <div>
                  <p className="text-[11px] text-slate-500">Ad Status</p>
                  <p className={cn("text-[14px] font-semibold", statusColorClass)}>
                    {statusLabel}
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200">
                <InfoCell icon={Tag} label="Category" value={getAdCategory(ad)} />
                <InfoCell
                  icon={MapPin}
                  label="Target Location"
                  value={getAdTargetLocation(ad)}
                />
                <InfoCell
                  icon={Radius}
                  label="Target Radius"
                  value={`${ad.targetRadiusMiles} miles`}
                />
                <InfoCell
                  icon={Megaphone}
                  label="Duration"
                  value={formatAdDuration(ad.duration)}
                />
                <InfoCell
                  icon={ExternalLink}
                  label="Redirect Link"
                  value={
                    ad.link ? (
                      <a
                        href={ad.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#005864] underline-offset-2 hover:underline"
                      >
                        {ad.link}
                      </a>
                    ) : (
                      "—"
                    )
                  }
                />
                <InfoCell
                  icon={Calendar}
                  label="Created At"
                  value={formatDate(ad.createdAt)}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
