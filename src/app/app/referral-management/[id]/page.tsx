"use client";
import { useRouter } from "next/navigation";
import { TrackingTable } from "../_components/tracking-table";
import { ArrowLeft } from "lucide-react";
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

const page = () => {
  const router = useRouter();

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

      <div className="flex items-center gap-4 py-2">
        <button
          onClick={() => router.back()}
          className="flex items-center text-[#005864] hover:text-[#004750] transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="heading">Referral Tracking</h1>
      </div>

      {/* Table Section */}
      <div className="relative z-10 mt-6">
        <TrackingTable data={referralData} />
      </div>
    </div>
  );
};

export default page;
