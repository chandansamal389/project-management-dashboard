import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_PROJECTS,
  INITIAL_TEAM,
  INITIAL_TASKS,
  INITIAL_ACTIVITY,
  INITIAL_TIMELOGS
} from '../data/initialData';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('pulseflow_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('pulseflow_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Projects
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('pulseflow_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  // Tasks
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('pulseflow_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  // Team
  const [teamMembers, setTeamMembers] = useState(() => {
    const saved = localStorage.getItem('pulseflow_team');
    return saved ? JSON.parse(saved) : INITIAL_TEAM;
  });

  // Activity Log
  const [activityLog, setActivityLog] = useState(() => {
    const saved = localStorage.getItem('pulseflow_activity');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY;
  });

  // Time Logs
  const [timeLogs, setTimeLogs] = useState(() => {
    const saved = localStorage.getItem('pulseflow_timelogs');
    return saved ? JSON.parse(saved) : INITIAL_TIMELOGS;
  });

  // Navigation & UI state
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState('all');
  const [selectedAssigneeFilter, setSelectedAssigneeFilter] = useState('all');

  // Modals state
  const [taskModal, setTaskModal] = useState({ isOpen: false, task: null, defaultStatus: 'todo' });
  const [projectModal, setProjectModal] = useState({ isOpen: false, project: null });

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const showToast = (title, message, type = 'primary') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('pulseflow_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('pulseflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('pulseflow_team', JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem('pulseflow_activity', JSON.stringify(activityLog));
  }, [activityLog]);

  useEffect(() => {
    localStorage.setItem('pulseflow_timelogs', JSON.stringify(timeLogs));
  }, [timeLogs]);

  // Log activity helper
  const recordActivity = (user, action, target, type = 'info') => {
    const newAct = {
      id: `act-${Date.now()}`,
      user,
      action,
      target,
      timestamp: 'Just now',
      type
    };
    setActivityLog(prev => [newAct, ...prev.slice(0, 19)]);
  };

  // Task Actions
  const addTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      commentsCount: 0,
      loggedHours: 0,
      subtasks: taskData.subtasks || []
    };
    setTasks(prev => [newTask, ...prev]);
    recordActivity('Current User', 'created new task', newTask.title, 'success');
    showToast('Task Created', `"${newTask.title}" was added successfully.`, 'success');
  };

  const updateTask = (taskId, fields) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, ...fields } : t))
    );
    recordActivity('Current User', 'updated task', fields.title || 'a task', 'info');
    showToast('Task Updated', 'Task changes have been saved.', 'info');
  };

  const deleteTask = (taskId) => {
    const target = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (target) {
      recordActivity('Current User', 'deleted task', target.title, 'warning');
      showToast('Task Deleted', `"${target.title}" was removed.`, 'warning');
    }
  };

  const moveTask = (taskId, newStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === newStatus) return;

    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    const readableStatus = {
      'backlog': 'Backlog',
      'todo': 'To Do',
      'in-progress': 'In Progress',
      'in-review': 'In Review',
      'done': 'Done'
    }[newStatus] || newStatus;

    recordActivity('Current User', `moved task to ${readableStatus}`, task.title, 'primary');
    showToast('Status Changed', `"${task.title}" is now ${readableStatus}`, 'primary');
  };

  const toggleSubtask = (taskId, subtaskId) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id !== taskId) return task;
        const updatedSubtasks = (task.subtasks || []).map(st =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        return { ...task, subtasks: updatedSubtasks };
      })
    );
  };

  // Project Actions
  const addProject = (projectData) => {
    const newProj = {
      ...projectData,
      id: `proj-${Date.now()}`,
      code: projectData.code || projectData.name.substring(0, 3).toUpperCase(),
      budgetSpent: 0,
      health: 'On Track',
      status: 'In Progress'
    };
    setProjects(prev => [newProj, ...prev]);
    recordActivity('Current User', 'created project', newProj.name, 'success');
    showToast('Project Created', `Project "${newProj.name}" created.`, 'success');
  };

  const updateProject = (projectId, fields) => {
    setProjects(prev =>
      prev.map(p => (p.id === projectId ? { ...p, ...fields } : p))
    );
    recordActivity('Current User', 'modified project', fields.name || 'project', 'info');
    showToast('Project Updated', 'Project updated successfully.', 'info');
  };

  const deleteProject = (projectId) => {
    const proj = projects.find(p => p.id === projectId);
    setProjects(prev => prev.filter(p => p.id !== projectId));
    // Also remove associated tasks
    setTasks(prev => prev.filter(t => t.projectId !== projectId));
    if (proj) {
      recordActivity('Current User', 'deleted project', proj.name, 'warning');
      showToast('Project Removed', `"${proj.name}" and associated tasks removed.`, 'warning');
    }
  };

  // Time Tracking Actions
  const addTimeLog = (logEntry) => {
    const newEntry = {
      ...logEntry,
      id: `tl-${Date.now()}`
    };
    setTimeLogs(prev => [newEntry, ...prev]);

    // Also update loggedHours in the respective task
    if (logEntry.taskId) {
      const hours = Math.round((logEntry.duration / 3600) * 10) / 10;
      setTasks(prev =>
        prev.map(t =>
          t.id === logEntry.taskId
            ? { ...t, loggedHours: (t.loggedHours || 0) + hours }
            : t
        )
      );
    }

    recordActivity('Current User', 'logged time', `${Math.round(logEntry.duration / 60)} mins on ${logEntry.projectName}`, 'info');
    showToast('Time Logged', `Logged time successfully.`, 'success');
  };

  const deleteTimeLog = (logId) => {
    setTimeLogs(prev => prev.filter(l => l.id !== logId));
    showToast('Log Removed', 'Timesheet entry deleted.', 'info');
  };

  // Reset demo data
  const resetToDemoData = () => {
    setProjects(INITIAL_PROJECTS);
    setTasks(INITIAL_TASKS);
    setTeamMembers(INITIAL_TEAM);
    setActivityLog(INITIAL_ACTIVITY);
    setTimeLogs(INITIAL_TIMELOGS);
    localStorage.removeItem('pulseflow_projects');
    localStorage.removeItem('pulseflow_tasks');
    localStorage.removeItem('pulseflow_team');
    localStorage.removeItem('pulseflow_activity');
    localStorage.removeItem('pulseflow_timelogs');
    showToast('Reset Complete', 'Default workspace demo data restored.', 'info');
  };

  return (
    <ProjectContext.Provider
      value={{
        theme,
        toggleTheme,
        projects,
        tasks,
        teamMembers,
        activityLog,
        timeLogs,
        activeTab,
        setActiveTab,
        sidebarOpen,
        setSidebarOpen,
        searchQuery,
        setSearchQuery,
        selectedProjectFilter,
        setSelectedProjectFilter,
        selectedPriorityFilter,
        setSelectedPriorityFilter,
        selectedAssigneeFilter,
        setSelectedAssigneeFilter,
        taskModal,
        setTaskModal,
        projectModal,
        setProjectModal,
        toasts,
        showToast,
        removeToast,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        toggleSubtask,
        addProject,
        updateProject,
        deleteProject,
        addTimeLog,
        deleteTimeLog,
        resetToDemoData
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
