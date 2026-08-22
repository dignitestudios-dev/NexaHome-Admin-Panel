"use client";

import { useEffect, useState } from "react";
import SearchInput from "@/components/global/search-input";
import { UsersTable } from "./_components/users-table";
import { UserStatusFilter } from "./_components/user-status-filter";
import type { UserStatusFilter as StatusFilter } from "@/features/users/users.types";
import type { UserTypeFilter as TypeFilter } from "@/features/users/users.types";

const USER_TYPE_TABS: { label: string; value: TypeFilter }[] = [
  // { label: "All Users", value: "all" },
  { label: "Home owner", value: "user" },
  { label: "Service Providers", value: "service-provider" },
  { label: "Partners", value: "partner" },
];

export default function UserManagementPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [userType, setUserType] = useState<TypeFilter>("user");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="min-h-screen bg-[#EAFCFF] px-0 font-sans">
      <div className="flex justify-between items-center my-4">
        <h1 className="heading text-[#1C1C1C] tracking-tight">
          User Management
        </h1>
        <div className="flex items-center gap-2">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by name and email"
          />
          <UserStatusFilter
            status={status}
            onApply={({ status: nextStatus }) => {
              setStatus(nextStatus);
            }}
          />
        </div>
      </div>

      <div className="flex gap-4 border-b border-gray-200 mb-6">
        {USER_TYPE_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setUserType(tab.value)}
            className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
              userType === tab.value
                ? "border-[#005864] text-[#005864]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative z-10">
        <UsersTable search={debouncedSearch} status={status} userType={userType} />
      </div>
    </div>
  );
}
