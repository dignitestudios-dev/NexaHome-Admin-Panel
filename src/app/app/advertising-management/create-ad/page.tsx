"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import CustomSelect from "@/components/global/custom-select";
import GooglePlacesAutocomplete from "@/components/global/google-places-autocomplete";
import { useCategories } from "@/features/categories/categories.hooks";
import { ADVERTISEMENT_DURATION_OPTIONS } from "@/features/advertisements/advertisements.api";
import { useCreateAdvertisement } from "@/features/advertisements/advertisements.hooks";
import type { AdvertisementDuration } from "@/features/advertisements/advertisements.types";
import type { ParsedGooglePlace } from "@/lib/google-places";

const MAX_AD_MEDIA_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_ZIP_CODE_LENGTH = 10;
const MAX_TARGET_RADIUS_MILES = 600;
const ALLOWED_AD_MEDIA_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
]);
const ALLOWED_AD_MEDIA_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp"]);

function validateAdMediaFile(file: File): string | null {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (file.type === "image/gif" || extension === "gif") {
    return "GIF files are not allowed. Please upload a PNG, JPEG, or WEBP image.";
  }

  const hasAllowedType =
    ALLOWED_AD_MEDIA_TYPES.has(file.type) ||
    ALLOWED_AD_MEDIA_EXTENSIONS.has(extension);

  if (!hasAllowedType) {
    return "Only PNG, JPEG, or WEBP images are allowed.";
  }

  if (file.size > MAX_AD_MEDIA_SIZE_BYTES) {
    return "Image size must be 10MB or less.";
  }

  return null;
}

function validateZipCode(zipCode: string): string | null {
  const trimmed = zipCode.trim();

  if (!trimmed) {
    return "Please enter a zip code.";
  }

  if (trimmed.length > MAX_ZIP_CODE_LENGTH) {
    return `Zip code must be ${MAX_ZIP_CODE_LENGTH} characters or less.`;
  }

  if (!/^\d{5}(-\d{4})?$/.test(trimmed)) {
    return "Please enter a valid zip code.";
  }

  return null;
}

function validateTargetRadiusMiles(value: string): string | null {
  if (!value.trim()) {
    return "Please enter target radius in miles.";
  }

  const radius = Number(value);
  if (Number.isNaN(radius) || radius <= 0) {
    return "Target radius must be a positive number.";
  }

  if (radius > MAX_TARGET_RADIUS_MILES) {
    return `Target radius must be ${MAX_TARGET_RADIUS_MILES} miles or less.`;
  }

  return null;
}

const initialFormState = {
  link: "",
  categoryId: "",
  duration: "" as AdvertisementDuration | "",
  targetRadiusMiles: "",
  street: "",
  address: "",
  state: "",
  city: "",
  country: "",
  zipCode: "",
  lat: "",
  long: "",
};

export default function CreateAdPage() {
  const router = useRouter();
  const createAdvertisement = useCreateAdvertisement();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories({
    page: 1,
    limit: 100,
  });

  const [formData, setFormData] = useState(initialFormState);
  const [locationSearch, setLocationSearch] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState("");
  const [mediaError, setMediaError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const categoryOptions = [...(categoriesData?.categories ?? [])]
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    )
    .map((category) => ({
      label: category.name,
      value: category._id,
    }));

  const durationOptions = ADVERTISEMENT_DURATION_OPTIONS.map((option) => ({
    label: option.label,
    value: option.value,
  }));

  useEffect(() => {
    return () => {
      if (mediaPreview.startsWith("blob:")) {
        URL.revokeObjectURL(mediaPreview);
      }
    };
  }, [mediaPreview]);

  const handleInputChange = (field: string, value: string) => {
    setSubmitError("");
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePlaceSelect = useCallback((place: ParsedGooglePlace) => {
    setSubmitError("");
    setLocationSearch(place.formattedAddress);
    setFormData((prev) => ({
      ...prev,
      street: place.street,
      address: place.address,
      city: place.city,
      state: place.state,
      country: place.country,
      zipCode: place.zipCode,
      lat: place.lat,
      long: place.long,
    }));
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateAdMediaFile(file);
    if (validationError) {
      setMediaError(validationError);
      e.target.value = "";
      return;
    }

    setSubmitError("");
    setMediaError("");
    if (mediaPreview.startsWith("blob:")) {
      URL.revokeObjectURL(mediaPreview);
    }
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const removeMedia = () => {
    if (mediaPreview.startsWith("blob:")) {
      URL.revokeObjectURL(mediaPreview);
    }
    setMediaFile(null);
    setMediaPreview("");
    setMediaError("");
  };

  const validateForm = (): string | null => {
    if (!mediaFile) return "Please upload an ad image.";
    const mediaValidationError = validateAdMediaFile(mediaFile);
    if (mediaValidationError) return mediaValidationError;
    if (!formData.duration) return "Please select duration.";
    if (!formData.categoryId) return "Please select a category.";
    if (!formData.link.trim()) return "Please enter a redirect URL.";

    const radiusError = validateTargetRadiusMiles(formData.targetRadiusMiles);
    if (radiusError) return radiusError;

    if (!formData.street.trim()) return "Please select a location from suggestions.";
    if (!formData.city.trim()) return "Please select a complete location.";
    if (!formData.state.trim()) return "Please select a complete location.";
    if (!formData.country.trim()) return "Please select a complete location.";

    const zipCodeError = validateZipCode(formData.zipCode);
    if (zipCodeError) return zipCodeError;

    if (!formData.lat.trim() || Number.isNaN(Number(formData.lat))) {
      return "Please enter a valid latitude.";
    }
    if (!formData.long.trim() || Number.isNaN(Number(formData.long))) {
      return "Please enter a valid longitude.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    const validationError = validateForm();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    if (!mediaFile || !formData.duration) return;

    try {
      await createAdvertisement.mutateAsync({
        media: mediaFile,
        duration: formData.duration,
        categoryId: formData.categoryId,
        targetRadiusMiles: Number(formData.targetRadiusMiles),
        link: formData.link.trim(),
        addressDetails: {
          street: formData.street.trim(),
          address: formData.address.trim(),
          state: formData.state.trim(),
          city: formData.city.trim(),
          country: formData.country.trim(),
          zipCode: formData.zipCode.trim(),
          lat: Number(formData.lat),
          long: Number(formData.long),
        },
      });
      router.push("/app/advertising-management");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to create advertisement."
      );
    }
  };

  const isSubmitting = createAdvertisement.isPending;

  return (
    <div className="w-full min-h-screen overflow-hidden">
      <div className="flex items-center gap-4 py-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center text-[#005864] hover:text-[#004750] transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="heading">Ad Creation</h1>
      </div>

      <div className="relative z-10 pt-0 w-full h-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex gap-6 p-6">
            <div
              className="bg-white rounded-[24px] p-6 flex-1"
              style={{ minHeight: "531px" }}
            >
              <div className="flex flex-col gap-2 mb-4">
                <Label className="text-sm font-medium text-black">
                  Redirect URL
                </Label>
                <Input
                  type="url"
                  placeholder="https://example.com/promo"
                  value={formData.link}
                  onChange={(e) => handleInputChange("link", e.target.value)}
                  disabled={isSubmitting}
                  className="h-[48px] rounded-[12px] bg-[rgba(244,244,244,0.6)] border-0 px-4"
                />
              </div>

              <div className="flex flex-col gap-2 w-full my-4">
                <Label className="text-[14px] font-medium leading-[18px] text-black">
                  Category Selection
                </Label>
                <CustomSelect
                  value={formData.categoryId}
                  onChange={(val) => handleInputChange("categoryId", val)}
                  options={categoryOptions}
                  placeholder={
                    categoriesLoading ? "Loading categories..." : "Select Category"
                  }
                />
              </div>

              <div className="flex flex-col gap-2 my-4">
                <Label className="text-sm font-medium text-black">Duration</Label>
                <CustomSelect
                  value={formData.duration}
                  onChange={(val) => handleInputChange("duration", val)}
                  options={durationOptions}
                  placeholder="Select Duration"
                />
              </div>

              <div className="flex flex-col gap-2 my-4">
                <Label className="text-sm font-medium text-black">
                  Target Radius (miles)
                </Label>
                <Input
                  type="number"
                  min="1"
                  max={MAX_TARGET_RADIUS_MILES}
                  placeholder="25"
                  value={formData.targetRadiusMiles}
                  onChange={(e) =>
                    handleInputChange("targetRadiusMiles", e.target.value)
                  }
                  disabled={isSubmitting}
                  className="h-[48px] rounded-[12px] bg-[rgba(244,244,244,0.6)] border-0 px-4"
                />
                <p className="text-xs text-[#565656]">
                  Maximum radius: {MAX_TARGET_RADIUS_MILES} miles.
                </p>
              </div>

              <div className="my-4">
                <Label className="text-sm font-medium text-black mb-3 block">
                  Location Targeting
                </Label>
                <GooglePlacesAutocomplete
                  value={locationSearch}
                  onChange={setLocationSearch}
                  onPlaceSelect={handlePlaceSelect}
                  disabled={isSubmitting}
                  placeholder="Search and select a location"
                />
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Street"
                    value={formData.street}
                    onChange={(e) => handleInputChange("street", e.target.value)}
                    disabled={isSubmitting}
                    className="h-[48px] rounded-[12px] bg-[rgba(244,244,244,0.6)] border-0 px-4"
                  />
                  <Input
                    placeholder="Address / Suite"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    disabled={isSubmitting}
                    className="h-[48px] rounded-[12px] bg-[rgba(244,244,244,0.6)] border-0 px-4"
                  />
                  <Input
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    disabled={isSubmitting}
                    className="h-[48px] rounded-[12px] bg-[rgba(244,244,244,0.6)] border-0 px-4"
                  />
                  <Input
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    disabled={isSubmitting}
                    className="h-[48px] rounded-[12px] bg-[rgba(244,244,244,0.6)] border-0 px-4"
                  />
                  <Input
                    placeholder="Country"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    disabled={isSubmitting}
                    className="h-[48px] rounded-[12px] bg-[rgba(244,244,244,0.6)] border-0 px-4"
                  />
                  <Input
                    placeholder="Zip Code"
                    value={formData.zipCode}
                    maxLength={MAX_ZIP_CODE_LENGTH}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                    disabled={isSubmitting}
                    className="h-[48px] rounded-[12px] bg-[rgba(244,244,244,0.6)] border-0 px-4"
                  />
                  <Input
                    type="number"
                    step="any"
                    placeholder="Latitude"
                    value={formData.lat}
                    onChange={(e) => handleInputChange("lat", e.target.value)}
                    disabled={isSubmitting}
                    className="h-[48px] rounded-[12px] bg-[rgba(244,244,244,0.6)] border-0 px-4"
                  />
                  <Input
                    type="number"
                    step="any"
                    placeholder="Longitude"
                    value={formData.long}
                    onChange={(e) => handleInputChange("long", e.target.value)}
                    disabled={isSubmitting}
                    className="h-[48px] rounded-[12px] bg-[rgba(244,244,244,0.6)] border-0 px-4"
                  />
                </div>
              </div>

              {submitError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {submitError}
                </div>
              ) : null}
            </div>

            <div
              className="bg-white rounded-[24px] p-6 flex flex-col gap-4"
              style={{ width: "482px", minHeight: "531px" }}
            >
              <h3 className="text-[22px] font-semibold text-black">Ad Media</h3>
              <p className="text-sm text-[#565656]">
                PNG, JPEG, or WEBP only. Maximum size: 10MB. GIF is not allowed.
              </p>

              {mediaError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {mediaError}
                </div>
              ) : null}
              {mediaPreview ? (
                <div className="relative grid h-[280px] w-full place-items-center overflow-hidden rounded-[7px] border-2 border-solid border-[#D9D9D9] bg-[#FBFBFB]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mediaPreview}
                    alt="Ad preview"
                    className="max-h-full max-w-full object-contain object-center"
                  />
                  <label className="absolute inset-0 cursor-pointer">
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                      onChange={handleImageUpload}
                      disabled={isSubmitting}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <label className="flex min-h-[200px] flex-1 cursor-pointer flex-col items-center justify-center rounded-[7px] border-2 border-dashed border-[#D9D9D9] bg-[#FBFBFB] transition hover:bg-gray-50">
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                    onChange={handleImageUpload}
                    disabled={isSubmitting}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-2 py-8">
                    <Upload size={30.84} className="text-[#959393]" />
                    <span className="text-center text-base font-medium text-black">
                      Click to Upload Or Drag & Drop
                    </span>
                  </div>
                </label>
              )}

              {mediaPreview ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={removeMedia}
                  disabled={isSubmitting}
                  className="h-[40px] rounded-[12px]"
                >
                  <X className="mr-2 h-4 w-4" />
                  Remove Image
                </Button>
              ) : null}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => router.back()}
                  variant="outline"
                  disabled={isSubmitting}
                  className="flex-1 h-[48px] rounded-[12px]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  disabled={isSubmitting || categoriesLoading}
                  className="flex-1 h-[48px] rounded-[12px]"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    "Activate"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
