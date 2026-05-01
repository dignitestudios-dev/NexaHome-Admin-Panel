import { Button } from "@/components/ui/button";
import DataTable from "./_components/data-table";
import { ReportingFilters } from "./_components/reporting-filters";

export default function ReportingPage() {
  return (
    <div>
      <div className="flex items-center justify-between my-6">
        <h1 className="heading">Reporting & Data Export</h1>
        <div className="flex items-center gap-2">
          <Button className="w-[110px] h-[40px]">Export</Button>
          <ReportingFilters />
        </div>
      </div>

      <DataTable />
    </div>
  );
}
