import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BEFORE_FAULT_PHOTO, AFTER_FIXED_PHOTO } from '../data/mockData';
import { simulationService } from '../services/simulationService';

export const ServiceInvoice: React.FC = () => {
  const { activeRequest, submitInvoicePayment, navigateTo, showToast, cityConfig, currentLocation } = useApp();

  const [rating, setRating] = useState(5);
  const [selectedTip, setSelectedTip] = useState<number | 'custom'>(50);
  const [customTipAmount, setCustomTipAmount] = useState<string>('75');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cash' | 'card'>('upi');
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Fixed in 38 mins',
    'Carried original spare parts',
  ]);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const basePayable = activeRequest?.totalPayable || 448;
  const tipNumber = selectedTip === 'custom' ? parseInt(customTipAmount) || 0 : selectedTip;
  const grandTotal = basePayable + tipNumber;

  const ratingLabels = [
    'Disappointing service',
    'Average service',
    'Good job done',
    'Great work!',
    '"Exceptional Service & Clean Work!"',
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handlePay = () => {
    setIsProcessing(true);
    showToast(`Simulating payment authorization of ₹${grandTotal} via ${paymentMethod.toUpperCase()} (Sandbox Mode)...`, 'info', 'account_balance_wallet');
    setTimeout(() => {
      setIsProcessing(false);
      submitInvoicePayment({
        rating,
        tip: tipNumber,
        method: paymentMethod,
        feedbackTags: selectedTags,
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-margin py-space-md flex-col gap-space-lg pb-32">
      {/* Job Completion Banner & Summary Card */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-md border border-surface-container">
        {/* Verified Status Pill & Timestamp */}
        <div className="flex items-center justify-between gap-space-sm flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-label-md text-label-md font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 shadow-[0_0_0_2px_#DCFCE7]"></span>
            Job Verified &amp; Completed
          </div>
          <span className="font-body-sm text-body-sm text-secondary flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-secondary">schedule</span>
            38 mins total
          </span>
        </div>

        {/* Service Title & Pro Details */}
        <div className="flex flex-col gap-1">
          <h2 className="font-headline-md text-headline-md text-on-surface font-extrabold">
            {activeRequest?.faultType || 'Short Circuit & MCB Replacement'}
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
            {activeRequest?.customerAddress || `${currentLocation.name}, ${cityConfig.name}`} · Service Order #{activeRequest?.invoiceNumber || 'SAT-8821'}
          </p>
        </div>

        {/* Pro Snapshot */}
        <div className="flex items-center gap-space-sm p-space-sm rounded-lg bg-surface-container-low">
          <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 bg-surface-container">
            <img
              className="w-full h-full object-cover"
              alt="Rahul Kumar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuALC5v_Pg92yXeMQ7zt1CR9eNPLsBl1gIAsWsig1StwYvFD19yXWcj3dBoUhNaF0_aTVckhbqRIYeA_4LIPFhDZEH3OL0bsz70beEPmamW09s2hZk8kmJ5xrr1gDb-_n5byP5mJPuRGZKDM0h7MdRfqz_mHM6rpXVenJjbnDmSGZEjP1gVDHSAUKWnBZ6_IPcFeuzo2hB83Ldd8r-4FQvDcRx1G1DVbqAp76WsAMImvcVdN7Gg8-sbJ"
            />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-label-lg text-label-lg text-on-surface truncate font-bold">
                Rahul Kumar
              </span>
              <span className="inline-flex items-center gap-0.5 text-tertiary bg-tertiary-fixed/30 px-1.5 py-0.2 rounded text-[10px] font-bold">
                <span className="material-symbols-outlined text-[12px] fill-1">verified</span>
                Trade Verified
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-amber-500 fill-1">
                star
              </span>
              4.95 (184 verified repairs)
            </p>
          </div>
          <button
            aria-label="Call technician"
            onClick={() => showToast(simulationService.simulateVoiceCall('Rahul Kumar').message, 'info', 'phone')}
            className="w-9 h-9 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-primary hover:bg-surface-container-high transition-transform active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">phone</span>
          </button>
        </div>

        {/* Before & After Verification Proof */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
              Visual Verification Evidence
            </span>
            <span className="font-label-sm text-label-sm text-primary font-semibold">
              2 Inspection Shots Attached
            </span>
          </div>
          <div className="grid grid-cols-2 gap-space-sm">
            {/* Before Card */}
            <div className="flex flex-col bg-surface-container-low rounded-lg p-2 gap-1.5">
              <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden bg-surface-container">
                <img
                  className="w-full h-full object-cover"
                  alt="Burned 32A MCB"
                  src={BEFORE_FAULT_PHOTO}
                />
                <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-inverse-surface/85 text-white font-label-sm text-[10px] font-bold">
                  BEFORE
                </span>
              </div>
              <p className="font-body-sm text-secondary text-xs truncate">
                Burned 32A MCB switch
              </p>
            </div>

            {/* After Card */}
            <div className="flex flex-col bg-surface-container-low rounded-lg p-2 gap-1.5">
              <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden bg-surface-container">
                <img
                  className="w-full h-full object-cover"
                  alt="Installed Schneider 32A MCB"
                  src={AFTER_FIXED_PHOTO}
                />
                <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-emerald-700 text-white font-label-sm text-[10px] font-bold">
                  AFTER
                </span>
              </div>
              <p className="font-body-sm text-secondary text-xs truncate">
                Schneider C-Curve Replaced
              </p>
            </div>
          </div>
        </div>

        {/* Itemized Service Breakdown */}
        <div className="flex flex-col gap-space-xs pt-space-xs">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
            Itemized Bill Breakdown
          </span>

          <div className="divide-y divide-surface-container rounded-lg border border-surface-container overflow-hidden">
            <div className="p-3 bg-surface-container-low/50 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-on-surface block">
                  Diagnostic &amp; Initial Inspection
                </span>
                <span className="text-secondary text-[11px]">
                  Standard {cityConfig.currencySymbol}{cityConfig.pricing.baseInspectionFee} visit fee waived (Repair &gt; {cityConfig.currencySymbol}{cityConfig.pricing.inspectionWaiveThreshold})
                </span>
              </div>
              <div className="text-right">
                <span className="line-through text-secondary mr-1">{cityConfig.currencySymbol}{cityConfig.pricing.baseInspectionFee}</span>
                <span className="font-bold text-emerald-700 font-mono">{cityConfig.currencySymbol}0</span>
              </div>
            </div>

            <div className="p-3 bg-surface-container-lowest flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-on-surface block">
                  MCB Rewiring &amp; Gang Box Labor
                </span>
                <span className="text-secondary text-[11px]">
                  Fixed tariff standard rate
                </span>
              </div>
              <span className="font-bold text-on-surface font-mono">{cityConfig.currencySymbol}220.00</span>
            </div>

            {activeRequest?.parts.map((p) => (
              <div key={p.id} className="p-3 bg-surface-container-lowest flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-on-surface block">{p.name}</span>
                  <span className="text-emerald-700 text-[11px] font-medium">
                    Direct {p.brand} MSRP (Zero Markup)
                  </span>
                </div>
                <span className="font-bold text-on-surface font-mono">{cityConfig.currencySymbol}{p.price}.00</span>
              </div>
            ))}

            <div className="p-3 bg-surface-container-lowest flex items-center justify-between text-xs">
              <div>
                <span className="text-secondary block">Platform Safety &amp; Insurance</span>
              </div>
              <span className="text-secondary font-mono">{cityConfig.currencySymbol}{cityConfig.pricing.platformSafetyFee}.00</span>
            </div>

            <div className="p-3 bg-surface-container-lowest flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-medium">First-Time Safety Coupon (SATTHI50)</span>
              <span className="text-emerald-700 font-mono">-{cityConfig.currencySymbol}{cityConfig.pricing.firstTimeDiscount}.00</span>
            </div>

            <div className="p-3 bg-surface-container-lowest flex items-center justify-between text-xs">
              <span className="text-secondary">GST ({cityConfig.pricing.gstPercent}% on Platform Fee)</span>
              <span className="text-secondary font-mono">{cityConfig.currencySymbol}{Math.round((cityConfig.pricing.platformSafetyFee * cityConfig.pricing.gstPercent) / 100)}.00</span>
            </div>

            {tipNumber > 0 && (
              <div className="p-3 bg-emerald-50 text-emerald-950 flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-emerald-700">volunteer_activism</span>
                  Technician Appreciation Tip
                </span>
                <span className="text-emerald-800 font-mono font-bold">+₹{tipNumber}.00</span>
              </div>
            )}
          </div>
        </div>

        {/* 30-Day Guarantee Callout */}
        <div className="p-3 rounded-lg bg-emerald-50 text-emerald-950 flex items-center gap-2.5 text-xs font-medium">
          <span className="material-symbols-outlined text-emerald-700 text-[20px]">
            verified_user
          </span>
          <span>
            Backed by <strong>SATTHI {cityConfig.pricing.warrantyDays}-Day Free Re-inspection Warranty</strong>. If this circuit trips again, callback is 100% free.
          </span>
        </div>
      </div>

      {/* Interactive Rating & Tip */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-4 border border-surface-container">
        <div className="text-center">
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            Rate Rahul's Service
          </h3>
          <p className="font-body-sm text-xs text-secondary mt-0.5">
            {ratingLabels[rating - 1]}
          </p>

          <div className="flex justify-center gap-2 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 cursor-pointer transition-transform active:scale-125"
              >
                <span
                  className={`material-symbols-outlined text-[32px] ${
                    star <= rating ? 'text-amber-500 fill-1' : 'text-surface-container-high'
                  }`}
                >
                  star
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-1.5 mt-2">
            {[
              'Fixed in 38 mins',
              'Carried original spare parts',
              'Polite & Transparent',
              'Insulated Safety Kit',
            ].map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-on-primary font-bold'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tip Rahul (100% Direct to Pro) */}
        <div className="pt-2 border-t border-surface-container">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-md text-label-md font-bold text-on-surface">
              Tip Rahul Kumar
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold">
              100% goes directly to Rahul
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[30, 50, 100].map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setSelectedTip(amount)}
                className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedTip === amount
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                }`}
              >
                ₹{amount}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSelectedTip('custom')}
              className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedTip === 'custom'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
              }`}
            >
              Other
            </button>
          </div>

          {selectedTip === 'custom' && (
            <div className="flex items-center gap-2 mt-2.5 p-2 bg-surface-container-low rounded-lg border border-surface-container animate-in fade-in">
              <span className="font-label-md text-sm font-bold text-on-surface pl-1">₹</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter custom tip amount (e.g. 75)"
                value={customTipAmount}
                onChange={(e) => setCustomTipAmount(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-transparent text-sm font-semibold text-on-surface focus:outline-none"
              />
              {customTipAmount && (
                <button
                  type="button"
                  onClick={() => setCustomTipAmount('')}
                  className="text-xs text-secondary hover:text-on-surface cursor-pointer pr-1"
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>

        {/* Payment Method Selector */}
        <div className="pt-2 border-t border-surface-container flex flex-col gap-2">
          <span className="font-label-md text-label-md font-bold text-on-surface">
            Select Payment Mode
          </span>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                paymentMethod === 'upi'
                  ? 'bg-primary-fixed/20 border-primary ring-1 ring-primary font-bold'
                  : 'bg-surface-container-low border-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] text-primary block mx-auto">
                qr_code_2
              </span>
              <span className="text-xs text-on-surface">Instant UPI</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                paymentMethod === 'cash'
                  ? 'bg-primary-fixed/20 border-primary ring-1 ring-primary font-bold'
                  : 'bg-surface-container-low border-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] text-secondary block mx-auto">
                payments
              </span>
              <span className="text-xs text-on-surface">Pay Cash</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                paymentMethod === 'card'
                  ? 'bg-primary-fixed/20 border-primary ring-1 ring-primary font-bold'
                  : 'bg-surface-container-low border-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] text-secondary block mx-auto">
                credit_card
              </span>
              <span className="text-xs text-on-surface">Card</span>
            </button>
          </div>
        </div>

        {/* Primary Pay Button */}
        <button
          onClick={handlePay}
          disabled={isProcessing}
          className="w-full h-12 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          {isProcessing ? (
            <>
              <span className="material-symbols-outlined text-[20px] animate-spin">
                progress_activity
              </span>
              <span>Simulating Authorization...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">flash_on</span>
              <span>Pay {cityConfig.currencySymbol}{grandTotal} (Simulated)</span>
            </>
          )}
        </button>
        <p className="text-[11px] text-center text-on-surface-variant font-medium mt-1">
          [Demo Sandbox] Test mode simulation — no actual funds are debited.
        </p>
      </div>

      {/* Official PDF Invoicing Action */}
      <div className="flex flex-col items-center gap-3 text-center">
        <button
          onClick={() => setShowPdfModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container font-label-md text-label-md shadow-xs transition-colors cursor-pointer border border-surface-container"
        >
          <span className="material-symbols-outlined text-[18px] text-primary">download</span>
          <span>View / Download Service Receipt Preview (PDF)</span>
        </button>
      </div>

      {/* PDF Modal */}
      {showPdfModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowPdfModal(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto text-on-surface"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center">
                <span className="font-headline-sm font-extrabold text-primary">SATTHI</span>
                <span className="text-[11px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-bold ml-2">
                  Demo Receipt Preview
                </span>
              </div>
              <button
                onClick={() => setShowPdfModal(false)}
                className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-surface-container flex items-center justify-center cursor-pointer hover:bg-surface-container-high transition-colors"
                aria-label="Close invoice PDF"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Demo Document Legal Notice Banner */}
            <div className="bg-amber-50 border border-amber-200 text-amber-950 p-2.5 rounded-lg text-[11px] leading-snug">
              <strong className="font-bold block mb-0.5">Demo Simulation Document</strong>
              Generated in a prototype sandbox environment for service estimation. This document is not a legally registered tax invoice under GST.
            </div>

            <div className="text-xs space-y-1 text-secondary">
              <p>Receipt #: {activeRequest?.invoiceNumber || 'SAT-8821'} (Prototype Demo) / Mock GSTIN: {cityConfig.tradeCompliance.gstin} (Demo Sandbox)</p>
              <p>Customer: {activeRequest?.customerName || cityConfig.demoUser.name} ({activeRequest?.customerAddress || `${currentLocation.name}, ${cityConfig.name}`})</p>
              <p>Partner: Rahul Kumar (Skill Screening: Passed in Demo Sandbox)</p>
              <p>Date: October 4, 2026 (Demo Mode)</p>
            </div>
            <table className="w-full text-xs text-left border-t border-b py-2">
              <thead>
                <tr className="border-b font-bold text-on-surface">
                  <th className="py-1">Description</th>
                  <th className="py-1 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-1">Line Inspection (Waived)</td>
                  <td className="py-1 text-right">{cityConfig.currencySymbol}0</td>
                </tr>
                <tr>
                  <td className="py-1">MCB Rewiring Labor</td>
                  <td className="py-1 text-right">{cityConfig.currencySymbol}220</td>
                </tr>
                <tr>
                  <td className="py-1">Schneider 32A C-Curve MCB</td>
                  <td className="py-1 text-right">{cityConfig.currencySymbol}210</td>
                </tr>
                <tr>
                  <td className="py-1">Platform Safety Fee</td>
                  <td className="py-1 text-right">{cityConfig.currencySymbol}{cityConfig.pricing.platformSafetyFee}</td>
                </tr>
                <tr>
                  <td className="py-1">GST ({cityConfig.pricing.gstPercent}%)</td>
                  <td className="py-1 text-right">{cityConfig.currencySymbol}{Math.round((cityConfig.pricing.platformSafetyFee * cityConfig.pricing.gstPercent) / 100)}</td>
                </tr>
                {tipNumber > 0 && (
                  <tr>
                    <td className="py-1 text-emerald-800 font-semibold">Technician Appreciation Tip</td>
                    <td className="py-1 text-right text-emerald-800 font-semibold font-mono">{cityConfig.currencySymbol}{tipNumber}</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="font-bold border-t">
                  <td className="py-1.5">Total Paid</td>
                  <td className="py-1.5 text-right text-primary font-mono text-sm">{cityConfig.currencySymbol}{grandTotal}</td>
                </tr>
              </tfoot>
            </table>
            <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-lg text-xs font-medium">
              ✓ Simulated Payment Recorded via {paymentMethod.toUpperCase()} (Sandbox Mode · No real funds charged) • {cityConfig.pricing.warrantyDays}-Day Prototype Warranty Applied
            </div>
            <button
              onClick={() => {
                showToast('[Demo Sandbox] Simulated receipt preview saved.', 'success', 'download');
                setShowPdfModal(false);
              }}
              className="w-full py-2.5 bg-primary text-white rounded-lg font-bold text-sm cursor-pointer shadow-xs"
            >
              Print / Save Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
