import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { simulationService } from '../services/simulationService';

export const HelpSupportModal: React.FC = () => {
  const { navigateTo, showToast, cityConfig, currentLocation } = useApp();
  const [claimSent, setClaimSent] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How does the SATTHI Transparent Pricing work?',
      a: `The ${cityConfig.currencySymbol}${cityConfig.pricing.baseInspectionFee} visit fee is fixed upfront and waived if total service labor exceeds ${cityConfig.currencySymbol}${cityConfig.pricing.inspectionWaiveThreshold}. Replacement parts are provided at direct distributor MSRP with original retail invoices—zero middlemen markups.`,
    },
    {
      q: 'What is the Doorstep Handshake PIN?',
      a: 'Every dispatch generates a unique 4-digit code (e.g. 4821). The technician cannot start billing or open their tools until you verify their photo ID and verbally share the PIN at your door.',
    },
    {
      q: 'What does the SATTHI 30-Day Guarantee cover?',
      a: `If a repaired circuit trips again, a tap leaks, or an installed part malfunctions within ${cityConfig.pricing.warrantyDays} days, we dispatch a supervisor for 100% free re-inspection and labor rework.`,
    },
    {
      q: 'Are technicians employees of SATTHI?',
      a: `No. Service professionals on SATTHI are independent local craftsmen who own their tools, control their hours, and keep 100% of their labor fees.`,
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto pb-32">
      <div className="px-margin pt-space-md flex flex-col gap-space-md">
        {/* Support Header Banner */}
        <div className="bg-gradient-to-r from-tertiary to-tertiary-container rounded-2xl p-6 text-on-tertiary shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-white">
                support_agent
              </span>
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-tertiary-fixed font-bold uppercase tracking-wider">
                {currentLocation.name} Operations Desk
              </span>
              <h1 className="font-headline-md text-headline-md text-white font-extrabold">
                24/7 Priority Assistance
              </h1>
            </div>
          </div>
          <p className="font-body-md text-body-md text-white/90 mt-3 leading-relaxed">
            Need urgent assistance, emergency grid escalation, or want to claim a warranty fix? Our
            local {cityConfig.name} operations desk is active.
          </p>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => showToast(simulationService.simulateVoiceCall(`Support Desk (${cityConfig.supportHelpline})`, 'support').message, 'info', 'phone')}
              className="py-3 px-3 rounded-xl bg-white text-on-surface font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">call</span>
              <span>{cityConfig.supportHelpline}</span>
            </button>
            <button
              onClick={() => showToast(simulationService.simulateChat(`Priority Support (${cityConfig.supportWhatsAppNumber})`).message, 'info', 'chat')}
              className="py-3 px-3 rounded-xl bg-emerald-600 text-white font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>WhatsApp Chat</span>
            </button>
          </div>
        </div>

        {/* 30-Day Guarantee Quick Claim */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container/60 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">verified</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Claim 30-Day Free Warranty
              </h2>
            </div>
            <span className="bg-emerald-50 text-emerald-800 font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">
              Zero Cost
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Enter your recent order number (e.g. #SAT-8821) if you are facing recurring tripping or issues.
          </p>

          {claimSent ? (
            <div className="p-3 bg-emerald-50 text-emerald-900 rounded-lg font-body-sm text-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-700">check_circle</span>
              <span>Claim registered! A senior supervisor is scheduled to contact you within 15 minutes.</span>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Order # (e.g. SAT-8821)"
                defaultValue="SAT-8821"
                className="flex-1 p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-on-surface font-label-md"
              />
              <button
                onClick={() => setClaimSent(true)}
                className="px-4 py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-primary-container active:scale-95 transition-transform cursor-pointer"
              >
                Submit Claim
              </button>
            </div>
          )}
        </div>

        {/* FAQs */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container/60 flex flex-col gap-3">
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            Frequently Asked Questions
          </h2>
          <div className="divide-y divide-surface-container">
            {faqs.map((faq, idx) => (
              <div key={idx} className="py-2.5">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-label-md text-label-md text-on-surface font-semibold gap-2 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="material-symbols-outlined text-[18px] text-secondary">
                    {activeFaq === idx ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
                {activeFaq === idx && (
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Back to Home */}
        <button
          onClick={() => navigateTo('home')}
          className="w-full py-3 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md font-bold hover:bg-surface-container-high transition-colors cursor-pointer"
        >
          Return to Marketplace Home
        </button>
      </div>
    </div>
  );
};
