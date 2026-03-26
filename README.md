# Task Manager — Buggy React App

A React + Vite application that implements a task manager with **10 intentional bugs** embedded in a single file (`src/TaskManager.jsx`).

## Prerequisites

- **Node.js** v18 or later
- **npm** (comes with Node.js)

## Getting Started

1. **Install dependencies**

   ```bash
   cd react_test2
   npm install
   ```

2. **Start the development server**

   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

## Features

- Task list with mock data (10 tasks)
- Filter by status (Todo / In Progress / Done)
- Filter by priority (High / Medium / Low)
- Search tasks by title
- Tag-based filtering
- Sort by due date
- Add new tasks via form
- Inline edit task titles
- Delete tasks
- Team workload overview with progress bars
- Project health score
- Session timer

## Bugs

All 10 bugs live in `src/TaskManager.jsx`. They cover common React anti-patterns and mistakes:

| # | Bug | Line Area |
|---|-----|-----------|
| 1 | Memory leak — `setInterval` without cleanup in `useEffect` | `useEffect` timer |
| 2 | Stale closure — `completedCount` captured at effect creation time | `useEffect` tasks watcher |
| 3 | Mutating sort — `.sort()` mutates the filtered array in place | `sortedTasks` |
| 4 | Direct state mutation — `tasks.push()` instead of creating new array | `addTask` |
| 5 | Direct object mutation — modifying task object in place before `setTasks` | `toggleStatus` |
| 6 | Missing `e.preventDefault()` — form submits and reloads the page | `handleAddSubmit` |
| 7 | Partial state overwrite — `setNewTask({ [field]: value })` without spread | `handleNewTaskChange` |
| 8 | Index as key — using array index for a filterable/sortable list | `sortedTasks.map` |
| 9 | Stale closure in notification — references stale `completedCount` | `useEffect` tasks watcher |
| 10 | Wrong divisor in calculation — divides by `tasks.length` instead of `totalWeight` | `projectHealth` |
