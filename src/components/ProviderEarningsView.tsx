import React from 'react';
import { useApp } from '../context/AppContext';
import { simulationService } from '../services/simulationService';

export const ProviderEarningsView: React.FC = () => {
  const { providerEarnings, navigateTo, showToast, currentLocation, cityConfig } = useApp();

  const cluster1Name = cityConfig.clusters[1]?.name.split(' ')[0] || 'Sector 2';
  const cluster0Name = currentLocation.name.split(' ')[0];

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto pb-32">
      <div className="px-margin pt-space-md flex flex-col gap-space-md">
        {/* Earnings Hero Banner */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-surface-container/60 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
              Earnings Wallet &amp; Direct Settlements
            </span>
            <span className="bg-emerald-50 text-emerald-800 font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-bold">
              Instant IMPS (Simulated)
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
              Today's Net Direct to Bank
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-data-metric text-3xl font-extrabold text-primary">
                ₹{providerEarnings.netDirect}.00
              </span>
              <span className="font-body-sm text-xs text-secondary font-medium">
                (Gross: ₹{providerEarnings.todayGross})
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between border border-surface-container">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs">
                <span className="material-symbols-outlined text-[20px]">account_balance</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md font-bold text-on-surface">
                  HDFC Bank ••4091
                </span>
                <span className="font-body-sm text-[11px] text-on-surface-variant">
                  Rahul Kumar · Settlement Sandbox
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                const sim = simulationService.simulateBankCashout({
                  amount: providerEarnings.netDirect,
                  bankAccountMasked: 'HDFC Bank ****4091',
                  currencySymbol: cityConfig.currencySymbol,
                });
                showToast(sim.message, 'success', 'account_balance');
              }}
              className="py-2 px-3.5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-bold shadow-xs active:scale-95 transition-transform cursor-pointer"
            >
              Withdraw (Demo)
            </button>
          </div>

          {/* Ethical 0% Commission Guarantee */}
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-950 text-xs flex items-start gap-2 border border-emerald-100">
            <span className="material-symbols-outlined text-[18px] text-emerald-700 shrink-0 mt-0.5">
              handshake
            </span>
            <p className="leading-snug">
              <strong>SATTHI ₹0 Commission Standard:</strong> You keep 100% of all diagnostic and labor
              fees. Only a flat ₹20 server &amp; GPS dispatch fee is deducted per completed job.
            </p>
          </div>

          {/* Sandbox Banking Notice */}
          <div className="p-2.5 rounded-lg bg-surface-container-low text-on-surface-variant text-[11px] flex items-center gap-2 border border-surface-container">
            <span className="material-symbols-outlined text-[16px] text-primary shrink-0">info</span>
            <span>
              <strong>Demo Payout Sandbox:</strong> Balance calculations and IMPS cashouts are simulated test records for prototype review. No real interbank wire or funds transfer is performed.
            </span>
          </div>
        </div>

        {/* Weekly Performance Bar Metric */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container/60 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              This Week's Activity
            </h2>
            <span className="font-label-sm text-label-sm text-primary font-bold">₹8,450 Total</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 pt-2 items-end h-32">
            {[
              { day: 'Mon', amount: '₹1.1k', height: '55%' },
              { day: 'Tue', amount: '₹1.4k', height: '70%' },
              { day: 'Wed', amount: '₹950', height: '48%' },
              { day: 'Thu', amount: '₹1.8k', height: '90%' },
              { day: 'Fri', amount: '₹1.5k', height: '75%' },
              { day: 'Sat', amount: '₹1.7k', height: '85%' },
              { day: 'Sun', amount: `₹${(providerEarnings.todayGross / 1000).toFixed(1)}k`, height: '80%', active: true },
            ].map((d) => (
              <div key={d.day} className="flex flex-col items-center gap-1 h-full justify-end">
                <span className="text-[9px] font-semibold text-secondary">{d.amount}</span>
                <div
                  className={`w-full rounded-t-md transition-all ${
                    d.active ? 'bg-primary' : 'bg-surface-container-high'
                  }`}
                  style={{ height: d.height }}
                ></div>
                <span
                  className={`font-label-sm text-[10px] ${
                    d.active ? 'font-bold text-primary' : 'text-on-surface-variant'
                  }`}
                >
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Dispatches Summary List */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container/60 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Recent Completed Settlements
            </h2>
            <span className="font-label-sm text-label-sm text-secondary">Updated 10m ago</span>
          </div>

          <div className="divide-y divide-surface-container">
            {[
              {
                title: 'Pooja K. (Villa 4B)',
                type: 'MCB Tripping Fix',
                gross: `${cityConfig.currencySymbol}520`,
                net: `${cityConfig.currencySymbol}500`,
                time: '2h ago',
              },
              {
                title: `Ananya S. (${cluster1Name})`,
                type: 'Ceiling Fan Regulator Swap',
                gross: `${cityConfig.currencySymbol}480`,
                net: `${cityConfig.currencySymbol}460`,
                time: '4h ago',
              },
              {
                title: `Dr. M. Rao (${cluster0Name})`,
                type: 'Geyser Line Continuity',
                gross: `${cityConfig.currencySymbol}480`,
                net: `${cityConfig.currencySymbol}460`,
                time: '6h ago',
              },
            ].map((job, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md font-bold text-on-surface">
                    {job.title}
                  </span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">
                    {job.type} • {job.time}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-data-metric text-sm font-bold text-on-surface block">
                    {job.net}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">Settled (Demo)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => navigateTo('provider-dashboard')}
          className="w-full py-3 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md font-bold hover:bg-surface-container-high transition-colors cursor-pointer"
        >
          Back to Provider Home
        </button>
      </div>
    </div>
  );
};
