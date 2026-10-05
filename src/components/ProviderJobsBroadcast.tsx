import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BEFORE_FAULT_PHOTO } from '../data/mockData';

export const ProviderJobsBroadcast: React.FC = () => {
  const { acceptRequestAsProvider, navigateTo, showToast } = useApp();
  const [secondsLeft, setSecondsLeft] = useState(24);
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 1 ? prev - 1 : 24));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAccept = () => {
    setIsAccepting(true);
    setTimeout(() => {
      acceptRequestAsProvider();
      navigateTo('provider-active-job');
    }, 800);
  };

  const handlePass = () => {
    navigateTo('provider-dashboard');
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto pb-28">
      <div className="flex flex-col w-full px-space-md py-space-sm space-y-space-md">
        {/* URGENT BROADCAST TICKER & COUNTDOWN */}
        <div className="w-full bg-primary text-on-primary rounded-xl p-space-md shadow-lg overflow-hidden relative">
          <div className="flex items-center justify-between gap-space-xs relative z-10">
            <div className="flex items-center gap-space-xs">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-fixed opacity-80"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-surface-container-lowest"></span>
              </span>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-fixed font-bold">
                  Incoming Dispatch
                </span>
                <span className="font-headline-sm text-headline-sm font-bold leading-tight">
                  Short Circuit Alert
                </span>
              </div>
            </div>

            {/* Circular Digital Countdown Gauge */}
            <div className="flex items-center gap-space-xs bg-primary-container px-space-sm py-1.5 rounded-full shadow-inner font-bold">
              <span className="material-symbols-outlined text-[18px] text-primary-fixed animate-pulse">
                timer
              </span>
              <span className="font-data-metric text-data-metric font-extrabold text-on-primary">
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

          {/* Live Telemetry Status & Audio Alert */}
          <div className="flex items-center justify-between text-primary-fixed mt-2.5 pt-2 font-label-sm text-label-sm font-medium">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">volume_up</span>
              <span>Loud Chime &amp; Haptic active</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              <span>Priority 1: Urgent Hazard</span>
            </div>
          </div>
        </div>

        {/* ROUTE PREVIEW SNIPPET */}
        <div className="w-full rounded-xl overflow-hidden shadow-xs border border-surface-container/60 bg-surface-container-lowest relative">
          <div
            className="w-full h-36 bg-cover bg-center relative"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBISS-3fTLGnrjUcIa9sSByFwiblcrR6D_ypSvmacGNDY4FgfiqqAj6nhN0duNvlpQ2V7jrMzf8NRWej2uU4UFYc4CTGnsw2v9qc1-UmMNqeHknS0-g2aWihU6iS5U0erJHzNcY0bt9FtR8lTDBTvK4zwjT7q8b7m8O9z5CxVhrIPoypfPArgsyKhayGIUFJ58fupBa9bi0k7NL70JRX5T0SwEFt5TxprCh6yxSY_yCT1M3npRjO7i8')`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

            {/* Telemetry Overlay Badges */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-surface-container-lowest/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-xs">
              <span className="material-symbols-outlined text-[16px] text-tertiary">two_wheeler</span>
              <span className="font-label-md text-label-md text-on-surface font-bold">
                6-8 mins travel
              </span>
            </div>
            <div className="absolute top-2.5 right-2.5 bg-primary px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-on-primary">near_me</span>
              <span className="font-label-sm text-label-sm text-on-primary font-bold">0.8 km</span>
            </div>

            {/* Route Bottom Info Strip */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-surface-container-lowest font-label-md text-label-md">
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full bg-primary-fixed shrink-0"></span>
                <span className="truncate font-semibold text-white">
                  100 Ft Rd → 12th Main, HAL 2nd Stage
                </span>
              </div>
              <span className="text-primary-fixed shrink-0 font-bold ml-1">Direct Lane</span>
            </div>
          </div>
        </div>

        {/* MAIN JOB DECISION CARD */}
        <div className="w-full bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container/60 p-space-md space-y-space-md">
          {/* Fault Title & Customer Profile */}
          <div className="flex items-start justify-between gap-space-sm pb-space-sm">
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-error font-label-sm text-label-sm font-bold mb-1">
                <span className="material-symbols-outlined text-[13px]">warning</span>
                <span>Main MCB Tripping</span>
              </div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
                Short Circuit Diagnostic
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5 text-on-surface-variant font-body-sm text-body-sm">
                <span className="font-bold text-on-surface">Priya M.</span>
                <span>•</span>
                <span className="inline-flex items-center text-on-surface font-semibold">
                  <span className="material-symbols-outlined text-[14px] text-primary fill-1">
                    star
                  </span>
                  <span className="font-bold ml-0.5">4.9</span>
                </span>
                <span>(12 bookings)</span>
              </div>
            </div>

            <div className="relative shrink-0">
              <img
                className="w-12 h-12 rounded-full object-cover shadow-sm bg-surface-container"
                alt="Priya M."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0jvPP9BqfTgRvSFtPoRv1XBASZQr--39R7ro2SLoEOHAu7q-l8VS6oYJGtO2oMgwc5WsZGvP6UrzWuooM3jFJ2z33ozxBMSZOupgdYge6Tc5XpCKZPoEFhlH0QGVTPh1jWETGNq4kVt8z5_cOChFZA-yTJ501t-hyRVbYoGLDq4oKID9xoY5gdsVK4_ce39h6vyCXRw4ms2BbY2gI_FkswL8kI1X7QZm02q1GzVvXgdhXmSks08ZI"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-tertiary flex items-center justify-center text-surface shadow">
                <span className="material-symbols-outlined text-[10px] text-white">verified</span>
              </span>
            </div>
          </div>

          {/* Guaranteed Locked Payout Banner */}
          <div className="bg-surface-container-low rounded-xl p-space-md flex items-center justify-between border border-surface-container">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">
                Guaranteed Payout
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-headline-lg-mobile text-headline-lg-mobile font-extrabold text-on-surface">
                  ₹220 – ₹450
                </span>
                <span className="font-label-sm text-label-sm text-tertiary font-bold">+ Tips</span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                Includes ₹99 base visit locked
              </span>
            </div>
            <div className="flex flex-col items-end text-right">
              <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-fixed font-bold">
                Instant Payout (Demo)
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-1 font-medium">
                Direct to Pro Sandbox
              </span>
            </div>
          </div>

          {/* Diagnostic Details & Audio/Text Quote */}
          <div className="space-y-space-xs">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">
              Reported Symptom
            </span>
            <div className="bg-surface-container-high/60 rounded-lg p-3 flex gap-2.5 items-start border border-surface-container">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                format_quote
              </span>
              <p className="font-body-md text-body-md text-on-surface italic leading-snug">
                “Living room power went out with a loud click; faint burning smell near the
                distribution box.”
              </p>
            </div>
          </div>

          {/* Attachment & Transparent Parts Policy */}
          <div className="grid grid-cols-2 gap-space-sm pt-1">
            <div className="bg-surface-container-low rounded-lg p-2.5 flex items-center gap-2 border border-surface-container">
              <img
                className="w-11 h-11 rounded-md object-cover shrink-0 shadow-xs bg-surface-container"
                alt="MCB Box"
                src={BEFORE_FAULT_PHOTO}
              />
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm font-bold text-on-surface truncate">
                  MCB_Box.jpg
                </span>
                <span
                  onClick={() => showToast('Photo inspection: Visible scorch mark on 32A MCB terminal. Replacement part suggested: Schneider 32A C-Curve.', 'info', 'image')}
                  className="font-body-sm text-body-sm text-primary flex items-center gap-0.5 cursor-pointer font-medium hover:underline"
                >
                  <span className="material-symbols-outlined text-[13px]">visibility</span>
                  <span>Inspect</span>
                </span>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-lg p-2.5 flex flex-col justify-center border border-surface-container">
              <div className="flex items-center gap-1 text-tertiary">
                <span className="material-symbols-outlined text-[15px]">verified_user</span>
                <span className="font-label-sm text-label-sm font-bold truncate">Pre-approved</span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant leading-tight mt-0.5">
                Havells / Schneider MRP parts
              </span>
            </div>
          </div>

          {/* Safety / Trust Checklist for Rahul */}
          <div className="flex items-center justify-between text-on-surface-variant pt-2 border-t border-surface-container">
            <div className="flex items-center gap-1.5 font-label-sm text-label-sm font-medium">
              <span className="material-symbols-outlined text-[16px] text-tertiary">shield</span>
              <span>Insured via SatthiPro Cover</span>
            </div>
            <div className="flex items-center gap-1.5 font-label-sm text-label-sm font-medium">
              <span className="material-symbols-outlined text-[16px] text-primary">pin_drop</span>
              <span>Accurate Geo-Fence</span>
            </div>
          </div>
        </div>

        {/* ACTION CONTROL DECK */}
        <div className="w-full space-y-space-sm pt-1">
          <button
            onClick={handleAccept}
            disabled={isAccepting}
            className="w-full h-14 bg-primary text-on-primary rounded-xl font-label-lg text-label-lg font-bold flex items-center justify-between px-space-md shadow-md active:scale-[0.98] transition-transform cursor-pointer"
          >
            <div className="flex items-center gap-space-sm">
              <span className="w-8 h-8 rounded-full bg-on-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] text-on-primary">
                  check_circle
                </span>
              </span>
              <span className="text-[17px] tracking-wide">
                {isAccepting ? 'LOCKING DISPATCH...' : 'ACCEPT DISPATCH'}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-on-primary/20 px-2.5 py-1 rounded-lg">
              <span className="font-data-metric text-data-metric font-extrabold text-on-primary">
                ₹220+
              </span>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </div>
          </button>

          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={handlePass}
              className="w-full h-11 bg-surface-container-high text-on-surface rounded-xl font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform hover:bg-surface-container-highest cursor-pointer border border-surface-container/60"
            >
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                close
              </span>
              <span>Pass / Not Ready Right Now</span>
            </button>
            <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[13px] text-secondary">handshake</span>
              <span>Independent partner • Zero penalty for passing broadcast</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
