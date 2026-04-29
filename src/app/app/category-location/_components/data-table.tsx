import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TopAreaData {
  area: string;
  totalJobs: number;
  demand: number;
}

interface DataTableProps {
  data: TopAreaData[];
}

export function DataTable({ data }: DataTableProps) {
  return (
    <div className="space-y-6">
      {/* Header with View All Link */}
      <div className="flex justify-between items-end">
        <h2 className="text-2xl font-semibold text-[#1A1A1A]">
          Top Areas By Job Activity
        </h2>
        <a href="#" className="text-sm font-semibold text-[#00707E] hover:opacity-80">
          View All
        </a>
      </div>

      {/* Table Container */}
      <div>
        <Table>
          <TableHeader>
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="w-[45%] text-black font-medium text-[13px] pl-4 rounded-l-3xl">
                Area
              </TableHead>
              <TableHead className="w-[30%] text-black font-medium text-[13px]">
                Total Jobs
              </TableHead>
              <TableHead className="w-[25%] text-right text-black font-medium text-[13px] pr-4 rounded-r-3xl">
                Category Demand
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow 
                key={index} 
                className="border-b border-[#F5F5F5] last:border-b-0 hover:bg-gray-50/50"
              >
                <TableCell className="font-medium text-[14px] text-[#1A1A1A] py-5 pl-4">
                  {row.area}
                </TableCell>
                <TableCell className="text-[14px] text-[#1A1A1A] py-5">
                  {row.totalJobs}
                </TableCell>
                <TableCell className="text-right font-bold text-[14px] text-[#1A1A1A] py-5 pr-4">
                  ${row.demand.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}