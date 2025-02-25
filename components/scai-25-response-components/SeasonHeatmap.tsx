import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export function SeasonHeatmap({
  accords,
  concentration,
}: {
  accords: { accord: { name: string }; percent: number }[];
  concentration: string;
}) {
  const seasonData = [
    {
      season: "Spring",
      intensity: accords.find((a) => a.accord.name === "floral")?.percent || 0,
    },
    {
      season: "Summer",
      intensity: accords.find((a) => a.accord.name === "citrus")?.percent || 0,
    },
    {
      season: "Fall",
      intensity: accords.find((a) => a.accord.name === "woody")?.percent || 0,
    },
    {
      season: "Winter",
      intensity: accords.find((a) => a.accord.name === "amber")?.percent || 0,
    },
  ];

  const chartConfig: ChartConfig = {
    Spring: { label: "Spring", color: "#ff7f0e" },
    Summer: { label: "Summer", color: "#2ca02c" },
    Fall: { label: "Fall", color: "#d62728" },
    Winter: { label: "Winter", color: "#1f77b4" },
  };

  return (
    <Card>
      <CardContent className="p-6">
        <ChartContainer config={chartConfig} className="h-[300px]">
          <BarChart
            accessibilityLayer
            data={seasonData}
            layout="vertical"
            margin={{
              left: 100,
              right: 10,
              top: 10,
              bottom: 10,
            }}
          >
            <YAxis
              dataKey="season"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={90}
            />
            <XAxis dataKey="intensity" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="intensity" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
        <p className="mt-4 text-sm text-muted-foreground">
          {concentration === "high"
            ? "Best for evening wear in cooler seasons"
            : "Versatile daytime usage"}
        </p>
      </CardContent>
    </Card>
  );
}
