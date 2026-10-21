"use client";

import {
  Dialog,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Mail,
  MessageSquare,
  Phone,
  Shield,
  User,
  X,
} from "lucide-react";
import type { CategoryRequest } from "@/features/category-requests/category-requests.types";
import { getCategoryRequestStatusColor } from "@/features/category-requests/category-requests.api";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";

interface CategoryRequestDetailsModalProps {
  open: boolean;
  request: CategoryRequest | null;
  onClose: () => void;
  onFulfill?: (request: CategoryRequest) => void;
  onReject?: (request: CategoryRequest) => void;
}

function getInitials(name?: string) {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function CategoryRequestDetailsModal({
  open,
  request,
  onClose,
  onFulfill,
  onReject,
}: CategoryRequestDetailsModalProps) {
  if (!request) return null;

  const user = request.user;
  const statusColor = getCategoryRequestStatusColor(request.status);
  const userEmail = user?.email || user?.contactEmail;
  const isPending = request.status === "pending";

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogPortal>
        <DialogOverlay />

        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 flex w-[min(620px,calc(100vw-2rem))] max-h-[92vh] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <DialogHeader className="space-y-0">
              <DialogTitle className="text-[22px] font-semibold text-slate-900">
                Category Request Details
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

          {/* Content */}
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            {/* Overview / User Card */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
              <div className="flex items-center gap-3.5">
                <Avatar className="h-12 w-12 rounded-xl border border-slate-200 bg-white">
                  <AvatarFallback className="rounded-xl bg-[#005864] text-base font-semibold text-white">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-[17px] font-semibold text-slate-900 leading-tight">
                    {user?.name || "Unknown User"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Requested on {formatDate(request.createdAt)}
                  </p>
                </div>
              </div>

              <div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider",
                    statusColor.badge
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", statusColor.dot)} />
                  {request.status}
                </span>
              </div>
            </div>

            {/* Request Message */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#005864]" />
                Request Message
              </h3>
              <p className="text-sm text-slate-800 whitespace-pre-line leading-relaxed rounded-xl bg-slate-50/80 border border-slate-100 p-3.5">
                {request.text || "—"}
              </p>
            </div>

            {/* Requester User Info */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <User className="h-4 w-4 text-[#005864]" />
                Requester Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm pt-1">
                <div className="rounded-lg bg-slate-50 p-3">
                  <span className="text-xs text-slate-500 block mb-0.5">Name</span>
                  <span className="font-medium text-slate-800">
                    {user?.name || "—"}
                  </span>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <span className="text-xs text-slate-500 block mb-0.5">Email</span>
                  <span className="font-medium text-slate-800 flex items-center gap-1.5 truncate">
                    <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{userEmail || "—"}</span>
                  </span>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <span className="text-xs text-slate-500 block mb-0.5">Phone</span>
                  <span className="font-medium text-slate-800 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    {user?.phone || "—"}
                  </span>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <span className="text-xs text-slate-500 block mb-0.5">Role</span>
                  <span className="font-medium text-slate-800 flex items-center gap-1.5 capitalize">
                    <Shield className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    {user?.role || "User"}
                  </span>
                </div>

                {user?.companyName ? (
                  <div className="rounded-lg bg-slate-50 p-3 sm:col-span-2">
                    <span className="text-xs text-slate-500 block mb-0.5">
                      Company
                    </span>
                    <span className="font-medium text-slate-800 flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      {user.companyName}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Timestamps */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>Created: {formatDate(request.createdAt)}</span>
                </div>
                {request.processedAt ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Processed: {formatDate(request.processedAt)}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>Updated: {formatDate(request.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
            <div>
              {isPending && onReject ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onReject(request)}
                  className="h-10 rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <X className="mr-1.5 h-4 w-4" />
                  Reject Request
                </Button>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-10 min-w-[90px] rounded-lg border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              >
                Close
              </Button>
              {isPending && onFulfill ? (
                <Button
                  type="button"
                  onClick={() => onFulfill(request)}
                  className="h-10 rounded-lg bg-[#005864] text-white hover:bg-[#004450]"
                >
                  <Check className="mr-1.5 h-4 w-4" />
                  Fulfill Request
                </Button>
              ) : null}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
