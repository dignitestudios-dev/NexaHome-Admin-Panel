"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
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
import {
  ChevronDown,
  ImagePlus,
  Layers,
  Loader2,
  Plus,
  Search,
  Sparkles,
  Tag,
  Upload,
  X,
} from "lucide-react";
import {
  useCategories,
  useCreateCategory,
} from "@/features/categories/categories.hooks";
import type { Category } from "@/features/categories/categories.types";
import {
  validateCategoryCredits,
  validateCategoryIcon,
  validateCategoryName,
  MAX_CATEGORY_CREDITS_DIGITS,
  MAX_CATEGORY_NAME_LENGTH,
} from "@/features/categories/categories.api";
import { cn } from "@/lib/utils";

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

function TagInputEditor({
  label,
  placeholder,
  tags,
  onChange,
  disabled,
  icon: Icon,
  badgeColor = "slate",
}: {
  label: string;
  placeholder: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  badgeColor?: "teal" | "slate" | "sky";
}) {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    if (!tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      onChange([...tags, trimmed]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const badgeStyles = {
    teal: "border-[#005864]/20 bg-[#005864]/5 text-[#005864]",
    slate: "border-slate-200 bg-slate-100 text-slate-700",
    sky: "border-sky-200 bg-sky-50 text-sky-800",
  }[badgeColor];

  return (
    <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Icon className="h-4 w-4 text-[#005864]" />
          {label}
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-100 px-1.5 text-xs font-semibold text-slate-600">
            {tags.length}
          </span>
        </Label>
        {tags.length > 0 ? (
          <button
            type="button"
            onClick={() => onChange([])}
            disabled={disabled}
            className="text-xs text-slate-400 transition hover:text-red-600 disabled:opacity-50"
          >
            Clear all
          </button>
        ) : null}
      </div>

      <div className="flex gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="h-10 flex-1 rounded-lg border-slate-200 bg-slate-50 text-sm focus-visible:ring-[#005864]"
        />
        <Button
          type="button"
          onClick={addTag}
          disabled={disabled || !inputValue.trim()}
          variant="outline"
          className="h-10 rounded-lg border-[#005864]/30 bg-white text-[#005864] hover:bg-[#005864]/5"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </div>

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium",
                badgeStyles
              )}
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(idx)}
                disabled={disabled}
                className="rounded-full p-0.5 opacity-70 transition hover:bg-black/10 hover:opacity-100 disabled:opacity-50"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic">
          No items added yet. Type above and press Enter or click Add.
        </p>
      )}
    </div>
  );
}

function RelatedCategoriesEditor({
  selected,
  onChange,
  disabled,
}: {
  selected: { _id: string; name: string; slug?: string }[];
  onChange: (updated: { _id: string; name: string; slug?: string }[]) => void;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchFilter.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchFilter]);

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useCategories({
      limit: 50,
      search: debouncedSearch || undefined,
      status: "all",
    });

  const allCategories = categoriesData?.categories ?? [];
  const selectedIds = new Set(selected.map((s) => s._id));

  const availableCategories = allCategories.filter(
    (cat) => !selectedIds.has(cat._id)
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (cat: Category) => {
    onChange([
      ...selected,
      {
        _id: cat._id,
        name: cat.name,
        slug: cat.slug,
      },
    ]);
    setSearchFilter("");
  };

  const handleRemove = (idToRemove: string) => {
    onChange(selected.filter((s) => s._id !== idToRemove));
  };

  return (
    <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Layers className="h-4 w-4 text-[#005864]" />
          Related Categories
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-100 px-1.5 text-xs font-semibold text-slate-600">
            {selected.length}
          </span>
        </Label>
        {selected.length > 0 ? (
          <button
            type="button"
            onClick={() => onChange([])}
            disabled={disabled}
            className="text-xs text-slate-400 transition hover:text-red-600 disabled:opacity-50"
          >
            Clear all
          </button>
        ) : null}
      </div>

      <div className="relative" ref={dropdownRef}>
        <div
          onClick={() => {
            if (!disabled) setIsOpen((prev) => !prev);
          }}
          className={cn(
            "flex h-10 w-full cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 transition hover:bg-slate-100/70",
            disabled && "cursor-not-allowed opacity-60"
          )}
        >
          <span className="text-slate-500">
            {availableCategories.length > 0
              ? "Select categories to relate..."
              : "Click to search and select categories..."}
          </span>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </div>

        {isOpen && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
            <div className="sticky top-0 mb-2 bg-white pb-1">
              <Input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search categories (queries backend)..."
                className="h-8 rounded-lg border-slate-200 bg-slate-50 text-xs focus-visible:ring-[#005864]"
                autoFocus
              />
            </div>
            {isLoadingCategories ? (
              <div className="flex items-center justify-center py-4 text-xs text-slate-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#005864]" />
                Searching categories...
              </div>
            ) : availableCategories.length > 0 ? (
              <div className="space-y-1">
                {availableCategories.map((cat) => (
                  <button
                    key={cat._id}
                    type="button"
                    onClick={() => handleSelect(cat)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-slate-800 transition hover:bg-[#005864]/10 hover:text-[#005864]"
                  >
                    <div>
                      <span className="font-medium">{cat.name}</span>
                      {cat.slug ? (
                        <span className="ml-2 font-mono text-[11px] text-slate-400">
                          #{cat.slug}
                        </span>
                      ) : null}
                    </div>
                    <Plus className="h-4 w-4 text-[#005864]" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-3 text-center text-xs text-slate-400">
                {debouncedSearch
                  ? `No categories matching "${debouncedSearch}"`
                  : "No additional categories available"}
              </div>
            )}
          </div>
        )}
      </div>

      {selected.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
          {selected.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-800">
                  {item.name}
                </p>
                {item.slug ? (
                  <p className="truncate font-mono text-[10px] text-slate-400">
                    {item.slug}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => handleRemove(item._id)}
                disabled={disabled}
                className="ml-2 rounded-md p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                aria-label={`Remove ${item.name}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic">
          No related categories selected.
        </p>
      )}
    </div>
  );
}

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

  // New keys state
  const [primaryPhrases, setPrimaryPhrases] = useState<string[]>([]);
  const [alternateKeywords, setAlternateKeywords] = useState<string[]>([]);
  const [relatedSearchPhrases, setRelatedSearchPhrases] = useState<string[]>([]);
  const [selectedRelatedCategories, setSelectedRelatedCategories] = useState<
    { _id: string; name: string; slug?: string }[]
  >([]);

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
    setPrimaryPhrases([]);
    setAlternateKeywords([]);
    setRelatedSearchPhrases([]);
    setSelectedRelatedCategories([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSubmitError("");
    if (name === "name") {
      if (showNameError && !validateCategoryName(value)) {
        setShowNameError(false);
      }
    }
    if (name === "oneTimeCredits" || name === "recurringCredits") {
      setShowCreditsError(false);
      const digitsOnly = value
        .replace(/\D/g, "")
        .slice(0, MAX_CATEGORY_CREDITS_DIGITS);
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
        primary_phrases: primaryPhrases,
        alternate_keywords: alternateKeywords,
        related_search_phrases: relatedSearchPhrases,
        relatedCategories: selectedRelatedCategories.map((c) => c._id),
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

        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 flex w-[min(680px,calc(100vw-2rem))] max-h-[92vh] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="text-[22px] font-semibold text-slate-900">
                Add Category
              </DialogTitle>
              <p className="text-sm text-slate-500">
                Create a new service category with pricing, keywords, and related categories.
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
                onBlur={() => {
                  if (formData.name.trim()) {
                    setShowNameError(true);
                  }
                }}
                placeholder="e.g. Air Duct Cleaning"
                disabled={createCategory.isPending}
                aria-invalid={!!nameError}
                className={cn(
                  "h-11 rounded-xl bg-slate-50 text-[15px] focus-visible:ring-[#005864]",
                  nameError
                    ? "border-red-300 focus-visible:ring-red-500"
                    : "border-slate-200"
                )}
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
                  <p className="text-sm text-red-600">
                    {recurringCreditsError}
                  </p>
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

            {/* Primary Phrases Editor */}
            <TagInputEditor
              label="Primary Phrases"
              placeholder="e.g. air duct cleaning, vent cleaning"
              tags={primaryPhrases}
              onChange={setPrimaryPhrases}
              disabled={createCategory.isPending}
              icon={Sparkles}
              badgeColor="teal"
            />

            {/* Alternate Keywords Editor */}
            <TagInputEditor
              label="Alternate Keywords"
              placeholder="e.g. indoor air cleaning, ducts, vents"
              tags={alternateKeywords}
              onChange={setAlternateKeywords}
              disabled={createCategory.isPending}
              icon={Tag}
              badgeColor="slate"
            />

            {/* Related Search Phrases Editor */}
            <TagInputEditor
              label="Related Search Phrases"
              placeholder="e.g. air quality, heating and cooling"
              tags={relatedSearchPhrases}
              onChange={setRelatedSearchPhrases}
              disabled={createCategory.isPending}
              icon={Search}
              badgeColor="sky"
            />

            {/* Related Categories Selector */}
            <RelatedCategoriesEditor
              selected={selectedRelatedCategories}
              onChange={setSelectedRelatedCategories}
              disabled={createCategory.isPending}
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
