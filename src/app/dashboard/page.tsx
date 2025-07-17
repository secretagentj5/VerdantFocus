
"use client";

import { useEffect, useState } from "react";
import AppHeader from "@/components/app-header";
import FocusChart from "@/components/focus-chart";
import StatsCards from "@/components/stats-cards";
import TaskLists from "@/components/task-lists";
import { useTaskStore } from "@/hooks/use-task-store";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { tasks } = useTaskStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow p-4 sm:p-6 md:p-8 space-y-8">
           <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
            <div className="space-y-8">
               <Skeleton className="h-80" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow p-4 sm:p-6 md:p-8 space-y-8">
        <StatsCards tasks={tasks} />
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <TaskLists />
          </div>
          <div className="space-y-8">
            <FocusChart tasks={tasks} />
          </div>
        </div>
      </main>
    </div>
  );
}
