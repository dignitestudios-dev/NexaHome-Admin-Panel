import React, { Suspense } from "react";
import JobActivity from "./_components/JobActivity";

const JobActivityPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobActivity />
    </Suspense>
  );
};

export default JobActivityPage;
