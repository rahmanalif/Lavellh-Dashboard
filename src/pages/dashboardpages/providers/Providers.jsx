import React from "react";
import ProviderList from "../../../components/dashboardcomponents/ProviderList";
import ProviderOverview from "@/components/dashboardcomponents/ProviderOverview";

const Providers = () => {
  return (
    <div>
      <ProviderOverview />
      <ProviderList />
    </div>
  );
};

export default Providers;
