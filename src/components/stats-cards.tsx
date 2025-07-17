"use client";

import { useMemo } from "react";
import { Timer, Coffee, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Task } from "@/types/task";

interface StatsCardsProps {
  tasks: Task[];
}

const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

export default function StatsCards({ tasks }: StatsCardsProps) {
  const stats = useMemo(() => {
    let totalFocusTime = 0;
    let totalPomodoros = 0;

    tasks.forEach((task) => {
      totalFocusTime += task.totalFocusTime;
      totalPomodoros += task.pomodoroSessions;
    });
    
    // Assuming break time is a function of pomodoros. This is an approximation.
    // A more accurate way would be to track it separately.
    const totalBreakTime = tasks.reduce((acc, task) => {
        const shortBreaks = Math.floor(task.pomodoroSessions / 4) * 3;
        const longBreaks = Math.floor(task.pomodoroSessions / 4);
        return acc + (shortBreaks * task.shortBreakDuration * 60) + (longBreaks * task.longBreakDuration * 60);
    }, 0);

    return { totalFocusTime, totalBreakTime, totalPomodoros };
  }, [tasks]);

  return (
    <div className="grid gap-4 md:grid-cols-3 animate-fade-in-up">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Focus Time</CardTitle>
          <Timer className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatTime(stats.totalFocusTime)}
          </div>
          <p className="text-xs text-muted-foreground">
            Across all tasks
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Break Time</CardTitle>
          <Coffee className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatTime(stats.totalBreakTime)}
          </div>
           <p className="text-xs text-muted-foreground">
            Estimated from sessions
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sessions Completed</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPomodoros}</div>
           <p className="text-xs text-muted-foreground">
            Pomodoro sessions
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
