import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import DailyAdsTable from "./dailyads-table";
import { AdsFilters } from "./ads-filters";
import { Plus } from "lucide-react";

const AdvertisingManagement = () => {
  const tabs = ["Daily Ads", "Weekly Ads", "Monthly Ads", "Admin Ads"];
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "Daily Ads";

  const handleTabChange = (tab: string) => {
    router.push(`?tab=${tab}`);
  };

  const handleCreateAd = () => {
    router.push("/app/advertising-management/create-ad");
  };
  const renderTable = (tab: string) => {
    switch (tab) {
      case "Daily Ads":
        return (
          <div>
            <DailyAdsTable />
          </div>
        );

      case "Weekly Ads":
        return (
          <div>
            <DailyAdsTable />
          </div>
        );

      case "Monthly Ads":
        return (
          <div>
            <DailyAdsTable />
          </div>
        );

      case "Admin Ads":
        return (
          <div>
            <DailyAdsTable />
          </div>
        );
    }
  };

  return (
    <div>
      <div className="flex justify-between py-4">
        <h1 className="heading">Advertising Management</h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleCreateAd}
            variant="default"
            className="w-[141px] h-[48px] rounded-[16px] px-[10px] py-[10px] flex flex-row justify-center items-center gap-[10px] leading-[18px]"
          >
            {" "}
            <span>
              <Plus />
            </span>{" "}
            Create Ad
          </Button>
          <AdsFilters />
        </div>
      </div>
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
      </div>
      {renderTable(activeTab)}
      {/* <Filter open={filterOpen} onClose={() => setFilterOpen(false)} /> */}
    </div>
  );
};

export default AdvertisingManagement;
