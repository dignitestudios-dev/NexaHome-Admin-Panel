"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";
import {
  useCategory,
  useUpdateCategory,
} from "@/features/categories/categories.hooks";
import type { Category } from "@/features/categories/categories.types";
import {
  validateCategoryIcon,
  validateCategoryName,
  validateCategoryCredits,
  MAX_CATEGORY_NAME_LENGTH,
  MAX_CATEGORY_CREDITS_DIGITS,
} from "@/features/categories/categories.api";
import { cn } from "@/lib/utils";

interface EditCategoryModalProps {
  open: boolean;
  category: Category | null;
  onOpenChange: (open: boolean) => void;
}

function CategoryStatusToggle({
  isActive,
  disabled,
  onChange,
}: {
  isActive: boolean;
  disabled?: boolean;
  onChange: (isActive: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#005864]/10 bg-[#F7FAFA] px-5 py-4">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-[#181818]">Category Status</p>
        <p className="text-xs text-[#565656]">
          {isActive
            ? "Category is visible and available for use."
            : "Category is inactive and hidden from use."}
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
          aria-label={isActive ? "Set category inactive" : "Set category active"}
          disabled={disabled}
          onClick={() => onChange(!isActive)}
          className={cn(
            "relative h-8 w-14 shrink-0 rounded-full transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60",
            isActive ? "bg-[#16BC4E]" : "bg-slate-300"
          )}
        >
          <span
            className={cn(
              "absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-150 will-change-transform",
              isActive ? "translate-x-6" : "translate-x-0"
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

export function EditCategoryModal({
  open,
  category,
  onOpenChange,
}: EditCategoryModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateCategory = useUpdateCategory();

  const { data: fetchedCategory, isLoading: isLoadingCategory } = useCategory(
    category?._id ?? "",
    open && Boolean(category?._id)
  );

  const categoryData = fetchedCategory ?? category;
  const categoryId = category?._id ?? "";

  const [name, setName] = useState("");
  const [oneTimeCredits, setOneTimeCredits] = useState("");
  const [recurringCredits, setRecurringCredits] = useState("");
  const [dollarPrice, setDollarPrice] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState("");
  const [iconError, setIconError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [showNameError, setShowNameError] = useState(false);
  const [showCreditsError, setShowCreditsError] = useState(false);

  // Init once when modal opens for a category
  useEffect(() => {
    if (!open || !category) return;

    const currentData = categoryData ?? category;
    setName(currentData.name ?? "");
    setOneTimeCredits(
      currentData.pricing?.oneTimeCredits != null
        ? String(currentData.pricing.oneTimeCredits)
        : currentData.credits != null
        ? String(currentData.credits)
        : ""
    );
    setRecurringCredits(
      currentData.pricing?.recurringCredits != null
        ? String(currentData.pricing.recurringCredits)
        : ""
    );
    setDollarPrice(
      currentData.pricing?.dollarPrice != null
        ? String(currentData.pricing.dollarPrice)
        : ""
    );
    setIsActive(
      currentData.isActive === false || currentData.isActive === "inactive"
        ? false
        : true
    );
    setIconPreview(currentData.icon?.location ?? "");
    setIconFile(null);
    setIconError("");
    setSubmitError("");
    setShowNameError(false);
    setShowCreditsError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, categoryId]);

  useEffect(() => {
    return () => {
      if (iconPreview.startsWith("blob:")) {
        URL.revokeObjectURL(iconPreview);
      }
    };
  }, [iconPreview]);

  const handleClose = () => {
    if (iconPreview.startsWith("blob:")) {
      URL.revokeObjectURL(iconPreview);
    }
    setIconFile(null);
    setIconError("");
    setSubmitError("");
    setShowNameError(false);
    setShowCreditsError(false);
    onOpenChange(false);
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIconError("");
    setSubmitError("");
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateCategoryIcon(file);
    if (validationError) {
      setIconError(validationError);
      e.target.value = "";
      return;
    }

    if (iconPreview.startsWith("blob:")) {
      URL.revokeObjectURL(iconPreview);
    }

    setIconFile(file);
    setIconPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const removeIcon = () => {
    setIconFile(null);
    if (iconPreview.startsWith("blob:")) {
      URL.revokeObjectURL(iconPreview);
    }
    setIconPreview(categoryData?.icon?.location ?? "");
    setIconError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const nameError =
    showNameError || name.length > MAX_CATEGORY_NAME_LENGTH
      ? validateCategoryName(name)
      : "";

  const oneTimeCreditsError = showCreditsError && oneTimeCredits.trim()
    ? validateCategoryCredits(oneTimeCredits)
    : "";
  const recurringCreditsError = showCreditsError && recurringCredits.trim()
    ? validateCategoryCredits(recurringCredits)
    : "";

  const handleSave = () => {
    const categoryNameError = validateCategoryName(name);
    if (categoryNameError) {
      setShowNameError(true);
      return;
    }

    if (!categoryData?._id || iconError) return;

    if (iconFile) {
      const iconValidationError = validateCategoryIcon(iconFile);
      if (iconValidationError) {
        setIconError(iconValidationError);
        return;
      }
    }

    setSubmitError("");

    updateCategory.mutate(
      {
        id: categoryData._id,
        name: name.trim(),
        oneTimeCredits: oneTimeCredits.trim() ? Number(oneTimeCredits.trim()) : undefined,
        recurringCredits: recurringCredits.trim() ? Number(recurringCredits.trim()) : undefined,
        dollarPrice: dollarPrice.trim() ? Number(dollarPrice.trim()) : undefined,
        icon: iconFile ?? undefined,
        isActive,
      },
      {
        onSuccess: () => {
          handleClose();
        },
        onError: (error) => {
          setSubmitError(error.message || "Failed to update category.");
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
        else onOpenChange(true);
      }}
    >
      <DialogPortal>
        <DialogOverlay />

        <div className="fixed left-1/2 top-1/2 z-50 flex w-[min(560px,calc(100vw-2rem))] max-h-[92vh] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="text-[22px] font-semibold text-slate-900">
                Edit Category
              </DialogTitle>
              <p className="text-sm text-slate-500">
                Update category name, status, or icon.
              </p>
            </DialogHeader>
            <button
              type="button"
              onClick={handleClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            {isLoadingCategory && !categoryData ? (
              <div className="flex min-h-[240px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#005864]" />
              </div>
            ) : (
              <>
                <CategoryStatusToggle
                  isActive={isActive}
                  disabled={isLoadingCategory && !categoryData}
                  onChange={(next) => {
                    setSubmitError("");
                    setIsActive(next);
                  }}
                />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="edit-category-name"
                      className="text-sm font-medium text-slate-700"
                    >
                      Category Name <span className="text-red-500">*</span>
                    </Label>
                    <span className="text-xs text-gray-400">
                      {name.length}/{MAX_CATEGORY_NAME_LENGTH}
                    </span>
                  </div>
                  <Input
                    id="edit-category-name"
                    type="text"
                    value={name}
                    maxLength={MAX_CATEGORY_NAME_LENGTH}
                    onChange={(e) => {
                      setSubmitError("");
                      setShowNameError(false);
                      setName(e.target.value);
                    }}
                    placeholder="e.g. Air Duct Cleaning"
                    disabled={updateCategory.isPending}
                    className="h-11 rounded-xl border-slate-200 bg-slate-50 text-[15px] focus-visible:ring-[#005864]"
                  />
                  {nameError ? (
                    <p className="text-sm text-red-600">{nameError}</p>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-one-time-credits"
                      className="text-sm font-medium text-slate-700"
                    >
                      One-Time Credits
                    </Label>
                    <Input
                      id="edit-one-time-credits"
                      type="text"
                      inputMode="numeric"
                      maxLength={MAX_CATEGORY_CREDITS_DIGITS}
                      value={oneTimeCredits}
                      onChange={(e) => {
                        setSubmitError("");
                        setShowCreditsError(false);
                        setOneTimeCredits(e.target.value.replace(/\D/g, "").slice(0, MAX_CATEGORY_CREDITS_DIGITS));
                      }}
                      placeholder="e.g. 50"
                      disabled={updateCategory.isPending}
                      className="h-11 rounded-xl border-slate-200 bg-slate-50 text-[15px] focus-visible:ring-[#005864]"
                    />
                    {oneTimeCreditsError ? (
                      <p className="text-sm text-red-600">{oneTimeCreditsError}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-recurring-credits"
                      className="text-sm font-medium text-slate-700"
                    >
                      Recurring Credits
                    </Label>
                    <Input
                      id="edit-recurring-credits"
                      type="text"
                      inputMode="numeric"
                      maxLength={MAX_CATEGORY_CREDITS_DIGITS}
                      value={recurringCredits}
                      onChange={(e) => {
                        setSubmitError("");
                        setShowCreditsError(false);
                        setRecurringCredits(e.target.value.replace(/\D/g, "").slice(0, MAX_CATEGORY_CREDITS_DIGITS));
                      }}
                      placeholder="e.g. 100"
                      disabled={updateCategory.isPending}
                      className="h-11 rounded-xl border-slate-200 bg-slate-50 text-[15px] focus-visible:ring-[#005864]"
                    />
                    {recurringCreditsError ? (
                      <p className="text-sm text-red-600">{recurringCreditsError}</p>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="edit-dollar-price"
                    className="text-sm font-medium text-slate-700"
                  >
                    Category Pricing ($)
                  </Label>
                  <Input
                    id="edit-dollar-price"
                    type="text"
                    inputMode="decimal"
                    value={dollarPrice}
                    onChange={(e) => {
                      setSubmitError("");
                      const val = e.target.value.replace(/[^0-9.]/g, "");
                      setDollarPrice(val);
                    }}
                    placeholder="e.g. 29.99"
                    disabled={updateCategory.isPending}
                    className="h-11 rounded-xl border-slate-200 bg-slate-50 text-[15px] focus-visible:ring-[#005864]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Category Icon
                  </Label>
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#005864]/25 bg-white">
                        {iconPreview ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={iconPreview}
                            alt="Category icon preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImagePlus className="h-8 w-8 text-[#005864]/50" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 space-y-2">
                        <p className="text-sm text-slate-600">
                          PNG, JPEG, or WEBP only. Max size 2MB.
                        </p>
                        {iconFile ? (
                          <p className="truncate text-sm font-medium text-slate-800">
                            {iconFile.name}
                          </p>
                        ) : null}
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={updateCategory.isPending}
                            className="h-9 rounded-lg border-[#005864]/20 text-[#005864] hover:bg-[#005864]/5"
                          >
                            <Upload className="mr-1.5 h-4 w-4" />
                            Change Icon
                          </Button>
                          {iconFile ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={removeIcon}
                              disabled={updateCategory.isPending}
                              className="h-9 rounded-lg border-red-200 text-red-600 hover:bg-red-50"
                            >
                              Reset
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleIconChange}
                  />
                  {iconError ? (
                    <p className="text-sm text-red-600">{iconError}</p>
                  ) : null}
                </div>

                {submitError ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {submitError}
                  </div>
                ) : null}
              </>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={updateCategory.isPending}
              className="h-10 min-w-[100px] rounded-lg border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={updateCategory.isPending || isLoadingCategory}
              className="h-10 min-w-[130px] rounded-lg bg-[#005864] text-white hover:bg-[#004450]"
            >
              {updateCategory.isPending ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
