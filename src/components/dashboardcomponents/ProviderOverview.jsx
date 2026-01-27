import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  fetchDashboardStats,
  selectDashboardStatus,
  selectDashboardTotals,
} from "@/store/dashboardStatsSlice";

export default function ProviderOverview() {
  const dispatch = useDispatch();
  const status = useSelector(selectDashboardStatus);
  const totals = useSelector(selectDashboardTotals);
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
          : totals?.totalEarnings || "—",
    },
    {
      title: "Total Providers",
      value:
        typeof totals?.totalProviders === "number"
          ? totals.totalProviders.toLocaleString()
          : totals?.totalProviders || "—",
    },
  ];

  return (
    <main className="">
      <div className="grid gap-2 md:grid-cols-2">
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
    </main>
  );
}
