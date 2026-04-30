"use client";

import SearchInput from "@/components/global/search-input";
import {
  TotalPartnersIcon,
  UsersAddedViaReferralIcon,
  JobsPostedViaReferralIcon,
  RevenueViaPartnerIcon,
} from "./_components/referral-icons";
import { ReferralTable } from "./_components/referral-table";
import { ReferralCards } from "./_components/referral-cards";

type ReferralRow = {
  id: number;
  avatar: string;
  partnerName: string;
  referralCode: string;
  usersReferred: string;
  jobsPosted: string;
  revenueGenerated: string;
  onboardedBy: string;
  status: "Active" | "Inactive";
  action: "Approve" | "Reject";
};

const ReferralManagement = () => {
  const cardsData = [
    {
      id: 1,
      title: "Total Partners",
      value: "56,879",
      icon: TotalPartnersIcon,
    },
    {
      id: 2,
      title: "Users Added via Referral",
      value: "56,879",
      icon: UsersAddedViaReferralIcon,
    },
    {
      id: 3,
      title: "Jobs Posted via Referral",
      value: "1,000",
      icon: JobsPostedViaReferralIcon,
    },
    {
      id: 4,
      title: "Revenue via Partner",
      value: "5%",
      icon: RevenueViaPartnerIcon,
    },
  ];

  const referralData: ReferralRow[] = [
    {
      id: 1,
      avatar: "JM",
      partnerName: "Jack Martian",
      referralCode: "REF12345",
      usersReferred: "150",
      jobsPosted: "20",
      revenueGenerated: "$10,000",
      onboardedBy: "Admin",
      status: "Active",
      action: "Approve",
    },
    {
      id: 2,
      avatar: "LH",
      partnerName: "Lila Hudson",
      referralCode: "REF67890",
      usersReferred: "230",
      jobsPosted: "35",
      revenueGenerated: "$15,500",
      onboardedBy: "Manager",
      status: "Active",
      action: "Approve",
    },
    {
      id: 3,
      avatar: "SM",
      partnerName: "Sarah Mitchell",
      referralCode: "REF11111",
      usersReferred: "89",
      jobsPosted: "12",
      revenueGenerated: "$5,200",
      onboardedBy: "Admin",
      status: "Inactive",
      action: "Reject",
    },
  ];

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center py-2">
        <h1 className="heading">Partner & Referral Management</h1>
        <SearchInput />
      </div>

      {/* Cards Section */}
      <ReferralCards cards={cardsData} />

      {/* Table Section */}
      <div className="relative z-10 mt-6">
        <ReferralTable data={referralData} />
      </div>
    </div>
  );
};

export default ReferralManagement;
