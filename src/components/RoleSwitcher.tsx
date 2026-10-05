import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const RoleSwitcher: React.FC = () => {
  const { role, setRole, activeRequest, resetDemoState } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const hasActiveJob =
    activeRequest &&
    activeRequest.status !== 'COMPLETED' &&
    activeRequest.status !== 'CANCELLED';

  if (collapsed) {
    return (
      <div className="fixed bottom-20 right-3 z-50 pointer-events-auto">
        <button
          onClick={() => setCollapsed(false)}
          className="w-10 h-10 rounded-full bg-inverse-surface text-inverse-on-surface shadow-xl flex items-center justify-center border border-white/20 active:scale-95 transition-transform cursor-pointer"
          title="Open Role Simulator Switcher"
        >
          <span className="material-symbols-outlined text-[20px] text-primary-fixed">
            swap_horiz
          </span>
          {hasActiveJob && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 right-3 z-50 pointer-events-auto animate-in fade-in slide-in-from-bottom-2">
      <div className="bg-inverse-surface/95 backdrop-blur-md rounded-2xl shadow-lg border border-white/15 p-2.5 flex flex-col gap-1.5 text-inverse-on-surface">
        <div className="flex items-center justify-between gap-3 px-1 text-[11px] font-bold text-secondary-fixed-dim">
          <span className="flex items-center gap-1 uppercase tracking-wider">
            <span className="material-symbols-outlined text-[13px] text-primary-fixed">
              published_with_changes
            </span>
            Role Simulator
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={resetDemoState}
              className="text-[10px] text-white/70 hover:text-white underline cursor-pointer py-1 px-0.5"
              title="Reset initial state"
            >
              Reset
            </button>
            <button
              onClick={() => setCollapsed(true)}
              className="w-6 h-6 rounded flex items-center justify-center text-white/70 hover:text-white cursor-pointer"
              aria-label="Collapse Role Simulator"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-xl">
          <button
            onClick={() => setRole('customer')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg font-label-sm text-xs font-bold transition-all cursor-pointer min-h-[36px] ${
              role === 'customer'
                ? 'bg-primary text-white shadow-xs'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">person</span>
            <span>Customer<span className="hidden sm:inline"> (Priya)</span></span>
          </button>
          <button
            onClick={() => setRole('provider')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg font-label-sm text-xs font-bold transition-all cursor-pointer min-h-[36px] ${
              role === 'provider'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">engineering</span>
            <span>Pro<span className="hidden sm:inline"> (Rahul)</span></span>
            {hasActiveJob && (
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
            )}
          </button>
        </div>

        {hasActiveJob && (
          <div className="px-1 text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Order #{activeRequest.id} is {activeRequest.status}</span>
          </div>
        )}
      </div>
    </div>
  );
};
