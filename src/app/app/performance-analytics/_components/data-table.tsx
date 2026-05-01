"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/global/pagination";
import { useTopCategoriesByExperts } from "@/features/insights/insights.hooks";

type DataTableProps = {
  search?: string;
};

const ITEMS_PER_PAGE = 10;

export default function DataTable({ search = "" }: DataTableProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useTopCategoriesByExperts({
    page,
    limit: ITEMS_PER_PAGE,
    search,
  });

  useEffect(() => {
    setPage(1);
  }, [search]);

  const categories = data?.categories ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handlePrev = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div>
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="rounded-l-3xl">Category</TableHead>
              <TableHead className="text-right rounded-r-3xl">
                Experts Signed Up
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
                    <span className="ml-2">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center text-red-600">
                  {(error as Error)?.message ??
                    "Failed to load categories by experts."}
                </TableCell>
              </TableRow>
            ) : categories.length ? (
              categories.map((item) => (
                <TableRow key={item.categoryId}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {item.expertsCount}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && !isError && categories.length > 0 && (
        <Pagination
          currentPage={data?.page ?? page}
          totalPages={totalPages}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
