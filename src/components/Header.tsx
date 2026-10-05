import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SATTHI_LOGO_URL, CUSTOMER_AVATAR } from '../data/mockData';
import { LocationDrawer } from './LocationDrawer';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showSos?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, showBack, onBack, showSos = true }) => {
  const { role, setRole, currentScreen, navigateTo, currentLocation, showToast, activeRequest, cityConfig } = useApp();
  const [showLocationDrawer, setShowLocationDrawer] = useState(false);

  // Provider Mode Header (Screen 9 & 10)
  if (role === 'provider' && (currentScreen === 'provider-dashboard' || currentScreen === 'provider-jobs')) {
    return (
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/92 backdrop-blur-md shadow-xs border-b border-surface-container/60">
        <div className="max-w-2xl mx-auto h-16 px-space-md flex items-center justify-between gap-space-sm">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigateTo('provider-dashboard')}
              className="flex items-center focus:outline-none min-h-[44px] min-w-[44px] -ml-2 pl-2 cursor-pointer"
              aria-label="Provider Dashboard"
            >
              <img
                alt="Brand logo"
                className="h-8 w-auto object-contain"
                src={SATTHI_LOGO_URL}
              />
            </button>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-headline-sm text-[17px] text-on-surface leading-none font-extrabold tracking-tight">
                  SATTHI
                </span>
                <span className="font-label-sm text-[10px] bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                  PRO
                </span>
              </div>
              <span className="font-body-sm text-[11px] text-secondary truncate max-w-[130px] mt-0.5">
                {currentScreen === 'provider-jobs' ? 'Jobs Broadcast' : 'Partner Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Switch to Customer Mode */}
            <button
              onClick={() => setRole('customer')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface border border-surface-container transition-colors font-label-sm text-xs font-semibold cursor-pointer min-h-[36px]"
              title="Switch to Resident Customer View"
            >
              <span className="material-symbols-outlined text-[15px] text-primary">person</span>
              <span>Resident View</span>
            </button>

            <div className="flex items-center gap-1.5 bg-surface-container-low border border-surface-container/80 px-2.5 py-1 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span className="font-label-sm text-xs text-on-surface font-semibold">
                Available
              </span>
            </div>

            <button
              aria-label="Emergency SOS hotline"
              onClick={() => showToast('Connecting to SATTHI Partner 24/7 Safety Helpline...', 'warning', 'e911_emergency')}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-error-container/80 text-error hover:bg-error-container active:scale-95 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">e911_emergency</span>
            </button>

            <button
              onClick={() => navigateTo('provider-profile')}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Partner Profile"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-xs">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
            </button>
          </div>
        </div>
      </header>
    );
  }

  // Stack Screens Header (Screens 2, 3, 4, 5, 6, 7, 11)
  if (showBack) {
    return (
      <header className="fixed top-0 w-full z-50 bg-surface/92 backdrop-blur-md shadow-xs pt-safe border-b border-surface-container/60">
        <div className="max-w-2xl mx-auto h-16 px-margin flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <button
              aria-label="Go back"
              className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container-low transition-colors -ml-1 shrink-0 active:scale-95 cursor-pointer"
              onClick={onBack ? onBack : () => navigateTo('home')}
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="font-headline-sm text-sm xs:text-base sm:text-lg text-on-surface truncate font-extrabold tracking-tight">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick Switch Button (Desktop/Tablet) */}
            <button
              onClick={() => setRole(role === 'customer' ? 'provider' : 'customer')}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface border border-surface-container font-label-sm text-xs font-bold transition-colors cursor-pointer min-h-[36px]"
              title="Toggle Role View"
            >
              <span className="material-symbols-outlined text-[15px] text-primary">
                {role === 'customer' ? 'engineering' : 'person'}
              </span>
              <span>{role === 'customer' ? 'Pro Mode' : 'Customer'}</span>
            </button>

            {showSos && (
              <button
                aria-label="Emergency SOS or Help Support"
                onClick={() => navigateTo('help')}
                className="flex items-center gap-1 px-2.5 h-9 rounded-full bg-error-container/70 hover:bg-error-container text-error transition-colors min-h-[36px] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px] text-error font-bold">
                  sos
                </span>
                <span className="font-label-sm text-xs text-error font-bold hidden xs:inline">
                  Help
                </span>
              </button>
            )}

            <button
              aria-label="Customer Care Hotline"
              onClick={() => navigateTo('help')}
              className="w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">support_agent</span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  // Customer Home & Activity Tab Header (Screen 1 & 8)
  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-surface/92 backdrop-blur-md shadow-xs pt-safe border-b border-surface-container/60">
        <div className="max-w-2xl mx-auto h-16 px-margin flex items-center justify-between gap-space-sm">
          {/* Brand Wordmark Logo */}
          <div className="flex items-center gap-space-xs shrink-0">
            <button
              onClick={() => navigateTo('home')}
              className="focus:outline-none flex items-center min-h-[44px] min-w-[44px] -ml-2 pl-2 cursor-pointer"
              aria-label="SATTHI Home"
            >
              <img
                alt="SATTHI Wordmark Logo"
                className="h-8 w-auto object-contain"
                src={SATTHI_LOGO_URL}
              />
            </button>
          </div>

          {/* Delivering To Pill - Center */}
          <button
            onClick={() => setShowLocationDrawer(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low/90 border border-surface-container/80 rounded-full min-h-[42px] text-left hover:bg-surface-container transition-colors cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-primary text-[19px] shrink-0">location_on</span>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-[9px] uppercase tracking-wider text-secondary font-bold leading-tight">
                DELIVERING TO
              </span>
              <span className="font-label-md text-xs sm:text-[13px] text-on-surface font-extrabold max-w-[120px] sm:max-w-[170px] truncate leading-tight">
                {currentLocation.name}
              </span>
            </div>
            <span className="material-symbols-outlined text-secondary text-[16px] shrink-0">
              keyboard_arrow_down
            </span>
          </button>

          {/* Role Toggle, Notifications & Customer Profile Avatar */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setRole('provider')}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-label-sm text-xs font-bold transition-colors cursor-pointer min-h-[36px]"
            >
              <span className="material-symbols-outlined text-[14px]">engineering</span>
              <span>Pro View</span>
              {activeRequest && activeRequest.status !== 'COMPLETED' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
            </button>

            <button
              aria-label="Alerts"
              onClick={() => showToast(`No emergency grid alerts in ${currentLocation.name}. All ${currentLocation.activeProsCount} technicians active.`, 'info', 'notifications')}
              className="relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary ring-2 ring-surface"></span>
            </button>

            <button
              onClick={() => navigateTo('activity-history')}
              className="relative min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Customer Profile"
            >
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover bg-surface-container ring-1 ring-surface-container-high"
                src={cityConfig.demoUser.avatar || CUSTOMER_AVATAR}
              />
              <span className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-surface"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Address / Neighborhood Selector Drawer */}
      <LocationDrawer
        isOpen={showLocationDrawer}
        onClose={() => setShowLocationDrawer(false)}
      />
    </>
  );
};
