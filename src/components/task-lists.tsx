
"use client";

import { useMemo, useState } from "react";
import { Check, Edit, Trash2 } from "lucide-react";

import { useTaskStore } from "@/hooks/use-task-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import TaskDialog from "./task-dialog";
import type { Task } from "@/types/task";

export default function TaskLists() {
  const { tasks, updateTask, deleteTask } = useTaskStore();
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { activeTasks, completedTasks } = useMemo(() => {
    const active: Task[] = [];
    const completed: Task[] = [];
    tasks.forEach((task) => {
      if (task.completed) {
        completed.push(task);
      } else {
        active.push(task);
      }
    });
    return { activeTasks: active, completedTasks: completed };
  }, [tasks]);

  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    setIsDialogOpen(true);
  };
  
  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setTaskToEdit(undefined);
    }
  };


  return (
    <>
      <Card className="animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
        <CardHeader>
          <CardTitle>Active Tasks</CardTitle>
          <CardDescription>
            Tasks you are currently working on.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-40 sm:h-48">
            <div className="space-y-2">
              {activeTasks.length > 0 ? (
                activeTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-2 rounded-md p-2 hover:bg-muted">
                    <span className="flex-grow">{task.description}</span>
                    <Button variant="ghost" size="icon" onClick={() => updateTask(task.id, { completed: true, completedAt: new Date().toISOString() })}>
                      <Check className="h-4 w-4" />
                    </Button>
                     <Button variant="ghost" size="icon" onClick={() => handleEdit(task)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center p-4">No active tasks.</p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}>
        <CardHeader>
          <CardTitle>Completed Tasks</CardTitle>
          <CardDescription>
            Tasks you have successfully completed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-40 sm:h-48">
            <div className="space-y-2">
              {completedTasks.length > 0 ? (
                completedTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-2 p-2">
                    <span className="flex-grow text-muted-foreground line-through">
                      {task.description}
                    </span>
                     <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center p-4">No completed tasks yet.</p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      
      <TaskDialog open={isDialogOpen} onOpenChange={handleDialogClose} taskToEdit={taskToEdit} />
    </>
  );
}
