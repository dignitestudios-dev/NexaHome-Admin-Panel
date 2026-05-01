"use client";

import { Suspense } from "react";
import AdvertisingManagement from "./_component/AdvertisingManagement";

const AdvertisingManagementPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdvertisingManagement />
    </Suspense>
  );
};

export default AdvertisingManagementPage;
