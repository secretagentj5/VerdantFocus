
# Prompt for Building a Native Android App: VerdantFocus

## 1. App Overview

**App Name:** VerdantFocus

**Core Concept:** A beautiful and intuitive productivity application designed to help users improve their focus and manage their tasks using the Pomodoro Technique. The app should have a clean, modern, and calming aesthetic.

---

## 2. Core Screens & Features

The application consists of two main screens: the **Timer Screen** and the **Dashboard Screen**.

### Screen 1: Timer Screen (Main Screen)

This is the primary screen where the user interacts with the Pomodoro timer.

**Layout & Components:**

*   **Header:** Displays the app name "VerdantFocus" and provides navigation to the "Dashboard" screen.
*   **Focus Task Selection:**
    *   A dropdown menu allowing users to select an active task to focus on. It should show "Select a task to focus on" if no task is selected or available.
    *   An "Add Task" button (e.g., a '+' icon) next to the dropdown, which opens the "Add/Edit Task Dialog".
*   **Pomodoro Timer Display:**
    *   A large, single, circular progress ring that visually represents the time remaining.
    *   Inside the ring, display the remaining time in a large digital format (MM:SS).
    *   Below the time, display the current timer mode (e.g., "Focus", "Short Break", "Long Break").
*   **Timer Controls:**
    *   **Focus Mode Controls:**
        *   A large, central **Play/Pause button**.
        *   A **Reset button** (e.g., refresh icon) to restart the current timer.
        *   A **Mark as Complete button** (e.g., checkmark icon) to complete the currently selected task.
        *   Two secondary buttons: **"Short Break"** and **"Long Break"**.
    *   **Break Mode Controls:**
        *   When a break is active, the main controls should be replaced by a **"Resume Focus" button**.
        *   The Play/Pause and Reset buttons should still be available for the break timer itself.
*   **Task Dialog (Popup/Modal):**
    *   This dialog appears when the user clicks "Add Task" or chooses to edit an existing task.
    *   **Fields:**
        *   Task Description (Multiline text input).
        *   Focus Duration (Number input, in minutes). Default to 25.
        *   Short Break Duration (Number input, in minutes). Default to 5.
        *   Long Break Duration (Number input, in minutes). Default to 15.
        *   Recurrence (Dropdown with options: "None", "Daily", "Weekly").
    *   **Actions:** "Save" and "Cancel" buttons.

**Functional Logic:**

1.  When the user selects a task and presses "Play", the focus timer starts counting down. The circular progress ring updates accordingly.
2.  When the user clicks "Short Break" or "Long Break", the current progress of the focus timer should be **paused and saved**. The app should immediately switch to the selected break mode and the break timer should start counting down.
3.  When a break timer finishes or the user clicks "Resume Focus", the app should return to the focus timer, **restoring its previously saved progress** and continuing the countdown.
4.  When a focus session (one full Pomodoro) is completed, a "Pomodoro Session" is logged for that task.
5.  All time spent in focus mode should be tracked and added to the `totalFocusTime` for that specific task.
6.  Marking a task as complete moves it from the "Active" list to the "Completed" list.
7.  Recurring tasks should be handled: a "Daily" task that is completed should reappear in the "Active" list the next day. A "Weekly" task should reappear 7 days after completion.

---

### Screen 2: Dashboard Screen

This screen provides an overview of the user's productivity and task history.

**Layout & Components:**

*   **Header:** Same as the Timer screen, providing navigation back to the "Timer".
*   **Stats Cards:** A row of three cards at the top displaying key metrics:
    1.  **Total Focus Time:** Sum of all focus time across all tasks. (Format: Xh Ym).
    2.  **Total Break Time:** Estimated or tracked total break time.
    3.  **Sessions Completed:** Total number of Pomodoro sessions completed.
*   **Task Lists:** Two distinct sections or cards:
    *   **Active Tasks:** A scrollable list of all non-completed tasks. Each item should show the task description and have buttons to **Edit** and **Delete**.
    *   **Completed Tasks:** A scrollable list of completed tasks. Each item should show the description (ideally with a strikethrough) and a button to **Delete**.
*   **Focus Distribution Chart:**
    *   A **Pie Chart** that visually breaks down the total focus time by task.
    *   Each slice of the pie represents a task, and its size corresponds to the percentage of total focus time spent on it.
    *   The chart should use a distinct color for each slice to be easily differentiable.
    *   A legend should be displayed, connecting the colors to the task descriptions.

---

## 3. Data Model

A `Task` object should have the following properties:

*   `id`: String (Unique identifier)
*   `description`: String
*   `focusDuration`: Integer (in minutes)
*   `shortBreakDuration`: Integer (in minutes)
*   `longBreakDuration`: Integer (in minutes)
*   `recurrence`: String ("None", "Daily", "Weekly")
*   `completed`: Boolean
*   `completedAt`: Timestamp/Date (null if not completed)
*   `totalFocusTime`: Integer (in seconds, for accuracy)
*   `pomodoroSessions`: Integer (count of completed focus sessions)

**Data Persistence:** All task data must be stored locally on the device so the user's information is saved between app sessions.

---

## 4. Style & Aesthetics

*   **Color Palette:** Use a calming, nature-inspired theme.
    *   **Primary Color:** A pleasant green (e.g., `#8FBC8F`) for primary buttons, the focus timer ring, and highlights.
    *   **Accent Color:** A soft green (e.g., `#90EE90`) for the break timer ring and secondary elements.
    *   **Background Color:** A very light, off-white with a hint of green (e.g., `#F0FFF0`).
    *   **Text Color:** A dark, desaturated color for readability (e.g., dark slate gray).
*   **Fonts:** Use a clean, modern, and highly readable sans-serif font (e.g., Inter, Lexend, or similar).
*   **Layout:** Spacious, clean, and modern. Use cards with rounded corners and soft shadows to contain elements and create a sense of depth.
*   **Icons:** Use simple, minimalist, and universally understood icons (e.g., from Material Design Icons).
*   **Animations:** Use subtle animations for state changes (e.g., fade-in for cards, smooth transitions for button presses) to make the UI feel responsive and polished.
