"use client";

import { useEffect, useState, type ComponentType } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CheckCircle2,
  ExternalLink,
  ImageIcon,
  Loader2,
  MapPin,
  Megaphone,
  Radius,
  Tag,
  X,
  Edit3,
} from "lucide-react";
import {
  ADVERTISEMENT_DURATION_OPTIONS,
  formatAdDuration,
  formatAdvertisementStatus,
  getAdCategory,
  getAdServiceProvider,
  getAdTargetLocation,
  getAdvertisementStatusColor,
  isAdvertisementActive,
} from "@/features/advertisements/advertisements.api";
import { useUpdateAdvertisement } from "@/features/advertisements/advertisements.hooks";
import type { Advertisement, AdvertisementDuration } from "@/features/advertisements/advertisements.types";
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
      <div className="min-w-0 flex-1">
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
  const updateAd = useUpdateAdvertisement();

  const [isEditing, setIsEditing] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [link, setLink] = useState("");
  const [targetRadiusMiles, setTargetRadiusMiles] = useState("");
  const [duration, setDuration] = useState<AdvertisementDuration | string>("day");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (ad) {
      setIsActive(isAdvertisementActive(ad.status));
      setLink(ad.link ?? "");
      setTargetRadiusMiles(String(ad.targetRadiusMiles ?? 10));
      setDuration(ad.duration ?? "day");
      setIsEditing(false);
      setSubmitError("");
    }
  }, [ad, open]);

  if (!ad) return null;

  const mediaUrl = ad.media?.location;
  const statusLabel = formatAdvertisementStatus(isActive);
  const statusColorClass = getAdvertisementStatusColor(isActive);

  const handleToggleStatus = (newActive: boolean) => {
    setIsActive(newActive);
    setSubmitError("");
    updateAd.mutate(
      {
        id: ad._id,
        isActive: newActive,
      },
      {
        onError: (err) => {
          setIsActive(!newActive);
          setSubmitError(err.message || "Failed to update ad status.");
        },
      }
    );
  };

  const handleSave = () => {
    setSubmitError("");
    updateAd.mutate(
      {
        id: ad._id,
        link: link.trim(),
        targetRadiusMiles: Number(targetRadiusMiles) || ad.targetRadiusMiles,
        duration: duration,
        isActive,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          onOpenChange(false);
        },
        onError: (err) => {
          setSubmitError(err.message || "Failed to update advertisement.");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90vh] w-[min(480px,calc(100vw-2rem))] flex-col gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl sm:max-w-[480px]"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4">
          <DialogHeader className="space-y-0">
            <DialogTitle className="text-[18px] font-semibold text-slate-900">
              {isEditing ? "Edit Advertisement" : "Ad Details"}
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

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="border-b border-slate-200 bg-slate-100">
            {mediaUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mediaUrl}
                alt={ad.media?.fileName || "Ad media"}
                draggable={false}
                className="aspect-[4/3] max-h-[220px] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[4/3] max-h-[220px] w-full items-center justify-center text-slate-400">
                <ImageIcon className="h-10 w-10" />
              </div>
            )}
          </div>

          <div className="space-y-4 px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[18px] font-semibold text-slate-900">
                  {getAdServiceProvider(ad)}
                </h2>
                <div className="mt-1 flex flex-wrap gap-1.5">
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

              {!isEditing ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-8 rounded-lg border-[#005864]/20 text-[#005864] hover:bg-[#005864]/5 gap-1.5"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit Ad
                </Button>
              ) : null}
            </div>

            {/* Ad Status Switch Bar */}
            <div
              className={cn(
                "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition",
                isActive
                  ? "border-emerald-200 bg-emerald-50/70"
                  : "border-red-200 bg-red-50/70"
              )}
            >
              <div className="flex items-center gap-3">
                <CheckCircle2
                  className={cn(
                    "h-5 w-5 shrink-0",
                    isActive ? "text-emerald-600" : "text-red-500"
                  )}
                />
                <div>
                  <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                    Ad Status
                  </p>
                  <p className={cn("text-[14px] font-semibold", statusColorClass)}>
                    {statusLabel}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">
                  {isActive ? "Active" : "Inactive"}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isActive}
                  disabled={updateAd.isPending}
                  onClick={() => handleToggleStatus(!isActive)}
                  className={cn(
                    "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-150 disabled:opacity-60",
                    isActive ? "bg-[#16BC4E]" : "bg-slate-300"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-150",
                      isActive ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            </div>

            {submitError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-600">
                {submitError}
              </div>
            ) : null}

            {isEditing ? (
              /* Editable Form */
              <div className="space-y-3 pt-1">
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-slate-700">
                    Redirect Link URL
                  </Label>
                  <Input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://example.com"
                    className="h-10 text-xs rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-700">
                      Target Radius (Miles)
                    </Label>
                    <Input
                      type="number"
                      value={targetRadiusMiles}
                      onChange={(e) => setTargetRadiusMiles(e.target.value)}
                      placeholder="50"
                      className="h-10 text-xs rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-700">
                      Duration
                    </Label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#005864]"
                    >
                      {ADVERTISEMENT_DURATION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                    disabled={updateAd.isPending}
                    className="h-9 rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSave}
                    disabled={updateAd.isPending}
                    className="h-9 bg-[#005864] text-[#ffffff] hover:bg-[#004450] rounded-lg min-w-[100px]"
                  >
                    {updateAd.isPending ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              /* Read-only Info List */
              <div className="rounded-xl border border-slate-200">
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
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
