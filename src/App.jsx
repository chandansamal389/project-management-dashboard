import React from 'react';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { KanbanBoard } from './components/KanbanBoard';
import { ProjectsView } from './components/ProjectsView';
import { TeamView } from './components/TeamView';
import { TimeTracker } from './components/TimeTracker';
import { AnalyticsView } from './components/AnalyticsView';
import { TaskModal } from './components/TaskModal';
import { ProjectModal } from './components/ProjectModal';
import { QuickToast } from './components/QuickToast';

const DashboardContent = () => {
  const { activeTab } = useProject();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'kanban':
        return <KanbanBoard />;
      case 'projects':
        return <ProjectsView />;
      case 'team':
        return <TeamView />;
      case 'timetracker':
        return <TimeTracker />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-content">
        <Navbar />
        <main className="flex-grow-1 pb-5">
          {renderActiveView()}
        </main>
      </div>

      {/* Modals & Notifications */}
      <TaskModal />
      <ProjectModal />
      <QuickToast />
    </div>
  );
};

export default function App() {
  return (
    <ProjectProvider>
      <DashboardContent />
    </ProjectProvider>
  );
}
