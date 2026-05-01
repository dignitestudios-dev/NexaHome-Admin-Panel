"use client";

import { useState, type ComponentType } from "react";
import {
  Dialog,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CheckCircle2,
  FileText,
  Loader2,
  Mail,
  Shield,
  UserX,
  X,
} from "lucide-react";
import ConfirmActionModal from "@/app/app/_components/confirmation-modal";
import { useToggleUserDeactivate } from "@/features/users/users.hooks";
import type {
  User,
  UserProfilePicture,
  UserSelectedCategory,
} from "@/features/users/users.types";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";

type UserDetailsModalProps = {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onUserUpdated: (user: User) => void;
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

function formatRoleLabel(role?: string) {
  if (!role) return "—";
  return role
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function formatDisplayName(value?: string) {
  if (!value?.trim()) return "—";
  return value
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function getModalTitle(role?: string) {
  if (!role) return "User Details";
  return `${formatRoleLabel(role)} Details`;
}

function getCategoryLabel(category: UserSelectedCategory) {
  if (typeof category === "string") return formatDisplayName(category);
  return formatDisplayName(category?.name);
}

function getProfileImageUrl(user: User) {
  if (!user.profilePicture) return undefined;
  if (typeof user.profilePicture === "string") return user.profilePicture;
  return user.profilePicture.location ?? undefined;
}

function getProfilePictureMeta(
  profilePicture: User["profilePicture"]
): UserProfilePicture | null {
  if (!profilePicture || typeof profilePicture === "string") return null;
  return profilePicture;
}

function InfoCell({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 border-b border-r border-slate-200 p-4",
        className
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
      <div className="min-w-0">
        <p className="text-[13px] text-slate-500">{label}</p>
        <p className="mt-0.5 break-all text-[14px] font-medium text-slate-900">
          {value}
        </p>
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

function StatusToggle({
  isActive,
  disabled,
  onToggle,
}: {
  isActive: boolean;
  disabled?: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-3">
      <span
        className={cn(
          "text-[13px] font-medium",
          !isActive ? "text-red-500" : "text-slate-400"
        )}
      >
        Inactive
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isActive}
        aria-label={isActive ? "Deactivate user" : "Activate user"}
        disabled={disabled}
        onClick={onToggle}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60",
          isActive ? "bg-emerald-500" : "bg-slate-300"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform",
            isActive ? "left-[22px]" : "left-0.5"
          )}
        />
      </button>
      <span
        className={cn(
          "text-[13px] font-medium",
          isActive ? "text-emerald-600" : "text-slate-400"
        )}
      >
        Active
      </span>
    </div>
  );
}

export function UserDetailsModal({
  open,
  user,
  onClose,
  onUserUpdated,
}: UserDetailsModalProps) {
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const { mutate: toggleDeactivate, isPending } = useToggleUserDeactivate();

  if (!user) return null;

  const isActive = !user.isDeactivatedByAdmin;
  const status = isActive ? "Active" : "Inactive";
  const profileMeta = getProfilePictureMeta(user.profilePicture);

  const handleToggle = () => {
    const previousUser = user;

    onUserUpdated({
      ...user,
      isDeactivatedByAdmin: !user.isDeactivatedByAdmin,
    });

    toggleDeactivate(
      { userId: user._id, currentUser: previousUser },
      {
        onSuccess: (updatedUser, { currentUser }) => {
          onUserUpdated({ ...currentUser, ...updatedUser, _id: currentUser._id });
          setShowDeactivateConfirm(false);
        },
        onError: () => {
          onUserUpdated(previousUser);
        },
      }
    );
  };

  const handleStatusToggle = () => {
    if (isPending) return;
    if (isActive) {
      setShowDeactivateConfirm(true);
      return;
    }
    handleToggle();
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) onClose();
        }}
      >
        <DialogPortal>
          <DialogOverlay />

          <div className="fixed left-1/2 top-1/2 z-50 flex w-[min(920px,calc(100vw-2rem))] max-h-[92vh] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <DialogHeader className="space-y-0">
                <DialogTitle className="text-[22px] font-semibold text-slate-900">
                  {getModalTitle(user.role)}
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

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* Profile + Status */}
              <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-[72px] w-[72px] ring-2 ring-slate-100">
                    <AvatarImage
                      src={getProfileImageUrl(user)}
                      alt={user.name}
                    />
                    <AvatarFallback className="bg-slate-800 text-lg font-semibold text-white">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-[22px] font-semibold text-slate-900">
                      {formatDisplayName(user.name)}
                    </h2>
                    <span className="mt-1 inline-flex rounded-md bg-sky-50 px-2.5 py-1 text-[12px] font-medium text-sky-700 ring-1 ring-sky-200">
                      {formatRoleLabel(user.role)}
                    </span>
                  </div>
                </div>

                <div
                  className={cn(
                    "flex items-center justify-between gap-4 rounded-xl border px-4 py-3 lg:min-w-[340px]",
                    isActive
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-red-200 bg-red-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {isActive ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <UserX className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <p className="text-[12px] text-slate-500">Account Status</p>
                      <p
                        className={cn(
                          "text-[15px] font-semibold",
                          isActive ? "text-emerald-700" : "text-red-600"
                        )}
                      >
                        {status}
                      </p>
                    </div>
                  </div>

                  {isPending ? (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </div>
                  ) : (
                    <StatusToggle
                      isActive={isActive}
                      disabled={isPending}
                      onToggle={handleStatusToggle}
                    />
                  )}
                </div>
              </div>

              {/* Info Grid */}
              <div className="mb-5 overflow-hidden rounded-xl border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  <InfoCell
                    icon={Calendar}
                    label="Join Date"
                    value={formatDate(user.joinDate)}
                  />
                  <InfoCell
                    icon={Mail}
                    label="Email"
                    value={user.email || "—"}
                  />
                  <InfoCell
                    icon={UserX}
                    label="Deactivated by Admin"
                    value={user.isDeactivatedByAdmin ? "Yes" : "No"}
                  />
                  <InfoCell
                    icon={Shield}
                    label="Role"
                    value={formatRoleLabel(user.role)}
                  />
                </div>
              </div>

            
            </div>

           
          </div>
        </DialogPortal>
      </Dialog>

      <ConfirmActionModal
        open={showDeactivateConfirm}
        type="block"
        userName={formatDisplayName(user.name)}
        isLoading={isPending}
        onClose={() => {
          if (!isPending) setShowDeactivateConfirm(false);
        }}
        onConfirm={handleToggle}
      />
    </>
  );
}
