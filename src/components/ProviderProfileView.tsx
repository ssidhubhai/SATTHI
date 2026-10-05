import React from 'react';
import { useApp } from '../context/AppContext';

export const ProviderProfileView: React.FC = () => {
  const { setRole, navigateTo, resetDemoState, cityConfig } = useApp();

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto pb-32">
      <div className="px-margin pt-space-md flex flex-col gap-space-md">
        {/* Profile Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-xs border border-surface-container/60 flex flex-col gap-space-md">
          <div className="flex items-center gap-space-md">
            <div className="relative">
              <img
                className="w-16 h-16 rounded-2xl object-cover bg-surface-container"
                alt="Rahul Kumar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuALC5v_Pg92yXeMQ7zt1CR9eNPLsBl1gIAsWsig1StwYvFD19yXWcj3dBoUhNaF0_aTVckhbqRIYeA_4LIPFhDZEH3OL0bsz70beEPmamW09s2hZk8kmJ5xrr1gDb-_n5byP5mJPuRGZKDM0h7MdRfqz_mHM6rpXVenJjbnDmSGZEjP1gVDHSAUKWnBZ6_IPcFeuzo2hB83Ldd8r-4FQvDcRx1G1DVbqAp76WsAMImvcVdN7Gg8-sbJ"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] shadow-xs">
                <span className="material-symbols-outlined text-[13px]">check</span>
              </span>
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
                  Rahul Kumar
                </h1>
                <span className="bg-primary-fixed text-on-primary-fixed font-label-sm text-[10px] px-2 py-0.5 rounded-full font-bold">
                  PRO MASTER
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Master Electrician · ID: SAT-TECH-9014
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-label-sm text-label-sm text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                  Demo Screening: Mock ID &amp; Skill Checked
                </span>
              </div>
            </div>
          </div>

          {/* Prototype Honest Disclaimer */}
          <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl text-amber-950 text-xs">
            <div className="flex items-center gap-1.5 font-bold mb-0.5">
              <span className="material-symbols-outlined text-[16px] text-amber-700">info</span>
              <span>Demo Screening Sandbox Notice</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-900">
              Provider credentials, licenses, and background checks shown here are simulated prototype data for workflow demonstration. They do not constitute official government (UIDAI) or police database certifications.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-surface-container-low rounded-xl p-3 text-center border border-surface-container">
            <div className="flex flex-col">
              <span className="font-data-metric text-data-metric text-on-surface">4.94</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Rating (340)</span>
            </div>
            <div className="flex flex-col">
              <span className="font-data-metric text-data-metric text-emerald-700">99.4%</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">On-Time</span>
            </div>
            <div className="flex flex-col">
              <span className="font-data-metric text-data-metric text-primary">₹0 Cut</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Direct Pay</span>
            </div>
          </div>
        </div>

        {/* Verification & Badges Checklist */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container/60 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Screening Checklist &amp; Licensing (Demo)
            </h2>
            <span className="font-label-sm text-[11px] bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded font-semibold">
              Simulated Checks
            </span>
          </div>
          <div className="space-y-2.5">
            {[
              {
                title: 'ITI Electrical Diploma (Demo Record)',
                sub: `Certificate #ITI-8812 (Sample portfolio check for prototype demo)`,
                icon: 'school',
              },
              {
                title: `${cityConfig.localUtilityProvider.name} Wireman License (Demo Check)`,
                sub: `Simulated credential check for domestic distribution boards`,
                icon: 'electric_bolt',
              },
              {
                title: '₹10,000 Demo Transit & Accidental Protection',
                sub: `Policy #${cityConfig.tradeCompliance.insuranceUnderwriter} (Prototype risk pool demo)`,
                icon: 'verified_user',
              },
              {
                title: 'Vehicle: Honda Activa 6G',
                sub: `Simulated route telemetry (Test transit simulator)`,
                icon: 'two_wheeler',
              },
            ].map((b, idx) => (
              <div key={idx} className="flex items-start gap-3 p-2.5 rounded-lg bg-surface-container-low border border-surface-container">
                <span className="material-symbols-outlined text-[20px] text-primary shrink-0 mt-0.5">
                  {b.icon}
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-md text-label-md font-bold text-on-surface">
                    {b.title}
                  </span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant leading-tight">
                    {b.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Mode & Demo Controls */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container/60 flex flex-col gap-3">
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            App Mode &amp; Demo Actions
          </h2>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setRole('customer')}
              className="w-full py-3 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
              <span>Switch to Customer App View</span>
            </button>
            <button
              onClick={() => {
                resetDemoState();
              }}
              className="w-full py-3 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-highest transition-colors cursor-pointer"
            >
              Reset Demo State
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
