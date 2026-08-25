"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";
import { useCreateCategory } from "@/features/categories/categories.hooks";
import {
  validateCategoryCredits,
  validateCategoryIcon,
  validateCategoryName,
  MAX_CATEGORY_CREDITS_DIGITS,
  MAX_CATEGORY_NAME_LENGTH,
} from "@/features/categories/categories.api";

interface AddCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const initialFormState = {
  name: "",
  oneTimeCredits: "",
  recurringCredits: "",
};

export const AddCategoryModal = ({
  open,
  onOpenChange,
  onSuccess,
}: AddCategoryModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createCategory = useCreateCategory();

  const [formData, setFormData] = useState(initialFormState);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState("");
  const [iconError, setIconError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [showNameError, setShowNameError] = useState(false);
  const [showCreditsError, setShowCreditsError] = useState(false);

  useEffect(() => {
    return () => {
      if (iconPreview.startsWith("blob:")) {
        URL.revokeObjectURL(iconPreview);
      }
    };
  }, [iconPreview]);

  const resetForm = () => {
    setFormData(initialFormState);
    setIconFile(null);
    if (iconPreview.startsWith("blob:")) {
      URL.revokeObjectURL(iconPreview);
    }
    setIconPreview("");
    setIconError("");
    setSubmitError("");
    setShowNameError(false);
    setShowCreditsError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setSubmitError("");
    if (name === "name") {
      setShowNameError(false);
    }
    if (name === "oneTimeCredits" || name === "recurringCredits") {
      setShowCreditsError(false);
      const digitsOnly = value.replace(/\D/g, "").slice(0, MAX_CATEGORY_CREDITS_DIGITS);
      setFormData((prev) => ({
        ...prev,
        [name]: digitsOnly,
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    setIconPreview("");
    setIconError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const nameError =
    showNameError || formData.name.length > MAX_CATEGORY_NAME_LENGTH
      ? validateCategoryName(formData.name)
      : "";

  const oneTimeCreditsError = showCreditsError
    ? validateCategoryCredits(formData.oneTimeCredits)
    : "";
  const recurringCreditsError = showCreditsError
    ? validateCategoryCredits(formData.recurringCredits)
    : "";

  const handleAdd = () => {
    const categoryNameError = validateCategoryName(formData.name);
    if (categoryNameError) {
      setShowNameError(true);
      return;
    }

    const oneTimeError = validateCategoryCredits(formData.oneTimeCredits);
    const recurringError = validateCategoryCredits(formData.recurringCredits);
    if (oneTimeError || recurringError) {
      setShowCreditsError(true);
      return;
    }

    if (!iconFile) {
      setIconError("Category icon is required.");
      return;
    }

    const iconValidationError = validateCategoryIcon(iconFile);
    if (iconValidationError) {
      setIconError(iconValidationError);
      return;
    }

    if (iconError) return;

    setSubmitError("");

    createCategory.mutate(
      {
        name: formData.name.trim(),
        icon: iconFile,
        oneTimeCredits: Number(formData.oneTimeCredits.trim()),
        recurringCredits: Number(formData.recurringCredits.trim()),
      },
      {
        onSuccess: () => {
          onSuccess?.();
          handleClose();
        },
        onError: (error) => {
          setSubmitError(error.message || "Failed to create category.");
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

        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 flex w-[min(560px,calc(100vw-2rem))] max-h-[92vh] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="text-[22px] font-semibold text-slate-900">
                Add Category
              </DialogTitle>
              <p className="text-sm text-slate-500">
                Create a new service category with icon.
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="category-name"
                  className="text-sm font-medium text-slate-700"
                >
                  Category Name <span className="text-red-500">*</span>
                </Label>
                <span className="text-xs text-gray-400">
                  {formData.name.length}/{MAX_CATEGORY_NAME_LENGTH}
                </span>
              </div>
              <Input
                id="category-name"
                type="text"
                name="name"
                value={formData.name}
                maxLength={MAX_CATEGORY_NAME_LENGTH}
                onChange={handleInputChange}
                placeholder="e.g. Air Duct Cleaning"
                disabled={createCategory.isPending}
                className="h-11 rounded-xl border-slate-200 bg-slate-50 text-[15px] focus-visible:ring-[#005864]"
              />
              {nameError ? (
                <p className="text-sm text-red-600">{nameError}</p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="one-time-credits"
                  className="text-sm font-medium text-slate-700"
                >
                  One-Time Credits <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="one-time-credits"
                  type="text"
                  inputMode="numeric"
                  name="oneTimeCredits"
                  maxLength={MAX_CATEGORY_CREDITS_DIGITS}
                  value={formData.oneTimeCredits}
                  onChange={handleInputChange}
                  placeholder="e.g. 50"
                  disabled={createCategory.isPending}
                  className="h-11 rounded-xl border-slate-200 bg-slate-50 text-[15px] focus-visible:ring-[#005864]"
                />
                {oneTimeCreditsError ? (
                  <p className="text-sm text-red-600">{oneTimeCreditsError}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="recurring-credits"
                  className="text-sm font-medium text-slate-700"
                >
                  Recurring Credits <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="recurring-credits"
                  type="text"
                  inputMode="numeric"
                  name="recurringCredits"
                  maxLength={MAX_CATEGORY_CREDITS_DIGITS}
                  value={formData.recurringCredits}
                  onChange={handleInputChange}
                  placeholder="e.g. 100"
                  disabled={createCategory.isPending}
                  className="h-11 rounded-xl border-slate-200 bg-slate-50 text-[15px] focus-visible:ring-[#005864]"
                />
                {recurringCreditsError ? (
                  <p className="text-sm text-red-600">{recurringCreditsError}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Category Icon <span className="text-red-500">*</span>
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
                        disabled={createCategory.isPending}
                        className="h-9 rounded-lg border-[#005864]/20 text-[#005864] hover:bg-[#005864]/5"
                      >
                        <Upload className="mr-1.5 h-4 w-4" />
                        {iconPreview ? "Change Icon" : "Upload Icon"}
                      </Button>
                      {iconPreview ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={removeIcon}
                          disabled={createCategory.isPending}
                          className="h-9 rounded-lg border-red-200 text-red-600 hover:bg-red-50"
                        >
                          Remove
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
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createCategory.isPending}
              className="h-10 min-w-[100px] rounded-lg border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAdd}
              disabled={createCategory.isPending}
              className="h-10 min-w-[130px] rounded-lg bg-[#005864] text-white hover:bg-[#004450]"
            >
              {createCategory.isPending ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </span>
              ) : (
                "Add Category"
              )}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};
