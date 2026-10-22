import React from 'react';
import { useProject } from '../context/ProjectContext';
import {
  Search,
  Moon,
  Sun,
  Plus,
  Bell,
  Menu,
  CheckCircle2,
  FolderPlus
} from 'lucide-react';

export const Navbar = () => {
  const {
    theme,
    toggleTheme,
    searchQuery,
    setSearchQuery,
    setSidebarOpen,
    setTaskModal,
    setProjectModal,
    toasts,
    activityLog
  } = useProject();

  return (
    <header className="topbar px-3 px-lg-4 d-flex align-items-center justify-content-between">
      {/* Left: Mobile Toggle & Global Search */}
      <div className="d-flex align-items-center gap-3 flex-grow-1" style={{ maxWidth: '480px' }}>
        <button
          className="btn btn-sm btn-outline-secondary d-lg-none border-0"
          onClick={() => setSidebarOpen(prev => !prev)}
          title="Toggle Navigation"
        >
          <Menu size={22} />
        </button>

        <div className="search-box d-flex align-items-center w-100 position-relative">
          <Search size={16} className="text-secondary me-2 flex-shrink-0" />
          <input
            type="text"
            className="form-control form-control-sm border-0 bg-transparent p-0 shadow-none text-body"
            placeholder="Search tasks, projects, team..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="btn btn-sm p-0 text-secondary border-0 position-absolute end-0 me-2"
              onClick={() => setSearchQuery('')}
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Right: Actions, Theme Toggle, Notifications, Profile */}
      <div className="d-flex align-items-center gap-2 gap-sm-3 ms-2">
        {/* Quick New Action Dropdown */}
        <div className="dropdown">
          <button
            className="btn btn-primary btn-sm d-flex align-items-center gap-1 shadow-sm px-2 px-sm-3 fw-semibold"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <Plus size={16} />
            <span className="d-none d-sm-inline">Create</span>
          </button>
          <ul className="dropdown-menu dropdown-menu-end shadow-sm">
            <li>
              <button
                className="dropdown-item d-flex align-items-center gap-2"
                onClick={() => setTaskModal({ isOpen: true, task: null, defaultStatus: 'todo' })}
              >
                <CheckCircle2 size={16} className="text-primary" />
                <span>New Task</span>
              </button>
            </li>
            <li>
              <button
                className="dropdown-item d-flex align-items-center gap-2"
                onClick={() => setProjectModal({ isOpen: true, project: null })}
              >
                <FolderPlus size={16} className="text-indigo" />
                <span>New Project</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Dark/Light Theme Switch */}
        <button
          className="btn btn-sm btn-outline-secondary border-0 p-2 text-body rounded-circle d-flex align-items-center justify-content-center"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} className="text-warning" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="dropdown">
          <button
            className="btn btn-sm btn-outline-secondary border-0 p-2 text-body rounded-circle position-relative d-flex align-items-center justify-content-center"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            title="Notifications"
          >
            <Bell size={18} />
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
              <span className="visually-hidden">New notifications</span>
            </span>
          </button>
          <div className="dropdown-menu dropdown-menu-end shadow-lg p-0" style={{ width: '320px' }}>
            <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
              <h6 className="mb-0 fw-bold">Recent Updates</h6>
              <span className="badge bg-primary-subtle text-primary">Live</span>
            </div>
            <div className="list-group list-group-flush" style={{ maxHeight: '280px', overflowY: 'auto' }}>
              {activityLog.slice(0, 5).map(act => (
                <div key={act.id} className="list-group-item list-group-item-action p-2 px-3 border-0">
                  <div className="d-flex align-items-start gap-2">
                    <div className="rounded-circle p-1 bg-primary-subtle text-primary mt-1">
                      <CheckCircle2 size={12} />
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-0 small text-body">
                        <strong>{act.user}</strong> {act.action} <span className="text-primary">{act.target}</span>
                      </p>
                      <small className="text-muted">{act.timestamp}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Current User Pill */}
        <div className="d-flex align-items-center gap-2 ps-2 border-start">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="Alex Rivera"
            className="rounded-circle object-fit-cover border"
            style={{ width: '34px', height: '34px' }}
          />
          <div className="d-none d-xl-block text-start lh-1">
            <span className="d-block fw-semibold small">Alex Rivera</span>
            <small className="text-muted" style={{ fontSize: '0.75rem' }}>Workspace Admin</small>
          </div>
        </div>
      </div>
    </header>
  );
};
