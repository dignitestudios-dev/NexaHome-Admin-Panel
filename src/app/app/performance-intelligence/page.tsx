import { Suspense } from "react";
import PerformanceIntelligence from "./_components/PerformanceIntelligence";

const PerformanceIntelligencePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PerformanceIntelligence />
    </Suspense>
  );
};

export default PerformanceIntelligencePage;
