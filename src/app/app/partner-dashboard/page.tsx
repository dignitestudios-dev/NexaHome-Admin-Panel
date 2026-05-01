import { Suspense } from "react";
import PartnerDashboard from "./_components/PartnerDashboard";

const PartnerDashboardPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PartnerDashboard />
    </Suspense>
  );
};

export default PartnerDashboardPage;
