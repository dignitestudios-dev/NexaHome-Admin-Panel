"use client";

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
  const usersData = [
    {
      name: "Ali Khan",
      email: "ali.khan@gmail.com",
      joinDate: "2023-05-12",
      jobPost: 12,
      revenueGenerated: 450.00,
    },
    {
      name: "Sara Ahmed",
      email: "sara.ahmed@yahoo.com",
      joinDate: "2022-11-03",
      jobPost: 25,
      revenueGenerated: 980.25,
    },
    {
      name: "Usman Tariq",
      email: "usman.tariq@hotmail.com",
      joinDate: "2024-01-20",
      jobPost: 8,
      revenueGenerated: 210.75,
    },
    {
      name: "Ayesha Malik",
      email: "ayesha.malik@gmail.com",
      joinDate: "2023-07-15",
      jobPost: 18,
      revenueGenerated: 6700.50,
    },
    {
      name: "Bilal Hussain",
      email: "bilal.hussain@outlook.com",
      joinDate: "2021-09-28",
      jobPost: 30,
      revenueGenerated: 1200.00,
    },
    {
      name: "Hina Sheikh",
      email: "hina.sheikh@gmail.com",
      joinDate: "2022-03-10",
      jobPost: 15,
      revenueGenerated: 5400.25,
    },
    {
      name: "Farhan Ali",
      email: "farhan.ali@yahoo.com",
      joinDate: "2024-02-05",
      jobPost: 5,
      revenueGenerated: 150.75,
    },
    {
      name: "Zainab Iqbal",
      email: "zainab.iqbal@gmail.com",
      joinDate: "2023-10-22",
      jobPost: 20,
      revenueGenerated: 720.50,
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
              <TableHead >Email</TableHead>
              <TableHead >Join Date</TableHead>
              <TableHead >Job Post</TableHead>
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
              usersData.map((user) => (
                <TableRow key={user.id} className="">
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

        <div className="flex flex-col sm:flex-row items-center justify-between py-4 space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-sm">Items per page:</span>

            <select value={10} className="border rounded px-2 py-1 text-sm">
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>

            <span className="text-sm font-medium">Page 1 of 1</span>

            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
