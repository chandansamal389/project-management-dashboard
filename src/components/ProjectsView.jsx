import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import {
  Plus,
  LayoutGrid,
  List,
  Calendar,
  DollarSign,
  User,
  MoreVertical,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const ProjectsView = () => {
  const {
    projects,
    tasks,
    teamMembers,
    setProjectModal,
    deleteProject,
    setActiveTab,
    setSelectedProjectFilter
  } = useProject();

  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category).filter(Boolean)))];

  const filteredProjects = projects.filter(project => {
    if (selectedCategory !== 'all' && project.category !== selectedCategory) {
      return false;
    }
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchName = project.name.toLowerCase().includes(q);
      const matchDesc = (project.description || '').toLowerCase().includes(q);
      const matchCode = (project.code || '').toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCode) return false;
    }
    return true;
  });

  const handleOpenKanban = (projId) => {
    setSelectedProjectFilter(projId);
    setActiveTab('kanban');
  };

  return (
    <div className="container-fluid p-3 p-lg-4">
      {/* Header and Controls */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Project Portfolio</h4>
          <p className="text-muted small mb-0">
            Monitor high-level project health, resource spending, and task completion velocity.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          {/* Grid / Table Toggle */}
          <div className="btn-group btn-group-sm" role="group">
            <button
              className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <List size={15} />
            </button>
          </div>

          <button
            className="btn btn-primary btn-sm d-flex align-items-center gap-2 shadow-sm"
            onClick={() => setProjectModal({ isOpen: true, project: null })}
          >
            <Plus size={16} />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="custom-card p-3 mb-4">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          {/* Category Pills */}
          <div className="d-flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                className={`btn btn-sm ${
                  selectedCategory === cat ? 'btn-primary' : 'btn-outline-secondary'
                } rounded-pill text-capitalize`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div style={{ maxWidth: '280px' }} className="w-100">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search project name or code..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid Mode */}
      {viewMode === 'grid' ? (
        <div className="row g-4">
          {filteredProjects.length === 0 ? (
            <div className="col-12 text-center py-5 text-muted">
              No projects found matching the filter criteria.
            </div>
          ) : (
            filteredProjects.map(project => {
              const projTasks = tasks.filter(t => t.projectId === project.id);
              const completedCount = projTasks.filter(t => t.status === 'done').length;
              const progressPct = projTasks.length > 0 ? Math.round((completedCount / projTasks.length) * 100) : 0;
              const budgetSpent = project.budgetSpent || 0;
              const budgetTotal = project.budgetTotal || 1;
              const budgetPct = Math.min(Math.round((budgetSpent / budgetTotal) * 100), 100);

              const healthBadgeClass = {
                'On Track': 'bg-success-subtle text-success',
                'At Risk': 'bg-warning-subtle text-warning',
                'Delayed': 'bg-danger-subtle text-danger'
              }[project.health] || 'bg-secondary-subtle text-secondary';

              return (
                <div key={project.id} className="col-12 col-md-6 col-xl-4">
                  <div className="custom-card p-4 h-100 d-flex flex-column">
                    {/* Header: Color accent, Code, Category & Health */}
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className="rounded-3 d-inline-block"
                          style={{ width: '12px', height: '12px', backgroundColor: project.color || '#4f46e5' }}
                        />
                        <span className="badge bg-body-secondary text-body fw-bold">{project.code}</span>
                        <span className="text-muted small">{project.category}</span>
                      </div>
                      <span className={`badge ${healthBadgeClass}`}>
                        {project.health || 'On Track'}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h5 className="fw-bold mb-2 text-body">{project.name}</h5>
                    <p className="text-muted small mb-3 flex-grow-1 line-clamp-2" style={{ fontSize: '0.82rem' }}>
                      {project.description || 'No description provided.'}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between small text-muted mb-1">
                        <span>Task Completion</span>
                        <span className="fw-semibold text-body">{completedCount}/{projTasks.length} ({progressPct}%)</span>
                      </div>
                      <div className="progress">
                        <div
                          className="progress-bar"
                          style={{ width: `${progressPct}%`, backgroundColor: project.color || '#4f46e5' }}
                        />
                      </div>
                    </div>

                    {/* Budget & Timeline Stats */}
                    <div className="p-2 rounded-3 bg-body-tertiary mb-3 small">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-muted d-flex align-items-center gap-1">
                          <DollarSign size={13} /> Budget
                        </span>
                        <span className="fw-medium">${budgetSpent.toLocaleString()} / ${budgetTotal.toLocaleString()}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted d-flex align-items-center gap-1">
                          <Calendar size={13} /> Due Date
                        </span>
                        <span className="fw-medium">{project.dueDate || 'TBD'}</span>
                      </div>
                    </div>

                    {/* Footer: Lead Assignee & Action Buttons */}
                    <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-auto">
                      <div className="d-flex align-items-center gap-2">
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>Lead:</small>
                        <span className="fw-semibold small text-body">{project.lead || 'Alex Rivera'}</span>
                      </div>

                      <div className="d-flex align-items-center gap-1">
                        <button
                          className="btn btn-sm btn-outline-primary py-1 px-2 d-flex align-items-center gap-1"
                          onClick={() => handleOpenKanban(project.id)}
                          title="Open tasks in Kanban"
                        >
                          <ExternalLink size={13} />
                          <span style={{ fontSize: '0.75rem' }}>Board</span>
                        </button>

                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-outline-secondary border-0 p-1 rounded-circle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <MoreVertical size={14} />
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                            <li>
                              <button
                                className="dropdown-item d-flex align-items-center gap-2"
                                onClick={() => setProjectModal({ isOpen: true, project })}
                              >
                                <Edit2 size={14} className="text-primary" />
                                <span>Edit Project</span>
                              </button>
                            </li>
                            <li><hr className="dropdown-divider my-1" /></li>
                            <li>
                              <button
                                className="dropdown-item d-flex align-items-center gap-2 text-danger"
                                onClick={() => deleteProject(project.id)}
                              >
                                <Trash2 size={14} />
                                <span>Delete Project</span>
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Table Mode */
        <div className="custom-card overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="ps-4">Project</th>
                  <th scope="col">Category</th>
                  <th scope="col">Health</th>
                  <th scope="col">Progress</th>
                  <th scope="col">Budget</th>
                  <th scope="col">Due Date</th>
                  <th scope="col">Lead</th>
                  <th scope="col" className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map(project => {
                  const projTasks = tasks.filter(t => t.projectId === project.id);
                  const completedCount = projTasks.filter(t => t.status === 'done').length;
                  const progressPct = projTasks.length > 0 ? Math.round((completedCount / projTasks.length) * 100) : 0;
                  const healthBadgeClass = {
                    'On Track': 'bg-success-subtle text-success',
                    'At Risk': 'bg-warning-subtle text-warning',
                    'Delayed': 'bg-danger-subtle text-danger'
                  }[project.health] || 'bg-secondary-subtle text-secondary';

                  return (
                    <tr key={project.id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center gap-2">
                          <span
                            className="rounded-circle flex-shrink-0"
                            style={{ width: '10px', height: '10px', backgroundColor: project.color }}
                          />
                          <div>
                            <span className="fw-semibold text-body d-block">{project.name}</span>
                            <small className="text-muted">{project.code}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-body-secondary text-body">{project.category}</span>
                      </td>
                      <td>
                        <span className={`badge ${healthBadgeClass}`}>{project.health}</span>
                      </td>
                      <td style={{ minWidth: '150px' }}>
                        <div className="d-flex align-items-center gap-2">
                          <div className="progress flex-grow-1" style={{ height: '6px' }}>
                            <div
                              className="progress-bar"
                              style={{ width: `${progressPct}%`, backgroundColor: project.color }}
                            />
                          </div>
                          <small className="fw-bold text-muted">{progressPct}%</small>
                        </div>
                      </td>
                      <td>
                        <small className="text-body fw-medium">
                          ${(project.budgetSpent || 0).toLocaleString()} / ${(project.budgetTotal || 0).toLocaleString()}
                        </small>
                      </td>
                      <td>
                        <small className="text-muted">{project.dueDate || 'TBD'}</small>
                      </td>
                      <td>
                        <small className="fw-medium">{project.lead || 'Alex Rivera'}</small>
                      </td>
                      <td className="text-end pe-4">
                        <div className="d-flex align-items-center justify-content-end gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary py-1 px-2"
                            onClick={() => handleOpenKanban(project.id)}
                            title="Open in Board"
                          >
                            <ExternalLink size={13} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary py-1 px-2"
                            onClick={() => setProjectModal({ isOpen: true, project })}
                            title="Edit"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger py-1 px-2"
                            onClick={() => deleteProject(project.id)}
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
