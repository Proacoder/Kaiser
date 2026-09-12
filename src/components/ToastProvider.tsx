import React, { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const toastCtx = useContext(ToastContext);
  if (!toastCtx) return null;
  const { toasts, removeToast } = toastCtx;

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 flex flex-col space-y-2 z-50 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`max-w-xs w-full bg-${toast.type ?? 'info'}-600 text-white px-4 py-2 rounded shadow-lg pointer-events-auto transition-opacity duration-300`}
            onClick={() => removeToast(toast.id)}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </>
  );
};
