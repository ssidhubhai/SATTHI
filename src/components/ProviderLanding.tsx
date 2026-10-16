import React from 'react';
import { useApp } from '../context/AppContext';

export const ProviderLanding: React.FC = () => {
  const { navigateTo, cityConfig, currentLocation } = useApp();

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto pb-32">
      {/* Hero Section */}
      <section className="relative px-margin pt-6 pb-8 bg-surface overflow-hidden">
        {/* Decorative ambient gradient */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col gap-3 relative z-10">
          <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
            <span className="material-symbols-outlined text-[16px] text-primary">engineering</span>
            <span className="font-label-sm text-xs font-bold uppercase tracking-wider">
              Work with SATTHI · Partner Portal
            </span>
          </div>

          <h1 className="font-headline-lg-mobile text-2xl xs:text-3xl sm:text-4xl text-on-surface font-extrabold tracking-tight leading-tight">
            Turn your free hours into more local work.
          </h1>

          <p className="font-body-md text-sm sm:text-base text-on-surface-variant leading-relaxed">
            Choose when you work. Accept jobs that fit you. Earn directly from your skills with verified customers across {cityConfig.name}.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-3">
            <button
              onClick={() => navigateTo('provider-register')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-primary text-on-primary font-label-lg font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-primary-container active:scale-98 transition-all cursor-pointer min-h-[48px]"
            >
              <span>Join SATTHI as a Pro</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
            <button
              onClick={() => navigateTo('provider-login')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-surface-container font-label-lg font-bold flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[48px]"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              <span>Provider Login</span>
            </button>
          </div>

          <div className="flex items-center gap-4 mt-2 pt-2 border-t border-surface-container/60 text-xs text-secondary">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
              <span>₹0 Platform Commission</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
              <span>Instant Bank Settlements</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
              <span>No Lead Fees</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Cluster Demand Ticker */}
      <section className="px-margin py-3">
        <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <div className="truncate">
              <span className="font-label-sm text-xs font-bold text-on-surface block truncate">
                Active Demand in {currentLocation.name}
              </span>
              <span className="font-body-sm text-[11px] text-secondary">
                {currentLocation.activeProsCount} pros online · {currentLocation.surgeActive ? 'High dispatch frequency' : 'Steady incoming requests'}
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-xs font-bold shrink-0">
            {currentLocation.surgeActive ? 'Surge Active' : 'Open'}
          </span>
        </div>
      </section>

      {/* How SATTHI Works for Providers */}
      <section className="px-margin py-5">
        <div className="mb-4">
          <span className="font-label-sm text-xs uppercase tracking-wider font-extrabold text-primary">
            Clear & Respectful Workflow
          </span>
          <h2 className="font-headline-sm text-lg sm:text-xl font-bold text-on-surface mt-0.5">
            How SATTHI works for independent professionals
          </h2>
          <p className="font-body-sm text-xs text-secondary mt-1">
            You are in full control of your schedule, service territory, and job acceptance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container/60 shadow-xs flex flex-col gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-base">
              1
            </div>
            <h3 className="font-headline-sm text-sm font-bold text-on-surface">Go Online When Ready</h3>
            <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
              Toggle your availability with one tap. No penalties for being offline when you are resting or on personal errands.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container/60 shadow-xs flex flex-col gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-base">
              2
            </div>
            <h3 className="font-headline-sm text-sm font-bold text-on-surface">Review Upfront Job Details</h3>
            <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
              See the exact customer locality, fault description, photo inspection, and guaranteed payout before saying yes.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container/60 shadow-xs flex flex-col gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-base">
              3
            </div>
            <h3 className="font-headline-sm text-sm font-bold text-on-surface">Doorstep PIN & Direct Pay</h3>
            <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
              Verify customer with a 4-digit PIN, add genuine van stock parts with zero markups, and receive instant direct payments.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-margin py-4">
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container/60 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-primary">workspace_premium</span>
            <h3 className="font-headline-sm text-base font-bold text-on-surface">
              Why independent pros choose SATTHI
            </h3>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">percent</span>
              </div>
              <div>
                <h4 className="font-label-md text-xs font-bold text-on-surface">₹0 Lead Fees or Deductions</h4>
                <p className="font-body-sm text-xs text-secondary mt-0.5 leading-relaxed">
                  Unlike traditional aggregator apps, you never pay upfront to view or unlock customer phone numbers. You keep your entire labor tariff.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">pin_drop</span>
              </div>
              <div>
                <h4 className="font-label-md text-xs font-bold text-on-surface">Tight Local Radius (3 to 5 km)</h4>
                <p className="font-body-sm text-xs text-secondary mt-0.5 leading-relaxed">
                  Save fuel and transit time. Receive jobs concentrated in your chosen neighborhood clusters like Indiranagar, Koramangala, or HSR Layout.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
              </div>
              <div>
                <h4 className="font-label-md text-xs font-bold text-on-surface">Verified Resident Safety & Protection</h4>
                <p className="font-body-sm text-xs text-secondary mt-0.5 leading-relaxed">
                  Every resident address is verified. 24/7 partner helpline and transit protection backing for accidental damages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Realistic Earnings Concept */}
      <section className="px-margin py-4">
        <div className="p-5 rounded-2xl bg-surface-container-low border border-surface-container flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs uppercase tracking-wider font-extrabold text-secondary">
              Transparent Economics
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Realistic Estimates
            </span>
          </div>

          <h3 className="font-headline-sm text-base font-bold text-on-surface">
            How earnings work on SATTHI
          </h3>

          <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
            Earnings depend directly on the jobs you accept, your trade skill, and the hours you choose to work. SATTHI does not make inflated income promises.
          </p>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container/60">
              <span className="text-[11px] text-secondary font-medium block">Standard Inspection Fee</span>
              <span className="font-data-metric text-lg font-bold text-primary">₹99</span>
              <span className="text-[10px] text-secondary block mt-0.5">Paid upfront by resident</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container/60">
              <span className="text-[11px] text-secondary font-medium block">Average Repair Labor</span>
              <span className="font-data-metric text-lg font-bold text-primary">₹220 - ₹550</span>
              <span className="text-[10px] text-secondary block mt-0.5">Based on trade difficulty</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-surface-container-high/60 text-[11px] text-secondary leading-snug">
            <strong>Honest Note:</strong> You are an independent contractor. SATTHI acts as a dispatch and matchmaking platform, not an employer.
          </div>
        </div>
      </section>

      {/* Trust & Screening Explanation */}
      <section className="px-margin py-4">
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container/60 shadow-xs flex flex-col gap-2">
          <h3 className="font-headline-sm text-sm font-bold text-on-surface">
            Our Onboarding & Screening Standard
          </h3>
          <p className="font-body-sm text-xs text-secondary leading-relaxed">
            To protect both customers and professionals, every partner undergoes a clear review process: government ID check, trade diploma / practical skill verification, and doorstep protocol training.
          </p>
          <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-900 text-[11px]">
            <strong>Demo Sandbox Notice:</strong> During this interactive demo, verification is simulated to allow you to experience the complete flow instantly.
          </div>
        </div>
      </section>

      {/* Provider FAQ */}
      <section className="px-margin py-4">
        <h3 className="font-headline-sm text-base font-bold text-on-surface mb-3">
          Frequently Asked Questions
        </h3>
        <div className="space-y-2">
          {[
            {
              q: 'Do I have to pay to receive job requests?',
              a: 'No. SATTHI does not charge any upfront coin or lead purchase fees. Job broadcasts are free to receive and accept.',
            },
            {
              q: 'Can I choose my own working hours?',
              a: 'Yes. You simply toggle your availability to Online or Offline whenever you choose. There are no minimum weekly shift hours.',
            },
            {
              q: 'How do spare parts get billed?',
              a: 'Spare parts are provided from your van inventory at genuine manufacturer MSRP with zero aggregator commission, protecting your reputation with customers.',
            },
            {
              q: 'How quickly are earnings settled?',
              a: 'Completed job payouts are credited to your SATTHI partner wallet immediately and can be withdrawn directly to your bank account via instant IMPS.',
            },
          ].map((faq, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container/60">
              <span className="font-label-md text-xs font-bold text-on-surface block">{faq.q}</span>
              <p className="font-body-sm text-xs text-secondary mt-1 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Floating CTA Banner */}
      <div className="px-margin pt-4">
        <div className="p-4 rounded-2xl bg-primary text-on-primary shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <h4 className="font-headline-sm text-base font-bold">Ready to get started?</h4>
            <p className="text-xs text-on-primary/80 mt-0.5">Register your trade in under 5 minutes.</p>
          </div>
          <button
            onClick={() => navigateTo('provider-register')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-surface-container-lowest text-primary font-bold text-xs cursor-pointer shadow-sm hover:bg-surface-container-low transition-colors"
          >
            Apply as Provider
          </button>
        </div>
      </div>
    </div>
  );
};
