import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import {
  Users,
  Mail,
  CheckCircle2,
  ListTodo,
  ExternalLink,
  Search,
  AlertCircle
} from 'lucide-react';

export const TeamView = () => {
  const {
    teamMembers,
    tasks,
    setActiveTab,
    setSelectedAssigneeFilter
  } = useProject();

  const [deptFilter, setDeptFilter] = useState('all');
  const [memberSearch, setMemberSearch] = useState('');

  const departments = ['all', ...Array.from(new Set(teamMembers.map(m => m.department).filter(Boolean)))];

  const filteredMembers = teamMembers.filter(member => {
    if (deptFilter !== 'all' && member.department !== deptFilter) return false;
    if (memberSearch.trim()) {
      const q = memberSearch.toLowerCase();
      const matchName = member.name.toLowerCase().includes(q);
      const matchRole = member.role.toLowerCase().includes(q);
      const matchEmail = member.email.toLowerCase().includes(q);
      if (!matchName && !matchRole && !matchEmail) return false;
    }
    return true;
  });

  const handleViewTasks = (memberId) => {
    setSelectedAssigneeFilter(memberId);
    setActiveTab('kanban');
  };

  return (
    <div className="container-fluid p-3 p-lg-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Team & Resource Capacity</h4>
          <p className="text-muted small mb-0">
            Monitor team workload, active commitments, and individual deliverables across departments.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="custom-card p-3 mb-4">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          {/* Department Pills */}
          <div className="d-flex flex-wrap gap-2">
            {departments.map(dept => (
              <button
                key={dept}
                className={`btn btn-sm ${
                  deptFilter === dept ? 'btn-primary' : 'btn-outline-secondary'
                } rounded-pill text-capitalize`}
                onClick={() => setDeptFilter(dept)}
              >
                {dept === 'all' ? 'All Departments' : dept}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div style={{ maxWidth: '280px' }} className="w-100">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search member by name or role..."
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="row g-4">
        {filteredMembers.map(member => {
          const assignedTasks = tasks.filter(t => t.assigneeId === member.id);
          const activeTasks = assignedTasks.filter(t => t.status !== 'done');
          const completedTasks = assignedTasks.filter(t => t.status === 'done');
          const capacity = member.capacity || 50;

          let capacityColor = '#22c55e'; // Green
          let capacityLabel = 'Balanced';
          if (capacity > 85) {
            capacityColor = '#ef4444'; // Red
            capacityLabel = 'Over capacity';
          } else if (capacity > 70) {
            capacityColor = '#eab308'; // Yellow
            capacityLabel = 'High load';
          }

          return (
            <div key={member.id} className="col-12 col-md-6 col-xl-4">
              <div className="custom-card p-4 h-100 d-flex flex-column">
                {/* Member Profile Header */}
                <div className="d-flex align-items-start gap-3 mb-3">
                  <div className="position-relative">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="rounded-circle border"
                      style={{ width: '56px', height: '56px', objectFit: 'cover' }}
                    />
                    <span
                      className="position-absolute bottom-0 end-0 rounded-circle border border-2 border-white"
                      style={{ width: '14px', height: '14px', backgroundColor: capacityColor }}
                    />
                  </div>
                  <div className="flex-grow-1 min-w-0">
                    <h6 className="fw-bold mb-0 text-body text-truncate">{member.name}</h6>
                    <small className="text-primary fw-medium d-block text-truncate mb-1">{member.role}</small>
                    <span className="badge bg-body-secondary text-body" style={{ fontSize: '0.7rem' }}>
                      {member.department}
                    </span>
                  </div>
                </div>

                {/* Email link */}
                <div className="d-flex align-items-center gap-2 text-muted small mb-3">
                  <Mail size={14} />
                  <a href={`mailto:${member.email}`} className="text-muted text-decoration-none text-truncate">
                    {member.email}
                  </a>
                </div>

                {/* Capacity Meter */}
                <div className="p-3 rounded-3 bg-body-tertiary mb-3">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="small fw-semibold text-body">Capacity Utilization</span>
                    <span className="small fw-bold" style={{ color: capacityColor }}>
                      {capacity}% ({capacityLabel})
                    </span>
                  </div>
                  <div className="progress" style={{ height: '7px' }}>
                    <div
                      className="progress-bar"
                      style={{ width: `${capacity}%`, backgroundColor: capacityColor }}
                    />
                  </div>
                </div>

                {/* Task Metrics */}
                <div className="row g-2 text-center mb-3">
                  <div className="col-6">
                    <div className="p-2 rounded border bg-body">
                      <div className="d-flex align-items-center justify-content-center gap-1 text-primary mb-1">
                        <ListTodo size={14} />
                        <span className="fw-bold fs-6">{activeTasks.length}</span>
                      </div>
                      <small className="text-muted" style={{ fontSize: '0.72rem' }}>Active Tasks</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2 rounded border bg-body">
                      <div className="d-flex align-items-center justify-content-center gap-1 text-success mb-1">
                        <CheckCircle2 size={14} />
                        <span className="fw-bold fs-6">{completedTasks.length}</span>
                      </div>
                      <small className="text-muted" style={{ fontSize: '0.72rem' }}>Completed</small>
                    </div>
                  </div>
                </div>

                {/* View Tasks CTA */}
                <button
                  className="btn btn-outline-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-2 mt-auto"
                  onClick={() => handleViewTasks(member.id)}
                >
                  <ExternalLink size={14} />
                  <span>View Assigned Tasks ({activeTasks.length})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
