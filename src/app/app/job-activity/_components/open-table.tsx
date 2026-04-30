"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Updated dummy data to match image_f26a76.png
const jobData = [
  {
    _id: "1",
    jobId: "NGTS012",
    category: "Window Cleaning",
    postedBy: { name: "Jack Martian", avatar: "https://github.com/shadcn.png" },
    vendor: { name: "Jack Martian", avatar: "https://github.com/shadcn.png" },
    status: "Inactive",
    date: "56",
  },
  {
    _id: "2",
    jobId: "NGTS012",
    category: "Window Cleaning",
    postedBy: { name: "Jack Martian", avatar: "https://github.com/shadcn.png" },
    vendor: { name: "Jack Martian", avatar: "https://github.com/shadcn.png" },
    status: "Active",
    date: "56",
  },
  {
    _id: "3",
    jobId: "NGTS012",
    category: "Window Cleaning",
    postedBy: { name: "Jack Martian", avatar: "https://github.com/shadcn.png" },
    vendor: { name: "Jack Martian", avatar: "https://github.com/shadcn.png" },
    status: "Active",
    date: "56",
  },
  {
    _id: "4",
    jobId: "NGTS012",
    category: "Window Cleaning",
    postedBy: { name: "Jack Martian", avatar: "https://github.com/shadcn.png" },
    vendor: { name: "Jack Martian", avatar: "https://github.com/shadcn.png" },
    status: "Active",
    date: "56",
  },
];

export default function OpenTable() {
  const [loading] = useState(false);

  return (
    <div className="w-full">
      <div className="rounded-[24px] overflow-hidden">
        <Table>
          {/* HEADER STYLE MATCHING image_f26a76.png */}
          <TableHeader className="border-none">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="py-6 px-6 font-semibold text-[#1A1A1A] rounded-l-3xl">Job ID</TableHead>
              <TableHead className="py-6 font-semibold text-[#1A1A1A]">Job Category</TableHead>
              <TableHead className="py-6 font-semibold text-[#1A1A1A]">Posted By</TableHead>
              <TableHead className="py-6 font-semibold text-[#1A1A1A]">Vendor Assigned</TableHead>
              <TableHead className="py-6 font-semibold text-[#1A1A1A]">Job Status</TableHead>
              <TableHead className="py-6 px-6 font-semibold text-[#1A1A1A] rounded-r-3xl">Date Posted</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                   Loading...
                </TableCell>
              </TableRow>
            ) : jobData.length ? (
              jobData.map((job) => (
                <TableRow key={job._id} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <TableCell className="py-6 px-6 font-medium text-[#1A1A1A]">
                    {job.jobId}
                  </TableCell>

                  <TableCell className="py-6 text-[#1A1A1A]">
                    {job.category}
                  </TableCell>

                  {/* USER CELL WITH AVATAR */}
                  <TableCell className="py-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-teal-100">
                        <AvatarImage src={job.postedBy.avatar} />
                        <AvatarFallback>JM</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-[#1A1A1A]">{job.postedBy.name}</span>
                    </div>
                  </TableCell>

                  {/* VENDOR CELL WITH AVATAR */}
                  <TableCell className="py-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-teal-100">
                        <AvatarImage src={job.vendor.avatar} />
                        <AvatarFallback>JM</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-[#1A1A1A]">{job.vendor.name}</span>
                    </div>
                  </TableCell>

                  {/* CONDITIONAL STATUS COLOR */}
                  <TableCell className="py-6 font-bold">
                    <span className={job.status === "Active" ? "text-[#22C55E]" : "text-[#EF4444]"}>
                      {job.status}
                    </span>
                  </TableCell>

                  <TableCell className="py-6 px-6 text-[#1A1A1A]">
                    {job.date}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION UI */}
      <div className="flex flex-col sm:flex-row items-center justify-between py-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Items per page:</span>
          <select className="border-none bg-gray-100 rounded-lg px-2 py-1 text-sm font-medium">
            <option>10</option>
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-gray-400">Previous</Button>
          <span className="text-sm font-semibold">Page 1 of 1</span>
          <Button variant="ghost" size="sm" className="text-teal-600 font-bold">Next</Button>
        </div>
      </div>
    </div>
  );
}