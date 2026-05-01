"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  const handleLogout = () => {
    console.log("Logout confirmed");
    router.push("/auth/login");
    setOpenLogoutModal(false);

    // 👉 your logout logic here
    // e.g. clear token, redirect, etc.
  };

  return (
    <>
      {/* Navbar */}
      <div className="w-full bg-white rounded-2xl px-6 py-6 flex items-center justify-between shadow-sm">
        <div />

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer">
              <Avatar className="w-9 h-9">
                <AvatarImage src="https://i.pravatar.cc/150?img=12" />
                <AvatarFallback>RC</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700">
                Ryan Cooper
              </span>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-[160px] rounded-xl shadow-md"
          >
            <DropdownMenuItem
              onClick={() => setOpenLogoutModal(true)}
              className="cursor-pointer text-red-600"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Logout Confirmation Modal */}
      <Dialog open={openLogoutModal} onOpenChange={setOpenLogoutModal}>
        <DialogContent className="w-[360px] rounded-[16px] p-6 border-none">
          <DialogHeader className="text-center space-y-2">
            <DialogTitle className="text-[20px] font-semibold text-[#181818]">
              Logout
            </DialogTitle>
            <DialogDescription className="text-[14px] text-gray-500">
              Are you sure you want to logout?
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setOpenLogoutModal(false)}
              className="flex-1 py-2 rounded-[10px] bg-gray-200 text-sm font-medium"
            >
              Cancel
            </button>

            <button
              onClick={handleLogout}
              className="flex-1 py-2 rounded-[10px] bg-[#d42d2d] text-white text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
