"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/global/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CSVDataTable() {
  const [page, setPage] = useState<number>(1);
  const totalPages = 5;

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  // ✅ dummy loading
  const [loading] = useState(false);

  // ✅ dummy data
  const jobCategories = [
    {
      _id: "1",
      rank: "01",
      name: "Baby Sitting",
      email: "baby@example.com",
      phone: "123-456-7890",
    },
    {
      _id: "2",
      rank: "02",
      name: "House Cleaning",
      email: "clean@example.com",
      phone: "123-456-7890",
    },
    {
      _id: "3",
      rank: "03",
      name: "Pet Care",
      email: "pet@example.com",
      phone: "123-456-7890",
    },
    {
      _id: "4",
      rank: "04",
      name: "Gardening",
      email: "garden@example.com",
      phone: "123-456-7890",
    },
    {
      _id: "5",
      rank: "05",
      name: "Cooking",
      email: "cook@example.com",
      phone: "123-456-7890",
    },
    {
      _id: "6",
      rank: "06",
      name: "Elderly Care",
      email: "elderly@example.com",
      phone: "123-456-7890",
    },
    {
      _id: "7",
      rank: "07",
      name: "Tutoring",
      email: "tutor@example.com",
      phone: "123-456-7890",
    },
  ];

  return (
    <div className="">
      <div className=" rounded-3xl overflow-hidden ">
        <Table className="">
          {/* HEADER */}
          <TableHeader className="  ">
            <TableRow className="">
              <TableHead className=" rounded-l-3xl  ">Name</TableHead>
              <TableHead className="  ">Email</TableHead>
              <TableHead className=" rounded-r-3xl ">Phone</TableHead>
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
            ) : jobCategories.length ? (
              jobCategories.map((category) => (
                <TableRow key={category._id} className="">
                  <TableCell className="capitalize">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" alt={category.name} />
                        <AvatarFallback className="bg-[#212121] text-white font-medium text-[12px]">
                          {category.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <span>{category.name}</span>
                    </div>
                  </TableCell>

                  <TableCell>{category.email}</TableCell>

                  <TableCell className="font-semibold ">
                    {category.phone}
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
      </div>

      {/* PAGINATION (STATIC UI) */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
}
