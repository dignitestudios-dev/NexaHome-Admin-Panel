"use client";

import { ExpertTable } from "./_components/ExpertTable";

export default function VerifiedExpertsPage() {
  return (
    <div className="min-h-screen px-0 font-sans">
      <h1 className="heading text-[#1C1C1C] my-4 tracking-tight">
        Verified Experts
      </h1>

      <div className="relative z-10">
        <ExpertTable />
      </div>
    </div>
  );
}
