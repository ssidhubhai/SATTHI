import React from 'react';
import { useApp } from '../context/AppContext';
import { simulationService } from '../services/simulationService';

export const ProviderProfile: React.FC = () => {
  const { selectedProviderId, providers, navigateTo, showToast, currentLocation } = useApp();

  const pro =
    providers.find((p) => p.id === selectedProviderId) ||
    providers.find((p) => p.id === 'rahul-kumar') ||
    providers[0];

  const handleBookNow = () => {
    navigateTo('request-form', { categoryId: pro.category, providerId: pro.id });
  };

  const handleCall = () => {
    showToast(simulationService.simulateVoiceCall(pro.name).message, 'info', 'phone');
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto pb-28">
      {/* Top Real-Time Telemetry Alert Strip */}
      <div className="px-margin pt-space-xs pb-space-sm">
        <div className="bg-surface-container-low rounded-xl p-space-sm flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-space-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
            </span>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                Available Right Now • {pro.distanceKm} km away
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {currentLocation.name} • Arrival in ~{pro.etaMinutes} mins
              </span>
            </div>
          </div>
          <div className="bg-surface-container-highest px-space-sm py-1 rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-primary text-[16px]">bolt</span>
            <span className="font-label-sm text-label-sm text-on-surface font-semibold">
              Fast Dispatch
            </span>
          </div>
        </div>
      </div>

      {/* Provider Identity Card */}
      <div className="px-margin mb-space-md">
        <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-md flex flex-col gap-space-md">
          <div className="flex items-start gap-space-md">
            <div className="relative shrink-0">
              <img
                alt={pro.name}
                className="w-20 h-20 rounded-2xl object-cover shadow-sm bg-surface-container"
                src={pro.avatar}
              />
              <div className="absolute -bottom-1.5 -right-1.5 bg-primary text-on-primary rounded-full p-1 shadow-sm flex items-center justify-center">
                <span className="material-symbols-outlined text-[14px]">verified</span>
              </div>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="font-headline-sm text-headline-sm text-on-surface truncate font-bold">
                  {pro.name}
                </h2>
                <span className="bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">
                  PRO
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 line-clamp-1">
                {pro.title}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-500 font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[18px] fill-1">star</span>
                  <span className="ml-1 text-on-surface font-headline-sm text-headline-sm font-bold">
                    {pro.rating}
                  </span>
                  <span className="text-on-surface-variant font-body-sm text-body-sm ml-1">
                    ({pro.reviewCount})
                  </span>
                </div>
                <span className="text-surface-container-highest font-body-sm">•</span>
                <span className="font-label-sm text-label-sm text-primary font-semibold">
                  SATTHI Assured
                </span>
              </div>
            </div>
          </div>

          {/* Trust Indicators Strip */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-1 text-xs text-on-surface-variant font-medium">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-tertiary">school</span>
              <span>ITI Diploma (Demo Check)</span>
            </div>
            <span className="text-secondary font-bold">·</span>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-tertiary">shield</span>
              <span>Demo Screening Passed</span>
            </div>
            <span className="text-secondary font-bold">·</span>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-tertiary">
                verified_user
              </span>
              <span>₹10,000 Demo Cover</span>
            </div>
          </div>

          {/* Quantitative Metric Matrix */}
          <div className="grid grid-cols-3 gap-2 bg-surface-container-low rounded-xl p-3 text-center">
            <div className="flex flex-col items-center">
              <span className="font-data-metric text-data-metric text-on-surface font-bold">
                {pro.experienceYears}+ Yrs
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Field Exp</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-data-metric text-data-metric text-emerald-700 font-bold">
                {pro.onTimeRate}%
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                On-Time Arrival
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-data-metric text-data-metric text-primary font-bold">
                {pro.repeatBookingsCount}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Nearby Repeats
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Transparent Pricing & Inspection Card */}
      <div className="px-margin mb-space-md">
        <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-md flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Transparent Pricing Menu
            </h3>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-label-sm text-xs font-bold">
              Standard Tariff
            </span>
          </div>

          <div className="divide-y divide-surface-container">
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-label-md font-bold text-on-surface block">
                  Diagnostic &amp; Line Inspection Fee
                </span>
                <span className="text-xs text-secondary">
                  Waived if repair work exceeds ₹{pro.pricingBreakdown.inspectionWaiveThreshold}
                </span>
              </div>
              <span className="font-bold text-on-surface font-mono">
                ₹{pro.pricingBreakdown.inspectionFee}
              </span>
            </div>

            {pro.pricingBreakdown.laborRates.map((rate, rIdx) => (
              <div key={rIdx} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-secondary">
                    {rate.icon}
                  </span>
                  <span className="font-label-md text-on-surface">{rate.label}</span>
                </div>
                <span className="font-semibold text-secondary font-mono text-xs">{rate.range}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews & Social Proof */}
      <div className="px-margin mb-space-md">
        <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-md flex flex-col gap-3">
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            Recent Local Reviews
          </h3>
          <div className="space-y-3">
            {pro.reviews.map((rev) => (
              <div key={rev.id} className="p-3 rounded-xl bg-surface-container-low flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-md font-bold text-on-surface">{rev.author}</span>
                  <span className="text-xs text-secondary">{rev.timeAgo}</span>
                </div>
                <div className="flex items-center text-amber-500 text-xs">
                  {'★'.repeat(rev.rating)}
                </div>
                <p className="font-body-sm text-xs text-on-surface mt-1">"{rev.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Guarantee Micro-Banner */}
      <div className="px-margin mb-space-md">
        <div className="bg-surface-container-low rounded-xl p-3 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-[28px]">handshake</span>
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              SATTHI 30-Day Guarantee
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              If recurring issues arise within 30 days, re-inspection is free.
            </span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Quick Action Drawer Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/92 backdrop-blur-md shadow-md px-margin py-3 pb-safe border-t border-surface-container/60">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-space-sm">
          {/* Left Price Summary */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="font-data-metric text-xl font-bold text-on-surface">₹{pro.visitFee}</span>
              <span className="font-label-sm text-xs text-on-surface-variant font-medium">visit</span>
            </div>
            <span className="font-label-sm text-xs text-primary font-semibold truncate">
              Waived if service &gt; ₹300
            </span>
          </div>

          {/* Right CTAs Group */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              aria-label="Direct Quick Phone Call"
              onClick={handleCall}
              className="w-11 h-11 flex items-center justify-center rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high border border-surface-container active:scale-95 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">call</span>
            </button>
            <button
              aria-label={`Book ${pro.name} Now`}
              onClick={handleBookNow}
              className="h-11 px-5 rounded-xl bg-primary text-on-primary flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-transform cursor-pointer font-bold text-xs"
            >
              <span>Request {pro.name.split(' ')[0]} Now</span>
              <span className="bg-white/20 text-on-primary font-label-sm text-[11px] px-2 py-0.5 rounded-full font-bold">
                ~{pro.etaMinutes}m
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
