"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  JobsPostedViaReferralIcon,
  RevenueViaPartnerIcon,
  UsersAddedViaReferralIcon,
} from "../../referral-management/_components/referral-icons";
import {
  formatPartnerCount,
  formatPartnerRevenue,
} from "@/features/partners/partners.api";
import { usePartnerSummary } from "@/features/partners/partners.hooks";

export function PartnerState() {
  const { data, isLoading } = usePartnerSummary();

  const stats = [
    {
      title: "Total Users Added",
      value: formatPartnerCount(data?.usersAddedViaReferral ?? 0),
      icon: UsersAddedViaReferralIcon,
    },
    {
      title: "Total Jobs Posted",
      value: formatPartnerCount(data?.jobsPostedViaReferral ?? 0),
      icon: JobsPostedViaReferralIcon,
    },
    {
      title: "Revenue Generated",
      value: formatPartnerRevenue(data?.revenueViaReferral ?? 0),
      icon: RevenueViaPartnerIcon,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
      {stats.map((item) => (
        <Card
          key={item.title}
          className="h-[100px] border-none shadow-none rounded-[24px] bg-white flex items-center"
        >
          <CardContent className="p-4 flex items-center gap-4 w-full">
            <div className="bg-[#EAF1F2] w-[68px] h-[68px] rounded-[24px] flex items-center justify-center shrink-0">
              <item.icon />
            </div>

            <div className="flex flex-col justify-center min-w-0">
              <p className="text-[13px] font-medium text-[#333333] whitespace-nowrap overflow-hidden text-ellipsis">
                {item.title}
              </p>
              <h2 className="text-[28px] font-bold text-black leading-none whitespace-nowrap">
                {isLoading ? "..." : item.value}
              </h2>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
