import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { simulationService } from '../services/simulationService';

export const LiveTracking: React.FC = () => {
  const {
    activeRequest,
    cancelActiveRequest,
    navigateTo,
    setRole,
    markProviderArrived,
    verifyDoorstepPin,
    completeServiceJob,
    showToast,
    currentLocation,
    cityConfig,
    providers,
  } = useApp();

  const assignedPro =
    (activeRequest?.assignedProviderId
      ? providers.find((p) => p.id === activeRequest.assignedProviderId)
      : providers[0]) || providers[0];
  const proFirstName = assignedPro.name.split(' ')[0];

  const [copiedPin, setCopiedPin] = useState(false);
  const [cancelSeconds, setCancelSeconds] = useState(45);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCancelSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyPin = () => {
    const pin = activeRequest?.pin || '4821';
    navigator.clipboard.writeText(pin);
    setCopiedPin(true);
    showToast(`PIN ${pin} copied to clipboard! Share with technician at door.`, 'success', 'content_copy');
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const status = activeRequest?.status || 'ON_THE_WAY';
  const isEnRoute = status === 'ON_THE_WAY';
  const isArrived = status === 'ARRIVED';
  const isInProgress = status === 'IN_PROGRESS';
  const isCompleted = status === 'COMPLETED';

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto pb-28">
      {/* Live Map Viewport & Telemetry Visualizer */}
      <div className="relative w-full h-72 sm:h-80 overflow-hidden bg-surface-container-highest">
        {/* Map Simulation Canvas */}
        <div
          className="w-full h-full bg-cover bg-center filter saturate-150 brightness-95"
          data-location={`${currentLocation.area}, ${cityConfig.name}, ${cityConfig.state}, ${cityConfig.country}`}
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBxkCRp_LbtXmT2YBSBjShJTdPkwbeo-8w6IftBxrmoIG18LDpF91GUP4vM9n1DDDa4IXJJhB7snk4lMRkAI8V9O6xQQvApUjUCYwKYvOnPX3hFzMWbhJRz3Hp-ezp7ty48vczRSdAe5Aq8kT1BGbfi_heoI3mzccL1xhlYyNh7FIAiOE9ilWPYKKDsHJMvG5-1yrtef-jOzUjjhLiLrmK6osKFctSkFhMj8ZOlDd73AHPQHcN2uhG2')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-surface/20 pointer-events-none"></div>

        {/* Interactive Simulated Route Vector Overlay (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <path
            className="animate-pulse"
            d="M 64 210 Q 140 180 180 135 T 290 85"
            fill="none"
            stroke="#d04317"
            strokeDasharray="8 6"
            strokeLinecap="round"
            strokeWidth="5"
          />
          <path
            d="M 64 210 Q 140 180 180 135 T 290 85"
            fill="none"
            stroke="#ffffff"
            strokeLinecap="round"
            strokeWidth="2"
          />
        </svg>

        {/* Simulated GPS Mode Badge */}
        <div className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-on-surface shadow-md z-10 flex items-center gap-1.5 border border-surface-container/60">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Simulated GPS Route (Demo)</span>
        </div>

        {/* Map Floating Controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            aria-label="Toggle Live Traffic"
            onClick={() => {
              const sim = simulationService.simulateGpsTelemetry(assignedPro.name, currentLocation.trafficCorridor || currentLocation.area, assignedPro.distanceKm);
              showToast(sim.message, 'info', 'traffic');
            }}
            className="w-10 h-10 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-md flex items-center justify-center text-on-surface hover:bg-surface-container-low transition-transform active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px] text-tertiary">traffic</span>
          </button>
          <button
            aria-label="Recenter Map on Driver"
            onClick={() => {
              const sim = simulationService.simulateGpsTelemetry(assignedPro.name, currentLocation.name, assignedPro.distanceKm);
              showToast(sim.message, 'info', 'my_location');
            }}
            className="w-10 h-10 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-md flex items-center justify-center text-on-surface hover:bg-surface-container-low transition-transform active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px] text-primary">my_location</span>
          </button>
        </div>

        {/* Live Driver Marker (En Route or Arrived) */}
        <div
          className={`absolute z-10 flex flex-col items-center transition-all duration-700 ${
            isArrived || isInProgress
              ? 'right-16 top-20'
              : 'left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-primary opacity-30"></span>
            <div className="w-10 h-10 rounded-full bg-primary text-on-primary shadow-lg flex items-center justify-center transform -rotate-12">
              <span className="material-symbols-outlined text-[22px]">
                {isArrived || isInProgress ? 'engineering' : 'two_wheeler'}
              </span>
            </div>
          </div>
          <div className="mt-1 px-2 py-0.5 rounded-full bg-surface-container-lowest/95 backdrop-blur-sm shadow-md text-center">
            <span className="font-label-sm text-label-sm text-primary font-bold">
              {isArrived ? `${proFirstName} • At Doorstep` : isInProgress ? `${proFirstName} • Inside` : `${proFirstName} • ${assignedPro.distanceKm} km`}
            </span>
          </div>
        </div>

        {/* Destination Pin (Home) */}
        <div className="absolute right-12 top-16 z-10 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-tertiary text-on-tertiary shadow-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">home</span>
          </div>
          <div className="mt-0.5 px-2 py-0.5 rounded-full bg-surface-container-lowest/95 shadow-md">
            <span className="font-label-sm text-label-sm text-on-surface font-semibold">
              12th Main Rd
            </span>
          </div>
        </div>

        {/* Live Floating Telemetry ETA Pill */}
        <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between p-2.5 rounded-xl bg-surface-container-lowest/95 backdrop-blur-lg shadow-lg">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-[20px]">
                {isArrived ? 'door_front' : isInProgress ? 'build' : 'near_me'}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {isArrived
                    ? 'Technician Arrived Outside'
                    : isInProgress
                    ? 'Service In Progress'
                    : 'Arriving in 6 mins'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                {isArrived
                  ? 'Please share your 4-digit PIN to begin inspection'
                  : isInProgress
                  ? 'Diagnosing distribution board & MCB relay'
                  : '0.4 km away • Smooth traffic via 100 Ft Rd'}
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm shrink-0 font-medium">
            {isArrived ? 'At Door' : isInProgress ? 'Live' : 'On schedule'}
          </span>
        </div>
      </div>

      {/* Testing & Simulation Quick-Action Bar */}
      <section className="px-margin pt-3">
        <div className="p-3 bg-secondary-container/40 rounded-xl border border-secondary/20 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-primary font-bold flex items-center gap-1 truncate">
              <span className="material-symbols-outlined text-[14px]">tune</span>
              <span className="hidden xs:inline">Interactive </span>Simulator
            </span>
            <button
              onClick={() => setRole('provider')}
              className="text-[11px] font-bold text-primary hover:underline flex items-center gap-0.5 cursor-pointer shrink-0"
            >
              <span>Switch to Pro HUD</span>
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <button
              onClick={markProviderArrived}
              disabled={isArrived || isInProgress}
              className={`py-2 px-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer truncate ${
                isArrived
                  ? 'bg-emerald-600 text-white'
                  : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-xs'
              }`}
            >
              1. Arrived
            </button>
            <button
              onClick={() => verifyDoorstepPin(activeRequest?.pin || '4821')}
              disabled={isInProgress}
              className={`py-2 px-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer truncate ${
                isInProgress
                  ? 'bg-emerald-600 text-white'
                  : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-xs'
              }`}
            >
              2. Verify PIN
            </button>
            <button
              onClick={() => {
                completeServiceJob();
                navigateTo('service-invoice');
              }}
              className="py-2 px-1.5 rounded-lg text-xs font-bold bg-primary text-on-primary shadow-xs hover:bg-primary-container transition-all cursor-pointer truncate"
            >
              3. Complete
            </button>
          </div>
        </div>
      </section>

      {/* Content Stream Container */}
      <div className="px-margin space-y-4 mt-3 pb-8 z-20">
        {/* Start PIN & Security Verification Banner */}
        <div className="w-full bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">
                verified_user
              </span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">
                Arrival Handshake Code
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-[11px] font-semibold">
              Share only at door
            </span>
          </div>

          {isInProgress ? (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[20px]">handshake</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-label-md text-sm font-bold text-emerald-950">
                      Doorstep PIN Handshake Verified
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900 text-[10px] font-bold">
                      Active
                    </span>
                  </div>
                  <p className="font-body-sm text-xs text-emerald-800 mt-0.5">
                    Tool unlock confirmed. Rahul is currently repairing the distribution box.
                  </p>
                </div>
              </div>
            </div>
          ) : isCompleted ? (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                </div>
                <div>
                  <span className="font-label-md text-sm font-bold text-emerald-950 block">
                    Service Completed by Rahul
                  </span>
                  <p className="font-body-sm text-xs text-emerald-800 mt-0.5">
                    Final itemized invoice is ready with 30-day SATTHI warranty.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigateTo('service-invoice')}
                className="px-3 py-2 rounded-lg bg-emerald-600 text-white font-label-sm text-xs font-bold shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer shrink-0"
              >
                Pay &amp; Rate
              </button>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container/60 flex items-center justify-between">
              <div>
                <p className="font-body-sm text-[11px] text-secondary">
                  Technician start PIN (confirms ID &amp; tool unlock):
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-headline-lg-mobile text-2xl font-extrabold tracking-widest text-on-surface font-mono">
                    {activeRequest?.pin || '4821'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Code Ready
                  </span>
                </div>
              </div>

              <button
                onClick={handleCopyPin}
                className="px-3.5 py-2 min-h-[40px] rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high font-label-sm text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">
                  {copiedPin ? 'check' : 'content_copy'}
                </span>
                <span>{copiedPin ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Assigned Pro Card */}
        <div className="w-full bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container/60 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuALC5v_Pg92yXeMQ7zt1CR9eNPLsBl1gIAsWsig1StwYvFD19yXWcj3dBoUhNaF0_aTVckhbqRIYeA_4LIPFhDZEH3OL0bsz70beEPmamW09s2hZk8kmJ5xrr1gDb-_n5byP5mJPuRGZKDM0h7MdRfqz_mHM6rpXVenJjbnDmSGZEjP1gVDHSAUKWnBZ6_IPcFeuzo2hB83Ldd8r-4FQvDcRx1G1DVbqAp76WsAMImvcVdN7Gg8-sbJ"
                alt="Rahul Kumar"
                className="w-14 h-14 rounded-full object-cover bg-surface-container shadow-xs border border-surface-container/60"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    {assignedPro.name}
                  </h3>
                  <span className="material-symbols-outlined text-tertiary text-[18px]">
                    verified
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-secondary">
                  {assignedPro.title} · {assignedPro.experienceYears} yrs exp · {assignedPro.vehicle.model} {assignedPro.vehicle.plate}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-amber-500 font-bold text-xs flex items-center">
                    ★ {assignedPro.rating} ({assignedPro.reviewCount} jobs)
                  </span>
                  <span className="text-outline text-xs">•</span>
                  <span className="text-emerald-700 text-xs font-semibold">{assignedPro.onTimeRate}% on-time</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => showToast(simulationService.simulateVoiceCall(assignedPro.name).message, 'info', 'phone')}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-xs hover:bg-primary-container transition-transform active:scale-[0.98] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">phone_in_talk</span>
              <span>Call {proFirstName}</span>
            </button>
            <button
              onClick={() => showToast(simulationService.simulateChat(proFirstName).message, 'info', 'chat')}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-surface-container text-on-surface font-label-lg text-label-lg font-semibold hover:bg-surface-container-high transition-transform active:scale-[0.98] cursor-pointer border border-surface-container/80"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px] text-tertiary">chat</span>
              <span>Chat / Photo</span>
              <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-emerald-600">
                notifications_active
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Receive live milestone alerts on WhatsApp (Demo Simulation)
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                checked={whatsappAlerts}
                onChange={(e) => {
                  setWhatsappAlerts(e.target.checked);
                  const sim = simulationService.simulateNotification(e.target.checked);
                  showToast(sim.message, 'info', 'chat');
                }}
                className="sr-only peer"
                type="checkbox"
              />
              <div className="w-9 h-5 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        {/* Live 5-Stage Job Lifecycle Progression */}
        <div className="w-full bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container/60 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Service Milestone Tracker
            </h3>
            <span className="font-label-sm text-label-sm text-primary font-semibold">
              Live Updating
            </span>
          </div>

          <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container-high">
            {/* Milestone 1 */}
            <div className="relative">
              <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[11px] font-bold">check</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                  Emergency Request Broadcasted
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">10:14 AM</span>
              </div>
              <p className="font-body-sm text-[11px] text-on-surface-variant">
                Matched with nearby certified {activeRequest?.category || 'pro'}s in {currentLocation.name}
              </p>
            </div>

            {/* Milestone 2 */}
            <div className="relative">
              <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[11px] font-bold">check</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                  {proFirstName} Accepted Order
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">10:15 AM</span>
              </div>
              <p className="font-body-sm text-[11px] text-on-surface-variant">
                Carrying certified diagnostic gear and authorized spares
              </p>
            </div>

            {/* Milestone 3: En Route */}
            <div className="relative">
              <div
                className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                  isArrived || isInProgress || isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-primary text-white shadow-[0_0_0_3px_#ffdbd1]'
                }`}
              >
                {isArrived || isInProgress || isCompleted ? (
                  <span className="material-symbols-outlined text-[11px] font-bold">check</span>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`font-body-sm text-body-sm ${
                    isEnRoute ? 'font-bold text-primary' : 'font-semibold text-on-surface'
                  }`}
                >
                  {isArrived || isInProgress || isCompleted
                    ? `Transit Completed (Arrived at ${activeRequest?.customerAddress?.split(',')[0] || currentLocation.name})`
                    : `${proFirstName} is En Route (${assignedPro.distanceKm} km away)`}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  {isEnRoute ? `ETA ~${assignedPro.etaMinutes}m` : '10:20 AM'}
                </span>
              </div>
              <p className="font-body-sm text-[11px] text-on-surface-variant">
                Approaching delivery corridor along {currentLocation.trafficCorridor || currentLocation.area}
              </p>
            </div>

            {/* Milestone 4: Arrival & Doorstep Handshake */}
            <div className={`relative ${!isArrived && !isInProgress && !isCompleted ? 'opacity-60' : ''}`}>
              <div
                className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                  isInProgress || isCompleted
                    ? 'bg-emerald-600 text-white'
                    : isArrived
                    ? 'bg-primary text-white shadow-[0_0_0_3px_#ffdbd1]'
                    : 'bg-surface-container-high'
                }`}
              >
                {isInProgress || isCompleted ? (
                  <span className="material-symbols-outlined text-[11px] font-bold">check</span>
                ) : isArrived ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                ) : null}
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`font-body-sm text-body-sm ${
                    isArrived ? 'font-bold text-primary' : 'font-medium text-on-surface'
                  }`}
                >
                  Arrival &amp; Doorstep PIN Verification
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  {isArrived ? 'Waiting for PIN' : isInProgress || isCompleted ? 'Verified' : 'Upcoming'}
                </span>
              </div>
              <p className="font-body-sm text-[11px] text-on-surface-variant">
                Requires verbal Handshake PIN code ({activeRequest?.pin || '4821'}) at doorstep
              </p>
            </div>

            {/* Milestone 5: Work in Progress & Invoice */}
            <div className={`relative ${!isInProgress && !isCompleted ? 'opacity-60' : ''}`}>
              <div
                className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? 'bg-emerald-600 text-white'
                    : isInProgress
                    ? 'bg-primary text-white shadow-[0_0_0_3px_#ffdbd1]'
                    : 'bg-surface-container-high'
                }`}
              >
                {isCompleted ? (
                  <span className="material-symbols-outlined text-[11px] font-bold">check</span>
                ) : isInProgress ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                ) : null}
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`font-body-sm text-body-sm ${
                    isInProgress ? 'font-bold text-primary' : 'font-medium text-on-surface'
                  }`}
                >
                  Diagnostic, Repair &amp; Itemized Bill
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Final Stage'}
                </span>
              </div>
              <p className="font-body-sm text-[11px] text-on-surface-variant">
                Itemized service receipt (demo simulation) &amp; {cityConfig.pricing.warrantyDays}-day SATTHI warranty applied upon completion
              </p>
            </div>
          </div>

          {/* Quick Invoice Link if completed */}
          {isCompleted && (
            <button
              onClick={() => navigateTo('service-invoice')}
              className="mt-3 w-full py-2.5 rounded-lg bg-emerald-600 text-white font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              <span>View Service Receipt &amp; Summary (Demo)</span>
              <span className="material-symbols-outlined text-[16px]">receipt_long</span>
            </button>
          )}
        </div>

        {/* Transparent Service Scope & Pricing Protection */}
        <div className="w-full bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container/60 space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Price Protection Guarantee
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-label-sm text-label-sm font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              Zero Hidden Fees
            </span>
          </div>

          <div className="p-3 rounded-lg bg-surface-container-low border border-surface-container/40 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-error-container text-error flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">flash_off</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                REPORTED EMERGENCY ISSUE
              </span>
              <span className="font-body-md text-body-md text-on-surface font-bold">
                {activeRequest?.faultType || 'Short Circuit / Main MCB Tripping'}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                {activeRequest?.description || 'Living room switchboard sparking'}
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-1 font-body-md text-body-md">
            <div className="flex items-center justify-between text-on-surface">
              <span>Diagnostic &amp; Initial Inspection Fee</span>
              <span className="font-semibold tabular-nums">{cityConfig.currencySymbol}{activeRequest?.visitFee || cityConfig.pricing.baseInspectionFee}</span>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant text-body-sm">
              <span>Platform Safety &amp; Insurance Protection</span>
              <span className="tabular-nums">{cityConfig.currencySymbol}{cityConfig.pricing.platformSafetyFee}</span>
            </div>
            <div className="flex items-center justify-between text-emerald-700 text-body-sm font-medium">
              <span>First-Time Emergency Discount (SATTHI50)</span>
              <span className="tabular-nums">-{cityConfig.currencySymbol}{cityConfig.pricing.firstTimeDiscount}</span>
            </div>
            <div className="pt-2 flex items-center justify-between text-on-surface font-bold border-t border-surface-container">
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm">Payable at Inspection</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">
                  Cash or UPI accepted by technician
                </span>
              </div>
              <span className="font-data-metric text-data-metric text-primary">
                {cityConfig.currencySymbol}{activeRequest?.visitFee || cityConfig.pricing.baseInspectionFee}
              </span>
            </div>
          </div>
        </div>

        {/* Cancellation Window Warning & Emergency Exit */}
        <div className="w-full p-4 rounded-xl bg-surface-container-low border border-surface-container/60 flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span className="font-body-sm text-body-sm">
              Free cancellation window expires in{' '}
              <span className="font-bold text-primary tabular-nums">
                00:{cancelSeconds < 10 ? `0${cancelSeconds}` : cancelSeconds}
              </span>
            </span>
          </div>
          <button
            onClick={cancelActiveRequest}
            className="w-full h-11 px-4 rounded-xl bg-surface-container-highest text-error font-label-md text-label-md font-bold hover:bg-error-container/40 transition-colors cursor-pointer"
            type="button"
          >
            Cancel Booking
          </button>
          <span className="font-label-sm text-[10px] text-on-surface-variant">
            {cityConfig.currencySymbol}{cityConfig.pricing.lateCancellationFee} dispatch convenience fee applies if cancelled after technician is within 500m.
          </span>
        </div>
      </div>
    </div>
  );
};
