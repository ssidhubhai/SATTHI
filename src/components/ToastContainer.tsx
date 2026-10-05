import React from 'react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${
              isSuccess
                ? 'bg-emerald-950/90 text-emerald-100 border-emerald-500/40'
                : isError
                ? 'bg-rose-950/90 text-rose-100 border-rose-500/40'
                : isWarning
                ? 'bg-amber-950/90 text-amber-100 border-amber-500/40'
                : 'bg-surface-container-lowest/95 text-on-surface border-surface-container/80 shadow-md'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`material-symbols-outlined text-[19px] shrink-0 ${
                  isSuccess
                    ? 'text-emerald-400'
                    : isError
                    ? 'text-rose-400'
                    : isWarning
                    ? 'text-amber-400'
                    : 'text-primary'
                }`}
              >
                {toast.icon || (isSuccess ? 'check_circle' : isError ? 'error' : isWarning ? 'warning' : 'info')}
              </span>
              <p className="font-label-md text-xs sm:text-label-md leading-snug line-clamp-2">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="w-8 h-8 min-w-[32px] min-h-[32px] -mr-1 rounded-full flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity shrink-0 cursor-pointer"
              aria-label="Close notification"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
