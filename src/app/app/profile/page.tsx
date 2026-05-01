"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, Mail, CheckCircle2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useMe, useUpdateProfile } from "@/features/auth/auth.hooks";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const MIN_NAME_LENGTH = 8;
const MAX_NAME_LENGTH = 30;
/** Unicode letters, spaces, hyphen, and apostrophe (straight or curly). */
const ALLOWED_FULL_NAME_PATTERN =
  /^[\p{L}]+(?:['\u2019-][\p{L}]+)*(?: [\p{L}]+(?:['\u2019-][\p{L}]+)*)*$/u;
/** Sentence case: John Doe, Mary-Jane, O'Brien */
const SENTENCE_CASE_NAME_PATTERN =
  /^[\p{Lu}][\p{Ll}]*(?:['\u2019-][\p{Lu}]?[\p{Ll}]*)*(?: [\p{Lu}][\p{Ll}]*(?:['\u2019-][\p{Lu}]?[\p{Ll}]*)*)*$/u;
const HTML_OR_SCRIPT_PATTERN = /<[^>]*>|javascript:|on\w+\s*=/i;
const ALLOWED_PROFILE_IMAGE_TYPES = new Set(["image/jpeg", "image/png"]);
const ALLOWED_PROFILE_IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png"]);

function validateProfileImage(file: File): string | null {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (file.type === "image/gif" || extension === "gif") {
    return "Only JPG, JPEG, and PNG image formats are allowed.";
  }

  const hasAllowedType =
    ALLOWED_PROFILE_IMAGE_TYPES.has(file.type) ||
    ALLOWED_PROFILE_IMAGE_EXTENSIONS.has(extension);

  if (!hasAllowedType) {
    return "Only JPG, JPEG, and PNG image formats are allowed.";
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return "Image must be 2MB or smaller.";
  }

  return null;
}

function toSentenceCaseName(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase()
    .replace(/(^|[\s\-'\u2019])(\p{L})/gu, (_, boundary: string, letter: string) => {
      return `${boundary}${letter.toLocaleUpperCase()}`;
    });
}

function getFullNameError(name: string): string {
  const trimmedName = name.trim();

  if (trimmedName.length === 0) {
    return "Full name is required.";
  }

  if (HTML_OR_SCRIPT_PATTERN.test(trimmedName)) {
    return "Full name cannot contain HTML or script content.";
  }

  if (trimmedName.length < MIN_NAME_LENGTH) {
    return `Full name must be at least ${MIN_NAME_LENGTH} characters.`;
  }

  if (trimmedName.length > MAX_NAME_LENGTH) {
    return `Full name must be ${MAX_NAME_LENGTH} characters or less.`;
  }

  if (/\d/.test(trimmedName)) {
    return "Full name cannot contain numbers.";
  }

  if (!ALLOWED_FULL_NAME_PATTERN.test(trimmedName)) {
    return "Only letters, spaces, hyphens, and apostrophes are allowed.";
  }

  if (!SENTENCE_CASE_NAME_PATTERN.test(trimmedName)) {
    return "Use sentence case (e.g. John Doe).";
  }

  return "";
}

function getInitials(name?: string) {
  if (!name) return "NA";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function ProfilePage() {
  const { data: admin, isLoading } = useMe();
  const updateProfile = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [fileError, setFileError] = useState("");
  const [saved, setSaved] = useState(false);

  // Sync form with fetched profile.
  useEffect(() => {
    if (admin) {
      setName(admin.name ?? "");
      setPreviewUrl(admin.profilePicture?.location ?? "");
    }
  }, [admin]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    setSaved(false);
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateProfileImage(file);
    if (validationError) {
      setFileError(validationError);
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    e.target.value = "";
  };

  const nameError = getFullNameError(name);

  const handleNameBlur = () => {
    if (!name.trim()) return;
    const formatted = toSentenceCaseName(name);
    if (formatted !== name) {
      setName(formatted);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedName = toSentenceCaseName(name);
    if (formattedName !== name) {
      setName(formattedName);
    }
    if (getFullNameError(formattedName)) return;

    if (imageFile) {
      const imageValidationError = validateProfileImage(imageFile);
      if (imageValidationError) {
        setFileError(imageValidationError);
        return;
      }
    }

    if (fileError) return;

    const formData = new FormData();
    formData.append("name", formattedName);
    if (imageFile) {
      formData.append("profilePicture", imageFile);
    }

    updateProfile.mutate(formData, {
      onSuccess: () => {
        setImageFile(null);
        setSaved(true);
      },
    });
  };

  return (
    <div className="max-w-full mx-auto">
      <h1 className="text-[28px] font-bold text-[#1A1A1A] mb-6">My Profile</h1>

      <Card className="rounded-[28px] border-none shadow-sm bg-white">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-r from-[#004D54] to-[#00A299]" />

        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit}>
            {/* Avatar + upload */}
            <div className="flex items-end gap-5 -mt-12 mb-8">
              <div className="relative">
                <Avatar className="w-28 h-28 ring-4 ring-white shadow-md">
                  <AvatarImage src={previewUrl} alt={name} />
                  <AvatarFallback className="text-2xl bg-[#00586417] text-[#005864]">
                    {getInitials(name || admin?.name)}
                  </AvatarFallback>
                </Avatar>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 bg-[#005864] text-white p-2 rounded-full shadow-md hover:opacity-90 transition"
                  aria-label="Change photo"
                >
                  <Camera size={16} />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <div className="pb-2">
                <p className="text-lg font-semibold text-[#1A1A1A]">
                  {isLoading ? "Loading..." : admin?.name ?? "Admin"}
                </p>
                <p className="text-sm text-gray-500">{admin?.email}</p>
              </div>
            </div>

            {fileError && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-600 px-4 py-2 rounded-md text-sm mb-4">
                ⚠ {fileError}
              </div>
            )}
            <p className="text-xs text-gray-400 mb-6">
              JPG, JPEG, or PNG only. Maximum size 2MB.
            </p>

            {/* Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label>Full Name</Label>
                  <span className="text-xs text-gray-400">
                    {name.length}/{MAX_NAME_LENGTH}
                  </span>
                </div>
                <Input
                  value={name}
                  maxLength={MAX_NAME_LENGTH}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSaved(false);
                  }}
                  onBlur={handleNameBlur}
                  placeholder="e.g. John Doe"
                  className="h-12 rounded-xl bg-gray-100 focus:bg-white focus:border-[#005864]"
                />
                {nameError && (
                  <p className="text-xs text-red-600 mt-1">⚠ {nameError}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Email</Label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    value={admin?.email ?? ""}
                    readOnly
                    disabled
                    className="h-12 pl-9 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* API error */}
            {updateProfile.isError && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-600 px-4 py-2 rounded-md text-sm mt-6">
                ⚠ {(updateProfile.error as Error)?.message ?? "Update failed."}
              </div>
            )}

            {/* Success */}
            {saved && (
              <div className="flex items-center gap-2 bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-2 rounded-md text-sm mt-6">
                <CheckCircle2 size={16} /> Profile updated successfully.
              </div>
            )}

            <div className="flex justify-end mt-8">
              <Button
                type="submit"
                disabled={updateProfile.isPending || !!nameError || !!fileError}
                className="h-12 px-8 bg-[#005864] hover:opacity-90 active:scale-95 rounded-xl disabled:opacity-60"
              >
                {updateProfile.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" /> Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
