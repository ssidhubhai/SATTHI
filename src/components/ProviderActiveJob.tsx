import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { simulationService } from '../services/simulationService';
import { AUTHORIZED_SPARE_PARTS } from '../data/mockData';
import { SparePartItem } from '../types';

export const ProviderActiveJob: React.FC = () => {
  const {
    activeRequest,
    markProviderArrived,
    verifyDoorstepPin,
    completeServiceJob,
    navigateTo,
    showToast,
    setRole,
    cityConfig,
    currentLocation,
    providers,
  } = useApp();

  const activeProvider =
    (activeRequest?.assignedProviderId
      ? providers.find((p) => p.id === activeRequest.assignedProviderId)
      : providers[0]) || providers[0];

  const [pinDigits, setPinDigits] = useState(['', '', '', '']);
  const [pinError, setPinError] = useState('');
  const [showScopeDrawer, setShowScopeDrawer] = useState(false);
  const [showGpsModal, setShowGpsModal] = useState(false);
  const [selectedExtraPart, setSelectedExtraPart] = useState<SparePartItem | null>(null);
  const [addedParts, setAddedParts] = useState<SparePartItem[]>([]);

  const isArrived =
    activeRequest?.status === 'ARRIVED' ||
    activeRequest?.status === 'IN_PROGRESS' ||
    activeRequest?.status === 'COMPLETED';
  const isInProgress = activeRequest?.status === 'IN_PROGRESS' || activeRequest?.status === 'COMPLETED';

  const handlePinChange = (index: number, val: string) => {
    // Only accept numeric characters
    const cleanVal = val.replace(/[^0-9]/g, '');
    const char = cleanVal.slice(-1);
    const updated = [...pinDigits];
    updated[index] = char;
    setPinDigits(updated);
    setPinError('');

    // Auto advance focus
    if (char && index < 3) {
      const nextInput = document.getElementById(`prov-pin-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-verify if all 4 digits are completed
    if (char && index === 3 && updated.every((d) => d !== '')) {
      const fullCode = updated.join('');
      const valid = verifyDoorstepPin(fullCode);
      if (!valid) {
        setPinError(`PIN ${fullCode} is incorrect. Please check customer screen (demo PIN ${activeRequest?.pin || '4821'}).`);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pinDigits[index] && index > 0) {
      const prevInput = document.getElementById(`prov-pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleFillDemoPin = () => {
    const pin = activeRequest?.pin || '4821';
    setPinDigits(pin.split(''));
    setPinError('');
    verifyDoorstepPin(pin);
  };

  const handleVerifyPin = () => {
    const entered = pinDigits.join('');
    if (entered.length < 4) {
      setPinError('Please enter all 4 digits provided by resident Priya.');
      return;
    }

    const isValid = verifyDoorstepPin(entered);
    if (!isValid) {
      setPinError(`PIN ${entered} is incorrect. Please ask customer (or use demo PIN ${activeRequest?.pin || '4821'}).`);
    }
  };

  const handleAddScope = () => {
    if (selectedExtraPart) {
      setAddedParts((prev) => [...prev, selectedExtraPart]);
      showToast(`Added ${selectedExtraPart.name} (+₹${selectedExtraPart.price}) with resident consent.`, 'success', 'add_shopping_cart');
      setShowScopeDrawer(false);
      setSelectedExtraPart(null);
    }
  };

  const handleCompleteJob = () => {
    completeServiceJob(addedParts);
    showToast('Job marked Completed! Demo service receipt generated.', 'success', 'check_circle');
    navigateTo('provider-dashboard');
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto pb-32">
      {/* Live Operational Telemetry Bar */}
      <div className="px-margin pt-space-sm pb-space-sm bg-surface-container-low flex flex-col gap-space-xs border-b border-surface-container">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
              Job #{activeRequest?.id || 'STH-8821'}
            </span>
          </div>
          <button
            onClick={() => setRole('customer')}
            className="text-[11px] font-bold text-primary flex items-center gap-0.5 hover:underline cursor-pointer"
          >
            <span>View Customer Tracking</span>
            <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-space-xs">
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-extrabold tracking-tight">
              {isInProgress ? 'Work in Progress' : isArrived ? 'At Doorstep' : '5 mins travel'}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {isInProgress
                ? '(Testing circuit)'
                : isArrived
                ? '(Waiting for PIN)'
                : '(0.4 km remaining)'}
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-semibold">
            <span className="material-symbols-outlined text-[14px]">
              {isInProgress ? 'bolt' : isArrived ? 'door_front' : 'two_wheeler'}
            </span>
            <span className="font-label-sm text-label-sm">
              {isInProgress ? 'Repair: Live' : isArrived ? 'Arrived' : 'Transit: Active'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation & Next Directive Block */}
      <div className="relative w-full">
        <div
          className="w-full h-56 bg-surface-container-high bg-cover bg-center relative overflow-hidden"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBxkCRp_LbtXmT2YBSBjShJTdPkwbeo-8w6IftBxrmoIG18LDpF91GUP4vM9n1DDDa4IXJJhB7snk4lMRkAI8V9O6xQQvApUjUCYwKYvOnPX3hFzMWbhJRz3Hp-ezp7ty48vczRSdAe5Aq8kT1BGbfi_heoI3mzccL1xhlYyNh7FIAiOE9ilWPYKKDsHJMvG5-1yrtef-jOzUjjhLiLrmK6osKFctSkFhMj8ZOlDd73AHPQHcN2uhG2')`,
          }}
        >
          {/* Live route HUD overlay */}
          <div className="absolute inset-x-3 top-3 bg-surface/95 backdrop-blur-md p-3 rounded-lg shadow-md flex items-center justify-between border border-surface-container/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[24px]">turn_right</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-lg text-label-lg text-primary font-bold">In 150m</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                    Turn Right
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface font-semibold truncate">
                  {activeRequest?.customerAddress?.split(',')[0] || currentLocation.area.split(',')[0]}
                </p>
              </div>
            </div>
            <button
              aria-label="Launch GPS HUD simulation"
              onClick={() => setShowGpsModal(true)}
              className="ml-2 px-2.5 py-1.5 rounded-lg bg-surface-container text-on-surface flex items-center gap-1 shrink-0 active:scale-95 transition-transform hover:bg-surface-container-highest cursor-pointer font-label-sm text-xs font-bold"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">navigation</span>
              <span>GPS HUD</span>
            </button>
          </div>

          {/* Speed & ETA overlay */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-full bg-surface-container-lowest/95 backdrop-blur-md font-mono text-xs font-bold text-on-surface shadow-xs">
              28 km/h · {activeProvider.vehicle.model}
            </div>
          </div>
        </div>
      </div>

      <div className="p-space-md flex flex-col gap-space-md">
        {/* Customer Information Card */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container/60 flex flex-col gap-space-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <img
                src={activeRequest?.customerAvatar || cityConfig.demoUser.avatar}
                alt="Resident"
                className="w-12 h-12 rounded-full object-cover bg-surface-container"
              />
              <div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  {activeRequest?.customerName || cityConfig.demoUser.name}
                </h3>
                <p className="font-body-sm text-body-sm text-secondary">
                  {activeRequest?.customerAddress || `${cityConfig.demoUser.defaultAddress}, ${cityConfig.name}`}
                </p>
              </div>
            </div>

            <button
              onClick={() => showToast(simulationService.simulateVoiceCall(activeRequest?.customerName || cityConfig.demoUser.name, 'customer').message, 'info', 'phone')}
              className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[20px]">phone</span>
            </button>
          </div>

          {/* Doorstep Landmark */}
          <div className="p-2.5 rounded-lg bg-surface-container-low flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">
              door_front
            </span>
            <p className="font-body-sm text-body-sm text-on-surface">
              <strong className="font-semibold">Doorstep Note: </strong>
              {activeRequest?.landmark || cityConfig.demoUser.landmark}
            </p>
          </div>
        </div>

        {/* DOORSTEP HANDSHAKE & VERIFICATION PIN */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container/60 flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px] text-primary">pin</span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Customer Doorstep PIN Handshake
              </h3>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isInProgress
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isInProgress ? 'PIN Verified' : 'Handshake Pending'}
            </span>
          </div>

          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Ask resident Priya for the 4-digit code shown on her SATTHI screen to unlock tool safety checklist &amp; begin service billing:
          </p>

          {/* Quick Demo Helper */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-primary-fixed/20 border border-primary/20">
            <span className="text-xs text-primary font-medium">
              Demo Helper: Customer's PIN is <strong>{activeRequest?.pin || '4821'}</strong>
            </span>
            <button
              onClick={handleFillDemoPin}
              className="text-xs font-bold text-primary underline cursor-pointer"
            >
              Auto-fill PIN
            </button>
          </div>

          {/* 4-Digit Input Boxes */}
          <div className="flex justify-center gap-2.5 sm:gap-3 my-2">
            {[0, 1, 2, 3].map((idx) => (
              <input
                key={idx}
                id={`prov-pin-${idx}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                maxLength={1}
                aria-label={`PIN digit ${idx + 1}`}
                value={pinDigits[idx]}
                disabled={isInProgress}
                onChange={(e) => handlePinChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`w-12 h-12 sm:w-14 sm:h-14 text-center font-mono text-xl sm:text-2xl font-bold rounded-xl border transition-all ${
                  isInProgress
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-500'
                    : 'bg-surface-container-low border-surface-container focus:border-primary focus:ring-2 focus:ring-primary/30'
                }`}
              />
            ))}
          </div>

          {pinError && (
            <p className="text-xs text-error font-medium text-center">{pinError}</p>
          )}

          {!isInProgress ? (
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              {!isArrived && (
                <button
                  onClick={markProviderArrived}
                  className="flex-1 py-3 px-3 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md font-bold transition-all cursor-pointer min-h-[44px]"
                >
                  I'm Outside Doorstep
                </button>
              )}
              <button
                onClick={handleVerifyPin}
                className="flex-1 py-3 px-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md font-bold transition-all shadow-xs cursor-pointer min-h-[44px]"
              >
                Verify PIN &amp; Begin Work
              </button>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 text-emerald-900 rounded-lg flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-700 text-[18px]">
                  check_circle
                </span>
                <span>Work session active. Standard ₹99 inspection + ₹220 labor locked.</span>
              </span>
            </div>
          )}
        </div>

        {/* WORK SCOPE & SPARE PARTS MANAGER (ACTIVE ONCE PIN VERIFIED) */}
        {isInProgress && (
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container/60 flex flex-col gap-space-sm animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[22px] text-primary">inventory_2</span>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  Parts &amp; Extra Labor Scope
                </h3>
              </div>
              <button
                onClick={() => setShowScopeDrawer(true)}
                className="px-3 py-1.5 rounded-lg bg-primary-fixed text-on-primary-fixed font-label-sm text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-primary-fixed/80"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Add Spare Part</span>
              </button>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Original brand parts must be shown to resident before replacing. SATTHI zero-markup applies:
            </p>

            <div className="divide-y divide-surface-container border rounded-xl overflow-hidden">
              <div className="p-3 bg-surface-container-low flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-on-surface block">
                    Initial Diagnostic &amp; MCB Rewiring Labor
                  </span>
                  <span className="text-secondary">Standard repair tariff slab</span>
                </div>
                <span className="font-bold text-on-surface font-mono">₹220.00</span>
              </div>

              {activeRequest?.parts.map((part) => (
                <div key={part.id} className="p-3 bg-surface-container-lowest flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-on-surface block">{part.name}</span>
                    <span className="text-emerald-700 font-medium">Original {part.brand} MSRP</span>
                  </div>
                  <span className="font-bold text-on-surface font-mono">₹{part.price}.00</span>
                </div>
              ))}

              {addedParts.map((part, pIdx) => (
                <div key={`extra-${pIdx}`} className="p-3 bg-emerald-50/50 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-emerald-950 block">{part.name}</span>
                    <span className="text-emerald-700 font-medium">Added &amp; Resident Approved</span>
                  </div>
                  <span className="font-bold text-emerald-950 font-mono">+₹{part.price}.00</span>
                </div>
              ))}
            </div>

            {/* Complete Job CTA */}
            <button
              onClick={handleCompleteJob}
              className="mt-2 w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-label-lg font-bold flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">task_alt</span>
              <span>Finish Repair &amp; Generate Service Receipt (Demo)</span>
            </button>
          </div>
        )}
      </div>

      {/* Spare Parts Catalog Drawer */}
      {showScopeDrawer && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowScopeDrawer(false)}
        >
          <div
            className="w-full max-w-lg bg-surface-container-lowest rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-headline-sm font-bold text-on-surface">
                Select Authorized Van Stock
              </h3>
              <button
                onClick={() => setShowScopeDrawer(false)}
                className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-surface-container flex items-center justify-center cursor-pointer hover:bg-surface-container-high transition-colors"
                aria-label="Close van stock selector"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-2">
              {AUTHORIZED_SPARE_PARTS.map((part) => {
                const isSelected = selectedExtraPart?.id === part.id;
                return (
                  <button
                    key={part.id}
                    onClick={() => setSelectedExtraPart(part)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-primary-fixed/20 border-primary ring-1 ring-primary'
                        : 'bg-surface-container-low border-surface-container'
                    }`}
                  >
                    <div>
                      <span className="font-label-md font-bold text-on-surface block">
                        {part.name}
                      </span>
                      <span className="text-xs text-secondary">
                        Brand: {part.brand} · In Van Stock
                      </span>
                    </div>
                    <span className="font-bold text-on-surface font-mono">₹{part.price}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleAddScope}
              disabled={!selectedExtraPart}
              className="w-full py-3 rounded-xl bg-primary text-on-primary font-bold shadow-md cursor-pointer disabled:opacity-50"
            >
              Confirm &amp; Show Price to Customer
            </button>
          </div>
        </div>
      )}

      {/* In-App GPS HUD Modal (Alternative to window.open) */}
      {showGpsModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowGpsModal(false)}
        >
          <div
            className="w-full max-w-md bg-inverse-surface text-inverse-on-surface rounded-2xl p-5 shadow-2xl flex flex-col gap-4 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-fixed text-[24px]">
                  navigation
                </span>
                <span className="font-headline-sm font-bold text-white">
                  Turn-by-Turn GPS HUD (Demo Navigation)
                </span>
              </div>
              <button
                onClick={() => setShowGpsModal(false)}
                className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-white/10 flex items-center justify-center cursor-pointer text-white hover:bg-white/20 transition-colors"
                aria-label="Close GPS HUD"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-4 bg-white/5 rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-[36px] text-primary-fixed">
                turn_right
              </span>
              <div>
                <span className="text-xl font-bold text-white block">In 150m Turn Right</span>
                <span className="text-xs text-white/70">Onto 12th Main Road • Fast Lane</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 bg-white/5 rounded-lg">
                <span className="text-white/60 block">Distance</span>
                <span className="font-bold text-white text-sm">0.4 km</span>
              </div>
              <div className="p-2.5 bg-white/5 rounded-lg">
                <span className="text-white/60 block">Speed</span>
                <span className="font-bold text-white text-sm">28 km/h</span>
              </div>
              <div className="p-2.5 bg-white/5 rounded-lg">
                <span className="text-white/60 block">Arrival ETA</span>
                <span className="font-bold text-primary-fixed text-sm">5 mins</span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-white/5 text-[11px] text-white/70 text-center">
              [Demo GPS Simulation] Simulated turn-by-turn guidance for prototype testing. No external GPS or map directions API invoked.
            </div>

            <button
              onClick={() => {
                setShowGpsModal(false);
                markProviderArrived();
              }}
              className="w-full py-3 rounded-xl bg-primary text-white font-bold cursor-pointer"
            >
              Simulate: Tapped "Arrived at Door"
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
