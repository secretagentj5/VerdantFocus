"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus } from "lucide-react";

import { useTaskStore } from "@/hooks/use-task-store";
import PomodoroTimer from "@/components/pomodoro-timer";
import TaskDialog from "@/components/task-dialog";
import AppHeader from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Task } from "@/types/task";

export default function Home() {
  const { tasks, updateTask, addFocusTime, addPomodoroSession } = useTaskStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const activeTasks = useMemo(() => tasks.filter((task) => !task.completed), [tasks]);

  useEffect(() => {
    if (isClient && !activeTaskId && activeTasks.length > 0) {
      setActiveTaskId(activeTasks[0].id);
    }
  }, [isClient, activeTaskId, activeTasks]);
  
  const activeTask = useMemo(
    () => tasks.find((task) => task.id === activeTaskId) || null,
    [tasks, activeTaskId]
  );

  const handleSessionComplete = (timeInSeconds: number) => {
    if (activeTaskId && timeInSeconds > 0) {
      addFocusTime(activeTaskId, timeInSeconds);
      if (activeTask && timeInSeconds >= activeTask.focusDuration * 60) {
        addPomodoroSession(activeTaskId);
      }
    }
  };

  const handleTaskCompletion = () => {
    if (activeTask && !activeTask.completed) {
      updateTask(activeTask.id, { completed: true, completedAt: new Date().toISOString() });
      const nextTask = activeTasks.find(t => t.id !== activeTask.id);
      setActiveTaskId(nextTask ? nextTask.id : null);
    }
  };

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <>
      <AppHeader />
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-md shadow-lg animate-fade-in-up">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-medium text-center">Focus Task</h2>
                <div className="flex items-center gap-2">
                  <Select
                    value={activeTaskId || ""}
                    onValueChange={(id) => setActiveTaskId(id)}
                    disabled={activeTasks.length === 0}
                  >
                    <SelectTrigger className="flex-grow">
                      <SelectValue placeholder="Select a task to focus on" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeTasks.map((task) => (
                        <SelectItem key={task.id} value={task.id}>
                          {task.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add Task</span>
                  </Button>
                </div>
              </div>

              <PomodoroTimer
                task={activeTask}
                onSessionComplete={handleSessionComplete}
                onTaskComplete={handleTaskCompletion}
                key={activeTaskId} // Re-mount timer when task changes
              />
            </div>
          </CardContent>
        </Card>
        <TaskDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      </main>
    </>
  );
}
