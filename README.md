# 🚀 PulseFlow — Agile Project Management Dashboard

PulseFlow is a modern, responsive, and full-featured Project Management & Agile Delivery Dashboard built with **HTML5, CSS3, JavaScript (ES6+), React 18, and Bootstrap 5.3**.

---

## ✨ Features

### 1. 📊 Executive Workspace Dashboard
- **Live Key Performance Indicators (KPIs)**: Total Projects, Active Sprint Velocity, Logged Timesheet Hours, and Team Capacity Load.
- **Workflow Pipeline Distribution**: Visual multi-segment progress breakdown across Backlog, To Do, In Progress, In Review, and Done.
- **Throughput Bar Chart**: Interactive daily completion velocity visualization.
- **Milestone & Deadlines Tracker**: Automated countdown badges for upcoming and urgent deliverables.
- **Real-Time Audit Activity Feed**: Live workspace event stream recording project and task updates.

### 2. 📋 Interactive Kanban Board
- **Drag-and-Drop Columns**: Smooth HTML5 drag-and-drop workflow across 5 standard Agile stages:
  - `Backlog`
  - `To Do`
  - `In Progress`
  - `In Review`
  - `Done`
- **Click-to-Move Menu**: Accessible dropdown menu on every card for mobile devices and keyboard navigation.
- **Rich Task Cards**: Priority badges (Urgent, High, Medium, Low), project color badges, checklist progress indicator, tags, assignee avatars, and due dates.
- **Filter Toolbar**: Instant filtering by Project, Priority, Assignee, and Keyword Search.

### 3. 📁 Project Portfolio Management
- **View Toggle**: Switch effortlessly between **Grid Cards** and **Detailed Table View**.
- **Dynamic Health & Progress**: Auto-computed progress bar based on completed tasks, health status badges (`On Track`, `At Risk`, `Delayed`).
- **Financial Budget Tracking**: Budget spent vs. total budget with percentage indicator.
- **Direct Kanban Drilldown**: One-click button to filter the board to any specific project.

### 4. 👥 Team & Workload Capacity
- **Resource Utilization**: Visual capacity bars (<70% Balanced, 70-85% High Load, >85% Over Capacity).
- **Role & Department Grouping**: Filter by Engineering, Product Design, QA, etc.
- **Individual Task Workload**: Jump directly to tasks assigned to any team member.

### 5. ⏱️ Time Tracker & Timesheets
- **Live Stopwatch**: Real-time start, pause, reset, and save timer (`HH:MM:SS`).
- **Billable vs. Internal Tracking**: Toggle billable rate calculations.
- **Timesheets Table**: Historical logs with task, project, user, duration, and notes.
- **Export to CSV**: Download complete timesheet reports in `.csv` format for payroll or client billing.

### 6. 📈 Portfolio & Delivery Analytics
- Priority distribution ratios, completion rates, team allocation matrix, and budget burn rates.

### 7. 🎨 Modern Design & UX
- **Theme Switching**: Built-in Dark and Light mode support using Bootstrap 5.3's `data-bs-theme`.
- **LocalStorage Persistence**: All new tasks, edited projects, logged hours, and theme preferences persist across reloads.
- **Toast Notifications**: Interactive status alerts when tasks are moved, created, or edited.

---

## 🛠️ Tech Stack

- **HTML5 & Modern CSS3**: Custom CSS variables, glassmorphism, responsive grid, and custom scrollbars.
- **Bootstrap 5.3.3**: Grid system, forms, badges, modals, tooltips, and dark/light color modes.
- **JavaScript (ES6+)**: LocalStorage state persistence, drag-and-drop API, and CSV generation.
- **React 18**: Component architecture, custom hooks, and React Context API.
- **Lucide React**: Clean modern icons.
- **Vite 5**: Blazing-fast development server and optimized production build.

---

## 🚀 Getting Started

### 1. Start Development Server
```bash
cd project-management-dashboard
npm run dev
```
Open [http://localhost:5174](http://localhost:5174) in your browser.

### 2. Build for Production
```bash
npm run build
```
Production assets are output to the `dist/` folder.

### 3. Preview Production Build
```bash
npm run preview
```
