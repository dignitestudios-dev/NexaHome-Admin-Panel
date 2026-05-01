"use client";

import { Button } from "@/components/ui/button";
import DataTable from "./data-table";
import { PartnerState } from "./partner-state";
import { useRouter, useSearchParams } from "next/navigation";

const tabs = ["Top Jobs", "Top Homeowners"] as const;
type PartnerDashboardTab = (typeof tabs)[number];

function normalizeTab(tab: string | null): PartnerDashboardTab {
  if (tab === "Top Areas" || tab === "Top Homeowners") return "Top Homeowners";
  if (tab === "Top Jobs") return "Top Jobs";
  return "Top Jobs";
}

export default function PartnerDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = normalizeTab(searchParams.get("tab"));

  const handleTabChange = (tab: PartnerDashboardTab) => {
    router.push(`?tab=${tab}`);
  };
  const renderTable = () => <DataTable activeTab={activeTab} />;
  return (
    <div className="min-h-screen font-sans">
      {/* Title */}
      <h1 className="heading">Partner Dashboard Overview</h1>

      {/* Stats */}

      <PartnerState />

      <h2 className="text-[26px] font-bold text-[#1A1A1A]">
        Category & Experts Insights
      </h2>
      <div className="inline-flex items-center bg-white rounded-[10px] p-1 gap-1 shadow-sm mt-4 mb-6">
        {tabs.map((tab) => (
          <Button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`
            w-[152px] ${activeTab !== tab && "bg-white text-[#181818CC]"}
            
          `}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Table */}
      {renderTable()}
    </div>
  );
}
