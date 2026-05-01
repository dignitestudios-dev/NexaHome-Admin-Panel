import { Suspense } from "react";
import { PartnerState } from "./_components/partner-state";

const PartnerDashboardPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PartnerState />
    </Suspense>
  );
};

export default PartnerDashboardPage;
