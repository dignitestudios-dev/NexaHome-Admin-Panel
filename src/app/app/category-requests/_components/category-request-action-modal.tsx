"use client";

import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CategoryRequest } from "@/features/category-requests/category-requests.types";

interface CategoryRequestActionModalProps {
  open: boolean;
  request: CategoryRequest | null;
  action: "fulfilled" | "rejected" | null;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function CategoryRequestActionModal({
  open,
  request,
  action,
  isLoading,
  onClose,
  onConfirm,
}: CategoryRequestActionModalProps) {
  if (!request || !action) return null;

  const isFulfill = action === "fulfilled";
  const requesterName = request.user?.name || "this user";

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && !isLoading) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[460px] max-w-[380px] rounded-[20px] p-6 shadow-2xl border-slate-200 gap-0">
        {/* Top Status Icon */}
        <div className="flex justify-center mb-4">
          <div
            className={`w-[48px] h-[48px] rounded-full flex items-center justify-center shadow-xs ${
              isFulfill
                ? "bg-emerald-600 text-white"
                : "bg-[#F01A1A] text-white"
            }`}
          >
            {isFulfill ? (
              <CheckCircle2 size={26} className="text-white" />
            ) : (
              <TriangleAlert size={24} className="text-white" />
            )}
          </div>
        </div>

        {/* Content */}
        <DialogHeader className="space-y-2 text-center mb-6">
          <DialogTitle className="text-[22px] font-bold text-[#181818]">
            {isFulfill ? "Fulfill Request" : "Reject Request"}
          </DialogTitle>

          <DialogDescription className="text-[14px] font-normal text-[#565656] leading-relaxed">
            {isFulfill
              ? `Are you sure you want to mark the category request from ${requesterName} as fulfilled?`
              : `Are you sure you want to reject the category request from ${requesterName}?`}
          </DialogDescription>
        </DialogHeader>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-[#ECECEC] text-[#181818] rounded-[12px] font-semibold text-[13px] hover:bg-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            No, Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-3 text-white rounded-[12px] font-semibold text-[13px] transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              isFulfill
                ? "bg-[#005864] hover:bg-[#004450]"
                : "bg-[#F01A1A] hover:bg-red-700"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Please wait...
              </span>
            ) : isFulfill ? (
              "Yes, Fulfill"
            ) : (
              "Yes, Reject"
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
