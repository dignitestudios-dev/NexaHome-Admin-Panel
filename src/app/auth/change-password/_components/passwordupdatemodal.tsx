"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useEffect } from "react";

interface PasswordUpdatedModalProps {
  open: boolean;
  onClose: () => void;
  onContinue?: () => void;
}

export function PasswordUpdatedModal({
  open,
  onClose,
  onContinue,
}: PasswordUpdatedModalProps) {

  // ✅ Auto close after 5 sec
//   useEffect(() => {
//     if (!open) return;

//     const timer = setTimeout(() => {
//       onClose();
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, [open, onClose]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center rounded-2xl p-8">

        {/* Success Icon */}
        <div className="w-16 h-16 mx-auto rounded-full bg-[#005864] flex items-center justify-center text-white text-2xl">
          ✓
        </div>

        <DialogHeader className="mt-6">
          <DialogTitle className="text-2xl font-semibold">
            Password Updated Successfully
          </DialogTitle>

          <DialogDescription className="text-gray-500 mt-2">
            Your password has been updated successfully. <br />
            You can now log in with your new password.
          </DialogDescription>
        </DialogHeader>

       
        <button
          
          onClick={onClose}
          className="w-full mt-6 h-11 bg-[#005864] text-white rounded-xl"
        >
            <Link href="/auth/login">
          Continue to Login
          </Link>
        </button>

      </DialogContent>
    </Dialog>
  );
}