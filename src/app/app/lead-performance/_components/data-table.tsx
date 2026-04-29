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

export default function DataTable() {
  const [loading] = useState(false);

  // ✅ Updated data (category-based like your previous table)
  const categories = [
    { id: "1", category: "Window Cleaning", total: 98, active: 56 },
    { id: "2", category: "Plumbing Services", total: 87, active: 61 },
    { id: "3", category: "Electrical Services", total: 76, active: 49 },
    { id: "4", category: "Handyman Services", total: 65, active: 42 },
    { id: "5", category: "Pest Control", total: 59, active: 38 },
    { id: "6", category: "Appliance Repair", total: 52, active: 33 },
    { id: "7", category: "Roofing Services", total: 48, active: 29 },
    { id: "8", category: "Pressure Washing", total: 41, active: 25 },
    { id: "9", category: "Gutter Services", total: 36, active: 21 },
    { id: "10", category: "Painting Services", total: 30, active: 18 },
  ];

  return (
    <div>
      <div className="overflow-hidden">
        <Table>
          {/* HEADER */}
          <TableHeader>
            <TableRow>
              <TableHead className="rounded-l-3xl">Category</TableHead>
              <TableHead className="text-center">
                Total Experts
              </TableHead>
              <TableHead className="text-right rounded-r-3xl">
                Active Experts
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : categories.length ? (
              categories.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.category}
                  </TableCell>

                  <TableCell className="text-center">
                    {item.total}
                  </TableCell>

                  <TableCell className="text-right font-semibold">
                    {item.active}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}