"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { JobActivityStatus } from "@/features/jobs-activity/jobs-activity.types";
import JobsActivityTable from "./jobs-activity-table";

const tabs = ["Pending", "In-Progress", "Completed"] as const;
type JobActivityTab = (typeof tabs)[number];

const TAB_STATUS_MAP: Record<JobActivityTab, JobActivityStatus> = {
  Pending: "pending",
  "In-Progress": "accepted",
  Completed: "completed",
};

function normalizeTab(tab: string | null): JobActivityTab {
  if (tab === "Open" || tab === "Active") return "Pending";
  if (tabs.includes(tab as JobActivityTab)) return tab as JobActivityTab;
  return "Pending";
}

export default function JobActivity() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = normalizeTab(searchParams.get("tab"));
  const [page, setPage] = useState(1);

  const apiStatus = TAB_STATUS_MAP[activeTab];

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const handleTabChange = (tab: JobActivityTab) => {
    router.push(`?tab=${tab}`);
  };

  return (
    <div>
      <h1 className="heading">Job Activity Monitoring</h1>
      <div className="flex justify-between py-4">
        <div className="inline-flex items-center gap-1 rounded-[10px] bg-white p-1">
          {tabs.map((tab) => (
            <Button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`w-[152px] ${activeTab !== tab && "bg-white text-[#181818CC]"}`}
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>

      <JobsActivityTable
        status={apiStatus}
        page={page}
        onPageChange={setPage}
      />
    </div>
  );
}
