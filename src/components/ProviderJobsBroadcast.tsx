import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BEFORE_FAULT_PHOTO } from '../data/mockData';

export const ProviderJobsBroadcast: React.FC = () => {
  const {
    activeRequest,
    acceptRequestAsProvider,
    jobOpportunities,
    acceptJobOpportunity,
    declineJobOpportunity,
    navigateTo,
    showToast,
    currentLocation,
  } = useApp();

  const [secondsLeft, setSecondsLeft] = useState(24);
  const [isAccepting, setIsAccepting] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'live' | 'all'>('live');

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 1 ? prev - 1 : 24));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAcceptLive = () => {
    setIsAccepting(true);
    setTimeout(() => {
      acceptRequestAsProvider();
      navigateTo('provider-active-job');
      showToast('Dispatch accepted! GPS navigation launched.', 'success', 'navigation');
    }, 600);
  };

  const handlePassLive = () => {
    navigateTo('provider-dashboard');
    showToast('Passed on dispatch. Next nearby technician notified.', 'info', 'fast_forward');
  };

  // Determine current active or top incoming request
  const hasIncomingLiveRequest =
    activeRequest &&
    (activeRequest.status === 'SEARCHING' ||
      activeRequest.status === 'REQUESTED' ||
      activeRequest.status === 'ACCEPTED' ||
      activeRequest.status === 'ON_THE_WAY');

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto pb-32">
      <div className="flex flex-col w-full px-space-md py-space-sm space-y-space-md">
        {/* View Switcher Tabs */}
        <div className="flex bg-surface-container-low p-1 rounded-xl">
          <button
            onClick={() => setSelectedTab('live')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedTab === 'live'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span>Immediate Radar Dispatch</span>
          </button>
          <button
            onClick={() => setSelectedTab('all')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedTab === 'all'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">list_alt</span>
            <span>All Nearby Opportunities ({jobOpportunities.length})</span>
          </button>
        </div>

        {selectedTab === 'live' ? (
          <>
            {/* URGENT BROADCAST TICKER & COUNTDOWN */}
            <div className="w-full bg-primary text-on-primary rounded-2xl p-space-md shadow-lg overflow-hidden relative">
              <div className="flex items-center justify-between gap-space-xs relative z-10">
                <div className="flex items-center gap-space-xs">
                  <span className="relative flex h-3 w-3 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-fixed opacity-80"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-surface-container-lowest"></span>
                  </span>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-[11px] uppercase tracking-wider text-primary-fixed font-bold">
                      Incoming Priority Dispatch
                    </span>
                    <span className="font-headline-sm text-base sm:text-lg font-bold leading-tight">
                      {activeRequest?.categoryTitle || 'Circuit Breaker Tripping'}
                    </span>
                  </div>
                </div>

                {/* Circular Digital Countdown Gauge */}
                <div className="flex items-center gap-1.5 bg-primary-container px-3 py-1.5 rounded-full shadow-inner font-bold">
                  <span className="material-symbols-outlined text-[18px] text-primary-fixed animate-pulse">
                    timer
                  </span>
                  <span className="font-data-metric text-sm font-extrabold text-on-primary">
                    {secondsLeft}s
                  </span>
                </div>
              </div>

              {/* Shrinking Time Bar Indicator */}
              <div className="w-full bg-on-primary/20 h-1.5 rounded-full mt-3 overflow-hidden relative">
                <div
                  className="h-full bg-primary-fixed rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${(secondsLeft / 24) * 100}%` }}
                ></div>
              </div>

              {/* Live Telemetry Status */}
              <div className="flex items-center justify-between text-primary-fixed mt-2.5 pt-2 font-label-sm text-xs font-medium border-t border-white/10">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">near_me</span>
                  <span>Target Area: {activeRequest?.customerAddress || currentLocation.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">bolt</span>
                  <span>Priority 1: Immediate Attention</span>
                </div>
              </div>
            </div>

            {/* ROUTE PREVIEW SNIPPET */}
            <div className="w-full rounded-2xl overflow-hidden shadow-xs border border-surface-container/60 bg-surface-container-lowest relative">
              <div
                className="w-full h-36 bg-cover bg-center relative"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBISS-3fTLGnrjUcIa9sSByFwiblcrR6D_ypSvmacGNDY4FgfiqqAj6nhN0duNvlpQ2V7jrMzf8NRWej2uU4UFYc4CTGnsw2v9qc1-UmMNqeHknS0-g2aWihU6iS5U0erJHzNcY0bt9FtR8lTDBTvK4zwjT7q8b7m8O9z5CxVhrIPoypfPArgsyKhayGIUFJ58fupBa9bi0k7NL70JRX5T0SwEFt5TxprCh6yxSY_yCT1M3npRjO7i8')`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                {/* Telemetry Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-surface-container-lowest/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-xs">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">two_wheeler</span>
                  <span className="font-label-md text-xs text-on-surface font-bold">
                    6-8 mins transit
                  </span>
                </div>
                <div className="absolute top-2.5 right-2.5 bg-primary px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-on-primary">near_me</span>
                  <span className="font-label-sm text-[11px] text-on-primary font-bold">
                    1.4 km corridor
                  </span>
                </div>

                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <span className="font-semibold truncate max-w-[220px]">
                    {activeRequest?.customerAddress || 'Indiranagar 100ft Road Corridor'}
                  </span>
                  <span className="text-[11px] text-white/80">Dry road conditions</span>
                </div>
              </div>
            </div>

            {/* GUARANTEED PAYOUT & SCOPE */}
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container/60 shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-xs uppercase tracking-wider text-secondary font-bold">
                  Guaranteed Dispatch Tariff
                </span>
                <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
                  ₹0 Platform Commission
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <span className="font-data-metric text-2xl font-extrabold text-primary">
                    ₹{activeRequest?.totalPayable || 319}.00
                  </span>
                  <span className="font-body-sm text-xs text-secondary ml-1.5">
                    (Standard Inspection + Initial Diagnostics)
                  </span>
                </div>
                <span className="text-xs text-emerald-700 font-bold">Direct IMPS</span>
              </div>

              {/* Resident Issue Description */}
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-1.5">
                <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                  Resident Fault Report
                </span>
                <p className="text-xs text-on-surface leading-relaxed">
                  "{activeRequest?.faultDescription || 'Master circuit breaker is tripping repeatedly when kitchen geyser is switched on. Slight burning smell from switchboard.'}"
                </p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-secondary">
                  <span className="material-symbols-outlined text-[15px] text-primary">person</span>
                  <span>Resident: <strong>{activeRequest?.customerName || 'Priya M.'}</strong></span>
                  <span>•</span>
                  <span>Landmark: <strong>{activeRequest?.landmark || 'Next to Blue Tokai Coffee'}</strong></span>
                </div>
              </div>

              {/* Photo Inspection Attachment */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container-low border border-surface-container">
                <img
                  src={BEFORE_FAULT_PHOTO}
                  alt="Fault Evidence"
                  className="w-12 h-12 rounded-lg object-cover bg-surface-container"
                />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-bold text-on-surface">Inspection Photo Attached</span>
                  <span className="text-[11px] text-secondary truncate">
                    Tripped MCB switchboard with discolored terminal
                  </span>
                </div>
                <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded font-bold">
                  VERIFIED
                </span>
              </div>
            </div>

            {/* ACTION DOCK: PASS OR ACCEPT */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handlePassLive}
                className="flex-1 py-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs cursor-pointer transition-colors"
              >
                Pass to Next Tech
              </button>
              <button
                onClick={handleAcceptLive}
                disabled={isAccepting}
                className="flex-2 py-3.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-98 disabled:opacity-50"
              >
                {isAccepting ? (
                  <span>Locking Dispatch...</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">navigation</span>
                    <span>Accept Job &amp; Navigate</span>
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          /* ALL NEARBY OPPORTUNITIES LIST */
          <div className="flex flex-col gap-3">
            <span className="font-label-sm text-xs uppercase tracking-wider text-secondary font-bold">
              Available Jobs in Your Radius ({currentLocation.name})
            </span>

            {jobOpportunities.map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container/60 shadow-xs flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-headline-sm text-sm font-bold text-on-surface">{job.title}</h3>
                    <p className="text-xs text-secondary mt-0.5">
                      {job.customerLocality} · {job.distanceKm} km · {job.estimatedTravelMinutes} mins
                    </p>
                  </div>
                  <span className="font-mono text-base font-extrabold text-primary">
                    ₹{job.estimatedEarnings}
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant bg-surface-container-low p-2.5 rounded-lg">
                  "{job.description}"
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-secondary">Posted {job.requestedAt}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => declineJobOpportunity(job.id)}
                      className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-xs font-semibold cursor-pointer"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => {
                        acceptJobOpportunity(job.id);
                        navigateTo('provider-active-job');
                      }}
                      className="px-4 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold cursor-pointer shadow-xs"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
