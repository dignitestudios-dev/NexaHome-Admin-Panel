"use client";

import { useEffect, useState } from "react";
import SearchInput from "@/components/global/search-input";
import { UsersTable } from "./_components/users-table";

export default function UserManagementPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

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
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name and email"
        />
      </div>

      <div className="relative z-10">
        <UsersTable search={debouncedSearch} />
      </div>
    </div>
  );
}
