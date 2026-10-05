import React from 'react';
import { useApp } from '../context/AppContext';
import { simulationService } from '../services/simulationService';

export const ProviderDashboard: React.FC = () => {
  const {
    providerDutyStatus,
    setProviderDutyStatus,
    providerEarnings,
    activeRequest,
    navigateTo,
    showToast,
    cityConfig,
    currentLocation,
  } = useApp();

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto pb-28">
      <div className="p-space-md flex flex-col gap-space-md">
        {/* Top Greeting & Real-time Locality Cluster */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface tracking-tight font-extrabold">
                Namaste, Rahul
              </span>
              <span className="material-symbols-outlined text-primary text-[20px] fill-1">
                verified
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="material-symbols-outlined text-[15px] text-primary">near_me</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                {currentLocation.name} • <strong className="text-primary font-bold">{currentLocation.surgeActive ? 'High Demand Surge' : 'Standard Demand'}</strong>
              </span>
            </div>
          </div>
          <div className="relative">
            <img
              className="w-12 h-12 rounded-full object-cover shadow-sm bg-surface-container"
              alt="Rahul Kumar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuALC5v_Pg92yXeMQ7zt1CR9eNPLsBl1gIAsWsig1StwYvFD19yXWcj3dBoUhNaF0_aTVckhbqRIYeA_4LIPFhDZEH3OL0bsz70beEPmamW09s2hZk8kmJ5xrr1gDb-_n5byP5mJPuRGZKDM0h7MdRfqz_mHM6rpXVenJjbnDmSGZEjP1gVDHSAUKWnBZ6_IPcFeuzo2hB83Ldd8r-4FQvDcRx1G1DVbqAp76WsAMImvcVdN7Gg8-sbJ"
            />
            <span
              className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-white ${
                providerDutyStatus === 'online'
                  ? 'bg-emerald-500'
                  : providerDutyStatus === 'busy'
                  ? 'bg-amber-500'
                  : 'bg-gray-400'
              }`}
            />
          </div>
        </div>

        {/* Master Duty Control & Status Switch */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container/60 flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="w-3 h-3 rounded-full relative flex items-center justify-center">
                {providerDutyStatus === 'online' && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
                )}
                <span
                  className={`w-3 h-3 rounded-full ${
                    providerDutyStatus === 'online'
                      ? 'bg-emerald-500'
                      : providerDutyStatus === 'busy'
                      ? 'bg-amber-500'
                      : 'bg-gray-400'
                  }`}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface leading-tight font-bold">
                  {providerDutyStatus === 'online'
                    ? 'ONLINE & AVAILABLE'
                    : providerDutyStatus === 'busy'
                    ? 'ON ACTIVE ASSIGNMENT'
                    : 'DUTY PAUSED (OFFLINE)'}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                  {providerDutyStatus === 'online'
                    ? 'Radius 3.5 km • Instant Dispatch'
                    : providerDutyStatus === 'busy'
                    ? 'Navigating to 12th Main customer'
                    : 'Turn online to receive nearby broadcast requests'}
                </span>
              </div>
            </div>

            {/* Duty Timer Pill */}
            <div className="flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-full text-on-surface-variant">
              <span className="material-symbols-outlined text-[15px]">timer</span>
              <span className="font-label-sm text-label-sm font-semibold">4h 15m duty</span>
            </div>
          </div>

          {/* Segmented Status Selector */}
          <div className="grid grid-cols-3 gap-1 bg-surface-container p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setProviderDutyStatus('online')}
              className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 font-label-md text-label-md transition-all cursor-pointer font-bold ${
                providerDutyStatus === 'online'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">radio_button_checked</span>
              <span>Active</span>
            </button>
            <button
              type="button"
              onClick={() => setProviderDutyStatus('busy')}
              className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 font-label-md text-label-md transition-all cursor-pointer font-bold ${
                providerDutyStatus === 'busy'
                  ? 'bg-secondary text-on-secondary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">engineering</span>
              <span>On Job</span>
            </button>
            <button
              type="button"
              onClick={() => setProviderDutyStatus('offline')}
              className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 font-label-md text-label-md transition-all cursor-pointer font-bold ${
                providerDutyStatus === 'offline'
                  ? 'bg-outline text-white shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">power_settings_new</span>
              <span>Resting</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-on-surface-variant pt-space-xs">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-tertiary text-[17px]">shield</span>
              <span className="font-label-sm text-label-sm">Emergency Grid Hotline (Simulated Dialer)</span>
            </div>
            <span className="font-label-sm text-label-sm font-bold text-primary">
              ₹0 Cut Guarantee
            </span>
          </div>
        </div>

        {/* Active Job Alert Banner if an active order exists */}
        {activeRequest && activeRequest.status !== 'COMPLETED' && activeRequest.status !== 'CANCELLED' && (
          <div className="bg-primary-fixed/30 border border-primary/40 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-extrabold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                Active Assigned Order #{activeRequest.id}
              </span>
              <span className="font-label-sm text-label-sm bg-primary text-on-primary px-2 py-0.5 rounded-full font-bold">
                {activeRequest.status}
              </span>
            </div>
            <p className="font-body-md text-body-md font-bold text-on-surface">
              {activeRequest.faultType} • {activeRequest.customerName}
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {activeRequest.customerAddress}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => navigateTo('provider-active-job')}
                className="flex-1 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold flex items-center justify-center gap-1 shadow-xs cursor-pointer"
              >
                <span>Open Active Job Navigation</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* Today's Earnings Snapshot */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container/60 flex flex-col gap-space-md">
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">
                Today's Earnings
              </span>
              <div className="flex items-baseline gap-space-xs">
                <span className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface font-extrabold">
                  ₹{providerEarnings.todayGross}
                </span>
                <span className="font-label-md text-label-md text-tertiary font-bold bg-tertiary-fixed px-1.5 py-0.5 rounded">
                  {providerEarnings.jobsDone} Jobs Done
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
                showToast(sim.message, 'success', 'account_balance_wallet');
              }}
              className="bg-primary text-on-primary px-3.5 py-2.5 rounded-lg font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-transform cursor-pointer shrink-0 min-h-[44px]"
            >
              <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
              <span>Cashout (Demo)</span>
            </button>
          </div>

          {/* Commission Transparency Breakdown */}
          <div className="bg-surface-container-low rounded-lg p-space-sm flex flex-col gap-1.5 text-on-surface-variant border border-surface-container">
            <div className="flex items-center justify-between font-body-sm text-body-sm">
              <span>Gross Collected via UPI</span>
              <span className="font-semibold text-on-surface">₹{providerEarnings.todayGross}.00</span>
            </div>
            <div className="flex items-center justify-between font-body-sm text-body-sm">
              <span className="flex items-center gap-1">
                SATTHI Fixed Platform Fee
                <span className="material-symbols-outlined text-[14px] text-tertiary">info</span>
              </span>
              <span className="font-semibold text-error">
                - ₹{providerEarnings.platformCut} ({providerEarnings.jobsDone} × ₹20)
              </span>
            </div>
            <div className="flex items-center justify-between font-label-md text-label-md text-on-surface pt-1 border-t border-surface-container font-bold">
              <span>Net Direct to HDFC ••4091</span>
              <span className="text-tertiary font-data-metric text-data-metric">
                ₹{providerEarnings.netDirect}.00
              </span>
            </div>
          </div>
        </div>

        {/* Live Hyperlocal Demand & Broadcast Radar */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container/60 flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[20px]">radar</span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Hyperlocal Demand Radar
              </span>
            </div>
            <span className="bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">
              +₹50 Surge Active
            </span>
          </div>

          {/* Live Broadcast Map View */}
          <div
            className="relative w-full h-40 rounded-lg overflow-hidden mt-1 shadow-inner bg-cover bg-center"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDNmb3UcccLTXjBCE4w1jFVGEVcJo9ugA9INn--cUFwH4J-b2xVcBtbRfpDQerBJEDLTHbmWy8A6xoUc1iYVKhXRa6v5h992fTY3Urt37ggK1gfVF_gvzy8aGTG-mHD8sOg2fN9E000RXR6faMomP_HoCh1R5eHU70sBKDEa2uaw3TTarrfBsfdvTeqXEAecA5jYsHdFY4HgkXhQ3h7O7Q1rAiWytJVX3bKL3Tqfe_JG2W4rO97sHxA')`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-space-sm">
              <div className="flex items-center justify-between text-surface">
                <div>
                  <p className="font-label-md text-label-md font-bold text-white">
                    {currentLocation.name} ({currentLocation.area})
                  </p>
                  <p className="font-body-sm text-body-sm text-white/90">
                    {currentLocation.activeProsCount} verified pros operating nearby
                  </p>
                </div>
                <button
                  onClick={() => navigateTo('provider-jobs')}
                  className="bg-primary hover:bg-primary-container text-on-primary px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-bold flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
                >
                  <span>Incoming (1)</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Broadcast Snippet */}
          <button
            onClick={() => navigateTo('provider-jobs')}
            className="bg-secondary-container rounded-lg p-space-sm flex items-center justify-between text-left cursor-pointer hover:bg-secondary-container/80 transition-colors gap-2"
          >
            <div className="flex items-center gap-space-sm min-w-0 flex-1">
              <span className="material-symbols-outlined text-on-secondary-container text-[20px] shrink-0">
                bolt
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-label-md text-on-secondary-container font-bold truncate">
                  Short Circuit / MCB Tripping
                </span>
                <span className="font-body-sm text-body-sm text-on-secondary-container/80 truncate">
                  0.8 km • 12th Main Road, HAL • Priya M.
                </span>
              </div>
            </div>
            <span className="font-label-sm text-label-sm font-extrabold text-primary shrink-0 whitespace-nowrap">
              ₹220 – ₹450
            </span>
          </button>
        </div>

        {/* Quick Working Tools Bar */}
        <div className="flex flex-col gap-space-xs">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant px-1 font-bold">
            Toolkit &amp; Compliance
          </span>
          <div className="grid grid-cols-3 gap-space-sm">
            <button
              onClick={() => showToast(`Standard ${cityConfig.name} rate card: ₹${cityConfig.pricing.baseInspectionFee} diagnostic labor rate locked.`, 'info', 'calculate')}
              className="bg-surface-container-lowest rounded-xl p-space-sm flex flex-col items-center justify-center text-center shadow-xs border border-surface-container/60 active:scale-95 transition-transform cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary mb-1.5">
                <span className="material-symbols-outlined text-[20px]">calculate</span>
              </div>
              <span className="font-label-sm text-label-sm font-bold text-on-surface">Rate Card</span>
              <span className="font-body-sm text-[11px] text-on-surface-variant">Industry Norms</span>
            </button>

            <button
              onClick={() => showToast('Van Spares Inventory: 4 Havells MCB switches, 10m Finolex copper wire verified.', 'success', 'inventory_2')}
              className="bg-surface-container-lowest rounded-xl p-space-sm flex flex-col items-center justify-center text-center shadow-xs border border-surface-container/60 active:scale-95 transition-transform cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface mb-1.5">
                <span className="material-symbols-outlined text-[20px]">inventory_2</span>
              </div>
              <span className="font-label-sm text-label-sm font-bold text-on-surface">Spares Van</span>
              <span className="font-body-sm text-[11px] text-tertiary font-semibold">Havells OK</span>
            </button>

            <button
              onClick={() => {
                const sim = simulationService.simulateSosHotline(cityConfig.localUtilityProvider.name, cityConfig.localUtilityProvider.helpline);
                showToast(sim.message, 'warning', 'call');
              }}
              className="bg-surface-container-lowest rounded-xl p-space-sm flex flex-col items-center justify-center text-center shadow-xs border border-surface-container/60 active:scale-95 transition-transform cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-error mb-1.5">
                <span className="material-symbols-outlined text-[20px]">call</span>
              </div>
              <span className="font-label-sm text-label-sm font-bold text-on-surface">{cityConfig.localUtilityProvider.sosLabel}</span>
              <span className="font-body-sm text-[11px] text-on-surface-variant">{cityConfig.localUtilityProvider.helpline} Grid</span>
            </button>
          </div>
        </div>

        {/* Recent Completed Calls (Today's Activity) */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container/60 flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Today's Completed Dispatches
            </span>
            <button
              onClick={() => navigateTo('provider-earnings')}
              className="font-label-sm text-label-sm text-primary font-bold hover:underline cursor-pointer"
            >
              Full Statement
            </button>
          </div>

          {/* Dispatch Item 1 */}
          <div className="flex items-center justify-between py-2 bg-surface-container-low px-3 rounded-lg border border-surface-container">
            <div className="flex items-center gap-space-sm">
              <div className="w-9 h-9 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary font-bold font-label-md text-label-md">
                PK
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md font-bold text-on-surface">
                  Pooja K. (Villa 4B)
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  MCB Tripping Fix • 32m service
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-label-lg text-label-lg font-bold text-on-surface">₹520</span>
              <div className="flex items-center text-primary text-[12px]">
                <span className="material-symbols-outlined text-[13px] fill-1">star</span>
                <span className="font-label-sm text-label-sm ml-0.5 font-bold">5.0</span>
              </div>
            </div>
          </div>

          {/* Dispatch Item 2 */}
          <div className="flex items-center justify-between py-2 bg-surface-container-low px-3 rounded-lg border border-surface-container">
            <div className="flex items-center gap-space-sm">
              <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold font-label-md text-label-md">
                AS
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md font-bold text-on-surface">
                  Ananya S.
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Ceiling Fan Regulator Swap
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-label-lg text-label-lg font-bold text-on-surface">₹480</span>
              <div className="flex items-center text-primary text-[12px]">
                <span className="material-symbols-outlined text-[13px] fill-1">star</span>
                <span className="font-label-sm text-label-sm ml-0.5 font-bold">5.0</span>
              </div>
            </div>
          </div>

          {/* Dispatch Item 3 */}
          <div className="flex items-center justify-between py-2 bg-surface-container-low px-3 rounded-lg border border-surface-container">
            <div className="flex items-center gap-space-sm">
              <div className="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary font-bold font-label-md text-label-md">
                MR
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md font-bold text-on-surface">
                  Dr. M. Rao
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Geyser Line Continuity Check
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-label-lg text-label-lg font-bold text-on-surface">₹480</span>
              <div className="flex items-center text-primary text-[12px]">
                <span className="material-symbols-outlined text-[13px] fill-1">star</span>
                <span className="font-label-sm text-label-sm ml-0.5 font-bold">5.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Spares Van Stock Status Banner */}
        <div className="bg-surface-container-low rounded-xl p-space-md flex items-center justify-between border border-surface-container">
          <div className="flex items-center gap-space-sm">
            <img
              className="w-12 h-12 rounded-lg object-cover bg-surface-container"
              alt="Electrical toolbox"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpjEj3VAzl8pdSBtaUH5bt5KRpU46kGabT43OyMKm4sh3Qv3X-UWekNRB1dHgcuJPVHdvHsPRYENOtbxrpU0XmMGJewsR5oU8xY1bkYcstkWtJRQH8cNBDigL5usN8hUnIV1tcpaMoT7hOubmUdYsRYmjoZ_blZ6mO--eiGLG20ZKYPBwUiGjOQoQldnH03YDxy1fyy8KJa-z_Qx9Y2eFsRMjnElD64VRBj0ERQ6bNtxRwiXO5gqVI"
            />
            <div className="flex flex-col">
              <span className="font-label-md text-label-md font-bold text-on-surface">
                Van Spares Stock Confirmed
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Havells 16A/32A MCB (4 qty), 2.5mm Wire roll
              </span>
            </div>
          </div>
          <button
            onClick={() => showToast(`Van stock inventory reconciled and synced with ${currentLocation.name} depot.`, 'success', 'inventory_2')}
            className="bg-surface-container-highest px-3 py-1.5 rounded-lg text-on-surface font-label-sm text-label-sm font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};
