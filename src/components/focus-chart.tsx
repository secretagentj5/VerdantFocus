"use client";

import { useMemo } from "react";
import { Pie, PieChart, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import type { Task } from "@/types/task";

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--chart-6))',
  'hsl(var(--chart-7))',
];

interface FocusChartProps {
  tasks: Task[];
}

export default function FocusChart({ tasks }: FocusChartProps) {
  const chartData = useMemo(() => {
    return tasks
      .filter((task) => task.totalFocusTime > 0)
      .map((task, index) => ({
        name: task.description,
        value: task.totalFocusTime,
        fill: CHART_COLORS[index % CHART_COLORS.length],
      }));
  }, [tasks]);

  const chartConfig = useMemo(() => {
    const config: any = {};
    chartData.forEach(item => {
        config[item.name] = {
            label: item.name,
            color: item.fill,
        }
    });
    return config;
  }, [chartData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Focus Distribution</CardTitle>
        <CardDescription>Time spent on each task</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel formatter={(value) => new Date(value * 1000).toISOString().substr(11, 8)} />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
                stroke="hsl(var(--background))"
              >
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[250px] w-full items-center justify-center text-muted-foreground">
            No focus data available.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
