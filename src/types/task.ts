export type TaskRecurrence = "None" | "Daily" | "Weekly";

export interface Task {
  id: string;
  description: string;
  focusDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  recurrence: TaskRecurrence;
  completed: boolean;
  completedAt: string | null;
  totalFocusTime: number; // in seconds
  pomodoroSessions: number;
}
