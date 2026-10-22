import React from 'react';
import { useProject } from '../context/ProjectContext';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertTriangle,
  Calendar,
  ArrowUpRight,
  Plus,
  Play,
  Users
} from 'lucide-react';

export const DashboardOverview = () => {
  const {
    projects,
    tasks,
    timeLogs,
    teamMembers,
    activityLog,
    setActiveTab,
    setSelectedProjectFilter,
    setTaskModal,
    setProjectModal
  } = useProject();

  // Metrics calculations
  const totalProjects = projects.length;
  const onTrackProjects = projects.filter(p => p.health === 'On Track').length;
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const openTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalSeconds = timeLogs.reduce((acc, log) => acc + (log.duration || 0), 0);
  const totalHours = Math.round((totalSeconds / 3600) * 10) / 10;

  const avgCapacity = teamMembers.length > 0
    ? Math.round(teamMembers.reduce((acc, m) => acc + (m.capacity || 0), 0) / teamMembers.length)
    : 0;

  // Task status distribution
  const statusCounts = {
    backlog: tasks.filter(t => t.status === 'backlog').length,
    todo: tasks.filter(t => t.status === 'todo').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    'in-review': tasks.filter(t => t.status === 'in-review').length,
    done: completedTasks
  };

  // Urgent & Upcoming tasks (sorted by due date)
  const upcomingTasks = [...tasks]
    .filter(t => t.status !== 'done' && t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4);

  return (
    <div className="container-fluid p-3 p-lg-4">
      {/* Welcome Banner */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Executive Workspace Overview</h4>
          <p className="text-muted small mb-0">
            Welcome back! You have <strong>{openTasks} active tasks</strong> across <strong>{totalProjects} strategic projects</strong>.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
            onClick={() => setActiveTab('timetracker')}
          >
            <Clock size={15} />
            <span>Open Timer</span>
          </button>
          <button
            className="btn btn-primary btn-sm d-flex align-items-center gap-2 shadow-sm"
            onClick={() => setTaskModal({ isOpen: true, task: null, defaultStatus: 'todo' })}
          >
            <Plus size={16} />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="row g-3 mb-4">
        {/* KPI 1: Active Projects */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="custom-card p-3 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-muted small fw-semibold">Active Projects</span>
              <div className="stat-accent bg-primary-subtle text-primary">
                <FolderKanban size={20} />
              </div>
            </div>
            <div className="d-flex align-items-baseline gap-2 mb-1">
              <h3 className="fw-bold mb-0">{totalProjects}</h3>
              <span className="badge bg-success-subtle text-success small">
                {onTrackProjects} On Track
              </span>
            </div>
            <div className="d-flex align-items-center text-muted small mt-2">
              <span className="text-success fw-medium d-flex align-items-center me-1">
                <ArrowUpRight size={14} /> +12%
              </span>
              <span>vs last month</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Task Completion */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="custom-card p-3 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-muted small fw-semibold">Sprint Velocity</span>
              <div className="stat-accent bg-success-subtle text-success">
                <CheckCircle2 size={20} />
              </div>
            </div>
            <div className="d-flex align-items-baseline gap-2 mb-1">
              <h3 className="fw-bold mb-0">{completionPercentage}%</h3>
              <span className="text-muted small">({completedTasks}/{totalTasks} done)</span>
            </div>
            <div className="progress mt-3">
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: `${completionPercentage}%` }}
                aria-valuenow={completionPercentage}
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
          </div>
        </div>

        {/* KPI 3: Logged Hours */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="custom-card p-3 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-muted small fw-semibold">Hours Tracked</span>
              <div className="stat-accent bg-info-subtle text-info">
                <Clock size={20} />
              </div>
            </div>
            <div className="d-flex align-items-baseline gap-2 mb-1">
              <h3 className="fw-bold mb-0">{totalHours}h</h3>
              <span className="badge bg-info-subtle text-info small">Timesheets</span>
            </div>
            <div className="d-flex align-items-center text-muted small mt-2">
              <span className="text-info fw-medium me-1">
                {timeLogs.length} entries
              </span>
              <span>recorded</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Team Load */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="custom-card p-3 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-muted small fw-semibold">Team Workload</span>
              <div className="stat-accent bg-warning-subtle text-warning">
                <Users size={20} />
              </div>
            </div>
            <div className="d-flex align-items-baseline gap-2 mb-1">
              <h3 className="fw-bold mb-0">{avgCapacity}%</h3>
              <span className="badge bg-warning-subtle text-warning small">
                {teamMembers.length} Members
              </span>
            </div>
            <div className="progress mt-3">
              <div
                className={`progress-bar ${avgCapacity > 80 ? 'bg-warning' : 'bg-primary'}`}
                role="progressbar"
                style={{ width: `${avgCapacity}%` }}
                aria-valuenow={avgCapacity}
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Visual Chart Breakdown & Upcoming Deadlines */}
      <div className="row g-4 mb-4">
        {/* Left Column: Visual Status Breakdown & Weekly Activity */}
        <div className="col-12 col-lg-8">
          <div className="custom-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h6 className="fw-bold mb-1">Workflow Status Distribution</h6>
                <small className="text-muted">Live distribution of tasks across the delivery pipeline</small>
              </div>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => setActiveTab('kanban')}
              >
                Go to Kanban
              </button>
            </div>

            {/* Custom Multi-Segment Progress Visualizer */}
            <div className="mb-4">
              <div className="d-flex gap-1 rounded-3 overflow-hidden p-1 bg-body-tertiary mb-3" style={{ height: '24px' }}>
                {totalTasks > 0 && (
                  <>
                    <div
                      style={{ width: `${(statusCounts.backlog / totalTasks) * 100}%`, backgroundColor: '#64748b' }}
                      title={`Backlog: ${statusCounts.backlog}`}
                    />
                    <div
                      style={{ width: `${(statusCounts.todo / totalTasks) * 100}%`, backgroundColor: '#3b82f6' }}
                      title={`To Do: ${statusCounts.todo}`}
                    />
                    <div
                      style={{ width: `${(statusCounts['in-progress'] / totalTasks) * 100}%`, backgroundColor: '#eab308' }}
                      title={`In Progress: ${statusCounts['in-progress']}`}
                    />
                    <div
                      style={{ width: `${(statusCounts['in-review'] / totalTasks) * 100}%`, backgroundColor: '#a855f7' }}
                      title={`In Review: ${statusCounts['in-review']}`}
                    />
                    <div
                      style={{ width: `${(statusCounts.done / totalTasks) * 100}%`, backgroundColor: '#22c55e' }}
                      title={`Done: ${statusCounts.done}`}
                    />
                  </>
                )}
              </div>

              {/* Status Legend Pills */}
              <div className="row g-2 text-center">
                <div className="col">
                  <div className="p-2 rounded bg-body-tertiary">
                    <span className="d-block fw-bold fs-6">{statusCounts.backlog}</span>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>Backlog</small>
                  </div>
                </div>
                <div className="col">
                  <div className="p-2 rounded bg-body-tertiary">
                    <span className="d-block fw-bold fs-6 text-primary">{statusCounts.todo}</span>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>To Do</small>
                  </div>
                </div>
                <div className="col">
                  <div className="p-2 rounded bg-body-tertiary">
                    <span className="d-block fw-bold fs-6 text-warning">{statusCounts['in-progress']}</span>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>In Progress</small>
                  </div>
                </div>
                <div className="col">
                  <div className="p-2 rounded bg-body-tertiary">
                    <span className="d-block fw-bold fs-6 text-indigo">{statusCounts['in-review']}</span>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>In Review</small>
                  </div>
                </div>
                <div className="col">
                  <div className="p-2 rounded bg-body-tertiary">
                    <span className="d-block fw-bold fs-6 text-success">{statusCounts.done}</span>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>Done</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Velocity SVG Bar Chart */}
            <div className="pt-3 border-top">
              <h6 className="fw-semibold small text-muted mb-3">Weekly Team Throughput (Completed Tasks)</h6>
              <div className="d-flex align-items-end justify-content-between gap-2 pt-2" style={{ height: '140px' }}>
                {[
                  { day: 'Mon', count: 4, height: 40 },
                  { day: 'Tue', count: 7, height: 70 },
                  { day: 'Wed', count: 5, height: 50 },
                  { day: 'Thu', count: 9, height: 90 },
                  { day: 'Fri', count: 8, height: 80 },
                  { day: 'Sat', count: 2, height: 20 },
                  { day: 'Sun', count: 1, height: 10 },
                ].map((bar, idx) => (
                  <div key={idx} className="d-flex flex-column align-items-center flex-grow-1 h-100 justify-content-end">
                    <span className="small text-muted mb-1" style={{ fontSize: '0.75rem' }}>{bar.count}</span>
                    <div
                      className="w-100 rounded-top"
                      style={{
                        height: `${bar.height}%`,
                        backgroundColor: idx === 3 ? '#4f46e5' : 'rgba(79, 70, 229, 0.35)',
                        transition: 'height 0.5s ease'
                      }}
                      title={`${bar.day}: ${bar.count} tasks`}
                    />
                    <span className="small text-muted mt-2 fw-medium" style={{ fontSize: '0.75rem' }}>{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Urgent & Upcoming Deadlines */}
        <div className="col-12 col-lg-4">
          <div className="custom-card p-4 h-100 d-flex flex-direction-column">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h6 className="fw-bold mb-0">Upcoming Deadlines</h6>
                <small className="text-muted">Target delivery milestones</small>
              </div>
              <Calendar size={18} className="text-primary" />
            </div>

            <div className="d-flex flex-column gap-2 flex-grow-1">
              {upcomingTasks.length === 0 ? (
                <div className="text-center py-4 text-muted small">
                  No upcoming deadlines! Great work.
                </div>
              ) : (
                upcomingTasks.map(task => {
                  const project = projects.find(p => p.id === task.projectId);
                  const isUrgent = task.priority === 'Urgent';
                  return (
                    <div
                      key={task.id}
                      className="p-3 rounded-3 bg-body-tertiary border d-flex flex-column gap-1 cursor-pointer"
                      onClick={() => {
                        setSelectedProjectFilter(task.projectId);
                        setActiveTab('kanban');
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <span
                          className="badge"
                          style={{
                            backgroundColor: `${project?.color || '#4f46e5'}20`,
                            color: project?.color || '#4f46e5'
                          }}
                        >
                          {project?.name || 'Project'}
                        </span>
                        <span className={`badge ${isUrgent ? 'badge-urgent' : 'badge-high'}`} style={{ fontSize: '0.7rem' }}>
                          Due {task.dueDate}
                        </span>
                      </div>
                      <span className="fw-semibold small text-truncate text-body mt-1">{task.title}</span>
                      <div className="d-flex align-items-center justify-content-between text-muted small mt-1" style={{ fontSize: '0.75rem' }}>
                        <span>Priority: <strong>{task.priority}</strong></span>
                        <span className="text-primary fw-medium">View in Board &rarr;</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Active Projects Spotlight & Live Activity Stream */}
      <div className="row g-4">
        {/* Active Projects Spotlight */}
        <div className="col-12 col-lg-7">
          <div className="custom-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold mb-0">Project Progress Overview</h6>
              <button
                className="btn btn-sm btn-link text-decoration-none p-0 fw-semibold"
                onClick={() => setActiveTab('projects')}
              >
                All Projects &rarr;
              </button>
            </div>

            <div className="d-flex flex-column gap-3">
              {projects.map(proj => {
                const projTasks = tasks.filter(t => t.projectId === proj.id);
                const projCompleted = projTasks.filter(t => t.status === 'done').length;
                const percent = projTasks.length > 0 ? Math.round((projCompleted / projTasks.length) * 100) : 0;
                
                return (
                  <div key={proj.id} className="p-3 rounded-3 border bg-body-tertiary">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className="rounded-circle"
                          style={{ width: '10px', height: '10px', backgroundColor: proj.color }}
                        />
                        <span className="fw-semibold text-body small">{proj.name}</span>
                        <span className="badge bg-secondary-subtle text-secondary small">{proj.code}</span>
                      </div>
                      <span className={`badge ${proj.health === 'On Track' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                        {proj.health}
                      </span>
                    </div>

                    <div className="d-flex align-items-center justify-content-between text-muted small mb-1" style={{ fontSize: '0.75rem' }}>
                      <span>{projCompleted} of {projTasks.length} tasks completed</span>
                      <span className="fw-bold">{percent}%</span>
                    </div>

                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${percent}%`, backgroundColor: proj.color }}
                        aria-valuenow={percent}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Activity Stream */}
        <div className="col-12 col-lg-5">
          <div className="custom-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold mb-0">Live Audit Activity</h6>
              <span className="badge bg-primary-subtle text-primary">Real-time</span>
            </div>

            <div className="d-flex flex-column gap-3">
              {activityLog.slice(0, 5).map(act => (
                <div key={act.id} className="d-flex align-items-start gap-3 pb-2 border-bottom last-border-0">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0 mt-1"
                    style={{ width: '28px', height: '28px', backgroundColor: '#4f46e5', fontSize: '0.72rem' }}
                  >
                    {act.user.charAt(0)}
                  </div>
                  <div className="flex-grow-1">
                    <p className="mb-0 small text-body">
                      <strong>{act.user}</strong> {act.action}{' '}
                      <span className="fw-semibold text-primary">{act.target}</span>
                    </p>
                    <small className="text-muted" style={{ fontSize: '0.72rem' }}>{act.timestamp}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
