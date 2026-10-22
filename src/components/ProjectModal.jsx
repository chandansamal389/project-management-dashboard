import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';

const COLOR_PRESETS = [
  '#4f46e5', // Indigo
  '#06b6d4', // Cyan
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#3b82f6'  // Blue
];

export const ProjectModal = () => {
  const {
    projectModal,
    setProjectModal,
    addProject,
    updateProject,
    teamMembers
  } = useProject();

  const isEditing = Boolean(projectModal.project);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: 'Engineering',
    description: '',
    color: '#4f46e5',
    health: 'On Track',
    startDate: '',
    dueDate: '',
    budgetTotal: 30000,
    lead: teamMembers[0]?.name || 'Alex Rivera'
  });

  useEffect(() => {
    if (projectModal.isOpen) {
      if (projectModal.project) {
        setFormData({
          name: projectModal.project.name || '',
          code: projectModal.project.code || '',
          category: projectModal.project.category || 'Engineering',
          description: projectModal.project.description || '',
          color: projectModal.project.color || '#4f46e5',
          health: projectModal.project.health || 'On Track',
          startDate: projectModal.project.startDate || '',
          dueDate: projectModal.project.dueDate || '',
          budgetTotal: projectModal.project.budgetTotal || 30000,
          lead: projectModal.project.lead || teamMembers[0]?.name || 'Alex Rivera'
        });
      } else {
        setFormData({
          name: '',
          code: '',
          category: 'Engineering',
          description: '',
          color: '#4f46e5',
          health: 'On Track',
          startDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
          budgetTotal: 35000,
          lead: teamMembers[0]?.name || 'Alex Rivera'
        });
      }
    }
  }, [projectModal, teamMembers]);

  if (!projectModal.isOpen) return null;

  const handleClose = () => {
    setProjectModal({ isOpen: false, project: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const payload = {
      name: formData.name.trim(),
      code: formData.code.trim() || formData.name.substring(0, 3).toUpperCase(),
      category: formData.category,
      description: formData.description.trim(),
      color: formData.color,
      health: formData.health,
      startDate: formData.startDate,
      dueDate: formData.dueDate,
      budgetTotal: Number(formData.budgetTotal) || 0,
      lead: formData.lead
    };

    if (isEditing) {
      updateProject(projectModal.project.id, payload);
    } else {
      addProject(payload);
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
          <div className="modal-header">
            <h5 className="modal-title fw-bold">
              {isEditing ? 'Edit Project Details' : 'Create New Project'}
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
                {/* Project Name */}
                <div className="col-12 col-md-8">
                  <label className="form-label small fw-semibold">Project Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. NextGen Microservices Platform"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Project Code */}
                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold">Code / Prefix</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. NMP-1"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>

                {/* Category & Health */}
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="DevOps & Cloud">DevOps & Cloud</option>
                    <option value="Product & UX">Product & UX</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Design Systems">Design Systems</option>
                    <option value="Security & Compliance">Security & Compliance</option>
                    <option value="Engineering">Engineering</option>
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Health Status</label>
                  <select
                    className="form-select"
                    value={formData.health}
                    onChange={(e) => setFormData({ ...formData, health: e.target.value })}
                  >
                    <option value="On Track">On Track (Green)</option>
                    <option value="At Risk">At Risk (Yellow)</option>
                    <option value="Delayed">Delayed (Red)</option>
                  </select>
                </div>

                {/* Color Palette Selector */}
                <div className="col-12">
                  <label className="form-label small fw-semibold d-block">Theme Accent Color</label>
                  <div className="d-flex align-items-center gap-2">
                    {COLOR_PRESETS.map(c => (
                      <button
                        type="button"
                        key={c}
                        className={`rounded-circle border-0 ${formData.color === c ? 'ring-active' : ''}`}
                        style={{
                          width: '28px',
                          height: '28px',
                          backgroundColor: c,
                          outline: formData.color === c ? '3px solid #6366f1' : 'none',
                          outlineOffset: '2px',
                          cursor: 'pointer'
                        }}
                        onClick={() => setFormData({ ...formData, color: c })}
                      />
                    ))}
                  </div>
                </div>

                {/* Dates */}
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Target Delivery Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>

                {/* Budget & Lead */}
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Total Budget ($ USD)</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    className="form-control"
                    value={formData.budgetTotal}
                    onChange={(e) => setFormData({ ...formData, budgetTotal: e.target.value })}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Project Lead</label>
                  <select
                    className="form-select"
                    value={formData.lead}
                    onChange={(e) => setFormData({ ...formData, lead: e.target.value })}
                  >
                    {teamMembers.map(m => (
                      <option key={m.id} value={m.name}>{m.name} ({m.role})</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="col-12">
                  <label className="form-label small fw-semibold">Project Scope & Summary</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Key strategic objectives, target metrics, stakeholders..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
            </div>

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
                {isEditing ? 'Save Changes' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
