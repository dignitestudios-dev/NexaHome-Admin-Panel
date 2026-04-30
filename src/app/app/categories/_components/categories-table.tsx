import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type CategoryRow = {
  id: number;
  name: string;
  oneTimePricing: string;
  recurringPricing: string;
  date: string;
  status: "Active" | "Inactive";
};

type CategoriesTableProps = {
  data: CategoryRow[];
};

export const CategoriesTable = ({ data }: CategoriesTableProps) => {
  return (
    <div className="rounded-3xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="font-light">
            <TableHead className="rounded-l-3xl">Name</TableHead>
            <TableHead>Category Pricing</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((category, index) => (
            <TableRow
              key={index}
              className="font-normal cursor-pointer hover:bg-gray-50 transition-colors"
            >
              {/* Name */}
              <TableCell>{category.name}</TableCell>

              {/* Category Pricing */}
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span>One Time: {category.oneTimePricing}</span>
                  <span>Recurring: {category.recurringPricing}</span>
                </div>
              </TableCell>

              {/* Join Date */}
              <TableCell>{category.date}</TableCell>

              {/* Status */}
              <TableCell>
                <span
                  className={`font-medium ${
                    category.status === "Active"
                      ? "text-[#16BC4E]"
                      : "text-[#FF0000]"
                  }`}
                >
                  {category.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
