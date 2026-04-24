"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  return (
    <div className="w-full bg-gray-100 rounded-2xl px-6 py-4 flex items-center justify-between shadow-sm">
      {/* Empty left space (as in design) */}
      <div />

      {/* User */}
      <div className="flex items-center gap-3">
        <Avatar className="w-9 h-9">
          <AvatarImage src="https://i.pravatar.cc/150?img=12" />
          <AvatarFallback>RC</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-gray-700">
          Ryan Cooper
        </span>
      </div>
    </div>
  );
}