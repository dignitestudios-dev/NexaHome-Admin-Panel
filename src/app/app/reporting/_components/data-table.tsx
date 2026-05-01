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
      name: "Ali Khan",
      email: "ali.khan@gmail.com",
      joinDate: "12-05-2023",
      jobPost: 12,
      revenueGenerated: 450.0,
    },
    {
      name: "Sara Ahmed",
      email: "sara.ahmed@yahoo.com",
      joinDate: "11-03-2022",
      jobPost: 25,
      revenueGenerated: 980.25,
    },
    {
      name: "Usman Tariq",
      email: "usman.tariq@hotmail.com",
      joinDate: "01-20-2024",
      jobPost: 8,
      revenueGenerated: 210.75,
    },
    {
      name: "Ayesha Malik",
      email: "ayesha.malik@gmail.com",
      joinDate: "07-15-2023",
      jobPost: 18,
      revenueGenerated: 6700.5,
    },
    {
      name: "Bilal Hussain",
      email: "bilal.hussain@outlook.com",
      joinDate: "09-28-2021",
      jobPost: 30,
      revenueGenerated: 1200.0,
    },
    {
      name: "Hina Sheikh",
      email: "hina.sheikh@gmail.com",
      joinDate: "03-10-2022",
      jobPost: 15,
      revenueGenerated: 5400.25,
    },
    {
      name: "Farhan Ali",
      email: "farhan.ali@yahoo.com",
      joinDate: "02-05-2024",
      jobPost: 5,
      revenueGenerated: 150.75,
    },
    {
      name: "Zainab Iqbal",
      email: "zainab.iqbal@gmail.com",
      joinDate: "10-22-2023",
      jobPost: 20,
      revenueGenerated: 720.5,
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
              <TableHead>Email</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Job Post</TableHead>
              <TableHead className=" rounded-r-3xl ">
                Revenue Generated
              </TableHead>
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
              usersData.map((user, index) => (
                <TableRow key={index} className="">
                  <TableCell className="font-medium  ">{user.name}</TableCell>

                  <TableCell className="capitalize">{user.email}</TableCell>

                  <TableCell>{user.joinDate}</TableCell>

                  <TableCell>{user.jobPost}</TableCell>

                  <TableCell>${user.revenueGenerated}</TableCell>
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
