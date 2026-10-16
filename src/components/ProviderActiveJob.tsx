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
    verifyCompletionAndCash,
    completeServiceJob,
    addPartToActiveJob,
    removePartFromActiveJob,
    updateLaborFee,
    navigateTo,
    showToast,
    setRole,
    cityConfig,
    currentLocation,
  } = useApp();

  const [pinDigits, setPinDigits] = useState(['', '', '', '']);
  const [pinError, setPinError] = useState('');
  const [showScopeDrawer, setShowScopeDrawer] = useState(false);
  const [showGpsModal, setShowGpsModal] = useState(false);
  const [showCashModal, setShowCashModal] = useState(false);
  const [completionPinDigits, setCompletionPinDigits] = useState(['', '', '', '']);
  const [completionPinError, setCompletionPinError] = useState('');
  const [selectedExtraPart, setSelectedExtraPart] = useState<SparePartItem | null>(null);
  const [technicianNotes, setTechnicianNotes] = useState('');
  const [isEditingLabor, setIsEditingLabor] = useState(false);
  const [tempLabor, setTempLabor] = useState(activeRequest?.laborFee || 220);

  const isArrived =
    activeRequest?.status === 'ARRIVED' ||
    activeRequest?.status === 'IN_PROGRESS' ||
    activeRequest?.status === 'COMPLETED';

  const isInProgress =
    activeRequest?.status === 'IN_PROGRESS' || activeRequest?.status === 'COMPLETED';

  const handlePinChange = (index: number, val: string) => {
    const cleanVal = val.replace(/[^0-9]/g, '');
    const char = cleanVal.slice(-1);
    const updated = [...pinDigits];
    updated[index] = char;
    setPinDigits(updated);
    setPinError('');

    if (char && index < 3) {
      const nextInput = document.getElementById(`prov-pin-${index + 1}`);
      nextInput?.focus();
    }

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
      setPinError('Please enter all 4 digits provided by the resident.');
      return;
    }

    const isValid = verifyDoorstepPin(entered);
    if (!isValid) {
      setPinError(`PIN ${entered} is incorrect. (Demo customer PIN is ${activeRequest?.pin || '4821'}).`);
    }
  };

  const handleAddScope = () => {
    if (selectedExtraPart) {
      addPartToActiveJob(selectedExtraPart);
      showToast(`Added ${selectedExtraPart.name} (+₹${selectedExtraPart.price}) to customer invoice.`, 'success', 'add_shopping_cart');
      setShowScopeDrawer(false);
      setSelectedExtraPart(null);
    }
  };

  const handleSaveLabor = () => {
    updateLaborFee(tempLabor);
    setIsEditingLabor(false);
    showToast(`Labor tariff updated to ₹${tempLabor}`, 'success', 'price_change');
  };

  const handleCompletionPinChange = (index: number, val: string) => {
    const cleanVal = val.replace(/[^0-9]/g, '');
    const char = cleanVal.slice(-1);
    const updated = [...completionPinDigits];
    updated[index] = char;
    setCompletionPinDigits(updated);
    setCompletionPinError('');

    if (char && index < 3) {
      const nextInput = document.getElementById(`prov-comp-pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleFillDemoCompletionPin = () => {
    const pin = activeRequest?.completionPin || '7130';
    setCompletionPinDigits(pin.split(''));
    setCompletionPinError('');
  };

  const handleConfirmCashPayment = () => {
    const entered = completionPinDigits.join('');
    if (entered.length < 4) {
      setCompletionPinError('Please enter all 4 digits provided by the resident.');
      return;
    }
    const success = verifyCompletionAndCash(entered, activeRequest?.totalPayable);
    if (success) {
      setShowCashModal(false);
      navigateTo('provider-dashboard');
    } else {
      setCompletionPinError(`PIN ${entered} is incorrect. (Resident completion PIN is ${activeRequest?.completionPin || '7130'}).`);
    }
  };

  const handleCompleteJob = () => {
    setShowCashModal(true);
  };

  // If no active request exists, provide a friendly return
  if (!activeRequest || activeRequest.status === 'COMPLETED' || activeRequest.status === 'CANCELLED') {
    return (
      <div className="flex flex-col w-full max-w-2xl mx-auto px-margin py-12 text-center items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-secondary">
          <span className="material-symbols-outlined text-[36px]">task_alt</span>
        </div>
        <h2 className="font-headline-sm text-lg font-bold text-on-surface">No Active Job in Progress</h2>
        <p className="font-body-sm text-xs text-secondary max-w-sm">
          You currently don't have an active dispatch assigned. Check incoming requests in the radar feed.
        </p>
        <button
          onClick={() => navigateTo('provider-dashboard')}
          className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs cursor-pointer shadow-xs"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

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
            <span className="font-label-sm text-xs uppercase tracking-wider text-primary font-bold">
              Dispatch #{activeRequest.id}
            </span>
          </div>

          {/* Cross-Persona Sync Helper */}
          <button
            onClick={() => setRole('customer')}
            className="text-[11px] font-bold text-primary flex items-center gap-0.5 hover:underline cursor-pointer bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20"
            title="Inspect resident view in real-time"
          >
            <span>Resident View</span>
            <span className="material-symbols-outlined text-[13px]">swap_horiz</span>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-space-xs">
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-extrabold tracking-tight">
              {isInProgress ? 'Work in Progress' : isArrived ? 'At Doorstep' : 'Travel to Customer'}
            </span>
            <span className="font-body-sm text-xs text-on-surface-variant">
              {isInProgress
                ? '(Tools active)'
                : isArrived
                ? '(Handshake pending)'
                : '(ETA 5 mins)'}
            </span>
          </div>
          <span className="font-mono text-sm font-bold text-primary">
            Locked: ₹{activeRequest.totalPayable}
          </span>
        </div>
      </div>

      <div className="p-space-md flex flex-col gap-space-md">
        {/* TRAVEL HUD & GPS BUTTON */}
        {!isArrived && (
          <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-xs border border-surface-container/60 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-xs uppercase tracking-wider text-secondary font-bold">
                Transit &amp; Route Telemetry
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Fast Lane
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">two_wheeler</span>
                </div>
                <div>
                  <span className="font-label-md text-xs font-bold text-on-surface block">
                    Two-Wheeler Navigation
                  </span>
                  <span className="text-[11px] text-secondary">
                    0.8 km · 28 km/h simulated speed
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowGpsModal(true)}
                className="px-3.5 py-2 rounded-lg bg-primary text-on-primary font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer hover:bg-primary-container"
              >
                <span className="material-symbols-outlined text-[16px]">navigation</span>
                <span>Open GPS HUD</span>
              </button>
            </div>

            <button
              onClick={markProviderArrived}
              className="w-full py-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-xs cursor-pointer transition-colors"
            >
              Simulate: I Have Arrived at Doorstep
            </button>
          </div>
        )}

        {/* CUSTOMER CONTACT & DOORSTEP NOTES */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-xs border border-surface-container/60 flex flex-col gap-space-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <img
                src={activeRequest.customerAvatar || cityConfig.demoUser.avatar}
                alt="Resident"
                className="w-12 h-12 rounded-full object-cover bg-surface-container ring-1 ring-surface-container-high"
              />
              <div>
                <h3 className="font-headline-sm text-sm font-bold text-on-surface">
                  {activeRequest.customerName || cityConfig.demoUser.name}
                </h3>
                <p className="font-body-sm text-xs text-secondary mt-0.5">
                  {activeRequest.customerAddress || `${cityConfig.demoUser.defaultAddress}, ${cityConfig.name}`}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const sim = simulationService.simulateVoiceCall(activeRequest.customerName || cityConfig.demoUser.name, 'customer');
                showToast(sim.message, 'info', 'phone');
              }}
              className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-transform"
              aria-label="Call Resident"
            >
              <span className="material-symbols-outlined text-[20px]">phone</span>
            </button>
          </div>

          {/* Doorstep Landmark */}
          <div className="p-2.5 rounded-lg bg-surface-container-low flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">
              door_front
            </span>
            <p className="font-body-sm text-xs text-on-surface">
              <strong className="font-semibold">Doorstep Note: </strong>
              {activeRequest.landmark || cityConfig.demoUser.landmark}
            </p>
          </div>
        </div>

        {/* DOORSTEP HANDSHAKE & VERIFICATION PIN */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-xs border border-surface-container/60 flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px] text-primary">pin</span>
              <h3 className="font-headline-sm text-sm font-bold text-on-surface">
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

          <p className="font-body-sm text-xs text-on-surface-variant">
            Ask resident {activeRequest.customerName?.split(' ')[0] || 'Priya'} for the 4-digit code shown on her SATTHI screen to unlock tool safety checklist &amp; begin service billing:
          </p>

          {/* Quick Demo Helper */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-primary-fixed/20 border border-primary/20">
            <span className="text-xs text-primary font-medium">
              Demo Helper: Resident's PIN is <strong>{activeRequest.pin || '4821'}</strong>
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
                  className="flex-1 py-3 px-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md font-bold transition-all cursor-pointer min-h-[44px]"
                >
                  I'm Outside Doorstep
                </button>
              )}
              <button
                onClick={handleVerifyPin}
                className="flex-1 py-3 px-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md font-bold transition-all shadow-xs cursor-pointer min-h-[44px]"
              >
                Verify PIN &amp; Begin Work
              </button>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-700 text-[18px]">
                  check_circle
                </span>
                <span>Work session active. Live scope &amp; parts synced to resident invoice.</span>
              </span>
            </div>
          )}
        </div>

        {/* WORK SCOPE & SPARE PARTS MANAGER (ACTIVE ONCE PIN VERIFIED) */}
        {isInProgress && (
          <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-xs border border-surface-container/60 flex flex-col gap-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[22px] text-primary">inventory_2</span>
                <h3 className="font-headline-sm text-sm font-bold text-on-surface">
                  Service Scope &amp; Van Inventory
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

            <p className="font-body-sm text-xs text-on-surface-variant">
              Any added spare part or labor update synchronizes live to the customer's bill in real-time.
            </p>

            {/* Itemized Breakdown List */}
            <div className="divide-y divide-surface-container border border-surface-container rounded-xl overflow-hidden">
              {/* Inspection fee status */}
              <div className="p-3 bg-surface-container-low flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-on-surface block">
                    Upfront Doorstep Visit &amp; Diagnostic
                  </span>
                  <span className="text-[11px] text-secondary">
                    {activeRequest.visitFeeWaiverApplied
                      ? 'Waived (labor + parts exceeds ₹300)'
                      : 'Standard visit lock'}
                  </span>
                </div>
                <span className={`font-mono font-bold ${activeRequest.visitFeeWaiverApplied ? 'line-through text-secondary' : 'text-on-surface'}`}>
                  ₹{activeRequest.visitFee}.00
                </span>
              </div>

              {/* Labor Fee Row */}
              <div className="p-3 bg-surface-container-lowest flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-on-surface block">
                    Diagnostic &amp; Repair Labor
                  </span>
                  <span className="text-[11px] text-secondary">
                    {activeRequest.categoryTitle} tariff slab
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isEditingLabor ? (
                    <div className="flex items-center gap-1">
                      <span className="text-secondary font-mono">₹</span>
                      <input
                        type="number"
                        value={tempLabor}
                        onChange={(e) => setTempLabor(parseInt(e.target.value) || 0)}
                        className="w-16 h-8 px-2 rounded border bg-surface text-center font-mono font-bold"
                      />
                      <button
                        onClick={handleSaveLabor}
                        className="px-2 py-1 rounded bg-primary text-white text-[10px] font-bold"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-on-surface font-mono">₹{activeRequest.laborFee}.00</span>
                      <button
                        onClick={() => setIsEditingLabor(true)}
                        className="text-[11px] text-primary hover:underline"
                        title="Edit Labor"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Spare Parts List */}
              {activeRequest.parts.map((part) => (
                <div key={part.id} className="p-3 bg-surface-container-lowest flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-on-surface block">{part.name}</span>
                    <span className="text-emerald-700 font-medium text-[11px]">
                      Original {part.brand} · MSRP Zero-Markup
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-on-surface font-mono">₹{part.price}.00</span>
                    <button
                      onClick={() => {
                        removePartFromActiveJob(part.id);
                        showToast(`Removed ${part.name}`, 'info', 'remove');
                      }}
                      className="text-error hover:text-error/80 cursor-pointer p-1"
                      title="Remove Part"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Payable Summary Bar */}
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between">
              <div>
                <span className="font-label-sm text-xs font-bold text-primary block uppercase tracking-wider">
                  Total Billable to Resident
                </span>
                <span className="text-[11px] text-secondary">
                  Includes applicable taxes and GST waiver
                </span>
              </div>
              <span className="font-mono text-xl font-extrabold text-primary">
                ₹{activeRequest.totalPayable}.00
              </span>
            </div>

            {/* Technician Work Notes */}
            <div>
              <label className="font-label-sm text-xs font-bold text-on-surface block mb-1">
                Technician Completion Notes
              </label>
              <textarea
                rows={2}
                value={technicianNotes}
                onChange={(e) => setTechnicianNotes(e.target.value)}
                placeholder="e.g. Replaced faulty MCB switch. Tested continuity and load on kitchen circuit. Resident satisfied."
                className="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            {/* Complete Job CTA */}
            <button
              onClick={handleCompleteJob}
              className="mt-2 w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-label-lg font-bold flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">task_alt</span>
              <span>Complete Job &amp; Issue Resident Invoice</span>
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
                Select Van Inventory Spare Part
              </h3>
              <button
                onClick={() => setShowScopeDrawer(false)}
                className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-surface-container flex items-center justify-center cursor-pointer hover:bg-surface-container-high transition-colors"
                aria-label="Close van stock selector"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-xs text-secondary leading-relaxed">
              Show original retail package to resident before installation. Billed at zero aggregator markup.
            </p>

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
                      <span className="font-label-md font-bold text-on-surface block text-xs">
                        {part.name}
                      </span>
                      <span className="text-[11px] text-secondary">
                        Brand: {part.brand} · In Stock
                      </span>
                    </div>
                    <span className="font-bold text-on-surface font-mono text-xs">₹{part.price}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleAddScope}
              disabled={!selectedExtraPart}
              className="w-full py-3 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md cursor-pointer disabled:opacity-50"
            >
              Add Selected Part &amp; Sync Bill
            </button>
          </div>
        </div>
      )}

      {/* Turn-by-Turn GPS Modal */}
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
                <span className="font-headline-sm font-bold text-white text-sm">
                  Turn-by-Turn GPS HUD (Demo Navigation)
                </span>
              </div>
              <button
                onClick={() => setShowGpsModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer text-white hover:bg-white/20 transition-colors"
                aria-label="Close GPS HUD"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <div className="p-4 bg-white/5 rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-[36px] text-primary-fixed">
                turn_right
              </span>
              <div>
                <span className="text-lg font-bold text-white block">In 150m Turn Right</span>
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
              className="w-full py-3 rounded-xl bg-primary text-white font-bold text-xs cursor-pointer"
            >
              Simulate: Tapped "Arrived at Door"
            </button>
          </div>
        </div>
      )}

      {/* Doorstep Cash Settlement & Completion Handshake Modal */}
      {showCashModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in"
          onClick={() => setShowCashModal(false)}
        >
          <div
            className="w-full max-w-md bg-surface-container-lowest text-on-surface rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl flex flex-col gap-4 border border-surface-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[24px]">
                  payments
                </span>
                <span className="font-headline-sm font-bold text-on-surface text-base">
                  Doorstep Cash Collection &amp; Handshake
                </span>
              </div>
              <button
                onClick={() => setShowCashModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center cursor-pointer text-secondary hover:bg-surface-container-high transition-colors"
                aria-label="Close cash modal"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            {/* Total Cash Bill Highlight */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/80 flex flex-col items-center text-center gap-1">
              <span className="text-xs uppercase tracking-wider text-emerald-800 font-bold">
                Cash to Collect from Resident
              </span>
              <span className="font-mono text-3xl font-extrabold text-emerald-950">
                ₹{activeRequest.totalPayable}
              </span>
              <div className="flex items-center gap-2 text-[11px] text-emerald-800 font-medium mt-1">
                <span>Labor: ₹{activeRequest.laborFee}</span>
                <span>•</span>
                <span>Parts: ₹{activeRequest.parts.reduce((sum, p) => sum + p.price, 0)}</span>
                <span>•</span>
                <span>Taxes: ₹{activeRequest.taxes}</span>
              </div>
            </div>

            {/* 4-Digit Completion PIN Input */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-on-surface">
                  Resident's 4-Digit Completion Code
                </label>
                <button
                  type="button"
                  onClick={handleFillDemoCompletionPin}
                  className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
                >
                  Demo Fill ({activeRequest.completionPin || '7130'})
                </button>
              </div>
              <p className="text-[11px] text-secondary">
                The resident receives this code on their screen upon reviewing completed work.
              </p>

              <div className="flex items-center justify-center gap-2.5 my-2">
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    id={`prov-comp-pin-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={completionPinDigits[idx]}
                    onChange={(e) => handleCompletionPinChange(idx, e.target.value)}
                    className="w-12 h-14 text-center font-mono text-xl font-bold rounded-xl border border-surface-container-high bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                  />
                ))}
              </div>

              {completionPinError && (
                <p className="text-xs font-bold text-error text-center">{completionPinError}</p>
              )}
            </div>

            {/* Submit Action */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleConfirmCashPayment}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-98"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Confirm ₹{activeRequest.totalPayable} Cash &amp; Finish Job</span>
              </button>
              <button
                onClick={() => setShowCashModal(false)}
                className="w-full py-2.5 rounded-xl text-secondary text-xs font-semibold hover:bg-surface-container transition-colors cursor-pointer"
              >
                Cancel / Return to Work
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
