"use client";

import Pagination from "@/components/global/pagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

export default function DataTable() {
  const [loading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const totalPages = 5;

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };
  const usersData = [
    {
      id: 1,
      name: "Jack Martian",
      category: "Window Cleaning+",
      date: "09/02/2025",
      status: "Active",
    },
    {
      id: 2,
      name: "Jack Martian",
      category: "Window Cleaning+",
      date: "09/02/2025",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Sarah Johnson",
      category: "Gutter Cleaning+",
      date: "09/03/2025",
      status: "Active",
    },
    {
      id: 4,
      name: "Michael Lee",
      category: "Power Washing+",
      date: "09/04/2025",
      status: "Active",
    },
    {
      id: 5,
      name: "Emily Davis",
      category: "Pressure Washing+",
      date: "09/05/2025",
      status: "Inactive",
    },
    {
      id: 6,
      name: "Chris Brown",
      category: "Roof Cleaning+",
      date: "09/06/2025",
      status: "Active",
    },
    {
      id: 7,
      name: "Laura Wilson",
      category: "Carpet Cleaning+",
      date: "09/07/2025",
      status: "Inactive",
    },
    {
      id: 8,
      name: "Robert Smith",
      category: "Home Cleaning+",
      date: "09/08/2025",
      status: "Active",
    },
    {
      id: 9,
      name: "Jessica Taylor",
      category: "Office Cleaning+",
      date: "09/09/2025",
      status: "Active",
    },
  ];
  const getStatusColor = (status: string) => {
    return status === "Active" ? "text-green-600" : "text-red-500";
  };
  return (
    <div>
      <div className=" rounded-3xl overflow-hidden ">
        <Table className="">
          {/* HEADER */}
          <TableHeader className="  ">
            <TableRow className="">
              <TableHead className=" rounded-l-3xl   ">User Name</TableHead>
              <TableHead className="  ">Category Purchased</TableHead>
              <TableHead className="   ">Purchase Date</TableHead>
              <TableHead className=" rounded-r-3xl ">Status</TableHead>
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody className="">
            {loading ? (
              <TableRow className="">
                <TableCell className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : usersData.length ? (
              usersData.map((user) => (
                <TableRow key={user.id} className="">
                  <TableCell className="font-medium  ">{user.name}</TableCell>

                  <TableCell className="capitalize">{user.category}</TableCell>

                  <TableCell>{user.date}</TableCell>

                  <TableCell
                    className={`font-semibold ${getStatusColor(user.status)}`}
                  >
                    {user.status}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No job categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}
