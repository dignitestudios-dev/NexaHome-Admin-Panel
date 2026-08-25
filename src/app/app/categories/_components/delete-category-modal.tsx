"use client";

import {
  Dialog,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, X } from "lucide-react";
import type { Category } from "@/features/categories/categories.types";

interface DeleteCategoryModalProps {
  open: boolean;
  category: Category | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: (categoryId: string) => void;
}

export function DeleteCategoryModal({
  open,
  category,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteCategoryModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 flex w-[min(400px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="flex items-center gap-2 text-[20px] font-semibold text-slate-900">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Delete Category
              </DialogTitle>
            </DialogHeader>
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="px-6 py-5 text-slate-600">
            <p>
              Are you sure you want to delete the category{" "}
              <span className="font-semibold text-slate-900">
                {category?.name}
              </span>
              ?
            </p>
            <p className="mt-2 text-sm text-slate-500">
              This action cannot be undone.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
              className="h-10 min-w-[100px] rounded-lg border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => category && onConfirm(category._id)}
              disabled={isDeleting}
              className="h-10 min-w-[100px] rounded-lg bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </span>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
