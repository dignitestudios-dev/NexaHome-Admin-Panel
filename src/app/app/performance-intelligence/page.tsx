"use client";

import { useState } from "react";

import { Search } from "lucide-react";
import { FaFilter } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/global/search-input";
import JobsDataTable from "./_components/jobs-data-table";
import AreaDataTable from "./_components/area-data-table";
import HomeOwnersDataTable from "./_components/home-owner-data-table";
import ExpertDataTable from "./_components/expert-data-table";
import { AreasFilters } from "./_components/areas-filters";
import { JobsFilters } from "./_components/jobs-filters";



export default function PerformanceIntelligence() {
  const tabs = ["Top Jobs", "Top Areas", "Top Homeowners", "Top Experts"];
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "Top Jobs";
  const [filterOpen, setFilterOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    router.push(`?tab=${tab}`);
  };
    const renderTable = (tab: string) => {
    switch (tab) {
      case "Top Jobs":
        return <div><JobsDataTable /></div>;

      case "Top Areas":
        return <div><AreaDataTable /></div>;

      case "Top Homeowners":
        return <div><HomeOwnersDataTable /></div>;

      case "Top Experts":
        return <div><ExpertDataTable /></div>;

     
    }
  };
  return (
    <div>
      <h1 className="heading">Performance Intelligence</h1>
      <div className="flex justify-between py-4">
        <div
          className="inline-flex items-center bg-white rounded-[10px] p-1 gap-1 shadow-sm"
          
        >
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
        <div className="flex items-center gap-2">
          <SearchInput />
          {activeTab === "Top Areas" && <AreasFilters />}
          {activeTab === "Top Jobs" && <JobsFilters />}
        </div>
      </div>
      {renderTable(activeTab)}
      {/* <Filter open={filterOpen} onClose={() => setFilterOpen(false)} /> */}
    </div>
  );
}
