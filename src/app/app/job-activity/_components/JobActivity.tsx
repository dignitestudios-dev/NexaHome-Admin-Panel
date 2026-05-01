"use client";

import { useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

import OpenTable from "./open-table";
import InprogressTable from "./inprogress-table";
import Completed from "./completed";

export default function JobActivity() {
  const tabs = ["Open", "In-Progress", "Completed"];
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "Open";

  const handleTabChange = (tab: string) => {
    router.push(`?tab=${tab}`);
  };
  const renderTable = (tab: string) => {
    switch (tab) {
      case "Open":
        return (
          <div>
            <OpenTable />
          </div>
        );

      case "In-Progress":
        return (
          <div>
            <InprogressTable />
          </div>
        );

      case "Completed":
        return (
          <div>
            <Completed />
          </div>
        );
    }
  };
  return (
    <div>
      <h1 className="heading">Job Activity Monitoring</h1>
      <div className="flex justify-between py-4">
        <div className="inline-flex items-center bg-white rounded-[10px] p-1 gap-1 ">
          {tabs.map((tab, i) => (
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
        {/* <div className="flex items-center gap-2">
          <SearchInput />
          {activeTab === "Top Areas" && <AreasFilters />}
          {activeTab === "Top Jobs" && <JobsFilters />}
        </div> */}
      </div>
      {renderTable(activeTab)}
      {/* <Filter open={filterOpen} onClose={() => setFilterOpen(false)} /> */}
    </div>
  );
}
