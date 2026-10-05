import React from 'react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { role, currentScreen, navigateTo, activeRequest } = useApp();

  // Stack screens should not show the bottom tab bar because they have their own sticky action docks!
  const isStackScreen =
    currentScreen === 'category-details' ||
    currentScreen === 'provider-profile' ||
    currentScreen === 'request-form' ||
    currentScreen === 'matching-radar' ||
    currentScreen === 'live-tracking' ||
    currentScreen === 'service-invoice' ||
    currentScreen === 'provider-active-job';

  if (isStackScreen) {
    return null;
  }

  if (role === 'customer') {
    const isHome = currentScreen === 'home';
    const isRequests = currentScreen === 'matching-radar' || currentScreen === 'live-tracking';
    const isActivity = currentScreen === 'activity-history';
    const isHelp = currentScreen === 'help';

    return (
      <nav
        className="fixed bottom-0 w-full z-50 pb-safe bg-surface/92 backdrop-blur-md shadow-xs border-t border-surface-container/60"
        data-active-classes="text-primary font-bold"
      >
        <div className="max-w-2xl mx-auto flex justify-around items-center h-16 px-space-xs">
          <button
            onClick={() => navigateTo('home')}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[48px] transition-colors cursor-pointer ${
              isHome ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className={`material-symbols-outlined text-[24px] ${isHome ? 'fill-1' : ''}`}>
              home
            </span>
            <span className="font-label-sm text-[11px] tracking-tight">Home</span>
          </button>

          <button
            onClick={() => {
              if (
                activeRequest &&
                (activeRequest.status === 'ON_THE_WAY' ||
                  activeRequest.status === 'ARRIVED' ||
                  activeRequest.status === 'IN_PROGRESS')
              ) {
                navigateTo('live-tracking');
              } else if (activeRequest && activeRequest.status === 'SEARCHING') {
                navigateTo('matching-radar');
              } else {
                navigateTo('request-form');
              }
            }}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[48px] transition-colors relative cursor-pointer ${
              isRequests ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">near_me</span>
            <span className="font-label-sm text-[11px] tracking-tight">Requests</span>
            {activeRequest && activeRequest.status !== 'COMPLETED' && activeRequest.status !== 'CANCELLED' && (
              <span className="absolute top-1.5 right-3 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
            )}
          </button>

          <button
            onClick={() => navigateTo('activity-history')}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[48px] transition-colors cursor-pointer ${
              isActivity ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className={`material-symbols-outlined text-[24px] ${isActivity ? 'fill-1' : ''}`}>
              receipt_long
            </span>
            <span className="font-label-sm text-[11px] tracking-tight">Activity</span>
          </button>

          <button
            onClick={() => navigateTo('help')}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[48px] transition-colors cursor-pointer ${
              isHelp ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className={`material-symbols-outlined text-[24px] ${isHelp ? 'fill-1' : ''}`}>
              support_agent
            </span>
            <span className="font-label-sm text-[11px] tracking-tight">Help</span>
          </button>
        </div>
      </nav>
    );
  }

  // Provider Mode Bottom Navigation (Screen 9 & 10)
  const isProvHome = currentScreen === 'provider-dashboard';
  const isProvJobs = currentScreen === 'provider-jobs';
  const isProvEarnings = currentScreen === 'provider-earnings';
  const isProvProfile = currentScreen === 'provider-profile';

  return (
    <nav
      className="fixed bottom-0 w-full z-50 pb-safe bg-surface/92 backdrop-blur-md shadow-xs border-t border-surface-container/60"
      data-active-classes="text-primary font-bold"
    >
      <div className="max-w-2xl mx-auto flex justify-around items-center h-16 px-space-xs">
        <button
          onClick={() => navigateTo('provider-dashboard')}
          className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] transition-colors cursor-pointer ${
            isProvHome ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className={`material-symbols-outlined text-[24px] ${isProvHome ? 'fill-1' : ''}`}>
            grid_view
          </span>
          <span className="font-label-sm text-[11px] mt-0.5 tracking-tight">Home</span>
        </button>

        <button
          onClick={() => navigateTo('provider-jobs')}
          className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] transition-colors relative cursor-pointer ${
            isProvJobs ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className={`material-symbols-outlined text-[24px] ${isProvJobs ? 'fill-1' : ''}`}>
            assignment
          </span>
          <span className="font-label-sm text-[11px] mt-0.5 tracking-tight">Jobs</span>
          {activeRequest && activeRequest.status !== 'COMPLETED' && activeRequest.status !== 'CANCELLED' && (
            <span className="absolute top-1.5 right-3 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          )}
        </button>

        <button
          onClick={() => navigateTo('provider-earnings')}
          className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] transition-colors cursor-pointer ${
            isProvEarnings ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className={`material-symbols-outlined text-[24px] ${isProvEarnings ? 'fill-1' : ''}`}>
            payments
          </span>
          <span className="font-label-sm text-[11px] mt-0.5 tracking-tight">Earnings</span>
        </button>

        <button
          onClick={() => navigateTo('provider-profile')}
          className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] transition-colors cursor-pointer ${
            isProvProfile ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className={`material-symbols-outlined text-[24px] ${isProvProfile ? 'fill-1' : ''}`}>
            badge
          </span>
          <span className="font-label-sm text-[11px] mt-0.5 tracking-tight">Profile</span>
        </button>
      </div>
    </nav>
  );
};
