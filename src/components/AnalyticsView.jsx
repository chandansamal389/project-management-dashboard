import React from 'react';
import { useProject } from '../context/ProjectContext';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Award,
  Layers,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const AnalyticsView = () => {
  const {
    projects,
    tasks,
    teamMembers,
    timeLogs
  } = useProject();

  // Tasks statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const inReviewTasks = tasks.filter(t => t.status === 'in-review').length;
  const todoTasks = tasks.filter(t => t.status === 'todo').length;
  const backlogTasks = tasks.filter(t => t.status === 'backlog').length;

  // Priority breakdown
  const urgentCount = tasks.filter(t => t.priority === 'Urgent').length;
  const highCount = tasks.filter(t => t.priority === 'High').length;
  const mediumCount = tasks.filter(t => t.priority === 'Medium').length;
  const lowCount = tasks.filter(t => t.priority === 'Low').length;

  // Total budget and spending
  const totalBudget = projects.reduce((acc, p) => acc + (p.budgetTotal || 0), 0);
  const totalSpent = projects.reduce((acc, p) => acc + (p.budgetSpent || 0), 0);
  const spendPercent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  return (
    <div className="container-fluid p-3 p-lg-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Portfolio & Delivery Analytics</h4>
          <p className="text-muted small mb-0">
            In-depth analytics on team productivity, budget burn rate, and pipeline health.
          </p>
        </div>
      </div>

      {/* Highlights Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="custom-card p-3">
            <span className="text-muted small fw-semibold">Delivery Rate</span>
            <div className="d-flex align-items-baseline gap-2 mt-1">
              <h3 className="fw-bold mb-0 text-success">
                {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
              </h3>
              <small className="text-muted">overall</small>
            </div>
            <small className="text-muted d-block mt-2">
              {completedTasks} completed out of {totalTasks}
            </small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="custom-card p-3">
            <span className="text-muted small fw-semibold">Critical Priority Load</span>
            <div className="d-flex align-items-baseline gap-2 mt-1">
              <h3 className="fw-bold mb-0 text-danger">{urgentCount}</h3>
              <small className="text-muted">urgent items</small>
            </div>
            <small className="text-muted d-block mt-2">
              {highCount} high priority items
            </small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="custom-card p-3">
            <span className="text-muted small fw-semibold">Budget Utilization</span>
            <div className="d-flex align-items-baseline gap-2 mt-1">
              <h3 className="fw-bold mb-0 text-primary">{spendPercent}%</h3>
              <small className="text-muted">burned</small>
            </div>
            <small className="text-muted d-block mt-2">
              ${totalSpent.toLocaleString()} of ${totalBudget.toLocaleString()}
            </small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="custom-card p-3">
            <span className="text-muted small fw-semibold">Active Contributors</span>
            <div className="d-flex align-items-baseline gap-2 mt-1">
              <h3 className="fw-bold mb-0 text-indigo">{teamMembers.length}</h3>
              <small className="text-muted">members</small>
            </div>
            <small className="text-muted d-block mt-2">
              Across 3 specialized squads
            </small>
          </div>
        </div>
      </div>

      {/* Row 1: Priority Distribution & Status Breakdown */}
      <div className="row g-4 mb-4">
        {/* Priority Breakdown Bar Visual */}
        <div className="col-12 col-lg-6">
          <div className="custom-card p-4 h-100">
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <AlertTriangle size={17} className="text-warning" />
              <span>Priority Distribution</span>
            </h6>

            <div className="d-flex flex-column gap-3">
              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span className="fw-semibold text-danger">Urgent</span>
                  <span className="text-muted">{urgentCount} tasks ({totalTasks ? Math.round((urgentCount / totalTasks) * 100) : 0}%)</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-danger" style={{ width: `${(urgentCount / totalTasks) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span className="fw-semibold text-warning">High</span>
                  <span className="text-muted">{highCount} tasks ({totalTasks ? Math.round((highCount / totalTasks) * 100) : 0}%)</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-warning" style={{ width: `${(highCount / totalTasks) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span className="fw-semibold text-info">Medium</span>
                  <span className="text-muted">{mediumCount} tasks ({totalTasks ? Math.round((mediumCount / totalTasks) * 100) : 0}%)</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-info" style={{ width: `${(mediumCount / totalTasks) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span className="fw-semibold text-secondary">Low</span>
                  <span className="text-muted">{lowCount} tasks ({totalTasks ? Math.round((lowCount / totalTasks) * 100) : 0}%)</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-secondary" style={{ width: `${(lowCount / totalTasks) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Health & Progress Comparison */}
        <div className="col-12 col-lg-6">
          <div className="custom-card p-4 h-100">
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <Layers size={17} className="text-primary" />
              <span>Project Progress Comparison</span>
            </h6>

            <div className="d-flex flex-column gap-3">
              {projects.map(p => {
                const pTasks = tasks.filter(t => t.projectId === p.id);
                const pDone = pTasks.filter(t => t.status === 'done').length;
                const pct = pTasks.length > 0 ? Math.round((pDone / pTasks.length) * 100) : 0;

                return (
                  <div key={p.id}>
                    <div className="d-flex justify-content-between small mb-1">
                      <span className="fw-semibold text-body">{p.name}</span>
                      <span className="fw-bold text-muted">{pct}% ({pDone}/{pTasks.length})</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div
                        className="progress-bar"
                        style={{ width: `${pct}%`, backgroundColor: p.color || '#4f46e5' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Team Member Workload Allocation */}
      <div className="custom-card p-4">
        <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
          <Award size={17} className="text-primary" />
          <span>Team Capacity & Allocation Matrix</span>
        </h6>

        <div className="row g-3">
          {teamMembers.map(m => {
            const memberTasks = tasks.filter(t => t.assigneeId === m.id);
            const activeCount = memberTasks.filter(t => t.status !== 'done').length;

            return (
              <div key={m.id} className="col-12 col-md-4">
                <div className="p-3 rounded-3 bg-body-tertiary border">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="rounded-circle border"
                      style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                    />
                    <div className="min-w-0 flex-grow-1">
                      <span className="fw-semibold small d-block text-truncate">{m.name}</span>
                      <small className="text-muted" style={{ fontSize: '0.72rem' }}>{m.role}</small>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between small text-muted mb-1" style={{ fontSize: '0.75rem' }}>
                    <span>Capacity Load</span>
                    <span className="fw-bold text-body">{m.capacity}% ({activeCount} active tasks)</span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div
                      className={`progress-bar ${m.capacity > 85 ? 'bg-danger' : m.capacity > 70 ? 'bg-warning' : 'bg-success'}`}
                      style={{ width: `${m.capacity}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
