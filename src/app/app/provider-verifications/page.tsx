"use client";

import { useEffect, useState } from "react";
import SearchInput from "@/components/global/search-input";
import { ProviderVerificationsTable } from "./_components/provider-verifications-table";
import { ProviderVerificationStatusFilter } from "./_components/provider-verification-status-filter";
import type { ProviderVerificationStatus } from "@/features/provider-verifications/provider-verifications.types";

export default function ProviderVerificationsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<ProviderVerificationStatus>("all");

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
          Provider Verifications
        </h1>
        <div className="flex items-center gap-2">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by name, email, company"
          />
          <ProviderVerificationStatusFilter
            status={status}
            onApply={({ status: nextStatus }) => {
              setStatus(nextStatus);
            }}
          />
        </div>
      </div>

      <div className="relative z-10 mt-6">
        <ProviderVerificationsTable search={debouncedSearch} status={status} />
      </div>
    </div>
  );
}
