"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchDashboardStats,
  selectDashboardMonthly,
} from "@/store/dashboardStatsSlice";

export function EarningsChart() {
  const dispatch = useDispatch();
  const monthly = useSelector(selectDashboardMonthly);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(`${currentYear}`);

  useEffect(() => {
    dispatch(fetchDashboardStats(Number(selectedYear)));
  }, [dispatch, selectedYear]);

  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const earningsData = useMemo(() => {
    if (Array.isArray(monthly) && monthly.length > 0) {
      if (typeof monthly[0] === "number") {
        return monthLabels.map((label, index) => ({
          month: label,
          earnings: monthly[index] ?? 0,
        }));
      }
      return monthly.map((item, index) => {
        const monthValue = item.month ?? item.label ?? item.name ?? index + 1;
        const monthLabel =
          typeof monthValue === "number"
            ? monthLabels[monthValue - 1] || `M${monthValue}`
            : monthValue;
        const earnings =
          item.earnings ??
          item.total ??
          item.amount ??
          item.value ??
          0;
        return { month: monthLabel, earnings };
      });
    }
    return monthLabels.map((label) => ({ month: label, earnings: 0 }));
  }, [monthly]);

  const chartConfig = {
    earnings: {
      label: "Earnings",
      color: "hsl(160, 60%, 45%)",
    },
  };

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Earnings</CardTitle>
        <Select
          value={selectedYear}
          onValueChange={(value) => setSelectedYear(value)}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[0, 1, 2].map((offset) => {
              const year = `${currentYear - offset}`;
              return (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <BarChart
            data={earningsData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid
              stroke="#808080" // visible light gray color
              strokeDasharray="3 3"
              vertical={false} // only horizontal lines
              strokeWidth={2}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={{ fill: "rgba(0,0,0,0.05)" }} // subtle hover effect
            />
            <Bar
              dataKey="earnings"
              fill="#1C5941"
              radius={[4, 4, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
