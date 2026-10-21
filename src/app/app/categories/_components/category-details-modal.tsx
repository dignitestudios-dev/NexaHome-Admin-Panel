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
import {
  Calendar,
  DollarSign,
  Layers,
  Pencil,
  Search,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { useCategory } from "@/features/categories/categories.hooks";
import type {
  Category,
  RelatedCategoryItem,
} from "@/features/categories/categories.types";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";

type CategoryDetailsModalProps = {
  open: boolean;
  categoryId: string | null;
  preview?: Category | null;
  onClose: () => void;
  onEdit?: (category: Category) => void;
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

function SectionHeading({
  icon: Icon,
  title,
  count,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  count?: number;
}) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <Icon className="h-4 w-4 text-[#005864]" />
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {count != null ? (
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-100 px-1.5 text-xs font-medium text-slate-600">
          {count}
        </span>
      ) : null}
    </div>
  );
}

export function CategoryDetailsModal({
  open,
  categoryId,
  preview,
  onClose,
  onEdit,
}: CategoryDetailsModalProps) {
  const { data: fetchedCategory, isLoading, isError } = useCategory(
    categoryId ?? "",
    open && Boolean(categoryId)
  );

  const category = fetchedCategory ?? preview ?? null;

  const isActive =
    category?.isActive === true ||
    category?.isActive === "active" ||
    category?.isActive === undefined;

  const primaryPhrases = category?.primary_phrases ?? [];
  const alternateKeywords = category?.alternate_keywords ?? [];
  const relatedSearchPhrases = category?.related_search_phrases ?? [];
  const relatedCategories = (category?.relatedCategories ?? []) as (
    | RelatedCategoryItem
    | string
  )[];

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
          {/* Modal Header */}
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

          {/* Modal Content */}
          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
            {isLoading && !category ? (
              <div className="flex min-h-[280px] items-center justify-center text-gray-500">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#005864]" />
              </div>
            ) : isError && !category ? (
              <div className="flex min-h-[280px] items-center justify-center text-sm text-red-600">
                Failed to load category details.
              </div>
            ) : !category ? null : (
              <>
                {/* Category Header Card */}
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 rounded-xl border border-slate-200 bg-white shadow-xs">
                      <AvatarImage
                        src={category.icon?.location ?? undefined}
                        alt={category.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="rounded-xl bg-[#005864] text-lg font-semibold text-white">
                        {getInitials(category.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h2 className="text-[20px] font-semibold text-slate-900 leading-tight">
                        {category.name}
                      </h2>
                      {category.slug ? (
                        <p className="font-mono text-xs text-slate-500">
                          slug: {category.slug}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider",
                        isActive
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                          : "bg-red-50 text-red-700 ring-1 ring-red-600/20"
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          isActive ? "bg-emerald-600" : "bg-red-600"
                        )}
                      />
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Pricing and Timestamps Grid */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2">
                    <InfoCell
                      icon={DollarSign}
                      label="One Time Credits"
                      value={category.pricing?.oneTimeCredits ?? "—"}
                    />
                    <InfoCell
                      icon={DollarSign}
                      label="Recurring Credits"
                      value={category.pricing?.recurringCredits ?? "—"}
                      className="border-r-0"
                    />
                    <InfoCell
                      icon={Calendar}
                      label="Created At"
                      value={formatDate(category.createdAt)}
                      className="border-b-0"
                    />
                    <InfoCell
                      icon={Calendar}
                      label="Updated At"
                      value={formatDate(category.updatedAt)}
                      className="border-b-0 border-r-0"
                    />
                  </div>
                </div>

                {/* Primary Phrases */}
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <SectionHeading
                    icon={Sparkles}
                    title="Primary Phrases"
                    count={primaryPhrases.length}
                  />
                  {primaryPhrases.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {primaryPhrases.map((phrase, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center rounded-lg border border-[#005864]/20 bg-[#005864]/5 px-3 py-1.5 text-[13px] font-medium text-[#005864]"
                        >
                          {phrase}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      No primary phrases added.
                    </p>
                  )}
                </div>

                {/* Alternate Keywords */}
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <SectionHeading
                    icon={Tag}
                    title="Alternate Keywords"
                    count={alternateKeywords.length}
                  />
                  {alternateKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {alternateKeywords.map((keyword, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-[13px] font-medium text-slate-700"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      No alternate keywords added.
                    </p>
                  )}
                </div>

                {/* Related Search Phrases */}
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <SectionHeading
                    icon={Search}
                    title="Related Search Phrases"
                    count={relatedSearchPhrases.length}
                  />
                  {relatedSearchPhrases.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {relatedSearchPhrases.map((searchPhrase, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-[13px] font-medium text-sky-800"
                        >
                          {searchPhrase}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      No related search phrases added.
                    </p>
                  )}
                </div>

                {/* Related Categories */}
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <SectionHeading
                    icon={Layers}
                    title="Related Categories"
                    count={relatedCategories.length}
                  />
                  {relatedCategories.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2.5 pt-1 sm:grid-cols-2">
                      {relatedCategories.map((item, idx) => {
                        const isObject =
                          typeof item === "object" && item !== null;
                        const catName = isObject
                          ? (item as RelatedCategoryItem).name || "Category"
                          : String(item);
                        const catSlug = isObject
                          ? (item as RelatedCategoryItem).slug
                          : undefined;

                        return (
                          <div
                            key={isObject ? (item as RelatedCategoryItem)._id || idx : idx}
                            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#005864] text-xs font-semibold text-white">
                              {getInitials(catName)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-slate-800">
                                {catName}
                              </p>
                              {catSlug ? (
                                <p className="truncate font-mono text-[11px] text-slate-400">
                                  {catSlug}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      No related categories linked.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 min-w-[100px] rounded-lg border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            >
              Close
            </Button>
            {category && onEdit ? (
              <Button
                type="button"
                onClick={() => onEdit(category)}
                className="h-10 min-w-[130px] rounded-lg bg-[#005864] text-white hover:bg-[#004450]"
              >
                <Pencil className="mr-1.5 h-4 w-4" />
                Edit Category
              </Button>
            ) : null}
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
