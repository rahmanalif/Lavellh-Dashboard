import React from "react";
import OverviewStats from "../../../components/dashboardcomponents/OverviewStats";
import { EarningsChart } from "../../../components/dashboardcomponents/EarningsChart";
import RecentTransactions from "../../../components/dashboardcomponents/RecentTransactions";

const DashboardOverview = () => {
  return (
    <div>
      <OverviewStats />
      <EarningsChart />
      <RecentTransactions />
    </div>
  );
};

export default DashboardOverview;
