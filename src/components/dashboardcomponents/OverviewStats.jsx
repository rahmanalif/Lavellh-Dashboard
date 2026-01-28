import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  fetchDashboardStats,
  selectDashboardProviderStats,
  selectDashboardStatus,
  selectDashboardTotals,
} from "@/store/dashboardStatsSlice";

export default function OverviewStats() {
  const dispatch = useDispatch();
  const status = useSelector(selectDashboardStatus);
  const totals = useSelector(selectDashboardTotals);
  const providerStats = useSelector(selectDashboardProviderStats);
  const year = new Date().getFullYear();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDashboardStats(year));
    }
  }, [dispatch, status, year]);

  const stats = [
    {
      title: "Total Earnings",
      value:
        typeof totals?.totalEarnings === "number"
          ? totals.totalEarnings.toLocaleString()
          : totals?.totalEarnings || "N/A",
    },
    {
      title: "Total Users",
      value:
        typeof totals?.totalUsers === "number"
          ? totals.totalUsers.toLocaleString()
          : totals?.totalUsers || "N/A",
    },
    {
      title: "Total Providers",
      value:
        typeof totals?.totalProviders === "number"
          ? totals.totalProviders.toLocaleString()
          : totals?.totalProviders || "N/A",
    },
  ];

  const businessOwnerCount =
    totals?.totalBusinessOwners ?? totals?.totalBizOwners;
  const eventManagerCount =
    totals?.totalEventManagers ?? totals?.totalEventPlaners;

  const providerStatusStats = [
    {
      title: "Total Business Owners",
      value:
        typeof businessOwnerCount === "number"
          ? businessOwnerCount.toLocaleString()
          : businessOwnerCount ?? "N/A",
    },
    {
      title: "Total Event Managers",
      value:
        typeof eventManagerCount === "number"
          ? eventManagerCount.toLocaleString()
          : eventManagerCount ?? "N/A",
    },
  ];

  return (
    <main className="">
      <div className="grid gap-2 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index} className="border-border shadow-none ">
            <CardHeader className="">
              <CardTitle className="text-2xl font-semibold  text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl text-[#1C5941] font-bold">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-2 md:grid-cols-3 mt-5">
        {providerStatusStats.map((stat, index) => (
          <Card key={index} className="border-border shadow-none ">
            <CardHeader className="">
              <CardTitle className="text-2xl font-semibold  text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl text-[#1C5941] font-bold">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
