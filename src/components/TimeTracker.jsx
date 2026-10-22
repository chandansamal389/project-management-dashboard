import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Download,
  Trash2,
  DollarSign,
  Briefcase,
  CheckCircle2,
  PlusCircle
} from 'lucide-react';

export const TimeTracker = () => {
  const {
    timeLogs,
    addTimeLog,
    deleteTimeLog,
    projects,
    tasks,
    showToast
  } = useProject();

  // Stopwatch state
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [isBillable, setIsBillable] = useState(true);
  const [notes, setNotes] = useState('');

  // Interval timer
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Format seconds into HH:MM:SS
  const formatTime = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Format duration into readable "Xh Ym"
  const formatDurationReadable = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    if (hrs === 0) return `${mins}m`;
    return `${hrs}h ${mins}m`;
  };

  const handleStartPause = () => {
    setIsRunning(prev => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const handleSaveLog = () => {
    if (seconds < 10) {
      showToast('Timer too short', 'Please track at least 10 seconds before saving.', 'warning');
      return;
    }

    const proj = projects.find(p => p.id === selectedProjectId);
    const task = tasks.find(t => t.id === selectedTaskId);

    addTimeLog({
      projectId: selectedProjectId,
      taskId: selectedTaskId,
      projectName: proj?.name || 'General Project',
      taskTitle: task?.title || 'General Task / Ad-hoc',
      userName: 'Current User',
      duration: seconds,
      date: new Date().toISOString().split('T')[0],
      billable: isBillable,
      notes: notes.trim() || 'Work session'
    });

    // Reset timer
    setSeconds(0);
    setIsRunning(false);
    setNotes('');
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (timeLogs.length === 0) {
      showToast('No logs', 'No timesheet entries to export.', 'info');
      return;
    }

    const headers = ['Date', 'Project', 'Task', 'User', 'Duration (Hours)', 'Billable', 'Notes'];
    const rows = timeLogs.map(log => [
      log.date,
      `"${log.projectName.replace(/"/g, '""')}"`,
      `"${log.taskTitle.replace(/"/g, '""')}"`,
      `"${log.userName}"`,
      (log.duration / 3600).toFixed(2),
      log.billable ? 'Yes' : 'No',
      `"${(log.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `timesheets_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Export Successful', 'Timesheet CSV file downloaded.', 'success');
  };

  // Calculated Stats
  const totalSeconds = timeLogs.reduce((acc, l) => acc + (l.duration || 0), 0);
  const billableSeconds = timeLogs.filter(l => l.billable).reduce((acc, l) => acc + (l.duration || 0), 0);
  const billablePercent = totalSeconds > 0 ? Math.round((billableSeconds / totalSeconds) * 100) : 0;
  const projectTasks = tasks.filter(t => t.projectId === selectedProjectId);

  return (
    <div className="container-fluid p-3 p-lg-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Time Tracking & Timesheets</h4>
          <p className="text-muted small mb-0">
            Record billable client hours, monitor team productivity, and export timesheet logs.
          </p>
        </div>
        <button
          className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2 shadow-sm"
          onClick={handleExportCSV}
        >
          <Download size={15} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Main Stopwatch Widget Card */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-7">
          <div className="custom-card p-4 h-100">
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <Clock size={18} className="text-primary" />
              <span>Active Work Stopwatch</span>
            </h6>

            {/* Glowing Big Timer Display */}
            <div className="text-center py-3 my-2 rounded-4 bg-body-tertiary border">
              <div className="timer-display text-primary mb-2">
                {formatTime(seconds)}
              </div>
              <div className="d-flex justify-content-center gap-2">
                <button
                  className={`btn ${isRunning ? 'btn-warning' : 'btn-primary'} px-4 py-2 fw-semibold d-flex align-items-center gap-2`}
                  onClick={handleStartPause}
                >
                  {isRunning ? <Pause size={18} /> : <Play size={18} />}
                  <span>{isRunning ? 'Pause' : 'Start Timer'}</span>
                </button>
                <button
                  className="btn btn-outline-secondary px-3 py-2"
                  onClick={handleReset}
                  title="Reset Timer"
                >
                  <RotateCcw size={18} />
                </button>
                <button
                  className="btn btn-success px-4 py-2 fw-semibold d-flex align-items-center gap-2"
                  onClick={handleSaveLog}
                  disabled={seconds < 10}
                >
                  <CheckCircle2 size={18} />
                  <span>Log Time</span>
                </button>
              </div>
            </div>

            {/* Context Inputs for Active Timer */}
            <div className="row g-3 mt-1">
              <div className="col-12 col-sm-6">
                <label className="form-label small fw-semibold text-muted">Project</label>
                <select
                  className="form-select form-select-sm"
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-sm-6">
                <label className="form-label small fw-semibold text-muted">Task</label>
                <select
                  className="form-select form-select-sm"
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                >
                  <option value="">General Project Work (No specific task)</option>
                  {projectTasks.map(t => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-sm-8">
                <label className="form-label small fw-semibold text-muted">Session Notes</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="What are you working on?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="col-12 col-sm-4 d-flex align-items-end pb-1">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="billableSwitch"
                    checked={isBillable}
                    onChange={(e) => setIsBillable(e.target.checked)}
                  />
                  <label className="form-check-label small fw-semibold" htmlFor="billableSwitch">
                    Billable Work
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timesheet Summary Metrics */}
        <div className="col-12 col-lg-5">
          <div className="row g-3 h-100">
            <div className="col-12">
              <div className="custom-card p-4">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-muted small fw-semibold">Total Logged Time</span>
                  <Clock size={18} className="text-primary" />
                </div>
                <h3 className="fw-bold mb-1">{formatDurationReadable(totalSeconds)}</h3>
                <small className="text-muted">Recorded across all project milestones</small>
              </div>
            </div>

            <div className="col-12">
              <div className="custom-card p-4">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-muted small fw-semibold">Billable Efficiency</span>
                  <DollarSign size={18} className="text-success" />
                </div>
                <div className="d-flex align-items-baseline gap-2 mb-2">
                  <h3 className="fw-bold mb-0">{billablePercent}%</h3>
                  <small className="text-success fw-medium">
                    ({formatDurationReadable(billableSeconds)} billable)
                  </small>
                </div>
                <div className="progress">
                  <div
                    className="progress-bar bg-success"
                    style={{ width: `${billablePercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timesheet History Table */}
      <div className="custom-card overflow-hidden">
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
          <h6 className="fw-bold mb-0">Timesheet Logs</h6>
          <span className="badge bg-body-secondary text-body">{timeLogs.length} Records</span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col" className="ps-4">Date</th>
                <th scope="col">Project</th>
                <th scope="col">Task</th>
                <th scope="col">User</th>
                <th scope="col">Duration</th>
                <th scope="col">Type</th>
                <th scope="col">Notes</th>
                <th scope="col" className="text-end pe-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {timeLogs.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    No time entries logged yet. Start the stopwatch above!
                  </td>
                </tr>
              ) : (
                timeLogs.map(log => (
                  <tr key={log.id}>
                    <td className="ps-4">
                      <small className="fw-semibold text-body">{log.date}</small>
                    </td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary">
                        {log.projectName}
                      </span>
                    </td>
                    <td>
                      <small className="text-body fw-medium d-block text-truncate" style={{ maxWidth: '200px' }}>
                        {log.taskTitle}
                      </small>
                    </td>
                    <td>
                      <small className="text-muted">{log.userName}</small>
                    </td>
                    <td>
                      <span className="badge bg-secondary-subtle text-secondary fw-semibold">
                        {formatDurationReadable(log.duration)}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${log.billable ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-muted'}`}>
                        {log.billable ? 'Billable' : 'Internal'}
                      </span>
                    </td>
                    <td>
                      <small className="text-muted text-truncate d-block" style={{ maxWidth: '240px' }}>
                        {log.notes || '—'}
                      </small>
                    </td>
                    <td className="text-end pe-4">
                      <button
                        className="btn btn-sm btn-outline-danger border-0 p-1"
                        onClick={() => deleteTimeLog(log.id)}
                        title="Delete entry"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
