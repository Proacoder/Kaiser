import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

type ToastOptions = {
  message: string;
  type?: 'info' | 'success' | 'error' | 'warning';
  duration?: number; // ms
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  const { addToast } = ctx;

  const toast = (options: ToastOptions) => {
    addToast(options);
  };

  return { toast };
};
