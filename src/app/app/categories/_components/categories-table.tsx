"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Pencil } from "lucide-react";
import Pagination from "@/components/global/pagination";
import { formatCategoryPricing } from "@/features/categories/categories.api";
import { useCategories } from "@/features/categories/categories.hooks";
import type {
  Category,
  CategoryStatusFilter,
} from "@/features/categories/categories.types";
import { formatDate } from "@/lib/date";
import { CategoryDetailsModal } from "./category-details-modal";
import { EditCategoryModal } from "./edit-category-modal";

type CategoriesTableProps = {
  page: number;
  search: string;
  status?: CategoryStatusFilter;
  onPageChange: (page: number) => void;
};

const ITEMS_PER_PAGE = 10;

const actionButtonClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-full transition";

function getInitials(name?: string) {
  if (!name) return "NA";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export const CategoriesTable = ({
  page,
  search,
  status = "all",
  onPageChange,
}: CategoriesTableProps) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data, isLoading, isError, error } = useCategories({
    page,
    limit: ITEMS_PER_PAGE,
    search: search || undefined,
    status,
  });

  const categories = data?.categories ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  return (
    <>
      <div className="rounded-3xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="font-light">
              <TableHead className="rounded-l-3xl">Name</TableHead>
              <TableHead>Category Pricing</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="rounded-r-3xl text-center">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isError ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-red-600">
                  ⚠ {(error as Error)?.message ?? "Failed to load categories."}
                </TableCell>
              </TableRow>
            ) : isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    <span className="ml-2">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : categories.length ? (
              categories.map((category) => {
                const pricing = formatCategoryPricing(category.pricing);

                return (
                  <TableRow
                    key={category._id}
                    className="font-normal hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10 rounded-lg">
                          <AvatarImage
                            src={category.icon?.location ?? undefined}
                            alt={category.name}
                            className="object-cover"
                          />
                          <AvatarFallback className="rounded-lg bg-[#005864] text-white text-[11px] font-medium">
                            {getInitials(category.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{category.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span>One Time: {pricing.oneTime}</span>
                        <span>Recurring: {pricing.recurring}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(category.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedCategory(category)}
                          className={`${actionButtonClass} bg-[#F0F5F6] text-[#005864] hover:bg-[#e2eced]`}
                          aria-label={`View ${category.name}`}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCategory(category)}
                          className={`${actionButtonClass} bg-[#FFF7ED] text-[#C2410C] hover:bg-[#FFEDD5]`}
                          aria-label={`Edit ${category.name}`}
                        >
                          <Pencil size={17} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && !isError && categories.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}

      <CategoryDetailsModal
        open={!!selectedCategory}
        categoryId={selectedCategory?._id ?? null}
        preview={selectedCategory}
        onClose={() => setSelectedCategory(null)}
      />

      <EditCategoryModal
        open={!!editingCategory}
        category={editingCategory}
        onOpenChange={(open) => {
          if (!open) setEditingCategory(null);
        }}
      />
    </>
  );
};
