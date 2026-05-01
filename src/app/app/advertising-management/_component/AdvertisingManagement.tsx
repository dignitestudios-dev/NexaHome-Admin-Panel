"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import SearchInput from "@/components/global/search-input";
import DailyAdsTable from "./dailyads-table";
import { AdsFilters } from "./ads-filters";
import {
  ADVERTISEMENT_TABS,
  normalizeAdvertisementTab,
} from "@/features/advertisements/advertisements.api";
import type {
  AdvertisementStatusFilter,
  AdvertisementTab,
} from "@/features/advertisements/advertisements.types";

const AdvertisingManagement = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = normalizeAdvertisementTab(searchParams.get("tab"));
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(
    searchParams.get("search")?.trim() ?? ""
  );
  const [status, setStatus] = useState<AdvertisementStatusFilter>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, debouncedSearch, status]);

  const handleTabChange = (tab: AdvertisementTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`?${params.toString()}`);
  };

  const handleCreateAd = () => {
    router.push("/app/advertising-management/create-ad");
  };

  return (
    <div>
      <div className="flex justify-between py-4">
        <h1 className="heading">Advertising Management</h1>
        <div className="flex items-center gap-2">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search ads"
          />
          <AdsFilters
            value={status}
            onApply={(nextStatus) => setStatus(nextStatus)}
          />
          <Button
            onClick={handleCreateAd}
            variant="default"
            className="w-[141px] h-[48px] rounded-[16px] px-[10px] py-[10px] flex flex-row justify-center items-center gap-[10px] leading-[18px]"
          >
            <span>
              <Plus />
            </span>
            Create Ad
          </Button>
        </div>
      </div>
      <div className="flex justify-between py-4">
        <div className="inline-flex items-center bg-white rounded-[10px] p-1 gap-1">
          {ADVERTISEMENT_TABS.map((tab) => (
            <Button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`w-[152px] ${
                activeTab !== tab.value && "bg-white text-[#181818CC]"
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>
      <DailyAdsTable
        tab={activeTab}
        search={debouncedSearch}
        status={status}
        page={page}
        onPageChange={setPage}
      />
    </div>
  );
};

export default AdvertisingManagement;
