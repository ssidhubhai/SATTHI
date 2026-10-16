import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { simulationService } from '../services/simulationService';

export const ProviderDashboard: React.FC = () => {
  const {
    providerDutyStatus,
    setProviderDutyStatus,
    providerEarnings,
    providerProfile,
    jobOpportunities,
    activeRequest,
    acceptJobOpportunity,
    declineJobOpportunity,
    navigateTo,
    showToast,
    cityConfig,
    currentLocation,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'urgent' | 'nearby'>('all');

  const hasActiveJob =
    activeRequest &&
    activeRequest.status !== 'COMPLETED' &&
    activeRequest.status !== 'CANCELLED';

  const isOnline = providerDutyStatus === 'online';

  const filteredOpportunities = jobOpportunities.filter((job) => {
    if (activeFilter === 'urgent') return job.urgency === 'immediate';
    if (activeFilter === 'nearby') return job.distanceKm <= 3.0;
    return true;
  });

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto pb-32">
      <div className="p-space-md flex flex-col gap-space-md">
        {/* Top Header Card: Identity & Real-Time Locality */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface tracking-tight font-extrabold">
                Namaste, {(providerProfile.fullName || providerProfile.name || 'Partner').split(' ')[0]}
              </span>
              <span className="material-symbols-outlined text-primary text-[20px] fill-1">
                verified
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="material-symbols-outlined text-[15px] text-primary">near_me</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                {currentLocation.name} •{' '}
                <strong className="text-primary font-bold">
                  {currentLocation.surgeActive ? 'High Demand Surge' : 'Standard Demand'}
                </strong>
              </span>
            </div>
          </div>

          <button
            onClick={() => navigateTo('provider-profile')}
            className="relative cursor-pointer group"
            aria-label="View Partner Profile"
          >
            <img
              className="w-12 h-12 rounded-full object-cover shadow-sm bg-surface-container ring-1 ring-surface-container-high group-hover:ring-primary transition-all"
              alt={providerProfile.fullName}
              src={providerProfile.avatarUrl}
            />
            <span
              className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-white ${
                isOnline
                  ? 'bg-emerald-500'
                  : providerDutyStatus === 'busy'
                  ? 'bg-amber-500'
                  : 'bg-gray-400'
              }`}
            />
          </button>
        </div>

        {/* MASTER AVAILABILITY CARD (LARGE HERO TOGGLE) */}
        <div
          className={`rounded-2xl p-5 shadow-xs border transition-all ${
            isOnline
              ? 'bg-surface-container-lowest border-emerald-500/40 ring-1 ring-emerald-500/20'
              : 'bg-surface-container-low border-surface-container'
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                  isOnline ? 'bg-emerald-50 text-emerald-700' : 'bg-surface-container text-secondary'
                }`}
              >
                <span className="material-symbols-outlined text-[26px]">
                  {isOnline ? 'sensors' : 'sensors_off'}
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-base font-bold text-on-surface">
                    {isOnline ? 'YOU ARE ONLINE' : 'YOU ARE OFFLINE'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      isOnline
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-surface-container-high text-secondary'
                    }`}
                  >
                    {isOnline ? 'Ready for Jobs' : 'Resting'}
                  </span>
                </div>
                <span className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                  {isOnline
                    ? `Broadcasting availability within ${providerProfile.serviceRadiusKm} km of ${currentLocation.name}`
                    : 'Turn on to receive nearby job alerts and emergency requests.'}
                </span>
              </div>
            </div>

            {/* Giant Online/Offline Master Switch */}
            <button
              onClick={() => {
                const nextStatus = isOnline ? 'offline' : 'online';
                setProviderDutyStatus(nextStatus);
                showToast(
                  nextStatus === 'online'
                    ? `You are now ONLINE in ${currentLocation.name}! Ready to receive job broadcasts.`
                    : 'You are now OFFLINE. New requests will not be dispatched.',
                  nextStatus === 'online' ? 'success' : 'info',
                  nextStatus === 'online' ? 'sensors' : 'bedtime'
                );
              }}
              className={`px-4 py-2.5 rounded-xl font-label-md text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0 ${
                isOnline
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-primary hover:bg-primary-container text-on-primary'
              }`}
            >
              {isOnline ? 'Go Offline' : 'Go Online'}
            </button>
          </div>

          {/* Online Context Bar */}
          {isOnline ? (
            <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-xs text-secondary">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
                <span>Polling radar active in {cityConfig.name}</span>
              </div>
              <span className="font-medium text-emerald-700">
                {jobOpportunities.length} opportunities nearby
              </span>
            </div>
          ) : (
            <div className="mt-3 pt-3 border-t border-surface-container text-xs text-secondary leading-snug">
              ℹ️ While offline, your location is hidden and customers will not receive you as a closest matched technician.
            </div>
          )}
        </div>

        {/* ACTIVE JOB BANNER (CRITICAL PERSISTENT BANNER) */}
        {hasActiveJob && (
          <div className="p-4 rounded-2xl bg-primary text-on-primary shadow-md flex flex-col gap-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                </span>
                <span className="font-label-sm text-xs uppercase tracking-wider font-extrabold text-primary-fixed">
                  CURRENT ACTIVE DISPATCH
                </span>
              </div>
              <span className="text-xs bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full font-bold">
                Status: {activeRequest?.status}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-headline-sm text-base font-bold">
                  {activeRequest?.categoryTitle || 'Electrical Inspection & Diagnostic'}
                </h3>
                <p className="text-xs text-on-primary/80 mt-0.5">
                  Resident: <strong>{activeRequest?.customerName}</strong> • {activeRequest?.customerAddress}
                </p>
              </div>
              <span className="font-mono text-base font-extrabold">
                ₹{activeRequest?.totalPayable}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => navigateTo('provider-active-job')}
                className="flex-1 py-2.5 rounded-xl bg-white text-primary font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer hover:bg-white/90 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">navigation</span>
                <span>Open Job HUD & Verify PIN</span>
              </button>
              <button
                onClick={() => {
                  const sim = simulationService.simulateVoiceCall(activeRequest?.customerName || 'Customer', 'customer');
                  showToast(sim.message, 'info', 'phone');
                }}
                className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center cursor-pointer text-white transition-colors"
                aria-label="Call Resident"
              >
                <span className="material-symbols-outlined text-[18px]">phone</span>
              </button>
            </div>
          </div>
        )}

        {/* TODAY'S EARNINGS SUMMARY CARD */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-surface-container/60 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs uppercase tracking-wider text-secondary font-bold">
              Today's Performance
            </span>
            <button
              onClick={() => navigateTo('provider-earnings')}
              className="text-xs text-primary font-bold hover:underline cursor-pointer flex items-center gap-0.5"
            >
              <span>Earnings Ledger</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
              <span className="text-[11px] text-secondary font-medium block">Jobs Done</span>
              <span className="font-data-metric text-xl font-extrabold text-on-surface">
                {providerEarnings.jobsDone}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">100% on time</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
              <span className="text-[11px] text-secondary font-medium block">Net Payout</span>
              <span className="font-data-metric text-xl font-extrabold text-primary">
                ₹{providerEarnings.netDirect}
              </span>
              <span className="text-[10px] text-secondary block mt-0.5">Gross: ₹{providerEarnings.todayGross}</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
              <span className="text-[11px] text-secondary font-medium block">Platform Cut</span>
              <span className="font-data-metric text-xl font-extrabold text-emerald-700">
                ₹0
              </span>
              <span className="text-[10px] text-secondary block mt-0.5">₹0 Commission</span>
            </div>
          </div>
        </div>

        {/* NEARBY JOB OPPORTUNITIES FEED */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">radar</span>
              <h2 className="font-headline-sm text-base font-bold text-on-surface">
                Nearby Job Opportunities
              </h2>
            </div>
            <span className="font-label-sm text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {filteredOpportunities.length} Active
            </span>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-full font-semibold transition-colors cursor-pointer border ${
                activeFilter === 'all'
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-container-low text-on-surface border-surface-container hover:bg-surface-container'
              }`}
            >
              All Broadcasts
            </button>
            <button
              onClick={() => setActiveFilter('urgent')}
              className={`px-3 py-1.5 rounded-full font-semibold transition-colors cursor-pointer border ${
                activeFilter === 'urgent'
                  ? 'bg-error text-on-error border-error'
                  : 'bg-surface-container-low text-on-surface border-surface-container hover:bg-surface-container'
              }`}
            >
              Urgent Hazards
            </button>
            <button
              onClick={() => setActiveFilter('nearby')}
              className={`px-3 py-1.5 rounded-full font-semibold transition-colors cursor-pointer border ${
                activeFilter === 'nearby'
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-container-low text-on-surface border-surface-container hover:bg-surface-container'
              }`}
            >
              Under 3 km
            </button>
          </div>

          {/* Job Cards */}
          {filteredOpportunities.length === 0 ? (
            <div className="p-8 rounded-2xl bg-surface-container-low border border-surface-container text-center flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-[32px] text-secondary">assignment_turned_in</span>
              <span className="font-headline-sm text-sm font-bold text-on-surface">No Pending Broadcasts</span>
              <p className="font-body-sm text-xs text-secondary max-w-xs">
                You've cleared all immediate opportunities. Keep yourself online to receive incoming requests.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOpportunities.map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container/60 shadow-xs flex flex-col gap-3 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">
                          {job.serviceCategory === 'electrician'
                            ? 'bolt'
                            : job.serviceCategory === 'plumber'
                            ? 'faucet'
                            : job.serviceCategory === 'carpenter'
                            ? 'carpenter'
                            : 'ac_unit'}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-headline-sm text-sm font-bold text-on-surface">
                            {job.title || job.issueTitle}
                          </h3>
                          {job.urgency === 'immediate' && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-error-container text-error uppercase">
                              Emergency
                            </span>
                          )}
                        </div>
                        <p className="font-body-sm text-xs text-secondary mt-0.5">
                          {job.customerLocality} · {job.distanceKm} km away · {job.estimatedTravelMinutes} mins transit
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-base font-extrabold text-primary block">
                        ₹{job.estimatedEarnings}
                      </span>
                      <span className="text-[10px] text-secondary">locked payout</span>
                    </div>
                  </div>

                  <p className="font-body-sm text-xs text-on-surface-variant bg-surface-container-low p-2.5 rounded-lg leading-relaxed">
                    "{job.description}"
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-secondary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      <span>Requested {job.requestedAt}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => declineJobOpportunity(job.id)}
                        className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Pass
                      </button>
                      <button
                        onClick={() => {
                          acceptJobOpportunity(job.id);
                          navigateTo('provider-active-job');
                        }}
                        className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-xs cursor-pointer transition-all"
                      >
                        Accept Job
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QUICK ACTIONS GRID */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-surface-container/60 flex flex-col gap-3">
          <h3 className="font-headline-sm text-sm font-bold text-on-surface">Quick Cockpit Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => navigateTo('provider-jobs')}
              className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container flex flex-col items-center text-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[22px] text-primary">assignment</span>
              <span className="text-xs font-bold text-on-surface">Jobs Feed</span>
              <span className="text-[10px] text-secondary">Broadcast view</span>
            </button>

            <button
              onClick={() => navigateTo('provider-earnings')}
              className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container flex flex-col items-center text-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[22px] text-emerald-700">payments</span>
              <span className="text-xs font-bold text-on-surface">Earnings</span>
              <span className="text-[10px] text-secondary">IMPS cashout</span>
            </button>

            <button
              onClick={() => navigateTo('provider-profile')}
              className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container flex flex-col items-center text-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[22px] text-tertiary">badge</span>
              <span className="text-xs font-bold text-on-surface">My Profile</span>
              <span className="text-[10px] text-secondary">Screening &amp; rates</span>
            </button>

            <button
              onClick={() => {
                showToast(`Local utility grid emergency hotlines: ${cityConfig.localUtilityProvider.name} ${cityConfig.localUtilityProvider.helpline}`, 'warning', 'e911_emergency');
              }}
              className="p-3 rounded-xl bg-error-container/40 hover:bg-error-container/70 border border-error/20 flex flex-col items-center text-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[22px] text-error">sos</span>
              <span className="text-xs font-bold text-error">Emergency SOS</span>
              <span className="text-[10px] text-error/80">Utility hotline</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
