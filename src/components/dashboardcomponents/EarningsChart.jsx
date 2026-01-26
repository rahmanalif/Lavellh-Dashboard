"use client";

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

export function EarningsChart() {
  const earningsData = [
    { month: "Jan", earnings: 5000 },
    { month: "Feb", earnings: 2500 },
    { month: "Mar", earnings: 8240 },
    { month: "Apr", earnings: 9000 },
    { month: "May", earnings: 8500 },
    { month: "Jun", earnings: 8800 },
    { month: "Jul", earnings: 9200 },
    { month: "Aug", earnings: 5000 },
    { month: "Sep", earnings: 2800 },
    { month: "Oct", earnings: 8600 },
    { month: "Nov", earnings: 9400 },
    { month: "Dec", earnings: 8700 },
  ];

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
        <Select defaultValue="2025">
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
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
