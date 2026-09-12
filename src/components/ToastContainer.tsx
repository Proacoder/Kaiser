import React from 'react';
import { ToastContext } from '../context/ToastContext';

export const ToastContainer: React.FC = () => {
  const ctx = React.useContext(ToastContext);
  if (!ctx) return null;
  const { toasts, removeToast } = ctx;

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center p-3 rounded-xl shadow-md transition-opacity duration-300 ${
            toast.type === 'error'
              ? 'bg-red-600 text-white'
              : toast.type === 'success'
              ? 'bg-green-600 text-white'
              : toast.type === 'warning'
              ? 'bg-yellow-600 text-white'
              : 'bg-slate-800 text-white'
          }`}
          role="alert"
        >
          <span className="flex-1 text-sm">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 text-sm underline"
          >
            dismiss
          </button>
        </div>
      ))}
    </div>
  );
};
