"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
import EditAdModal from "./edit-ad-modal";
import Pagination from "@/components/global/pagination";

export default function DailyAdsTable() {
  // ✅ dummy loading
  const [loading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [page, setPage] = useState<number>(1);
  const totalPages = 5;

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handleEditClick = (ad: any) => {
    console.log("🚀 ~ handleEditClick ~ ad:", ad);
    setSelectedAd(ad);
    setEditModalOpen(true);
  };

  // ✅ dummy data
  const dailyAds = [
    {
      _id: "1",
      rank: "01",
      name: "Lawn Mowing",
      addType: "Standard",
      category: "Home Services",
      targetLocation: "New York, NY",
      duration: "1 month",
      status: "Active",
    },
    {
      _id: "2",
      rank: "02",
      name: "House Cleaning",
      addType: "Premium",
      category: "Home Services",
      targetLocation: "Los Angeles, CA",
      duration: "2 weeks",
      status: "Inactive",
    },
    {
      _id: "3",
      rank: "03",
      name: "Pet Care",
      addType: "Standard",
      category: "Pet Services",
      targetLocation: "Chicago, IL",
      duration: "3 months",
      status: "Active",
    },
    {
      _id: "4",
      rank: "04",
      name: "Gardening",
      addType: "Premium",
      category: "Home Services",
      targetLocation: "Houston, TX",
      duration: "1 month",
      status: "Inactive",
    },
    {
      _id: "5",
      rank: "05",
      name: "Cooking",
      addType: "Standard",
      category: "Food Services",
      targetLocation: "Phoenix, AZ",
      duration: "1 month",
      status: "Active",
    },
  ];

  return (
    <div className="">
      <div className=" rounded-3xl overflow-hidden ">
        <Table className="">
          {/* HEADER */}
          <TableHeader className="  ">
            <TableRow className="">
              <TableHead className=" rounded-l-3xl   ">
                Service Provider
              </TableHead>
              <TableHead className="   ">Add Type</TableHead>
              <TableHead className="  ">Category</TableHead>
              <TableHead>Target Location</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className=" rounded-r-3xl ">Actions</TableHead>
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
            ) : dailyAds.length ? (
              dailyAds.map((ad) => (
                <TableRow key={ad._id} className="">
                  <TableCell className="capitalize">{ad.name}</TableCell>
                  <TableCell>{ad.addType}</TableCell>
                  <TableCell className=" ">{ad.category}</TableCell>
                  <TableCell>{ad.targetLocation}</TableCell>
                  <TableCell>{ad.duration}</TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${
                        ad.status === "Active"
                          ? "text-[#16BC4E]"
                          : "text-[#FF0000]"
                      }`}
                    >
                      {ad.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Ellipsis size={20} />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-[123px]">
                        <DropdownMenuItem onClick={() => handleEditClick(ad)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>Activate</DropdownMenuItem>
                        <DropdownMenuItem>Deactivate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

      {/* Edit Ad Modal */}
      <EditAdModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        adData={selectedAd}
      />

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
