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

export default function CSVDataTable() {

  // ✅ dummy loading
  const [loading] = useState(false);

  // ✅ dummy data
  const jobCategories = [
    { _id: "1", rank: "01", name: "Baby Sitting", email: "baby@example.com", phone: "123-456-7890" },
    { _id: "2", rank: "02", name: "House Cleaning", email: "clean@example.com", phone: "123-456-7890" },
    { _id: "3", rank: "03", name: "Pet Care", email: "pet@example.com", phone: "123-456-7890" },
    { _id: "4", rank: "04", name: "Gardening", email: "garden@example.com", phone: "123-456-7890" },
    { _id: "5", rank: "05", name: "Cooking", email: "cook@example.com", phone: "123-456-7890" },
    { _id: "6", rank: "06", name: "Elderly Care", email: "elderly@example.com", phone: "123-456-7890" },
    { _id: "7", rank: "07", name: "Tutoring", email: "tutor@example.com", phone: "123-456-7890" },
   
  ];

  return (
    <div className="">
     

      <div className=" rounded-3xl overflow-hidden " >
        <Table className="" >

          {/* HEADER */}
          <TableHeader className="  ">
             <TableRow className="" >
   
              <TableHead className=" rounded-l-3xl  ">Name</TableHead>
              <TableHead className="  ">Email</TableHead>
              <TableHead className=" rounded-r-3xl ">Phone</TableHead>
           </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody className="">
            {loading ? (
              <TableRow className="" >
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
            

                  <TableCell className="capitalize" >
                    {category.name}
                  </TableCell>

                  <TableCell>
                    {category.email}
                  </TableCell>

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
      <div className="flex flex-col sm:flex-row items-center justify-between py-4 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm">Items per page:</span>

          <select
            value={10}
            className="border rounded px-2 py-1 text-sm"
          >
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

          <span className="text-sm font-medium">
            Page 1 of 1
          </span>

          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}