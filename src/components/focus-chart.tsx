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

interface FocusChartProps {
  tasks: Task[];
}

export default function FocusChart({ tasks }: FocusChartProps) {
  const chartData = useMemo(() => {
    return tasks
      .filter((task) => task.totalFocusTime > 0)
      .map((task) => ({
        name: task.description,
        value: task.totalFocusTime,
        fill: `hsl(var(--chart-${(tasks.indexOf(task) % 5) + 1}))`,
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
