import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckSquare,
  Clock,
  Calendar,
  Trash2,
  Edit2,
  ArrowRight,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';

const COLUMNS = [
  { id: 'backlog', title: 'Backlog', color: '#64748b' },
  { id: 'todo', title: 'To Do', color: '#3b82f6' },
  { id: 'in-progress', title: 'In Progress', color: '#eab308' },
  { id: 'in-review', title: 'In Review', color: '#8b5cf6' },
  { id: 'done', title: 'Done', color: '#22c55e' }
];

export const KanbanBoard = () => {
  const {
    tasks,
    projects,
    teamMembers,
    moveTask,
    deleteTask,
    toggleSubtask,
    setTaskModal,
    searchQuery,
    setSearchQuery,
    selectedProjectFilter,
    setSelectedProjectFilter,
    selectedPriorityFilter,
    setSelectedPriorityFilter,
    selectedAssigneeFilter,
    setSelectedAssigneeFilter
  } = useProject();

  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [activeDragCol, setActiveDragCol] = useState(null);

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    // Project filter
    if (selectedProjectFilter !== 'all' && task.projectId !== selectedProjectFilter) {
      return false;
    }
    // Priority filter
    if (selectedPriorityFilter !== 'all' && task.priority !== selectedPriorityFilter) {
      return false;
    }
    // Assignee filter
    if (selectedAssigneeFilter !== 'all' && task.assigneeId !== selectedAssigneeFilter) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = (task.description || '').toLowerCase().includes(q);
      const matchTags = (task.tags || []).some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTags) return false;
    }
    return true;
  });

  // Drag and Drop handlers
  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDragCol !== colId) {
      setActiveDragCol(colId);
    }
  };

  const handleDragLeave = (e, colId) => {
    if (activeDragCol === colId) {
      setActiveDragCol(null);
    }
  };

  const handleDrop = (e, colId) => {
    e.preventDefault();
    setActiveDragCol(null);
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      moveTask(taskId, colId);
      setDraggedTaskId(null);
    }
  };

  const resetFilters = () => {
    setSelectedProjectFilter('all');
    setSelectedPriorityFilter('all');
    setSelectedAssigneeFilter('all');
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedProjectFilter !== 'all' ||
    selectedPriorityFilter !== 'all' ||
    selectedAssigneeFilter !== 'all' ||
    searchQuery !== '';

  return (
    <div className="container-fluid p-3 p-lg-4">
      {/* Board Header & Controls */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Agile Sprint Board</h4>
          <p className="text-muted small mb-0">
            Drag and drop cards across columns or use the move options to transition work items.
          </p>
        </div>
        <button
          className="btn btn-primary btn-sm d-flex align-items-center gap-2 shadow-sm align-self-start align-self-md-auto"
          onClick={() => setTaskModal({ isOpen: true, task: null, defaultStatus: 'todo' })}
        >
          <Plus size={16} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="custom-card p-3 mb-4">
        <div className="row g-2 align-items-center">
          {/* Project Filter */}
          <div className="col-12 col-sm-6 col-md-3">
            <label className="form-label text-muted small mb-1">Project</label>
            <select
              className="form-select form-select-sm"
              value={selectedProjectFilter}
              onChange={(e) => setSelectedProjectFilter(e.target.value)}
            >
              <option value="all">All Projects</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="col-12 col-sm-6 col-md-3">
            <label className="form-label text-muted small mb-1">Priority</label>
            <select
              className="form-select form-select-sm"
              value={selectedPriorityFilter}
              onChange={(e) => setSelectedPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Assignee Filter */}
          <div className="col-12 col-sm-6 col-md-3">
            <label className="form-label text-muted small mb-1">Assignee</label>
            <select
              className="form-select form-select-sm"
              value={selectedAssigneeFilter}
              onChange={(e) => setSelectedAssigneeFilter(e.target.value)}
            >
              <option value="all">All Assignees</option>
              {teamMembers.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          <div className="col-12 col-sm-6 col-md-3 d-flex align-items-end">
            <button
              className={`btn btn-sm w-100 ${hasActiveFilters ? 'btn-outline-danger' : 'btn-outline-secondary'}`}
              onClick={resetFilters}
              disabled={!hasActiveFilters}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Columns Horizontal Container */}
      <div className="kanban-wrapper">
        {COLUMNS.map(column => {
          const columnTasks = filteredTasks.filter(t => t.status === column.id);

          return (
            <div key={column.id} className="kanban-column">
              {/* Column Header */}
              <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <span
                    className="rounded-circle"
                    style={{ width: '10px', height: '10px', backgroundColor: column.color }}
                  />
                  <h6 className="fw-bold mb-0 text-body small">{column.title}</h6>
                  <span className="badge rounded-pill bg-body-secondary text-body small" style={{ fontSize: '0.7rem' }}>
                    {columnTasks.length}
                  </span>
                </div>
                <button
                  className="btn btn-sm btn-outline-secondary p-1 border-0"
                  onClick={() => setTaskModal({ isOpen: true, task: null, defaultStatus: column.id })}
                  title={`Add task to ${column.title}`}
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Column Body / Dropzone */}
              <div
                className={`kanban-column-body ${activeDragCol === column.id ? 'drag-over' : ''}`}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={(e) => handleDragLeave(e, column.id)}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {columnTasks.length === 0 ? (
                  <div className="text-center py-4 text-muted small opacity-50">
                    No tasks here
                  </div>
                ) : (
                  columnTasks.map(task => {
                    const project = projects.find(p => p.id === task.projectId);
                    const assignee = teamMembers.find(m => m.id === task.assigneeId);
                    const subtasks = task.subtasks || [];
                    const completedSubtasks = subtasks.filter(st => st.completed).length;

                    const priorityClass = {
                      'Urgent': 'badge-urgent',
                      'High': 'badge-high',
                      'Medium': 'badge-medium',
                      'Low': 'badge-low'
                    }[task.priority] || 'badge-secondary';

                    return (
                      <div
                        key={task.id}
                        className={`task-card ${draggedTaskId === task.id ? 'is-dragging' : ''}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                      >
                        {/* Card Header: Project & Priority Badge */}
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <span
                            className="badge text-truncate"
                            style={{
                              maxWidth: '150px',
                              backgroundColor: `${project?.color || '#4f46e5'}20`,
                              color: project?.color || '#4f46e5'
                            }}
                          >
                            {project?.name || 'Project'}
                          </span>
                          <span className={`badge ${priorityClass}`} style={{ fontSize: '0.7rem' }}>
                            {task.priority}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <h6 className="fw-semibold text-body mb-1" style={{ fontSize: '0.9rem' }}>
                          {task.title}
                        </h6>
                        {task.description && (
                          <p className="text-muted small mb-2 line-clamp-2" style={{ fontSize: '0.78rem' }}>
                            {task.description}
                          </p>
                        )}

                        {/* Subtasks Progress */}
                        {subtasks.length > 0 && (
                          <div className="mb-2">
                            <div className="d-flex align-items-center justify-content-between text-muted mb-1" style={{ fontSize: '0.72rem' }}>
                              <span className="d-flex align-items-center gap-1">
                                <CheckSquare size={12} />
                                Subtasks
                              </span>
                              <span>{completedSubtasks}/{subtasks.length}</span>
                            </div>
                            <div className="progress" style={{ height: '5px' }}>
                              <div
                                className="progress-bar bg-primary"
                                style={{ width: `${(completedSubtasks / subtasks.length) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        {task.tags && task.tags.length > 0 && (
                          <div className="d-flex flex-wrap gap-1 mb-2">
                            {task.tags.map((tag, idx) => (
                              <span key={idx} className="badge bg-body-tertiary text-muted border" style={{ fontSize: '0.68rem' }}>
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Card Footer: Assignee, Due Date, Menu */}
                        <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-2">
                          <div className="d-flex align-items-center gap-2">
                            {assignee ? (
                              <img
                                src={assignee.avatar}
                                alt={assignee.name}
                                className="rounded-circle border"
                                style={{ width: '26px', height: '26px', objectFit: 'cover' }}
                                title={`Assigned to ${assignee.name}`}
                              />
                            ) : (
                              <div
                                className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                                style={{ width: '26px', height: '26px', fontSize: '0.7rem' }}
                              >
                                ?
                              </div>
                            )}

                            {task.dueDate && (
                              <span className="text-muted small d-flex align-items-center gap-1" style={{ fontSize: '0.72rem' }}>
                                <Calendar size={12} />
                                {task.dueDate.substring(5)}
                              </span>
                            )}
                          </div>

                          {/* Quick Actions Dropdown */}
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
                                  onClick={() => setTaskModal({ isOpen: true, task, defaultStatus: task.status })}
                                >
                                  <Edit2 size={14} className="text-primary" />
                                  <span>Edit Task</span>
                                </button>
                              </li>
                              <li><hr className="dropdown-divider my-1" /></li>
                              <li className="dropdown-header small text-muted">Move to column:</li>
                              {COLUMNS.filter(c => c.id !== task.status).map(c => (
                                <li key={c.id}>
                                  <button
                                    className="dropdown-item d-flex align-items-center gap-2 small py-1"
                                    onClick={() => moveTask(task.id, c.id)}
                                  >
                                    <span className="rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: c.color }} />
                                    <span>{c.title}</span>
                                  </button>
                                </li>
                              ))}
                              <li><hr className="dropdown-divider my-1" /></li>
                              <li>
                                <button
                                  className="dropdown-item d-flex align-items-center gap-2 text-danger"
                                  onClick={() => deleteTask(task.id)}
                                >
                                  <Trash2 size={14} />
                                  <span>Delete</span>
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
