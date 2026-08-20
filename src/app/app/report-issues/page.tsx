"use client";

import { Suspense } from "react";
import ReportIssues from "./_components/report-issues";

export default function ReportIssuesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReportIssues />
    </Suspense>
  );
}
