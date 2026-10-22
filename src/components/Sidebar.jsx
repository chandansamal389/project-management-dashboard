import React from 'react';
import { useProject } from '../context/ProjectContext';
import {
  LayoutDashboard,
  KanbanSquare,
  FolderKanban,
  Users,
  Clock,
  BarChart3,
  RotateCcw,
  Layers,
  ChevronRight,
  X
} from 'lucide-react';

export const Sidebar = () => {
  const {
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
    tasks,
    projects,
    teamMembers,
    setSelectedProjectFilter,
    resetToDemoData
  } = useProject();

  const openTasksCount = tasks.filter(t => t.status !== 'done').length;

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'kanban', label: 'Kanban Board', icon: KanbanSquare, badge: openTasksCount },
    { id: 'projects', label: 'Projects', icon: FolderKanban, badge: projects.length },
    { id: 'team', label: 'Team', icon: Users, badge: teamMembers.length },
    { id: 'timetracker', label: 'Time Tracker', icon: Clock },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (window.innerWidth < 992) {
      setSidebarOpen(false);
    }
  };

  const handleProjectFilterClick = (projId) => {
    setSelectedProjectFilter(projId);
    setActiveTab('kanban');
    if (window.innerWidth < 992) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop d-lg-none"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar p-3 ${sidebarOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <div
              className="d-flex align-items-center justify-content-center text-white rounded-3 shadow-sm"
              style={{ width: '36px', height: '36px', backgroundColor: '#4f46e5' }}
            >
              <Layers size={20} />
            </div>
            <div>
              <span className="fw-bold fs-5 tracking-tight d-block lh-1">PulseFlow</span>
              <small className="text-muted" style={{ fontSize: '0.72rem' }}>Workspace v2.4</small>
            </div>
          </div>
          <button
            className="btn btn-sm btn-outline-secondary border-0 d-lg-none"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="mb-4">
          <small className="text-uppercase text-muted fw-bold px-2 mb-2 d-block" style={{ fontSize: '0.68rem', letterSpacing: '0.08em' }}>
            Main Menu
          </small>
          <nav className="d-flex flex-column gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`nav-link-custom ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <Icon size={18} className="me-2 flex-shrink-0" />
                  <span className="flex-grow-1 text-start">{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`badge rounded-pill ${
                        isActive ? 'bg-primary text-white' : 'bg-body-secondary text-body'
                      }`}
                      style={{ fontSize: '0.7rem' }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Projects List */}
        <div className="mb-auto">
          <div className="d-flex align-items-center justify-content-between px-2 mb-2">
            <small className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.68rem', letterSpacing: '0.08em' }}>
              Active Projects
            </small>
          </div>
          <div className="d-flex flex-column gap-1" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {projects.slice(0, 5).map(proj => (
              <button
                key={proj.id}
                className="btn btn-sm text-start d-flex align-items-center gap-2 px-2 py-1 text-body-secondary border-0 w-100 rounded-2 hover-bg"
                style={{ fontSize: '0.82rem' }}
                onClick={() => handleProjectFilterClick(proj.id)}
                title={`Filter board by ${proj.name}`}
              >
                <span
                  className="rounded-circle flex-shrink-0"
                  style={{ width: '8px', height: '8px', backgroundColor: proj.color || '#4f46e5' }}
                />
                <span className="text-truncate flex-grow-1">{proj.name}</span>
                <ChevronRight size={12} className="text-muted opacity-50" />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Workspace Card & Reset Demo */}
        <div className="pt-3 border-top mt-3">
          <div className="p-3 rounded-3 bg-body-tertiary mb-3 border">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <span className="fw-semibold small">Pro Workspace</span>
              <span className="badge bg-success-subtle text-success" style={{ fontSize: '0.68rem' }}>Active</span>
            </div>
            <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
              {tasks.filter(t => t.status === 'done').length} of {tasks.length} total tasks delivered.
            </p>
          </div>

          <button
            className="btn btn-sm btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2 py-1"
            style={{ fontSize: '0.8rem' }}
            onClick={resetToDemoData}
            title="Restore sample demo data"
          >
            <RotateCcw size={14} />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </aside>
    </>
  );
};
