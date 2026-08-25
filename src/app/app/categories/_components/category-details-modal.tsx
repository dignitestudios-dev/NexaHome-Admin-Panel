"use client";

import type { ComponentType, ReactNode } from "react";
import {
  Dialog,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, FileText, ImageIcon, X } from "lucide-react";
import { useCategory } from "@/features/categories/categories.hooks";
import type { Category } from "@/features/categories/categories.types";
import { formatDate } from "@/lib/date";

type CategoryDetailsModalProps = {
  open: boolean;
  categoryId: string | null;
  preview?: Category | null;
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

function InfoCell({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-start gap-3 border-b border-r border-slate-200 p-4 ${className ?? ""}`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
      <div className="min-w-0">
        <p className="text-[13px] text-slate-500">{label}</p>
        <div className="mt-0.5 break-all text-[14px] font-medium text-slate-900">
          {value}
        </div>
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-4 py-3 last:border-b-0">
      <span className="shrink-0 text-[13px] text-slate-500">{label}</span>
      <span className="break-all text-right text-[13px] font-medium text-slate-800">
        {value}
      </span>
    </div>
  );
}

export function CategoryDetailsModal({
  open,
  categoryId,
  preview,
  onClose,
}: CategoryDetailsModalProps) {
  const { data: fetchedCategory, isLoading, isError } = useCategory(
    categoryId ?? "",
    open && Boolean(categoryId)
  );

  const category = fetchedCategory ?? preview ?? null;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogPortal>
        <DialogOverlay />

        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 flex w-[min(760px,calc(100vw-2rem))] max-h-[92vh] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <DialogHeader className="space-y-0">
              <DialogTitle className="text-[22px] font-semibold text-slate-900">
                Category Details
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

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {isLoading && !category ? (
              <div className="flex min-h-[280px] items-center justify-center text-gray-500">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#005864]" />
              </div>
            ) : isError && !category ? (
              <div className="flex min-h-[280px] items-center justify-center text-red-600 text-sm">
                Failed to load category details.
              </div>
            ) : !category ? null : (
              <>
                <div className="mb-5 flex items-center gap-4">
                  <Avatar className="h-20 w-20 rounded-xl">
                    <AvatarImage
                      src={category.icon?.location ?? undefined}
                      alt={category.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="rounded-xl bg-[#005864] text-xl font-semibold text-white">
                      {getInitials(category.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-[24px] font-semibold text-slate-900">
                      {category.name}
                    </h2>
                  
                  </div>
                </div>

                <div className="mb-5 overflow-hidden rounded-xl border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2">
                    <InfoCell
                      icon={DollarSign}
                      label="Dollar Price"
                      value={
                        category.pricing?.dollarPrice != null
                          ? `$${category.pricing?.oneTimeCredits}`
                          : "—"
                      }
                    />
                    <InfoCell
                      icon={DollarSign}
                      label="One Time Credits"
                      value={category.pricing?.oneTimeCredits ?? "—"}
                    />
                    <InfoCell
                      icon={DollarSign}
                      label="Recurring Credits"
                      value={category.pricing?.recurringCredits ?? "—"}
                    />
                    <InfoCell
                      icon={FileText}
                      label="Credits"
                      value={category.credits ?? "—"}
                    />
                    <InfoCell
                      icon={Calendar}
                      label="Created At"
                      value={formatDate(category.createdAt)}
                    />
                    <InfoCell
                      icon={Calendar}
                      label="Updated At"
                      value={formatDate(category.updatedAt)}
                      className="border-b-0 sm:border-r-0"
                    />
                  </div>
                </div>

              
              </>
            )}
          </div>

          <div className="flex items-center justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 min-w-[100px] rounded-lg border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            >
              Close
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
