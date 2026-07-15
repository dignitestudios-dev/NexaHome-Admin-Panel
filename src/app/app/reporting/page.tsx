"use client";

import { Suspense } from "react";
import Reporting from "./_components/Reporting";

export default function ReportingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Reporting />
    </Suspense>
  );
}
