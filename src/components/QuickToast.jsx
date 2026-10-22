import React from 'react';
import { useProject } from '../context/ProjectContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const QuickToast = () => {
  const { toasts, removeToast } = useProject();

  if (toasts.length === 0) return null;

  return (
    <div
      className="toast-container position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 1090 }}
    >
      {toasts.map(toast => {
        let Icon = CheckCircle2;
        let borderClass = 'border-primary';
        let bgClass = 'bg-primary-subtle text-primary';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderClass = 'border-success';
          bgClass = 'bg-success-subtle text-success';
        } else if (toast.type === 'warning') {
          Icon = AlertCircle;
          borderClass = 'border-warning';
          bgClass = 'bg-warning-subtle text-warning';
        } else if (toast.type === 'danger') {
          Icon = AlertCircle;
          borderClass = 'border-danger';
          bgClass = 'bg-danger-subtle text-danger';
        }

        return (
          <div
            key={toast.id}
            className={`toast show custom-card mb-2 border ${borderClass} shadow-lg`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            style={{ minWidth: '280px' }}
          >
            <div className="toast-header border-0 bg-transparent py-2 px-3">
              <span className={`rounded-circle p-1 me-2 d-flex align-items-center justify-content-center ${bgClass}`}>
                <Icon size={14} />
              </span>
              <strong className="me-auto small text-body">{toast.title}</strong>
              <button
                type="button"
                className="btn-close ms-2"
                aria-label="Close"
                onClick={() => removeToast(toast.id)}
              />
            </div>
            {toast.message && (
              <div className="toast-body pt-0 pb-2 px-3 small text-muted">
                {toast.message}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
