import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/global/pagination";

interface TopAreaData {
  area: string;
  totalJobs: number;
  demand: number;
}

interface DataTableProps {
  data: TopAreaData[];
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
}

export function DataTable({
  data,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  isLoading = false,
  isError = false,
  errorMessage,
}: DataTableProps) {
  return (
    <div className="space-y-6">
      {/* Header with View All Link */}
      <div className="flex justify-between items-end">
        <h2 className="text-2xl font-semibold text-[#1A1A1A]">
          Top Areas By Job Activity
        </h2>
      </div>

      {/* Table Container */}
      <div>
        <Table>
          <TableHeader>
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="w-[45%] text-left text-black font-medium text-[13px] rounded-l-3xl">
                Area
              </TableHead>
              <TableHead className="w-[30%] text-center text-black font-medium text-[13px]">
                Total Jobs
              </TableHead>
              <TableHead className="w-[25%] text-center text-black font-medium text-[13px] rounded-r-3xl">
                Revenue Generated
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
                    <span className="ml-2">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-red-600">
                  {errorMessage ?? "Failed to load top locations."}
                </TableCell>
              </TableRow>
            ) : data.length ? (
              data.map((row, index) => (
                <TableRow
                  key={index}
                  className="border-b border-[#F5F5F5] last:border-b-0 hover:bg-gray-50/50"
                >
                  <TableCell className="text-left font-medium text-[14px] text-[#1A1A1A] py-5">
                    {row.area}
                  </TableCell>
                  <TableCell className="text-center text-[14px] text-[#1A1A1A] py-5">
                    {row.totalJobs}
                  </TableCell>
                  <TableCell className="text-center font-bold text-[14px] text-[#1A1A1A] py-5">
                    ${row.demand.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No locations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && !isError && data.length > 0 && totalPages > 1 ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={onPrevPage}
          onNext={onNextPage}
        />
      ) : null}
    </div>
  );
}