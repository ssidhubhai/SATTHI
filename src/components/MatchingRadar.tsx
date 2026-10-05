import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const MatchingRadar: React.FC = () => {
  const {
    activeRequest,
    acceptRequestAsProvider,
    cancelActiveRequest,
    navigateTo,
    currentLocation,
    cityConfig,
    providers,
  } = useApp();
  const [countdown, setCountdown] = useState(8);
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (!isAccepted) {
      setIsAccepted(true);
      acceptRequestAsProvider();
      const navTimer = setTimeout(() => {
        navigateTo('live-tracking');
      }, 2000);
      return () => clearTimeout(navTimer);
    }
  }, [countdown, isAccepted, acceptRequestAsProvider, navigateTo]);

  // Identify the target responding technician
  const matchedPro =
    (activeRequest?.assignedProviderId
      ? providers.find((p) => p.id === activeRequest.assignedProviderId)
      : providers[0]) || providers[0];

  // Top 3 pros for dynamic radar telemetry display
  const radarPros = providers.slice(0, 3);
  const searchRadius = cityConfig.searchRadiusKm || 2.5;

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto pb-24">
      {/* Status & Headline Zone */}
      <section className="px-margin pt-space-md pb-space-sm flex flex-col gap-space-xs">
        <div className="inline-flex items-center gap-space-xs px-3 py-1.5 rounded-full bg-surface-container-high w-fit shadow-xs">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant font-bold tracking-wider uppercase">
            Live Proximity Search · {currentLocation.name}
          </span>
        </div>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface tracking-tight mt-1 font-extrabold">
          Locating nearby available {activeRequest?.category || 'electrician'}s…
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
          Broadcasting request for{' '}
          <span className="font-semibold text-on-surface">
            {activeRequest?.faultType || 'Diagnostic & Repair'}
          </span>{' '}
          to background-cleared pros within {searchRadius} km.
        </p>
      </section>

      {/* Interactive Radar Arena */}
      <section className="px-margin my-space-sm">
        <div className="relative w-full aspect-square max-w-[380px] mx-auto rounded-3xl bg-inverse-surface overflow-hidden shadow-xl flex items-center justify-center select-none">
          {/* Concentric telemetry range circles */}
          <div className="absolute w-[82%] h-[82%] rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] pointer-events-none"></div>
          <div className="absolute w-[58%] h-[58%] rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] pointer-events-none"></div>
          <div className="absolute w-[34%] h-[34%] rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)] pointer-events-none"></div>

          {/* Tactical Axis lines */}
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/5 pointer-events-none"></div>
          <div className="absolute inset-y-0 left-1/2 w-[1px] bg-white/5 pointer-events-none"></div>

          {/* Animated Radar Sweep Cone */}
          <div className="absolute inset-0 origin-center animate-[spin_4s_linear_infinite] pointer-events-none">
            <div className="w-1/2 h-1/2 ml-auto origin-bottom-left bg-gradient-to-tr from-transparent via-primary/10 to-primary/35 rounded-tl-full blur-[1px]"></div>
          </div>

          {/* Center Anchor: Customer */}
          <div className="relative z-20 flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-12 h-12 rounded-full bg-primary/25 animate-ping"></div>
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-[20px] fill-1">
                  person_pin_circle
                </span>
              </div>
            </div>
            <div className="mt-1 px-2.5 py-1 rounded-full bg-surface-container-lowest/95 backdrop-blur shadow-md">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                You ({currentLocation.area.split(',')[0] || currentLocation.name})
              </span>
            </div>
          </div>

          {/* Dynamic Provider Nodes from City Catalog */}
          {radarPros[0] && (
            <div className="absolute top-[22%] left-[64%] z-20 flex flex-col items-center animate-[pulse_2.5s_infinite]">
              <div className="relative flex items-center justify-center">
                <span className="absolute w-8 h-8 rounded-full bg-surface-container-lowest/20 animate-ping"></span>
                <div className="w-8 h-8 rounded-full bg-surface-container-lowest p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-primary text-on-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[15px]">electric_bolt</span>
                  </div>
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></span>
              </div>
              <div className="mt-1 px-2 py-0.5 rounded-md bg-inverse-surface/90 text-inverse-on-surface shadow-md backdrop-blur">
                <p className="font-label-sm text-[10px] leading-tight font-semibold tracking-wide whitespace-nowrap">
                  {radarPros[0].name.split(' ')[0]} · {radarPros[0].distanceKm} km
                </p>
              </div>
            </div>
          )}

          {radarPros[1] && (
            <div className="absolute bottom-[24%] left-[16%] z-20 flex flex-col items-center opacity-90">
              <div className="relative flex items-center justify-center">
                <div className="w-7 h-7 rounded-full bg-surface-container-lowest p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-surface-container-high text-on-surface flex items-center justify-center">
                    <span className="material-symbols-outlined text-[13px]">handyman</span>
                  </div>
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="mt-1 px-1.5 py-0.5 rounded bg-inverse-surface/85 text-inverse-on-surface shadow-sm">
                <p className="font-label-sm text-[9px] leading-none whitespace-nowrap">
                  {radarPros[1].name.split(' ')[0]} · {radarPros[1].distanceKm} km
                </p>
              </div>
            </div>
          )}

          {radarPros[2] && (
            <div className="absolute top-[18%] left-[18%] z-20 flex flex-col items-center opacity-85">
              <div className="relative flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-surface-container-lowest p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-surface-container-high text-on-surface flex items-center justify-center">
                    <span className="material-symbols-outlined text-[12px]">build</span>
                  </div>
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="mt-1 px-1.5 py-0.5 rounded bg-inverse-surface/85 text-inverse-on-surface shadow-sm">
                <p className="font-label-sm text-[9px] leading-none whitespace-nowrap">
                  {radarPros[2].name.split(' ')[0]} · {radarPros[2].distanceKm} km
                </p>
              </div>
            </div>
          )}

          {/* Bottom Overlay Real-time Counter Badge */}
          <div className="absolute bottom-3 inset-x-2.5 sm:inset-x-3 flex justify-between items-center z-20 pointer-events-none gap-1">
            <div className="px-2.5 sm:px-3 py-1.5 rounded-full bg-inverse-surface/85 backdrop-blur-md text-inverse-on-surface flex items-center gap-1.5 shadow-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-label-sm text-[11px] sm:text-label-sm font-bold tracking-tight">
                {currentLocation.activeProsCount} Pros in {currentLocation.name}
              </span>
            </div>
            <div className="px-2 sm:px-2.5 py-1.5 rounded-full bg-inverse-surface/85 backdrop-blur-md text-inverse-on-surface flex items-center gap-1 text-[10px] sm:text-[11px] font-medium shrink-0">
              <span className="material-symbols-outlined text-[13px] sm:text-[14px] text-tertiary-fixed-dim">
                radar
              </span>
              <span>Sweep {searchRadius} km</span>
            </div>
          </div>
        </div>
      </section>

      {/* Incoming Pro Response Card (Transition State) */}
      <section className="px-margin pt-space-xs pb-space-sm">
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-4 shadow-xs border border-surface-container/60">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-container to-tertiary"></div>

          <div className="flex items-center justify-between gap-space-xs mb-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed">
              <span className="material-symbols-outlined text-[15px] text-primary">bolt</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wide font-bold">
                Fastest Match Responding
              </span>
            </div>
            <div className="flex items-center gap-1 text-primary font-semibold">
              <span className="material-symbols-outlined text-[15px]">timer</span>
              <span className="font-label-sm text-label-sm font-bold">
                {isAccepted ? 'Partner Accepted!' : `Securing slot… ${countdown}s`}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-space-sm">
            <div className="relative shrink-0">
              <img
                className="w-14 h-14 rounded-xl object-cover shadow-xs bg-surface-container border border-surface-container/60"
                alt={matchedPro.name}
                src={matchedPro.avatar}
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[13px] fill-1">verified</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-1">
                <h3 className="font-headline-sm text-headline-sm text-on-surface truncate font-bold">
                  {matchedPro.name}
                </h3>
                <div className="flex items-center gap-0.5 shrink-0 bg-surface-container-high px-1.5 py-0.5 rounded">
                  <span className="material-symbols-outlined text-[13px] text-amber-500 fill-1">
                    star
                  </span>
                  <span className="font-label-sm text-label-sm font-bold text-on-surface">
                    {matchedPro.rating}
                  </span>
                  <span className="font-body-sm text-[10px] text-on-surface-variant font-normal">
                    ({matchedPro.reviewCount})
                  </span>
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5">
                {matchedPro.title}
              </p>
              <div className="flex items-center gap-1 text-primary font-medium text-xs mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                <span>Acknowledged dispatch request</span>
              </div>
            </div>
          </div>

          {/* Quick Telemetry & Pricing Pill Strip */}
          <div className="grid grid-cols-2 gap-space-xs mt-3.5 pt-3 bg-surface-container-low p-2.5 rounded-xl border border-surface-container/40">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-on-surface shrink-0 shadow-xs border border-surface-container/60">
                <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
              </div>
              <div className="min-w-0">
                <span className="block font-body-sm text-[11px] text-on-surface-variant leading-none">
                  Arrival Estimate
                </span>
                <span className="font-label-lg text-label-lg text-on-surface font-bold">
                  ~{matchedPro.etaMinutes} mins
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-on-surface shrink-0 shadow-xs border border-surface-container/60">
                <span className="material-symbols-outlined text-[18px]">lock</span>
              </div>
              <div className="min-w-0">
                <span className="block font-body-sm text-[11px] text-on-surface-variant leading-none">
                  Inspection Fee
                </span>
                <span className="font-label-lg text-label-lg text-primary font-bold">
                  {cityConfig.currencySymbol}{matchedPro.visitFee || cityConfig.pricing.baseInspectionFee} Locked
                </span>
              </div>
            </div>
          </div>

          {/* Linear dynamic countdown bar */}
          <div className="w-full bg-surface-container-high rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                isAccepted ? 'bg-emerald-600 w-full' : 'bg-primary'
              }`}
              style={{ width: `${(countdown / 8) * 100}%` }}
            ></div>
          </div>

          {isAccepted && (
            <button
              onClick={() => navigateTo('live-tracking')}
              className="mt-3 w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>View Live Tracking &amp; Arrival</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          )}
        </div>
      </section>

      {/* Real-Time Telemetry & Trust Stepper */}
      <section className="px-margin py-space-xs">
        <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-xs border border-surface-container/60 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">
              Matching Simulation (Demo Sandbox)
            </span>
            <span className="font-body-sm text-body-sm text-primary font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">sync</span> Live Broadcast
            </span>
          </div>
          <div className="flex flex-col gap-2.5">
            {/* Step 1 */}
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px] font-bold">check</span>
              </div>
              <span className="font-body-md text-body-md text-on-surface">
                Issue broadcasted to {currentLocation.activeProsCount} active pros in {currentLocation.name}
              </span>
            </div>
            {/* Step 2 */}
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px] font-bold">check</span>
              </div>
              <span className="font-body-md text-body-md text-on-surface">
                Digital proximity &amp; tool readiness verified
              </span>
            </div>
            {/* Step 3 (Active) */}
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-6 h-6 shrink-0">
                <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-primary opacity-60"></span>
                <div className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[13px]">
                    radio_button_checked
                  </span>
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                  Waiting for pro confirmation
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Average acceptance speed: 25 seconds
                </span>
              </div>
            </div>
            {/* Step 4 */}
            <div className="flex items-center gap-3 opacity-45">
              <div className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[14px]">call</span>
              </div>
              <span className="font-body-md text-body-md text-on-surface">
                Direct masked chat &amp; phone relay opens (Demo Relay)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Reassurance & Protection Guarantee */}
      <section className="px-margin py-space-xs">
        <div className="rounded-xl bg-surface-container-low p-3.5 flex items-start gap-3 border border-surface-container/60">
          <div className="w-8 h-8 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
            <span className="material-symbols-outlined text-[20px] fill-1">verified_user</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-label-md text-label-md text-on-surface font-bold">
              SATTHI Fair-Play Assurance
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
              Zero cancellation fee within first {cityConfig.pricing.freeCancellationMinutes} minutes. You only pay after work is inspected, quoted, and approved by you.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Action Dock */}
      <div className="px-margin pt-space-sm pb-space-lg flex flex-col gap-space-xs mt-auto">
        <button
          onClick={cancelActiveRequest}
          className="w-full h-12 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition-colors font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-xs border border-surface-container/60 active:scale-[0.98] cursor-pointer font-medium"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
            close
          </span>
          <span>Cancel Request</span>
        </button>

        <div className="flex items-center justify-center py-1">
          <a
            className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors py-1"
            href={cityConfig.supportTel}
          >
            <span className="material-symbols-outlined text-[16px]">support_agent</span>
            <span className="font-label-sm text-label-sm underline underline-offset-4">
              {cityConfig.operationsDeskName} SOS Helpline: {cityConfig.supportHelpline}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};
