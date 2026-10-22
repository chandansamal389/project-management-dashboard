import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { X, Plus, Trash2, CheckSquare } from 'lucide-react';

export const TaskModal = () => {
  const {
    taskModal,
    setTaskModal,
    addTask,
    updateTask,
    projects,
    teamMembers
  } = useProject();

  const isEditing = Boolean(taskModal.task);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: projects[0]?.id || '',
    status: 'todo',
    priority: 'Medium',
    assigneeId: teamMembers[0]?.id || '',
    dueDate: '',
    estimatedHours: 8,
    tagsInput: '',
    subtasks: []
  });

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (taskModal.isOpen) {
      if (taskModal.task) {
        setFormData({
          title: taskModal.task.title || '',
          description: taskModal.task.description || '',
          projectId: taskModal.task.projectId || projects[0]?.id || '',
          status: taskModal.task.status || 'todo',
          priority: taskModal.task.priority || 'Medium',
          assigneeId: taskModal.task.assigneeId || teamMembers[0]?.id || '',
          dueDate: taskModal.task.dueDate || '',
          estimatedHours: taskModal.task.estimatedHours || 8,
          tagsInput: (taskModal.task.tags || []).join(', '),
          subtasks: taskModal.task.subtasks ? [...taskModal.task.subtasks] : []
        });
      } else {
        setFormData({
          title: '',
          description: '',
          projectId: projects[0]?.id || '',
          status: taskModal.defaultStatus || 'todo',
          priority: 'Medium',
          assigneeId: teamMembers[0]?.id || '',
          dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
          estimatedHours: 8,
          tagsInput: '',
          subtasks: []
        });
      }
    }
  }, [taskModal, projects, teamMembers]);

  if (!taskModal.isOpen) return null;

  const handleClose = () => {
    setTaskModal({ isOpen: false, task: null, defaultStatus: 'todo' });
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setFormData(prev => ({
      ...prev,
      subtasks: [
        ...prev.subtasks,
        { id: `sub-${Date.now()}`, title: newSubtaskTitle.trim(), completed: false }
      ]
    }));
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (subId) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(s => s.id !== subId)
    }));
  };

  const handleToggleSubtask = (subId) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(s =>
        s.id === subId ? { ...s, completed: !s.completed } : s
      )
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const parsedTags = formData.tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      projectId: formData.projectId,
      status: formData.status,
      priority: formData.priority,
      assigneeId: formData.assigneeId,
      dueDate: formData.dueDate,
      estimatedHours: Number(formData.estimatedHours) || 0,
      tags: parsedTags,
      subtasks: formData.subtasks
    };

    if (isEditing) {
      updateTask(taskModal.task.id, payload);
    } else {
      addTask(payload);
    }

    handleClose();
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)', backdropFilter: 'blur(3px)' }}
      onClick={handleClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          {/* Modal Header */}
          <div className="modal-header">
            <h5 className="modal-title fw-bold">
              {isEditing ? 'Edit Work Item' : 'Create New Work Item'}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleClose}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="row g-3">
                {/* Title */}
                <div className="col-12">
                  <label className="form-label small fw-semibold">Task Title *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Implement OAuth2 Refresh Token Rotation"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                {/* Project & Column */}
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Project</label>
                  <select
                    className="form-select"
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Sprint Status / Column</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="backlog">Backlog</option>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="in-review">In Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                {/* Priority & Assignee */}
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Priority</label>
                  <select
                    className="form-select"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="Urgent">Urgent (Red)</option>
                    <option value="High">High (Orange)</option>
                    <option value="Medium">Medium (Yellow)</option>
                    <option value="Low">Low (Blue)</option>
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Assignee</label>
                  <select
                    className="form-select"
                    value={formData.assigneeId}
                    onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                  >
                    {teamMembers.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                    ))}
                  </select>
                </div>

                {/* Due Date & Estimated Hours */}
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Due Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Estimated Hours</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                  />
                </div>

                {/* Tags */}
                <div className="col-12">
                  <label className="form-label small fw-semibold">Tags (comma separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Backend, Security, React, API"
                    value={formData.tagsInput}
                    onChange={(e) => setFormData({ ...formData, tagsInput: e.target.value })}
                  />
                </div>

                {/* Description */}
                <div className="col-12">
                  <label className="form-label small fw-semibold">Description & Acceptance Criteria</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Describe scope, context, and key deliverables..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Subtasks Builder */}
                <div className="col-12">
                  <label className="form-label small fw-semibold d-flex align-items-center gap-1">
                    <CheckSquare size={14} className="text-primary" />
                    <span>Checklist & Subtasks</span>
                  </label>

                  <div className="d-flex flex-column gap-2 mb-2">
                    {formData.subtasks.map(st => (
                      <div key={st.id} className="d-flex align-items-center gap-2 p-2 rounded bg-body-tertiary border">
                        <input
                          type="checkbox"
                          className="form-check-input mt-0"
                          checked={st.completed}
                          onChange={() => handleToggleSubtask(st.id)}
                        />
                        <span
                          className={`flex-grow-1 small ${st.completed ? 'text-decoration-line-through text-muted' : 'text-body'}`}
                        >
                          {st.title}
                        </span>
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-danger p-0"
                          onClick={() => handleRemoveSubtask(st.id)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="input-group input-group-sm">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Add subtask item..."
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSubtask();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-primary d-flex align-items-center gap-1"
                      onClick={handleAddSubtask}
                    >
                      <Plus size={14} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm px-4 fw-semibold"
              >
                {isEditing ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
