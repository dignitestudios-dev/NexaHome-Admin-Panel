"use client";

import { useState } from "react";
import SearchInput from "@/components/global/search-input";
import { PartnersTable } from "../partner-dashboard/_components/partners-table";
import {
  TotalPartnersIcon,
  UsersAddedViaReferralIcon,
  JobsPostedViaReferralIcon,
  RevenueViaPartnerIcon,
} from "./_components/referral-icons";
import { ReferralCards } from "./_components/referral-cards";
import {
  formatPartnerCount,
  formatPartnerRevenue,
} from "@/features/partners/partners.api";
import { usePartnerSummary } from "@/features/partners/partners.hooks";

const ReferralManagement = () => {
  const [search, setSearch] = useState("");
  const { data: summary, isLoading } = usePartnerSummary();

  const cardsData = [
    {
      id: 1,
      title: "Total Partners",
      value: isLoading ? "..." : formatPartnerCount(summary?.totalPartners ?? 0),
      icon: TotalPartnersIcon,
    },
    {
      id: 2,
      title: "Users Added via Referral",
      value: isLoading
        ? "..."
        : formatPartnerCount(summary?.usersAddedViaReferral ?? 0),
      icon: UsersAddedViaReferralIcon,
    },
    {
      id: 3,
      title: "Jobs Posted via Referral",
      value: isLoading
        ? "..."
        : formatPartnerCount(summary?.jobsPostedViaReferral ?? 0),
      icon: JobsPostedViaReferralIcon,
    },
    {
      id: 4,
      title: "Revenue via Partner",
      value: isLoading
        ? "..."
        : formatPartnerRevenue(summary?.revenueViaReferral ?? 0),
      icon: RevenueViaPartnerIcon,
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center py-2">
        <h1 className="heading">Partner & Referral Management</h1>
        <SearchInput value={search} onChange={setSearch} />
      </div>

      <ReferralCards cards={cardsData} />

      <div className="relative z-10 mt-6">
        <PartnersTable search={search} />
      </div>
    </div>
  );
};

export default ReferralManagement;
