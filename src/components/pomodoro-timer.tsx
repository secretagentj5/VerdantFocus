
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Play, Pause, Coffee, RefreshCw, Check, Bed } from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import {
  ChartContainer
} from "@/components/ui/chart";
import type { Task } from "@/types/task";

type TimerMode = "focus" | "shortBreak" | "longBreak";

interface PomodoroTimerProps {
  task: Task | null;
  onSessionComplete: (timeInSeconds: number) => void;
  onTaskComplete: () => void;
}

export default function PomodoroTimer({
  task,
  onSessionComplete,
  onTaskComplete,
}: PomodoroTimerProps) {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [isRunning, setIsRunning] = useState(false);
  
  // These store the *current* time left for each mode
  const [focusTimeLeft, setFocusTimeLeft] = useState(task ? task.focusDuration * 60 : 25 * 60);
  const [shortBreakTimeLeft, setShortBreakTimeLeft] = useState(task ? task.shortBreakDuration * 60 : 5 * 60);
  const [longBreakTimeLeft, setLongBreakTimeLeft] = useState(task ? task.longBreakDuration * 60 : 15 * 60);

  // This stores the focus time when a break is started
  const [savedFocusTime, setSavedFocusTime] = useState(focusTimeLeft);
  
  const [accumulatedFocusTime, setAccumulatedFocusTime] = useState(0);

  const initialTime = useMemo(() => {
    if (!task) return 25 * 60;
    switch (mode) {
      case "focus":
        return task.focusDuration * 60;
      case "shortBreak":
        return task.shortBreakDuration * 60;
      case "longBreak":
        return task.longBreakDuration * 60;
      default:
        return task.focusDuration * 60;
    }
  }, [task, mode]);
  
  const timeLeft = useMemo(() => {
    switch (mode) {
      case "focus":
        return focusTimeLeft;
      case "shortBreak":
        return shortBreakTimeLeft;
      case "longBreak":
        return longBreakTimeLeft;
    }
  }, [mode, focusTimeLeft, shortBreakTimeLeft, longBreakTimeLeft]);

   useEffect(() => {
    if (task) {
      setIsRunning(false);
      const initialFocusTime = task.focusDuration * 60;
      setFocusTimeLeft(initialFocusTime);
      setSavedFocusTime(initialFocusTime);
      setShortBreakTimeLeft(task.shortBreakDuration * 60);
      setLongBreakTimeLeft(task.longBreakDuration * 60);
      setAccumulatedFocusTime(0);
      setMode('focus');
    } else {
       setFocusTimeLeft(25 * 60);
       setShortBreakTimeLeft(5 * 60);
       setLongBreakTimeLeft(15 * 60);
    }
  }, [task]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        switch(mode) {
          case 'focus':
            setFocusTimeLeft(prev => prev - 1);
            setAccumulatedFocusTime(prev => prev + 1);
            break;
          case 'shortBreak':
            setShortBreakTimeLeft(prev => prev - 1);
            break;
          case 'longBreak':
            setLongBreakTimeLeft(prev => prev - 1);
            break;
        }
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (mode === "focus") {
        if (accumulatedFocusTime > 0) {
          onSessionComplete(accumulatedFocusTime);
          setAccumulatedFocusTime(0);
        }
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, onSessionComplete, accumulatedFocusTime]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const startBreak = (breakType: "shortBreak" | "longBreak") => {
    setIsRunning(false);
    if (mode === "focus") {
      setSavedFocusTime(focusTimeLeft); // Save current focus time
      if(accumulatedFocusTime > 0) {
        onSessionComplete(accumulatedFocusTime);
        setAccumulatedFocusTime(0);
      }
    }
    setMode(breakType);
  };
  
  const resumeFocus = () => {
    setIsRunning(false);
    setMode("focus");
    setFocusTimeLeft(savedFocusTime); // Restore saved focus time
    // Reset break timers
    if (task) {
        setShortBreakTimeLeft(task.shortBreakDuration * 60);
        setLongBreakTimeLeft(task.longBreakDuration * 60);
    }
  };

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    
    if (mode === 'focus') {
      const newFocusTime = task ? task.focusDuration * 60 : 25 * 60;
      setFocusTimeLeft(newFocusTime);
      setSavedFocusTime(newFocusTime);
      // Only reset accumulated time if we are resetting the main focus timer
      if (accumulatedFocusTime > 0) {
        onSessionComplete(accumulatedFocusTime);
      }
      setAccumulatedFocusTime(0);
    } else if (mode === 'shortBreak') {
      setShortBreakTimeLeft(task ? task.shortBreakDuration * 60 : 5 * 60);
    } else if (mode === 'longBreak') {
      setLongBreakTimeLeft(task ? task.longBreakDuration * 60 : 15 * 60);
    }
  }, [mode, task, accumulatedFocusTime, onSessionComplete]);
  
  const handleTaskCompletion = () => {
    setIsRunning(false);
    if (mode === 'focus' && accumulatedFocusTime > 0) {
        onSessionComplete(accumulatedFocusTime);
    }
    setAccumulatedFocusTime(0);
    onTaskComplete();
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const progress = initialTime > 0 ? (initialTime - timeLeft) / initialTime * 100 : 0;

  const chartColor = useMemo(() => {
    switch (mode) {
      case 'focus':
        return "hsl(var(--primary))";
      case 'shortBreak':
        return "hsl(var(--chart-2))";
      case 'longBreak':
        return "hsl(var(--chart-4))";
      default:
        return "hsl(var(--primary))";
    }
  }, [mode]);

  const chartData = [{ name: 'progress', value: progress, fill: chartColor }];

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-center">
        <p className="text-muted-foreground">Please add a task to begin.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6">
      <div className="relative w-48 h-48 sm:w-64 sm:h-64" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
         <ChartContainer config={{}} className="w-full h-full">
            <RadialBarChart
                innerRadius="80%"
                outerRadius="100%"
                data={chartData}
                startAngle={90}
                endAngle={-270}
                barSize={12}
            >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar
                    background={{ fill: 'hsl(var(--muted))' }}
                    dataKey="value"
                    angleAxisId={0}
                    cornerRadius={10}
                />
            </RadialBarChart>
        </ChartContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl sm:text-6xl font-bold tabular-nums">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground uppercase tracking-widest">
                {mode.replace('Break', ' Break')}
            </span>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 w-full">
        {mode === 'focus' && (
          <>
            <div className="flex items-center justify-center gap-4">
              <Button size="icon" variant="ghost" className="w-12 h-12" onClick={resetTimer}>
                <RefreshCw className="w-6 h-6" />
              </Button>
              <Button size="lg" className="rounded-full w-24 h-24 sm:w-28 sm:h-28 shadow-lg" onClick={toggleTimer}>
                {isRunning ? <Pause className="w-10 h-10 sm:w-12 sm:h-12" /> : <Play className="w-10 h-10 sm:w-12 sm:h-12" />}
              </Button>
              <Button size="icon" variant="ghost" className="w-12 h-12" onClick={handleTaskCompletion} disabled={isRunning}>
                <Check className="w-6 h-6" />
              </Button>
            </div>
            <div className="flex justify-center gap-2 sm:gap-4 flex-wrap">
              <Button variant="secondary" size="lg" className="shadow-sm" onClick={() => startBreak('shortBreak')}>
                <Coffee className="mr-2 h-5 w-5" /> Short Break
              </Button>
              <Button variant="secondary" size="lg" className="shadow-sm" onClick={() => startBreak('longBreak')}>
                <Bed className="mr-2 h-5 w-5" /> Long Break
              </Button>
            </div>
          </>
        )}

        {(mode === 'shortBreak' || mode === 'longBreak') && (
            <div className="flex flex-col items-center gap-4">
                 <Button size="lg" onClick={resumeFocus} className="shadow-lg">
                    Resume Focus
                </Button>
                 <div className="flex items-center justify-center gap-4">
                     <Button size="icon" variant="ghost" className="w-12 h-12" onClick={resetTimer}>
                        <RefreshCw className="w-6 h-6" />
                     </Button>
                     <Button size="lg" className="rounded-full w-20 h-20 shadow-md" onClick={toggleTimer}>
                         {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                     </Button>
                 </div>
            </div>
        )}
      </div>
    </div>
  );
}
