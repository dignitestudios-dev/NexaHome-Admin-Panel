"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/global/search-input";
import JobsDataTable from "./jobs-data-table";
import AreaDataTable from "./area-data-table";
import HomeOwnersDataTable from "./home-owner-data-table";
import ExpertDataTable from "./expert-data-table";

export default function PerformanceIntelligence() {
  const tabs = ["Top Jobs", "Top Areas", "Top Homeowners", "Top Experts"];
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "Top Jobs";
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const handleTabChange = (tab: string) => {
    router.push(`?tab=${tab}`);
  };

  const renderTable = (tab: string) => {
    switch (tab) {
      case "Top Jobs":
        return (
          <div>
            <JobsDataTable search={debouncedSearch} />
          </div>
        );

      case "Top Areas":
        return (
          <div>
            <AreaDataTable search={debouncedSearch} />
          </div>
        );

      case "Top Homeowners":
        return (
          <div>
            <HomeOwnersDataTable search={debouncedSearch} />
          </div>
        );

      case "Top Experts":
        return (
          <div>
            <ExpertDataTable search={debouncedSearch} />
          </div>
        );
    }
  };
  return (
    <div>
      <h1 className="heading">Performance Intelligence</h1>
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
        <div className="flex items-center gap-2">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search"
          />
        </div>
      </div>
      {renderTable(activeTab)}
    </div>
  );
}
