"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface MainAccordsChartProps {
  mainAccords: {
    accord: {
      name: string;
      color: string;
    };
    percent: number;
  }[];
  //   mainAccords: TPerfumePopulated["mainAccords"];
}

export function MainAccordsChart({ mainAccords }: MainAccordsChartProps) {
  const chartData = mainAccords.map(({ accord, percent }) => ({
    name: accord.name,
    percent: percent,
    fill: accord.color,
  }));

  const chartConfig: ChartConfig = mainAccords.reduce((config, { accord }) => {
    config[accord.name] = {
      label: accord.name,
      color: accord.color,
    };
    return config;
  }, {} as ChartConfig);

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{
          left: 100,
          right: 10,
          top: 10,
          bottom: 10,
        }}
      >
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          width={90}
        />
        <XAxis dataKey="percent" type="number" hide />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="percent" layout="vertical" radius={5} />
      </BarChart>
    </ChartContainer>
  );
}
