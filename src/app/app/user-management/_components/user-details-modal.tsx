"use client";

import { useState, type ComponentType } from "react";
import {
  Dialog,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogContent,
  DialogTitle,
  DialogDescription,
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
  Phone,
} from "lucide-react";
import ConfirmActionModal from "@/app/app/_components/confirmation-modal";
import { useToggleUserDeactivate, useUserDetail } from "@/features/users/users.hooks";
import type {
  User,
  UserProfilePicture,
  UserSelectedCategory,
} from "@/features/users/users.types";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import { PortfolioMediaGallery } from "./portfolio-media-gallery";

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

  const { data: userDetail, isLoading: isDetailLoading } = useUserDetail(
    user?._id ?? "",
    user?.role ?? "",
    { enabled: !!user && open }
  );

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
        <DialogContent
          showCloseButton={false}
          className="flex w-[min(920px,calc(100vw-2rem))] max-h-[92vh] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl p-0 sm:max-w-none gap-0"
        >
          <div className="flex h-full flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 shrink-0">
              <DialogHeader className="space-y-0">
                <DialogTitle className="text-[22px] font-semibold text-slate-900">
                  {getModalTitle(user.role)}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Detailed view of user profile and account details
                </DialogDescription>
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
                  {userDetail?.phone && (
                    <InfoCell
                      icon={Phone}
                      label="Phone"
                      value={userDetail.phone}
                    />
                  )}
                </div>
              </div>

              {isDetailLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </div>
              )}

              {userDetail?.stats && (
                <div className="mb-5 overflow-hidden rounded-xl border border-slate-200">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-800">Statistics</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2">
                    {Object.entries(userDetail.stats).map(([key, val]) => (
                      <InfoCell
                        key={key}
                        icon={FileText}
                        label={formatDisplayName(key.replace(/([A-Z])/g, ' $1').trim())}
                        value={String(val)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {userDetail && (
                <div className="mb-5 overflow-hidden rounded-xl border border-slate-200">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-800">Additional Info</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2">
                    {userDetail.isEmailVerified !== undefined && <InfoCell icon={CheckCircle2} label="Email Verified" value={userDetail.isEmailVerified ? "Yes" : "No"} />}
                    {userDetail.isPhoneVerified !== undefined && <InfoCell icon={CheckCircle2} label="Phone Verified" value={userDetail.isPhoneVerified ? "Yes" : "No"} />}
                    {userDetail.isProfileCompleted !== undefined && <InfoCell icon={CheckCircle2} label="Profile Completed" value={userDetail.isProfileCompleted ? "Yes" : "No"} />}

                    {(userDetail.companyName || user.companyName) && <InfoCell icon={FileText} label="Company Name" value={userDetail.companyName || user.companyName || "—"} />}
                    {userDetail.contactEmail && <InfoCell icon={Mail} label="Contact Email" value={userDetail.contactEmail} />}
                    {userDetail.identityStatus && <InfoCell icon={Shield} label="Identity Status" value={userDetail.identityStatus} />}
                    {userDetail.averageRating !== undefined && <InfoCell icon={FileText} label="Average Rating" value={String(userDetail.averageRating)} />}
                    {userDetail.totalReviews !== undefined && <InfoCell icon={FileText} label="Total Reviews" value={String(userDetail.totalReviews)} />}

                    {userDetail.stripeAccountStatus && <InfoCell icon={FileText} label="Stripe Status" value={userDetail.stripeAccountStatus} />}
                    {userDetail.isPartnerApproved !== undefined && <InfoCell icon={CheckCircle2} label="Partner Approved" value={userDetail.isPartnerApproved ? "Yes" : "No"} />}
                    {userDetail.selectedCategories && userDetail.selectedCategories.length > 0 && <InfoCell icon={FileText} label="Categories" value={userDetail.selectedCategories.map((c: any) => c.name).join(", ")} />}
                  </div>
                </div>
              )}

              {userDetail?.documents && Object.keys(userDetail.documents).length > 0 && (
                (() => {
                  const validDocs = Object.entries(userDetail.documents).filter(
                    ([_, doc]: any) => doc && (doc.location || doc.front || doc.back)
                  );
                  return (
                    <div className="mb-5 overflow-hidden rounded-xl border border-slate-200">
                      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                        <h3 className="text-sm font-semibold text-slate-800">Documents</h3>
                      </div>
                      {validDocs.length === 0 ? (
                        <div className="p-6 text-center text-[14px] text-slate-500 bg-slate-50/50">
                          Docs not provided
                        </div>
                      ) : (
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {validDocs.map(([key, doc]: any) => {
                            if (doc.front || doc.back) {
                              return (
                                <div key={key} className="flex flex-col gap-2 border border-slate-200 rounded p-3 bg-white">
                                  <p className="text-sm font-medium text-slate-800">{formatDisplayName(key.replace(/([A-Z])/g, ' $1').trim())}</p>
                                  {doc.front && <a href={doc.front.location} target="_blank" rel="noreferrer" className="text-[13px] text-[#005864] hover:underline">View Front</a>}
                                  {doc.back && <a href={doc.back.location} target="_blank" rel="noreferrer" className="text-[13px] text-[#005864] hover:underline">View Back</a>}
                                </div>
                              );
                            }
                            return (
                              <div key={key} className="flex flex-col gap-2 border border-slate-200 rounded p-3 bg-white">
                                <p className="text-sm font-medium text-slate-800">{formatDisplayName(key.replace(/([A-Z])/g, ' $1').trim())}</p>
                                <a href={doc.location} target="_blank" rel="noreferrer" className="text-[13px] text-[#005864] hover:underline">View Document</a>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })()
              )}

              {userDetail?.portfolioMedia && userDetail.portfolioMedia.length > 0 && (
                <div className="mb-5 overflow-hidden rounded-xl border border-slate-200">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-800">Portfolio</h3>
                    <span className="text-xs text-slate-500 font-medium">
                      {userDetail.portfolioMedia.length} {userDetail.portfolioMedia.length === 1 ? "item" : "items"}
                    </span>
                  </div>
                  <div className="p-4">
                    <PortfolioMediaGallery mediaList={userDetail.portfolioMedia} />
                  </div>
                </div>
              )}

              {userDetail?.addresses?.length > 0 && (
                <div className="mb-5 overflow-hidden rounded-xl border border-slate-200">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-800">Addresses</h3>
                  </div>
                  <div className="p-4 flex flex-col gap-3">
                    {userDetail?.addresses.map((addr: any) => (
                      <div key={addr._id} className="text-[14px] text-slate-800 flex items-center justify-between border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                        <span>{addr.street}, {addr.city}, {addr.state} {addr.zipCode}</span>
                        {addr.isDefault && <span className="text-[11px] uppercase tracking-wider text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Default</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </DialogContent>
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
