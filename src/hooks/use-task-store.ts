"use client";

import { useState, useEffect, useCallback } from "react";
import type { Task, TaskRecurrence } from "@/types/task";

const STORE_KEY = "verdantfocus-tasks";

type TaskData = Omit<Task, "id" | "completed" | "completedAt" | "totalFocusTime" | "pomodoroSessions">;

const createStore = () => {
  let state: Task[] = [];
  const listeners = new Set<() => void>();

  const loadState = () => {
    try {
      const item = window.localStorage.getItem(STORE_KEY);
      if (item) {
        state = JSON.parse(item);
      }
    } catch (error) {
      console.error("Failed to load tasks from localStorage", error);
      state = [];
    }
  };

  const saveState = () => {
    try {
      const item = JSON.stringify(state);
      window.localStorage.setItem(STORE_KEY, item);
    } catch (error) {
      console.error("Failed to save tasks to localStorage", error);
    }
  };
  
  if (typeof window !== "undefined") {
    loadState();
  }

  const store = {
    getState: () => state,
    setState: (newStateFn: (prevState: Task[]) => Task[]) => {
      state = newStateFn(state);
      saveState();
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };

  return store;
};

const taskStore = createStore();

const resetRecurringTasks = () => {
    taskStore.setState(prevState => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        return prevState.map(task => {
            if (!task.completed || !task.completedAt) return task;

            const completedDate = new Date(task.completedAt);
            const completedDay = new Date(completedDate.getFullYear(), completedDate.getMonth(), completedDate.getDate());
            
            let shouldReset = false;
            if (task.recurrence === "Daily" && completedDay.getTime() < today.getTime()) {
                shouldReset = true;
            } else if (task.recurrence === "Weekly") {
                const diffTime = Math.abs(today.getTime() - completedDay.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays >= 7) {
                    shouldReset = true;
                }
            }
            
            if (shouldReset) {
                return { ...task, completed: false, completedAt: null };
            }
            return task;
        });
    });
};

if (typeof window !== "undefined") {
    resetRecurringTasks();
}

const actions = {
  addTask: (taskData: TaskData) => {
    taskStore.setState((prevState) => [
      ...prevState,
      {
        ...taskData,
        id: new Date().toISOString() + Math.random(),
        completed: false,
        completedAt: null,
        totalFocusTime: 0,
        pomodoroSessions: 0,
      },
    ]);
  },
  updateTask: (taskId: string, updatedData: Partial<Task>) => {
    taskStore.setState((prevState) =>
      prevState.map((task) =>
        task.id === taskId ? { ...task, ...updatedData } : task
      )
    );
  },
  deleteTask: (taskId: string) => {
    taskStore.setState((prevState) => prevState.filter((task) => task.id !== taskId));
  },
  addFocusTime: (taskId: string, timeInSeconds: number) => {
    taskStore.setState(prevState => prevState.map(task =>
      task.id === taskId ? { ...task, totalFocusTime: task.totalFocusTime + timeInSeconds } : task
    ));
  },
  addPomodoroSession: (taskId: string) => {
    taskStore.setState(prevState => prevState.map(task =>
      task.id === taskId ? { ...task, pomodoroSessions: task.pomodoroSessions + 1 } : task
    ));
  }
};

export const useTaskStore = () => {
  const [tasks, setTasks] = useState(taskStore.getState());

  useEffect(() => {
    const unsubscribe = taskStore.subscribe(() => {
      setTasks(taskStore.getState());
    });
    // On mount, check for recurring tasks to reset
    resetRecurringTasks();
    setTasks(taskStore.getState()); // get latest state after reset
    return unsubscribe;
  }, []);

  return {
    tasks,
    ...actions,
  };
};
