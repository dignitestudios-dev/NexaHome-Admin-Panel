"use client";

import React from "react";
import DataTable from "./_components/data-table";
import Stats from "./_components/stats";
import { LeadFilter } from "./_components/lead-filter";

/* ================= PAGE ================= */

export default function LeadPerformancePage() {
  return (
    <div className="min-h-screen font-sans">
      
      {/* Title */}
      <h1 className="heading">
        Lead Performance Analytics
      </h1>

      {/* Stats */}
      <div className="flex flex-wrap gap-6 mb-12 ">
        <Stats/>
      </div>
  

      {/* Section Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-[26px] font-bold text-[#1A1A1A]">
          Experts Signed Up Per Category
        </h2>

        {/* Replaced PerformanceFilter (Dropdown) with LeadFilter (Drawer) */}
        <LeadFilter />
      </div>

      {/* Table */}
      <DataTable/>

    </div>
  );
}