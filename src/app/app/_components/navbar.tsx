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
import { useRouter, usePathname } from "next/navigation";
import { MapPin, X, Loader2 } from "lucide-react";
import { useMe, useLogout } from "@/features/auth/auth.hooks";
import { useDashboardFilters } from "@/components/global/filter-context";

function getInitials(name?: string) {
  if (!name) return "NA";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const { data: admin, isLoading } = useMe();
  const logout = useLogout();
  const { city, zipCode, setCity, setZipCode, resetFilters } =
    useDashboardFilters();

  const showLocationFilters = pathname.startsWith(
    "/app/performance-intelligence"
  );

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => {
        setOpenLogoutModal(false);
        router.push("/auth/login");
      },
    });
  };

  const hasFilters = Boolean(city || zipCode);

  return (
    <>
      {/* Navbar */}
      <div
        className={`w-full bg-white rounded-2xl px-6 py-4 flex flex-wrap items-center gap-4 shadow-sm ${
          showLocationFilters ? "justify-between" : "justify-end"
        }`}
      >
        {/* City and ZIP Code filters — performance-intelligence only */}
        {showLocationFilters ? (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-[#F4F9F9] border border-[#005864]/10 rounded-xl px-3 py-1.5 text-xs text-gray-600">
              <MapPin className="w-4 h-4 text-[#005864]" />
              <input
                type="text"
                placeholder="Filter by City..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-transparent border-none outline-none text-xs font-medium text-[#181818] placeholder-gray-400 w-32 focus:w-40 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 bg-[#F4F9F9] border border-[#005864]/10 rounded-xl px-3 py-1.5 text-xs text-gray-600">
              <span className="font-bold text-[#005864] text-[11px]">ZIP</span>
              <input
                type="text"
                placeholder="Filter by ZIP Code..."
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="bg-transparent border-none outline-none text-xs font-medium text-[#181818] placeholder-gray-400 w-32 focus:w-40 transition-all"
              />
            </div>

            {hasFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Clear Filters
              </button>
            )}
          </div>
        ) : null}

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer">
              <Avatar className="w-9 h-9">
                <AvatarImage src={admin?.profilePicture?.location} />
                <AvatarFallback>{getInitials(admin?.name)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700">
                {isLoading ? "Loading..." : admin?.name ?? "Admin"}
              </span>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-[180px] rounded-xl shadow-md"
          >
            <DropdownMenuItem
              onClick={() => router.push("/app/profile")}
              className="cursor-pointer"
            >
              View Profile
            </DropdownMenuItem>
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
              disabled={logout.isPending}
              className="flex-1 py-2 rounded-[10px] bg-gray-200 text-sm font-medium disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              onClick={handleLogout}
              disabled={logout.isPending}
              className="flex-1 py-2 rounded-[10px] bg-[#d42d2d] text-white text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {logout.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Logging out...
                </>
              ) : (
                "Logout"
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
