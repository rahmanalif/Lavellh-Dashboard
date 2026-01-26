import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProviderOverview() {
  const stats = [
    {
      title: "Total Earnings",
      value: "$24.88 K",
    },
    {
      title: "Total Providers",
      value: "740",
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
