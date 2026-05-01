"use client";

import {
  Dialog,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Loader2, X } from "lucide-react";
import { useExpert } from "@/features/experts/experts.hooks";
import type {
  ExpertCategory,
  ExpertDetail,
  ExpertProfilePicture,
} from "@/features/experts/experts.types";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";

type ExpertDetailsModalProps = {
  open: boolean;
  expertId: string | null;
  purchaseDate?: string | null;
  onClose: () => void;
};

function getInitials(name?: string) {
  if (!name?.trim()) return "NA";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDisplayName(value?: string) {
  if (!value?.trim()) return "—";
  return value
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function formatRoleLabel(role?: string) {
  if (!role) return "Service Provider";
  return role
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function getProfileImageUrl(expert: ExpertDetail) {
  if (!expert.profilePicture) return undefined;
  if (typeof expert.profilePicture === "string") return expert.profilePicture;
  return (expert.profilePicture as ExpertProfilePicture).location ?? undefined;
}

function getCategories(expert: ExpertDetail): ExpertCategory[] {
  return expert.categories ?? expert.selectedCategories ?? [];
}

export function ExpertDetailsModal({
  open,
  expertId,
  purchaseDate,
  onClose,
}: ExpertDetailsModalProps) {
  const { data: expert, isLoading, isError, error } = useExpert(
    expertId ?? "",
    open && Boolean(expertId)
  );

  const categories = expert ? getCategories(expert) : [];
  const isActive = expert?.isActive !== false;
  const displayName = formatDisplayName(expert?.name);
  const companyName = expert?.companyName?.trim();

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogPortal>
        <DialogOverlay className="bg-black/40 backdrop-blur-[2px]" />

        <div className="fixed left-1/2 top-1/2 z-50 flex max-h-[min(90vh,720px)] w-[min(960px,calc(100vw-1.5rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[28px] border border-[#005864]/10 bg-white shadow-[0_24px_80px_rgba(0,88,100,0.18)]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <DialogHeader className="space-y-0">
              <DialogTitle className="text-[20px] font-semibold tracking-tight text-[#1C1C1C]">
                Expert Details
              </DialogTitle>
            </DialogHeader>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            {isLoading && !expert ? (
              <div className="flex min-h-[300px] items-center justify-center text-slate-500">
                <Loader2 className="h-8 w-8 animate-spin text-[#005864]" />
              </div>
            ) : isError && !expert ? (
              <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-red-100 bg-red-50 px-4 text-sm text-red-600">
                ⚠ {(error as Error)?.message ?? "Failed to load expert details."}
              </div>
            ) : !expert ? null : (
              <div className="flex flex-col gap-5 lg:flex-row lg:gap-6">
                {/* Left profile panel */}
                <div className="relative flex w-full shrink-0 flex-col items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(165deg,rgba(0,88,100,0.1)_0%,rgba(0,88,100,0.04)_100%)] px-6 py-10 lg:w-[320px] lg:min-h-[320px]">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#D7DF23]/20 blur-2xl" />
                  <div className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-[#005864]/15 blur-2xl" />

                  <Avatar className="relative h-[112px] w-[112px] ring-4 ring-white shadow-[0_8px_24px_rgba(0,88,100,0.16)]">
                    <AvatarImage
                      src={getProfileImageUrl(expert)}
                      alt={displayName}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-[#005864] text-2xl font-semibold text-white">
                      {getInitials(expert.name)}
                    </AvatarFallback>
                  </Avatar>

                  <h2 className="relative mt-5 max-w-full truncate text-center text-[22px] font-semibold leading-tight text-[#1C1C1C]">
                    {displayName}
                  </h2>

                  {companyName ? (
                    <p className="relative mt-1.5 max-w-full truncate text-center text-sm font-medium text-[#005864]">
                      {companyName}
                    </p>
                  ) : null}

                  <p className="relative mt-2 rounded-full bg-white/80 px-3 py-1 text-center text-sm text-black/65 shadow-sm">
                    {formatRoleLabel(expert.role)}
                  </p>
                </div>

                {/* Right details */}
                <div className="flex min-w-0 flex-1 flex-col gap-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3.5">
                      <div className="flex items-center gap-2 text-[#005864]">
                        <CalendarDays className="h-4 w-4" />
                        <p className="text-sm font-semibold text-[#1C1C1C]">
                          Purchased Date
                        </p>
                      </div>
                      <p className="mt-1.5 pl-6 text-base text-black/70">
                        {formatDate(
                          purchaseDate ?? expert.joinDate ?? expert.createdAt
                        )}
                      </p>
                    </div>

                    <span
                      className={cn(
                        "inline-flex h-9 shrink-0 items-center justify-center rounded-full px-4 text-sm font-semibold text-white shadow-sm",
                        isActive ? "bg-[#16BC4E]" : "bg-[#FF0000]"
                      )}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-slate-100 bg-white p-4 sm:p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-lg font-semibold text-[#1C1C1C]">
                        Advanced Category
                      </p>
                      <span className="rounded-full bg-[#F0F5F6] px-2.5 py-1 text-xs font-semibold text-[#005864]">
                        {categories.length}
                      </span>
                    </div>

                    <div className="max-h-[240px] overflow-y-auto pr-1">
                      {categories.length ? (
                        <div className="flex flex-wrap gap-2.5">
                          {categories.map((category, index) => (
                            <span
                              key={category._id ?? `${category.name}-${index}`}
                              className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#005864] px-4 py-2 text-sm font-medium leading-5 text-white shadow-[0_2px_8px_rgba(0,88,100,0.2)] transition hover:bg-[#004850]"
                            >
                              {formatDisplayName(category.name)}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
                          No categories found.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
